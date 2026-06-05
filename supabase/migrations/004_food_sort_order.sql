alter table public.food_entries
  add column if not exists sort_order integer not null default 0;

-- Backfill sort order from logged_at for existing rows
with ranked as (
  select
    id,
    row_number() over (
      partition by daily_log_id
      order by logged_at asc
    ) - 1 as new_order
  from public.food_entries
)
update public.food_entries fe
set sort_order = ranked.new_order
from ranked
where fe.id = ranked.id;
