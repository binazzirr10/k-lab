-- K-Lab core database. Authentication is provided by Clerk.
-- Every user-facing table is protected by RLS using Clerk's JWT `sub` claim.

create table if not exists public.profiles (
  user_id text primary key,
  display_name text not null default 'Ученица K-Lab',
  avatar_url text,
  native_language text not null default 'ru',
  target_level text not null default 'A1',
  daily_goal_minutes integer not null default 15 check (daily_goal_minutes between 5 and 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create or replace function public.is_k_lab_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = coalesce(auth.jwt() ->> 'sub', '')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  level text not null default 'A1',
  cover_url text,
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  slug text unique not null,
  title text not null,
  summary text,
  content jsonb not null default '{}'::jsonb,
  xp_reward integer not null default 20 check (xp_reward >= 0),
  estimated_minutes integer not null default 10 check (estimated_minutes > 0),
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id text not null,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  score integer check (score between 0 and 100),
  xp_earned integer not null default 0 check (xp_earned >= 0),
  last_step text,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.vocabulary_sets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  level text not null default 'A1',
  position integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vocabulary_items (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.vocabulary_sets(id) on delete cascade,
  korean text not null,
  romanization text,
  translation_ru text not null,
  translation_kk text,
  example_korean text,
  example_translation_ru text,
  audio_url text,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (set_id, korean)
);

create table if not exists public.vocabulary_reviews (
  user_id text not null,
  item_id uuid not null references public.vocabulary_items(id) on delete cascade,
  state text not null default 'new' check (state in ('new', 'learning', 'known', 'review')),
  ease_factor numeric(4,2) not null default 2.50,
  interval_days integer not null default 0,
  repetitions integer not null default 0,
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  primary key (user_id, item_id)
);

create table if not exists public.speaking_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  lesson_id uuid references public.lessons(id) on delete set null,
  phrase_korean text not null,
  transcript text,
  text_match_score integer check (text_match_score between 0 and 100),
  fluency_score integer check (fluency_score between 0 and 100),
  pronunciation_score integer check (pronunciation_score between 0 and 100),
  coach_feedback text,
  audio_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.k_scenes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  location_label text,
  cover_url text,
  script jsonb not null default '[]'::jsonb,
  difficulty text not null default 'A1',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scene_progress (
  user_id text not null,
  scene_id uuid not null references public.k_scenes(id) on delete cascade,
  completed_at timestamptz,
  best_score integer check (best_score between 0 and 100),
  primary key (user_id, scene_id)
);

create table if not exists public.user_entitlements (
  user_id text primary key,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'manual')),
  status text not null default 'active' check (status in ('active', 'trialing', 'past_due', 'cancelled', 'expired')),
  access_until timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  price_id text,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id text not null,
  action text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lesson_progress_user_id_idx on public.lesson_progress(user_id);
create index if not exists vocabulary_reviews_due_idx on public.vocabulary_reviews(user_id, next_review_at);
create index if not exists speaking_attempts_user_id_idx on public.speaking_attempts(user_id, created_at desc);
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger courses_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger lessons_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create trigger vocabulary_sets_updated_at before update on public.vocabulary_sets for each row execute function public.set_updated_at();
create trigger vocabulary_items_updated_at before update on public.vocabulary_items for each row execute function public.set_updated_at();
create trigger user_entitlements_updated_at before update on public.user_entitlements for each row execute function public.set_updated_at();
create trigger subscriptions_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.vocabulary_sets enable row level security;
alter table public.vocabulary_items enable row level security;
alter table public.vocabulary_reviews enable row level security;
alter table public.speaking_attempts enable row level security;
alter table public.k_scenes enable row level security;
alter table public.scene_progress enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.subscriptions enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "profiles: own read" on public.profiles for select to authenticated using ((auth.jwt() ->> 'sub') = user_id);
create policy "profiles: own create" on public.profiles for insert to authenticated with check ((auth.jwt() ->> 'sub') = user_id);
create policy "profiles: own update" on public.profiles for update to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);

create policy "content: authenticated read courses" on public.courses for select to authenticated using (is_published or public.is_k_lab_admin());
create policy "content: admin manage courses" on public.courses for all to authenticated using (public.is_k_lab_admin()) with check (public.is_k_lab_admin());
create policy "content: authenticated read lessons" on public.lessons for select to authenticated using (is_published or public.is_k_lab_admin());
create policy "content: admin manage lessons" on public.lessons for all to authenticated using (public.is_k_lab_admin()) with check (public.is_k_lab_admin());
create policy "content: authenticated read vocabulary sets" on public.vocabulary_sets for select to authenticated using (is_published or public.is_k_lab_admin());
create policy "content: admin manage vocabulary sets" on public.vocabulary_sets for all to authenticated using (public.is_k_lab_admin()) with check (public.is_k_lab_admin());
create policy "content: authenticated read vocabulary items" on public.vocabulary_items for select to authenticated using (
  exists (
    select 1
    from public.vocabulary_sets
    where vocabulary_sets.id = vocabulary_items.set_id
      and (vocabulary_sets.is_published or public.is_k_lab_admin())
  )
);
create policy "content: admin manage vocabulary items" on public.vocabulary_items for all to authenticated using (public.is_k_lab_admin()) with check (public.is_k_lab_admin());
create policy "content: authenticated read scenes" on public.k_scenes for select to authenticated using (is_published or public.is_k_lab_admin());
create policy "content: admin manage scenes" on public.k_scenes for all to authenticated using (public.is_k_lab_admin()) with check (public.is_k_lab_admin());

create policy "progress: own access" on public.lesson_progress for all to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);
create policy "reviews: own access" on public.vocabulary_reviews for all to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);
create policy "speaking: own access" on public.speaking_attempts for all to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);
create policy "scene progress: own access" on public.scene_progress for all to authenticated using ((auth.jwt() ->> 'sub') = user_id) with check ((auth.jwt() ->> 'sub') = user_id);
create policy "entitlements: own read" on public.user_entitlements for select to authenticated using ((auth.jwt() ->> 'sub') = user_id);
create policy "subscriptions: own read" on public.subscriptions for select to authenticated using ((auth.jwt() ->> 'sub') = user_id);
create policy "admin audit: admin read" on public.admin_audit_log for select to authenticated using (public.is_k_lab_admin());
