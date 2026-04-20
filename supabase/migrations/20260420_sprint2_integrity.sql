-- Sprint 2 — 데이터 무결성 / RBAC / 피드백 수정
-- 실행: Supabase Dashboard > SQL Editor 에 전체 붙여넣기 후 실행
-- 멱등(idempotent) 하게 작성되어 재실행해도 안전.

-- ─── 1. guide_feedback 에 session_id 컬럼 추가 ──────────────────────────────
-- 익명 피드백 중복 방지 키 (FeedbackForm 에서 localStorage 기반 UUID 발급)
alter table guide_feedback
  add column if not exists session_id text;

create index if not exists feedback_session_idx on guide_feedback (session_id);

-- ─── 2. guides.status 에 'archived' 허용 ────────────────────────────────────
-- updateGuideStatus(id, 'archived') 가 check 제약에서 튕기는 현상 수정
alter table guides drop constraint if exists guides_status_check;
alter table guides add constraint guides_status_check
  check (status in ('draft','review','published','archived'));

-- ─── 3. helpful 카운터 증가 RPC (기존에 없던 것) ─────────────────────────────
-- submitFeedback 에서 helpful 투표 시 호출
create or replace function increment_guide_helpful(guide_id_param text)
returns void language plpgsql as $$
begin
  update guides
     set helpful = coalesce(helpful, 0) + 1,
         helpful_rate = case
           when coalesce(views, 0) = 0 then 100
           else round(100.0 * (coalesce(helpful, 0) + 1) / greatest(views, 1))
         end
   where id = guide_id_param;
end;
$$;

-- ─── 4. profiles 테이블 + role ───────────────────────────────────────────────
-- 서버사이드 역할 체크용. auth.users 와 1:1 대응. RLS 정책에서 참조.
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  name       text,
  role       text not null default 'guest'
             check (role in ('admin','director','counselor','operator','guest')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row execute function update_updated_at();

alter table profiles enable row level security;

-- 본인 row 만 select (관리자 조회는 service_role 키로)
drop policy if exists "profiles_self_select" on profiles;
create policy "profiles_self_select" on profiles for select
  using (auth.uid() = id);

-- 본인 row 만 update (role 은 별도 admin_update_role RPC 사용 권장)
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles for update
  using (auth.uid() = id);

-- 신규 가입자 프로필 자동 생성 (email 은 auth.users 에서 복사)
create or replace function create_profile_on_signup()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'guest')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function create_profile_on_signup();

-- ─── 5. guides UPDATE/DELETE RLS 정책 ────────────────────────────────────────
-- 기존 public select 는 유지, 쓰기/삭제는 role 기반.
-- DIRECTOR/ADMIN 만 UPDATE, ADMIN 만 DELETE.
drop policy if exists "guides_admin_director_update" on guides;
create policy "guides_admin_director_update" on guides for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin','director')
    )
  );

drop policy if exists "guides_admin_insert" on guides;
create policy "guides_admin_insert" on guides for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role in ('admin','director','counselor')
    )
  );

drop policy if exists "guides_admin_delete" on guides;
create policy "guides_admin_delete" on guides for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );

-- ─── 6. guide_feedback 쓰기는 이미 public insert 허용됨 ──────────────────────
-- 단, UPDATE/DELETE 는 본인 session 또는 admin 만
drop policy if exists "feedback_admin_delete" on guide_feedback;
create policy "feedback_admin_delete" on guide_feedback for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
  );
