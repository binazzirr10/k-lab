-- Authenticated users can also write their own progress through PostgREST.
-- Enforce the same XP rule at the table for every write path.
create function public.enforce_lesson_xp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status <> 'completed' then
    new.xp_earned := 0;
    return new;
  end if;

  if tg_op = 'UPDATE' then
    if old.status = 'completed'
      and old.lesson_id = new.lesson_id
      and old.user_id = new.user_id then
      new.xp_earned := old.xp_earned;
      return new;
    end if;
  end if;

  select lesson.xp_reward into new.xp_earned
  from public.lessons as lesson
  where lesson.id = new.lesson_id and lesson.is_published;

  if not found then
    raise exception 'Lesson is unavailable' using errcode = '23514';
  end if;
  return new;
end;
$$;

create trigger enforce_lesson_xp
before insert or update on public.lesson_progress
for each row execute function public.enforce_lesson_xp();

revoke execute on function public.enforce_lesson_xp() from public, anon, authenticated;
