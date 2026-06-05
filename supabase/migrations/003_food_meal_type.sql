-- Add meal type to food entries (if 001 was run without meal column)

do $$ begin
  create type meal_type as enum ('breakfast', 'snack', 'lunch', 'evening', 'night');
exception
  when duplicate_object then null;
end $$;

alter table public.food_entries
  add column if not exists meal meal_type not null default 'breakfast';
