-- ============================================================
-- AMS Wiki — guides 테이블 (Supabase / PostgreSQL)
-- Vercel 통합: layr8xs-projects / store_BE2CoXO5hUhEkxhK
-- ============================================================

-- guides 메인 테이블
create table if not exists public.guides (
  id            text primary key,
  title         text not null,
  module        text not null,
  type          text not null check (type in ('SOP','DECISION','REFERENCE','TROUBLE','RESPONSE','POLICY')),
  tldr          text not null,
  path          text,
  ams_url       text,
  confluence_url text,
  confluence_id text,
  version       text default 'v1.0',
  author        text,
  views         integer default 0,
  helpful       integer default 0,
  helpful_rate  integer default 0,
  targets       text[],
  steps         jsonb,
  main_items    jsonb,
  cases         jsonb,
  cautions      text[],
  trouble_table jsonb,
  responses     jsonb,
  decision_table jsonb,
  reference_data jsonb,
  policy_diff   jsonb,
  published     boolean default true,
  updated       date not null,
  created_at    timestamptz default now()
);

-- 조회수 증가 함수
create or replace function public.increment_guide_views(guide_id text)
returns void language plpgsql as $$
begin
  update public.guides set views = coalesce(views, 0) + 1 where id = guide_id;
end;
$$;

-- 피드백 테이블
create table if not exists public.guide_feedback (
  id         bigserial primary key,
  guide_id   text references public.guides(id) on delete cascade,
  helpful    boolean not null,
  comment    text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.guides         enable row level security;
alter table public.guide_feedback enable row level security;

-- 누구나 읽기 가능
create policy "guides_public_read"    on public.guides         for select using (true);
create policy "feedback_public_insert" on public.guide_feedback for insert with check (true);

-- 인덱스
create index if not exists guides_module_idx  on public.guides(module);
create index if not exists guides_type_idx    on public.guides(type);
create index if not exists guides_updated_idx on public.guides(updated desc);
create index if not exists guides_search_idx  on public.guides using gin(to_tsvector('simple', title || ' ' || tldr));
