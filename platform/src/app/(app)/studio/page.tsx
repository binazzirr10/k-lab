import { signInFor } from "@/lib/sign-in";
import { activePlan, planName } from "@/lib/plans";
import { readiness } from "@/lib/universities";
import { loadUniversityLab } from "@/lib/university-lab";
import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { getOrCreateStudentProfile } from "@/lib/profile";

const weekNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const paths = [
  { number: "Уроки", title: "Список уроков курса", note: "Открыть первый урок →", href: "/learn/lesson-01-introduction" },
  { number: "Speaking Lab", title: "Записать свою фразу", note: "Записать и сравнить с образцом →", href: "/speaking" },
  { number: "K‑Drama", title: "Сцены к урокам курса", note: "Слушать и повторять реплики →", href: "/k-scene" },
];


async function getLearningStats(userId: string) {
  try {
    const { createServerSupabaseClient } = await import("@/lib/supabase/server");
    const supabase = await createServerSupabaseClient();
    const [{ data: lessons, error: lessonsError }, { count: speakingAttempts, error: speakingError }] = await Promise.all([
      supabase.from("lesson_progress").select("lesson_id, status, progress_percent, xp_earned, updated_at").eq("user_id", userId),
      supabase.from("speaking_attempts").select("id", { count: "exact", head: true }).eq("user_id", userId),
    ]);

    if (lessonsError || speakingError) throw new Error("Progress is unavailable");
    const completed = (lessons ?? []).filter((lesson) => lesson.status === "completed");
    const totalXp = (lessons ?? []).reduce((sum, lesson) => sum + Number(lesson.xp_earned || 0), 0);
    const practicedDates = new Set((lessons ?? []).map((lesson) => new Date(lesson.updated_at).toLocaleDateString("en-CA", { timeZone: "Asia/Oral" })));
    let streak = 0;
    const cursor = new Date();
    while (practicedDates.has(cursor.toLocaleDateString("en-CA", { timeZone: "Asia/Oral" }))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const firstLesson = (lessons ?? []).find((lesson) => lesson.lesson_id === "a1000000-0000-4000-8000-000000000101");
    const secondLesson = (lessons ?? []).find((lesson) => lesson.lesson_id === "a1000000-0000-4000-8000-000000000102");
    const thirdLesson = (lessons ?? []).find((lesson) => lesson.lesson_id === "a1000000-0000-4000-8000-000000000103");
    const fourthLesson = (lessons ?? []).find((lesson) => lesson.lesson_id === "a1000000-0000-4000-8000-000000000104");
    const checkpoint = (lessons ?? []).find((lesson) => lesson.lesson_id === "a1000000-0000-4000-8000-000000000105");
    return { connected: true, completed: completed.length, totalXp, level: Math.floor(totalXp / 250) + 1, streak, speakingAttempts: speakingAttempts ?? 0, firstLessonProgress: Number(firstLesson?.progress_percent || 0), secondLessonProgress: Number(secondLesson?.progress_percent || 0), thirdLessonProgress: Number(thirdLesson?.progress_percent || 0), fourthLessonProgress: Number(fourthLesson?.progress_percent || 0), checkpointProgress: Number(checkpoint?.progress_percent || 0) };
  } catch {
    return { connected: false, completed: 0, totalXp: 0, level: 1, streak: 0, speakingAttempts: 0, firstLessonProgress: 0, secondLessonProgress: 0, thirdLessonProgress: 0, fourthLessonProgress: 0, checkpointProgress: 0 };
  }
}

export default async function StudioPage() {
  const { userId } = await auth();
  if (!userId) redirect(signInFor("/studio"));

  const user = await currentUser();
  const isAdmin = String(user?.publicMetadata?.role ?? "").toLowerCase() === "admin";
  const current = activePlan(user?.publicMetadata);
  const clerkName = user?.firstName || user?.username || "Ученик";
  const profileResult = await getOrCreateStudentProfile({ userId, displayName: clerkName, avatarUrl: user?.imageUrl ?? null }).catch(() => ({ profile: null, connected: false }));
  const name = profileResult.profile?.display_name || clerkName;
  const [stats, lab] = await Promise.all([getLearningStats(userId), loadUniversityLab(userId)]);
  const xpToNext = 250 - (stats.totalXp % 250 || 0);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const nextLesson = stats.fourthLessonProgress === 100
    ? { title: "Checkpoint 01", description: "Итоговый тест по четырём урокам: 50 баллов и +50 XP.", href: "/checkpoint/section-01" }
    : stats.thirdLessonProgress === 100
    ? { title: "Мой день", description: "Скажи, что ты делаешь днём, и потренируй вежливое настоящее время.", href: "/learn/lesson-04-my-day" }
    : stats.secondLessonProgress === 100
    ? { title: "Что это?", description: "Назови предметы вокруг себя и потренируй короткие фразы.", href: "/learn/lesson-03-objects" }
    : stats.firstLessonProgress === 100
      ? { title: "Откуда ты?", description: "Скажи, из какой ты страны, и собери свою первую мини‑визитку.", href: "/learn/lesson-02-country" }
      : { title: "Первое знакомство", description: "Поздоровайся по‑корейски и собери фразу со своим именем.", href: "/learn/lesson-01-introduction" };

  return (
    <>
      <AppNav active="studio">{isAdmin && <Link href="/admin">Админ</Link>}<span className="app-nav-name">{name}</span><UserButton appearance={{ elements: { avatarBox: "rhythm-avatar" } }} /></AppNav>

      <main className="rhythm-wrap">
        <section className="rhythm-hero">
          <div><div className="rhythm-eyebrow">Личный кабинет · 오늘의 리듬</div><h1>Мой ритм</h1><p>Открой следующее задание курса или выбери другое занятие ниже на странице.</p><p>Тариф: <b>{planName(current.plan)}</b>{current.until && ` до ${new Date(current.until).toLocaleDateString("ru-RU", { timeZone: "Asia/Almaty" })}`} · <Link href="/pricing">Все тарифы</Link></p></div>
          <aside className="rhythm-lesson"><small>Следующее задание курса</small><h2>{nextLesson.title}</h2><p>{nextLesson.description}</p><a href={nextLesson.href}>Открыть задание →</a></aside>
        </section>

        <section className="rhythm-stats" aria-label="Статистика обучения">
          <article className="rhythm-stat level"><div>Уровень по XP</div><strong>{stats.level} <small>уровень</small></strong><p>{xpToNext} XP до следующего уровня</p></article>
          <article className="rhythm-stat"><div>Серия дней</div><strong>{stats.streak}</strong><p>дней с новым уроком</p></article>
          <article className="rhythm-stat"><div>Всего XP</div><strong>{stats.totalXp}</strong><p>за уроки и Checkpoint</p></article>
          <article className="rhythm-stat"><div>Уроков пройдено</div><strong>{stats.completed}</strong><p>считая Checkpoint</p></article>
        </section>

        <section className="rhythm-board">
          <article className="rhythm-panel"><div className="rhythm-panel-title"><h2>Твой маршрут</h2><span>Прогресс по урокам</span></div><div className="rhythm-course-row"><Link className="rhythm-hangul" href="/hangul">Карта хангыля <span aria-hidden="true">↗</span></Link></div><div className="rhythm-course-row"><div><b>Урок 1 · Знакомство</b><em>{stats.firstLessonProgress}%</em></div><i><span style={{ width: `${stats.firstLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 2 · Откуда ты?</b><em>{stats.secondLessonProgress}%</em></div><i><span style={{ width: `${stats.secondLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 3 · Что это?</b><em>{stats.thirdLessonProgress}%</em></div><i><span style={{ width: `${stats.thirdLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 4 · Мой день</b><em>{stats.fourthLessonProgress}%</em></div><i><span style={{ width: `${stats.fourthLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Checkpoint 01 · Первый разговор</b><em>{stats.checkpointProgress}%</em></div><i><span style={{ width: `${stats.checkpointProgress}%` }} /></i></div></article>
          <aside className="rhythm-panel rhythm-weekly"><div className="rhythm-panel-title"><h2>Серия дней</h2><span>{stats.streak ? `${stats.streak} дн. подряд` : "Начни сегодня"}</span></div><div className="rhythm-week-chart">{weekNames.map((day, index) => { const done = stats.streak > 0 && index <= todayIndex && index > todayIndex - stats.streak; return <div key={day}><i className={done ? "done" : ""} style={{ height: done ? "86px" : "8px" }} /><span>{day}</span></div>; })}</div><p>{stats.streak ? <>Ты завершаешь уроки <b>{stats.streak} дн.</b> подряд.</> : "Серия начнётся в день, когда ты завершишь новый урок."}</p></aside>
        </section>

        <section className="rhythm-panel rhythm-lab" aria-labelledby="rhythm-lab">
          <div><h2 id="rhythm-lab">University Lab</h2><p>Каталог университетов Кореи, твой список и подготовка к поступлению.</p></div>
          <dl><div><dt>В списке</dt><dd>{lab.saved.length}</dd></div>{current.plan === "pro_plus" && <div><dt>Документы</dt><dd>{readiness(lab.planner.done).percent}%</dd></div>}</dl>
          <Link href="/universities">Открыть University Lab <span aria-hidden="true">→</span></Link>
        </section>

        <section className="rhythm-directions"><div className="rhythm-directions-head"><h2>Выбери, чем заняться ещё.</h2><p>Уроки, Speaking Lab и сцены курса открываются здесь же, а прогресс сохраняется в этом кабинете.</p></div><div className="rhythm-paths">{paths.map((path) => <a href={path.href} key={path.number}><span>{path.number}</span><h3>{path.title}</h3><p>{path.note}</p></a>)}</div></section>

        <section className="rhythm-badges" aria-label="Бейджи">
          <article className={stats.completed >= 1 ? "unlocked" : "locked"}><i>{stats.completed >= 1 ? "✦" : "○"}</i><b>Первый шаг</b><span>Заверши один урок</span></article><article className={stats.streak >= 7 ? "unlocked" : "locked"}><i>{stats.streak >= 7 ? "✦" : "○"}</i><b>Семь дней</b><span>Пока недоступен</span></article><article className={stats.completed >= 5 ? "unlocked" : "locked"}><i>{stats.completed >= 5 ? "✦" : "○"}</i><b>Начало A1</b><span>4 урока и Checkpoint</span></article><article className={stats.speakingAttempts >= 1 ? "unlocked" : "locked"}><i>{stats.speakingAttempts >= 1 ? "✦" : "○"}</i><b>Голос K‑Lab</b><span>Пока недоступен</span></article>
        </section>
        {!stats.connected && <p className="rhythm-db-note">Не удалось загрузить прогресс, поэтому здесь нули. Обнови страницу или зайди позже.</p>}
      </main>
      <footer className="rhythm-footer">© 2026 K‑Lab<Link href="/universities">Университеты</Link></footer>
      <KTutor context="studio" />
    </>
  );
}
