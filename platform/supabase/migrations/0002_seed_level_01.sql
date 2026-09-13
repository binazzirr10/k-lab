-- Initial published content for the first K-Lab route.
-- Fixed IDs make this migration safe to run once and easy to reference in code.

insert into public.courses (id, slug, title, subtitle, level, position, is_published)
values (
  'a1000000-0000-4000-8000-000000000001',
  'level-01-first-conversation',
  'Level 01 · Первый разговор',
  'Знакомство, страна, предметы и планы на сегодня.',
  'A1',
  1,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  level = excluded.level,
  position = excluded.position,
  is_published = excluded.is_published;

insert into public.lessons (
  id, course_id, slug, title, summary, content, xp_reward, estimated_minutes, position, is_published
)
values (
  'a1000000-0000-4000-8000-000000000101',
  'a1000000-0000-4000-8000-000000000001',
  'lesson-01-introduction',
  'Знакомство: первое 안녕하세요',
  'Поздоровайся, назови своё имя и пойми, когда использовать 이에요 / 예요.',
  jsonb_build_object(
    'dialogue', jsonb_build_array(
      jsonb_build_object('speaker', '민지', 'korean', '안녕하세요?', 'russian', 'Здравствуйте!'),
      jsonb_build_object('speaker', '너', 'korean', '안녕하세요. 저는 알리나예요.', 'russian', 'Здравствуйте. Я Алина.'),
      jsonb_build_object('speaker', '민지', 'korean', '반갑습니다.', 'russian', 'Приятно познакомиться.')
    ),
    'grammar', 'После согласной используй 이에요, после гласной — 예요.',
    'checkpoint', 'Нужно 2 правильных ответа из 3.'
  ),
  25,
  8,
  1,
  true
)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  content = excluded.content,
  xp_reward = excluded.xp_reward,
  estimated_minutes = excluded.estimated_minutes,
  position = excluded.position,
  is_published = excluded.is_published;
