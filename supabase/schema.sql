-- Careet: 계정 1 = 투두·임시저장·발행글·읽음·저장·밑줄 노트

create table if not exists public.accounts (
  id text primary key,
  name text not null default '김캐릿',
  email text not null default '',
  role text not null default '트렌드 담당자',
  login_at timestamptz,
  notes jsonb not null default '[]'::jsonb,
  extra_articles jsonb not null default '[]'::jsonb,
  read_ids jsonb not null default '[]'::jsonb,
  saved_ids jsonb not null default '[]'::jsonb,
  prefs jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.accounts add column if not exists prefs jsonb not null default '{}'::jsonb;

create table if not exists public.todos (
  id text primary key,
  account_id text not null references public.accounts(id) on delete cascade,
  text text not null,
  source_article_id text,
  source_title text not null default '',
  added_at timestamptz not null default now(),
  done boolean not null default false
);

create index if not exists todos_account_id_idx on public.todos (account_id);

create table if not exists public.drafts (
  id text primary key,
  account_id text not null references public.accounts(id) on delete cascade,
  category text not null default '',
  title text not null default '',
  body text not null default '',
  thumbnail text not null default '',
  todos jsonb not null default '[]'::jsonb,
  criteria jsonb not null default '[false,false,false]'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists drafts_account_id_idx on public.drafts (account_id);

alter table public.accounts enable row level security;
alter table public.todos enable row level security;
alter table public.drafts enable row level security;

drop policy if exists "accounts open" on public.accounts;
create policy "accounts open" on public.accounts for all using (true) with check (true);

drop policy if exists "todos open" on public.todos;
create policy "todos open" on public.todos for all using (true) with check (true);

drop policy if exists "drafts open" on public.drafts;
create policy "drafts open" on public.drafts for all using (true) with check (true);

grant all on public.accounts to anon, authenticated, service_role;
grant all on public.todos to anon, authenticated, service_role;
grant all on public.drafts to anon, authenticated, service_role;
