-- Bumply initial schema for Neon Postgres
-- Prerequisites: enable Neon Auth in the Neon Console (creates neon_auth schema).
-- Run in Neon SQL Editor after Neon Auth is enabled.

create type checklist_item_type as enum ('task', 'vitamin');
create type meal_type as enum ('breakfast', 'snack', 'lunch', 'evening', 'night');

create table public.profiles (
  id uuid primary key references neon_auth."user" (id) on delete cascade,
  due_date date,
  created_at timestamptz not null default now()
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references neon_auth."user" (id) on delete cascade,
  name text not null,
  type checklist_item_type not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references neon_auth."user" (id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

create table public.log_completions (
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  checklist_item_id uuid not null references public.checklist_items (id) on delete cascade,
  completed boolean not null default false,
  primary key (daily_log_id, checklist_item_id)
);

create table public.water_entries (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  logged_at timestamptz not null default now()
);

create table public.food_entries (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  name text not null,
  meal meal_type not null default 'breakfast',
  sort_order integer not null default 0,
  logged_at timestamptz not null default now()
);

create index idx_checklist_items_user on public.checklist_items (user_id, type, active);
create index idx_daily_logs_user_date on public.daily_logs (user_id, log_date desc);
create index idx_water_entries_log on public.water_entries (daily_log_id);
create index idx_food_entries_log on public.food_entries (daily_log_id);
