-- Migration from ml/calories schema to cups/food diary
-- Skip if you ran the updated 001_initial_schema.sql

-- Profiles: drop goal columns
alter table public.profiles drop column if exists water_goal_ml;
alter table public.profiles drop column if exists calorie_goal;

-- Water: each row is one cup (drop ml column)
alter table public.water_entries drop column if exists amount_ml;

-- Calories -> food diary
alter table public.calorie_entries rename to food_entries;
alter table public.food_entries drop column if exists calories;

-- Rename policies if they exist under old names
drop policy if exists "Users manage own calorie entries" on public.food_entries;
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
