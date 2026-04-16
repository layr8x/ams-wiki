-- AMS Wiki — Supabase PostgreSQL Schema
-- 실행: Supabase Dashboard > SQL Editor > 전체 붙여넣기 후 실행

-- ─── extensions ─────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists pg_trgm;   -- 한국어 포함 전문 검색

-- ─── 가이드 메인 테이블 ───────────────────────────────────────────────────────
create table if not exists guides (
  id            text primary key,                 -- 슬러그 (member-merge 등)
  type          text not null check (type in ('SOP','DECISION','REFERENCE','TROUBLE','RESPONSE','POLICY')),
  module        text not null,
  title         text not null,
  tldr          text,
  path          text,
  ams_url       text,
  confluence_id text,
  confluence_url text,
  targets       text[],
  tags          text[],
  author        text,
  version       text default 'v1.0',
  status        text default 'published' check (status in ('draft','review','published')),
  views         integer default 0,
  helpful       integer default 0,
  helpful_rate  integer default 0,
  steps         jsonb,
  main_items_table jsonb,
  cases         jsonb,
  cautions      text[],
  trouble_table jsonb,
  responses     jsonb,
  decision_table jsonb,
  reference_data jsonb,
  policy_diff   jsonb,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 전문 검색 인덱스 (GIN)
create index if not exists guides_title_search   on guides using gin (title gin_trgm_ops);
create index if not exists guides_tldr_search    on guides using gin (tldr  gin_trgm_ops);
create index if not exists guides_module_idx     on guides (module);
create index if not exists guides_type_idx       on guides (type);
create index if not exists guides_updated_idx    on guides (updated_at desc);
create index if not exists guides_views_idx      on guides (views desc);

-- ─── 피드백 테이블 ───────────────────────────────────────────────────────────
create table if not exists guide_feedback (
  id         uuid primary key default uuid_generate_v4(),
  guide_id   text references guides(id) on delete cascade,
  vote       text check (vote in ('helpful','needs_improvement')),
  comment    text,
  created_at timestamptz default now()
);
create index if not exists feedback_guide_idx on guide_feedback (guide_id);

-- ─── 페이지뷰 테이블 ─────────────────────────────────────────────────────────
create table if not exists guide_views (
  id         uuid primary key default uuid_generate_v4(),
  guide_id   text references guides(id) on delete cascade,
  session_id text,
  created_at timestamptz default now()
);
create index if not exists views_guide_idx on guide_views (guide_id);
create index if not exists views_created_idx on guide_views (created_at desc);

-- ─── 검색 로그 테이블 ────────────────────────────────────────────────────────
create table if not exists search_logs (
  id         uuid primary key default uuid_generate_v4(),
  query      text not null,
  result_count integer default 0,
  created_at timestamptz default now()
);
create index if not exists search_logs_query_idx on search_logs (query);
create index if not exists search_logs_created_idx on search_logs (created_at desc);

-- ─── updated_at 자동 갱신 트리거 ────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guides_updated_at on guides;
create trigger guides_updated_at
  before update on guides
  for each row execute function update_updated_at();

-- ─── 조회수 증가 RPC ─────────────────────────────────────────────────────────
create or replace function increment_guide_views(guide_id_param text)
returns void language plpgsql as $$
begin
  update guides set views = views + 1 where id = guide_id_param;
end;
$$;

-- ─── 피드백 집계 RPC ─────────────────────────────────────────────────────────
create or replace function get_guide_stats(guide_id_param text)
returns json language plpgsql as $$
declare
  result json;
begin
  select json_build_object(
    'total',    count(*),
    'helpful',  count(*) filter (where vote = 'helpful'),
    'needsImprovement', count(*) filter (where vote = 'needs_improvement'),
    'helpfulRate', case when count(*) > 0
      then round(100.0 * count(*) filter (where vote = 'helpful') / count(*))
      else 0
    end
  ) into result
  from guide_feedback
  where guide_id = guide_id_param;
  return result;
end;
$$;

-- ─── Row Level Security (공개 읽기 허용) ─────────────────────────────────────
alter table guides enable row level security;
create policy "guides_public_read" on guides for select using (true);
create policy "guides_public_feedback" on guide_feedback for insert with check (true);
create policy "guides_feedback_read" on guide_feedback for select using (true);
alter table guide_feedback enable row level security;
alter table guide_views enable row level security;
create policy "views_public_insert" on guide_views for insert with check (true);
create policy "views_public_read"   on guide_views for select using (true);
alter table search_logs enable row level security;
create policy "search_logs_insert"  on search_logs for insert with check (true);
