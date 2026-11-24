import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { getOrCreateStudentProfile } from "@/lib/profile";

const weekNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const paths = [
  { number: "01 · УРОКИ", title: "Список уроков курса", note: "Открыть список уроков →", href: "https://k-lab-two.vercel.app/courses.html" },
  { number: "02 · SPEAKING LAB", title: "Записать свою фразу", note: "Получить AI‑отзыв о записи →", href: "https://k-lab-two.vercel.app/speaking.html" },
  { number: "03 · K‑DRAMA", title: "Сцены к урокам курса", note: "Слушать и повторять реплики →", href: "https://k-lab-two.vercel.app/kdrama.html" },
];

const studioStyle = `
.rhythm-nav,.rhythm-wrap,.rhythm-footer{width:min(1220px,calc(100% - 40px));margin-left:auto;margin-right:auto;font-family:Arial,"Noto Sans KR",sans-serif}
.rhythm-nav{min-height:86px;padding-block:8px;border-bottom:1px solid var(--ink);display:flex;align-items:center;justify-content:space-between;gap:20px}
.rhythm-logo{display:flex;align-items:center;gap:10px;min-height:44px;color:var(--ink);font:700 23px Georgia,"Noto Sans KR",serif;letter-spacing:-.03em;text-decoration:none}
.rhythm-seal{display:grid;place-items:center;width:35px;height:35px;border:1px solid var(--ink);border-radius:50%;font:15px "Noto Sans KR",sans-serif}
.rhythm-links{display:flex;flex-wrap:wrap;justify-content:center;gap:2px 16px}
.rhythm-links a{color:#58645d;font-size:12px;font-weight:700;letter-spacing:.07em;text-decoration:none}
.rhythm-links a[aria-current="page"]{color:var(--shell-red)}
.rhythm-user{display:flex;align-items:center;gap:10px}
.rhythm-name{max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:700}
.rhythm-avatar{width:44px;height:44px;border:1px solid var(--ink)}
.rhythm-wrap{margin-top:25px;margin-bottom:80px}
.rhythm-hero{position:relative;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.9fr);gap:30px;overflow:hidden;padding:46px clamp(25px,5vw,62px);border:1px solid var(--ink);background:#fffdf7}
.rhythm-hero::after{content:"오늘";position:absolute;right:4%;bottom:-54px;color:rgba(22,35,30,.06);font:700 190px "Noto Sans KR",sans-serif;letter-spacing:-.15em;pointer-events:none}
.rhythm-eyebrow{position:relative;z-index:1;color:#b42431;font-size:12px;font-weight:700;letter-spacing:.12em}
.rhythm-hero h1{position:relative;z-index:1;max-width:630px;overflow-wrap:anywhere;margin:13px 0 15px;font:500 clamp(34px,4.6vw,63px)/1.01 Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-hero h1 span{color:#b42431}
.rhythm-hero>div>p{position:relative;z-index:1;max-width:520px;margin:0;color:#617069;font-size:16px;line-height:1.65}
.rhythm-lesson{z-index:1;align-self:center;padding:23px;border:1px solid var(--ink);background:var(--ink);box-shadow:6px 6px 0 #dcbf6c;color:#fffdf7}
.rhythm-lesson small{color:#cfd8d1;font-size:12px;font-weight:700;letter-spacing:.1em}
.rhythm-lesson h2{margin:18px 0 8px;font:500 28px Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-lesson p{margin:0;color:#cfd8d1;font-size:13px;line-height:1.5}
.rhythm-lesson a{display:block;width:100%;margin-top:20px;padding:13px;border:1px solid #dcbf6c;background:#dcbf6c;color:var(--ink);text-align:center;text-decoration:none;font-size:12px;font-weight:700}
.rhythm-stats{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(3,minmax(0,1fr));margin-top:20px;border-top:1px solid var(--ink);border-left:1px solid var(--ink)}
.rhythm-stat{min-height:140px;padding:20px;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);background:#fffdf7}
.rhythm-stat.level{background:#d9e6db}
.rhythm-stat>div{color:#526158;font-size:12px;font-weight:700;letter-spacing:.1em}
.rhythm-stat strong{display:block;margin-top:22px;font:500 39px Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-stat strong small{font:13px Arial,sans-serif;letter-spacing:0}
.rhythm-stat p{margin:3px 0 0;color:#526158;font-size:12px}
.rhythm-board{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(270px,.75fr);gap:20px;margin-top:80px}
.rhythm-panel{padding:28px;border:1px solid var(--ink);background:#fffdf7}
.rhythm-panel-title{display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:8px 15px;margin-bottom:25px}
.rhythm-panel-title h2{margin:0;font:500 29px Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-panel-title span{color:#b42431;font-size:12px;font-weight:700;letter-spacing:.1em}
.rhythm-course-row{padding:18px 0;border-top:1px solid rgba(22,35,30,.18)}
.rhythm-course-row:first-of-type{border-top:0}
.rhythm-course-row>div{display:flex;justify-content:space-between;gap:14px;margin-bottom:10px;font-size:13px}
.rhythm-course-row em{color:#b42431;font-style:normal;font-weight:700}
.rhythm-course-row i{display:block;height:7px;overflow:hidden;background:#e6e7df}
.rhythm-course-row i span{display:block;height:100%;background:var(--ink)}
.rhythm-weekly{min-height:325px;background:var(--ink);color:#fffdf7}
.rhythm-weekly .rhythm-panel-title h2{color:#fffdf7}
.rhythm-weekly .rhythm-panel-title span{color:#dcbf6c}
.rhythm-week-chart{display:flex;align-items:end;justify-content:space-between;gap:8px;height:155px;padding-top:12px;border-bottom:1px solid rgba(255,255,255,.35)}
.rhythm-week-chart div{display:flex;width:100%;flex-direction:column;align-items:center;gap:8px;color:#bfcac2;font-size:12px}
.rhythm-week-chart i{display:block;width:100%;max-width:26px;min-height:4px;background:rgba(255,255,255,.18)}
.rhythm-week-chart i.done{background:#dcbf6c}
.rhythm-weekly>p{margin:19px 0 0;color:#c7d0c9;font-size:13px;line-height:1.55}
.rhythm-weekly>p b{color:#fffdf7}
.rhythm-directions{margin-top:80px}
.rhythm-directions-head{display:flex;align-items:end;justify-content:space-between;gap:25px;margin-bottom:28px}
.rhythm-directions h2{max-width:560px;margin:0;font:500 clamp(34px,4vw,52px)/1.04 Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-directions-head p{max-width:360px;margin:0;color:#617069;font-size:14px;line-height:1.6}
.rhythm-paths{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--ink);border-left:1px solid var(--ink)}
.rhythm-paths a{display:flex;flex-direction:column;min-height:245px;padding:23px;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);background:#fffdf7;color:var(--ink);text-decoration:none}
.rhythm-paths a:nth-child(2){background:#e8d7cb}
.rhythm-paths a:nth-child(3){background:#d9e6db}
.rhythm-paths span{font-size:12px;font-weight:700;letter-spacing:.1em}
.rhythm-paths h3{max-width:250px;margin:auto 0 10px;padding-top:24px;font:500 31px/1.02 Georgia,"Noto Sans KR",serif;letter-spacing:-.03em}
.rhythm-paths p{margin:0;color:#59665f;font-size:12px}
.rhythm-badges{display:grid;grid-template-columns:repeat(4,1fr);margin-top:20px;border-top:1px solid var(--ink);border-left:1px solid var(--ink)}
.rhythm-badges article{min-height:128px;padding:17px;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);background:#fffdf7}
.rhythm-badges article.locked{color:#526158;background:#edece4}
.rhythm-badges i{font-size:22px;font-style:normal}
.rhythm-badges b{display:block;margin-top:20px;font-size:12px}
.rhythm-badges span{display:block;margin-top:4px;color:#526158;font-size:12px}
.rhythm-db-note{margin-top:16px;color:#617069;font:13px Arial,sans-serif}
.rhythm-footer{padding:28px 0;color:#536158;font:12px Arial,sans-serif;letter-spacing:.08em}
@media (prefers-reduced-motion: no-preference) {
  .rhythm-course-row i span {
    animation: rhythm-progress var(--dur-enter) var(--ease-out) both;
    transform-origin: left;
  }
  .rhythm-week-chart i.done {
    animation: rhythm-day var(--dur-enter) var(--ease-out) both;
    transform-origin: bottom;
  }
}
@keyframes rhythm-progress {
  from { transform: scaleX(.08); }
  to { transform: scaleX(1); }
}
@keyframes rhythm-day {
  from { transform: scaleY(.1); }
  to { transform: scaleY(1); }
}
@media(max-width:900px){
  .rhythm-nav{flex-wrap:wrap;gap:4px 14px}
  .rhythm-links{order:1;width:100%;justify-content:flex-start}
  .rhythm-hero,.rhythm-board{grid-template-columns:minmax(0,1fr)}
  .rhythm-stats{grid-template-columns:repeat(2,1fr)}
  .rhythm-stats .level{grid-column:span 2}
  .rhythm-paths{grid-template-columns:1fr}
  .rhythm-paths a{min-height:210px}
  .rhythm-badges{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:500px){
  .rhythm-nav,.rhythm-wrap,.rhythm-footer{width:calc(100% - 28px)}
  .rhythm-nav{min-height:70px}
  .rhythm-name{max-width:92px}
  .rhythm-hero{padding:32px 23px}
  .rhythm-hero h1{font-size:clamp(30px,9vw,42px)}
  .rhythm-stats{grid-template-columns:1fr}
  .rhythm-stats .level{grid-column:auto}
  .rhythm-stat{min-height:105px}
  .rhythm-stat strong{margin-top:12px;font-size:32px}
  .rhythm-board,.rhythm-directions{margin-top:55px}
  .rhythm-directions-head{display:block}
  .rhythm-directions-head p{margin-top:17px}
  .rhythm-panel{padding:21px}
  .rhythm-badges{grid-template-columns:1fr}
  .rhythm-week-chart{height:134px}
}
`;

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
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const isAdmin = String(user?.publicMetadata?.role ?? "").toLowerCase() === "admin";
  const clerkName = user?.firstName || user?.username || "Ученик";
  const profileResult = await getOrCreateStudentProfile({ userId, displayName: clerkName, avatarUrl: user?.imageUrl ?? null }).catch(() => ({ profile: null, connected: false }));
  const name = profileResult.profile?.display_name || clerkName;
  const stats = await getLearningStats(userId);
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
      <style>{studioStyle}</style>
      <nav className="rhythm-nav" aria-label="Главное меню K-Lab">
        <Link className="rhythm-logo" href="/"><span className="rhythm-seal">ㅋ</span>K‑Lab</Link>
        <div className="rhythm-links">
          <a className="active" aria-current="page" href="/studio">МОЙ РИТМ</a><a href="https://k-lab-two.vercel.app/courses.html">УРОКИ</a><a href="/vocabulary">WORD DECK</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><Link href="/k-scene">K‑SCENE</Link><a href="https://k-lab-two.vercel.app/universities.html">ПОСТУПЛЕНИЕ</a>{isAdmin && <a href="/admin">АДМИН</a>}
        </div>
        <div className="rhythm-user"><span className="rhythm-name">{name}</span><UserButton appearance={{ elements: { avatarBox: "rhythm-avatar" } }} /></div>
      </nav>

      <main className="rhythm-wrap">
        <section className="rhythm-hero">
          <div><div className="rhythm-eyebrow">ЛИЧНЫЙ КАБИНЕТ · 오늘의 리듬</div><h1>{name}, вот твой<br />следующий <span>шаг.</span></h1><p>Открой следующее задание курса или выбери другое занятие ниже на странице.</p></div>
          <aside className="rhythm-lesson"><small>СЛЕДУЮЩЕЕ ЗАДАНИЕ КУРСА</small><h2>{nextLesson.title}</h2><p>{nextLesson.description}</p><a href={nextLesson.href}>ОТКРЫТЬ ЗАДАНИЕ →</a></aside>
        </section>

        <section className="rhythm-stats" aria-label="Статистика обучения">
          <article className="rhythm-stat level"><div>УРОВЕНЬ ПО XP</div><strong>{stats.level} <small>уровень</small></strong><p>{xpToNext} XP до следующего уровня</p></article>
          <article className="rhythm-stat"><div>СЕРИЯ ДНЕЙ</div><strong>{stats.streak}</strong><p>дней с новым уроком</p></article>
          <article className="rhythm-stat"><div>ВСЕГО XP</div><strong>{stats.totalXp}</strong><p>за уроки и Checkpoint</p></article>
          <article className="rhythm-stat"><div>УРОКОВ ПРОЙДЕНО</div><strong>{stats.completed}</strong><p>считая Checkpoint</p></article>
        </section>

        <section className="rhythm-board">
          <article className="rhythm-panel"><div className="rhythm-panel-title"><h2>Твой маршрут</h2><span>ПРОГРЕСС ПО УРОКАМ</span></div><div className="rhythm-course-row"><div><b>Карта хангыля · без учёта прогресса</b><em>0%</em></div><i><span style={{ width: "0%" }} /></i></div><div className="rhythm-course-row"><div><b>Урок 1 · Давайте познакомимся!</b><em>{stats.firstLessonProgress}%</em></div><i><span style={{ width: `${stats.firstLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 2 · Откуда ты?</b><em>{stats.secondLessonProgress}%</em></div><i><span style={{ width: `${stats.secondLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 3 · Что это?</b><em>{stats.thirdLessonProgress}%</em></div><i><span style={{ width: `${stats.thirdLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 4 · Мой день</b><em>{stats.fourthLessonProgress}%</em></div><i><span style={{ width: `${stats.fourthLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Checkpoint 01 · Первый разговор</b><em>{stats.checkpointProgress}%</em></div><i><span style={{ width: `${stats.checkpointProgress}%` }} /></i></div></article>
          <aside className="rhythm-panel rhythm-weekly"><div className="rhythm-panel-title"><h2>Эта неделя</h2><span>{stats.streak ? `${stats.streak} ДН. ПОДРЯД` : "НАЧНИ СЕГОДНЯ"}</span></div><div className="rhythm-week-chart">{weekNames.map((day, index) => { const done = stats.streak > 0 && index <= todayIndex && index > todayIndex - stats.streak; return <div key={day}><i className={done ? "done" : ""} style={{ height: done ? "86px" : "8px" }} /><span>{day}</span></div>; })}</div><p>{stats.streak ? <>Ты завершаешь уроки <b>{stats.streak} дн.</b> подряд. Сегодняшний день уже засчитан.</> : "Серия начнётся в день, когда ты завершишь новый урок."}</p></aside>
        </section>

        <section className="rhythm-directions"><div className="rhythm-directions-head"><h2>Выбери, чем заняться ещё.</h2><p>Эти разделы открываются на прежнем сайте K‑Lab. Вход там отдельный, и результаты в этот кабинет не попадают.</p></div><div className="rhythm-paths">{paths.map((path) => <a href={path.href} key={path.number}><span>{path.number}</span><h3>{path.title}</h3><p>{path.note}</p></a>)}</div></section>

        <section className="rhythm-badges" aria-label="Бейджи">
          <article className={stats.completed >= 1 ? "unlocked" : "locked"}><i>{stats.completed >= 1 ? "✦" : "○"}</i><b>Первый шаг</b><span>Заверши один урок</span></article><article className={stats.streak >= 7 ? "unlocked" : "locked"}><i>{stats.streak >= 7 ? "✦" : "○"}</i><b>Семь дней</b><span>Пока недоступен</span></article><article className={stats.completed >= 5 ? "unlocked" : "locked"}><i>{stats.completed >= 5 ? "✦" : "○"}</i><b>Начало A1</b><span>4 урока и Checkpoint</span></article><article className={stats.speakingAttempts >= 1 ? "unlocked" : "locked"}><i>{stats.speakingAttempts >= 1 ? "✦" : "○"}</i><b>Голос K‑Lab</b><span>Пока недоступен</span></article>
        </section>
        {!stats.connected && <p className="rhythm-db-note">Не удалось загрузить прогресс, поэтому здесь нули. Обнови страницу или зайди позже.</p>}
      </main>
      <footer className="rhythm-footer">© 2026 K‑LAB · КОРЕЙСКИЙ ЯЗЫК ДЛЯ НАЧИНАЮЩИХ</footer>
      <KTutor context="studio" />
    </>
  );
}
