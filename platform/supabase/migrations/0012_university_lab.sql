-- University Lab: one row per student. `saved` is the free shortlist, `planner`
-- holds the Pro+ tools (goal, comparison, checklist, dates and notes).
create table if not exists public.university_lab (
  user_id text primary key,
  saved text[] not null default '{}' check (cardinality(saved) <= 40),
  planner jsonb not null default '{}'::jsonb
    check (jsonb_typeof(planner) = 'object' and octet_length(planner::text) <= 32768),
  updated_at timestamptz not null default now()
);

alter table public.university_lab enable row level security;

revoke all on public.university_lab from anon, authenticated;
grant select, insert, update on public.university_lab to authenticated;

drop policy if exists "university lab: own read" on public.university_lab;
create policy "university lab: own read" on public.university_lab
  for select to authenticated using ((auth.jwt() ->> 'sub') = user_id);
drop policy if exists "university lab: own create" on public.university_lab;
create policy "university lab: own create" on public.university_lab
  for insert to authenticated with check ((auth.jwt() ->> 'sub') = user_id);
drop policy if exists "university lab: own update" on public.university_lab;
create policy "university lab: own update" on public.university_lab
  for update to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);

drop trigger if exists university_lab_updated_at on public.university_lab;
create trigger university_lab_updated_at before update on public.university_lab
  for each row execute function public.set_updated_at();
