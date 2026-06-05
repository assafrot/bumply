-- Bumply initial schema
-- Run in Supabase SQL Editor. Enable Anonymous Auth in Authentication > Providers.

create type checklist_item_type as enum ('task', 'vitamin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  due_date date,
  created_at timestamptz not null default now()
);

create table public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type checklist_item_type not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
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

-- Each row = one cup of water drunk
create table public.water_entries (
  id uuid primary key default gen_random_uuid(),
  daily_log_id uuid not null references public.daily_logs (id) on delete cascade,
  logged_at timestamptz not null default now()
);

create type meal_type as enum ('breakfast', 'snack', 'lunch', 'evening', 'night');

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

alter table public.profiles enable row level security;
alter table public.checklist_items enable row level security;
alter table public.daily_logs enable row level security;
alter table public.log_completions enable row level security;
alter table public.water_entries enable row level security;
alter table public.food_entries enable row level security;

create policy "Users manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users manage own checklist items"
  on public.checklist_items for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own daily logs"
  on public.daily_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own log completions"
  on public.log_completions for all
  using (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  );

create policy "Users manage own water entries"
  on public.water_entries for all
  using (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  );

create policy "Users manage own food entries"
  on public.food_entries for all
  using (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.daily_logs dl
      where dl.id = daily_log_id and dl.user_id = auth.uid()
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
