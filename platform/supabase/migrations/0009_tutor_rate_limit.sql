-- K-Tutor rate limit. Every tutor question costs a paid Gemini call, so each
-- signed-in user gets a bounded number of questions per window.
--
-- The table has RLS enabled and NO policies: clients can neither read nor
-- delete their history to reset the counter. The only way in is
-- consume_tutor_quota(), which takes the user id from the Clerk JWT itself.

create table if not exists public.tutor_requests (
  id bigint generated always as identity primary key,
  user_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists tutor_requests_user_created_idx
  on public.tutor_requests(user_id, created_at desc);

alter table public.tutor_requests enable row level security;

create or replace function public.consume_tutor_quota()
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_user_id text := coalesce(auth.jwt() ->> 'sub', '');
  v_burst_limit constant integer := 20;           -- per 10 minutes
  v_daily_limit constant integer := 150;          -- per 24 hours
  v_recent integer;
  v_daily integer;
begin
  if v_user_id = '' then
    return false;
  end if;

  -- Serialize concurrent requests of one user so parallel calls cannot
  -- slip past the limit between the count and the insert.
  perform pg_advisory_xact_lock(hashtext('tutor_quota:' || v_user_id));

  select
    count(*) filter (where created_at > now() - interval '10 minutes'),
    count(*)
  into v_recent, v_daily
  from public.tutor_requests
  where user_id = v_user_id
    and created_at > now() - interval '24 hours';

  if v_recent >= v_burst_limit or v_daily >= v_daily_limit then
    return false;
  end if;

  insert into public.tutor_requests (user_id) values (v_user_id);

  -- Keep the table small: rows older than the longest window are useless.
  delete from public.tutor_requests
  where user_id = v_user_id
    and created_at < now() - interval '24 hours';

  return true;
end;
$$;

revoke all on function public.consume_tutor_quota() from public, anon;
grant execute on function public.consume_tutor_quota() to authenticated;
