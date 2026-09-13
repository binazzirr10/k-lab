import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { KTutor } from "@/app/components/k-tutor";
import { getOrCreateStudentProfile } from "@/lib/profile";

const weekNames = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const paths = [
  { number: "01 · LESSONS", title: "Уроки и живые фразы", note: "Продолжить маршрут →", href: "https://k-lab-two.vercel.app/courses.html" },
  { number: "02 · SPEAKING LAB", title: "Потренировать голос", note: "Откроется после урока →", href: "https://k-lab-two.vercel.app/speaking.html" },
  { number: "03 · K‑DRAMA", title: "Понять сцену без субтитров", note: "Учиться через контекст →", href: "https://k-lab-two.vercel.app/kdrama.html" },
];

// Safari can keep an older dev CSS chunk while Next is running locally. Keeping
// the dashboard essentials in the document makes the local preview resilient.
const studioStyleFix = `.rhythm-nav,.rhythm-wrap,.rhythm-footer{width:min(1220px,calc(100% - 40px));margin-left:auto;margin-right:auto;font-family:Arial,sans-serif}.rhythm-nav{height:86px;display:flex;align-items:center;justify-content:space-between;gap:20px}.rhythm-logo{display:flex;align-items:center;gap:10px;color:#102c22;font:700 23px Georgia,serif;letter-spacing:-1px;text-decoration:none}.rhythm-seal{display:grid;place-items:center;width:35px;height:35px;border:1px solid #102c22;border-radius:50%;font:15px Arial}.rhythm-links{display:flex;gap:18px}.rhythm-links a{color:#58645d;font-size:11px;font-weight:700;letter-spacing:.07em;text-decoration:none}.rhythm-links a.active{color:#b42431}.rhythm-user{display:flex;align-items:center;gap:10px}.rhythm-name{font-size:12px;font-weight:700}.rhythm-wrap{margin-top:25px;margin-bottom:80px}.rhythm-hero{position:relative;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(260px,.9fr);gap:30px;overflow:hidden;padding:46px clamp(25px,5vw,62px);border:1px solid #102c22;background:#fffdf7}.rhythm-eyebrow{color:#b42431;font-size:11px;font-weight:700;letter-spacing:.12em}.rhythm-hero h1{max-width:630px;margin:13px 0 15px;font:500 clamp(37px,5vw,63px)/1.01 Georgia,serif;letter-spacing:-.07em}.rhythm-hero h1 span{color:#b42431}.rhythm-hero>div>p{max-width:520px;margin:0;color:#617069;font-size:16px;line-height:1.65}.rhythm-lesson{align-self:center;padding:23px;border:1px solid #102c22;background:#102c22;box-shadow:6px 6px #dcbf6c;color:#fffdf7}.rhythm-lesson small{color:#cfd8d1;font-size:10px;font-weight:700;letter-spacing:.1em}.rhythm-lesson h2{margin:18px 0 8px;font:500 28px Georgia,serif}.rhythm-lesson p{margin:0;color:#cfd8d1;font-size:13px;line-height:1.5}.rhythm-lesson a{display:block;margin-top:20px;padding:13px;background:#dcbf6c;color:#102c22;text-align:center;text-decoration:none;font-size:12px;font-weight:700}.rhythm-stats{display:grid;grid-template-columns:1.4fr repeat(3,1fr);margin-top:20px;border-top:1px solid #102c22;border-left:1px solid #102c22}.rhythm-stat{min-height:140px;padding:20px;border-right:1px solid #102c22;border-bottom:1px solid #102c22;background:#fffdf7}.rhythm-stat.level{background:#d9e6db}.rhythm-stat>div{color:#627067;font-size:10px;font-weight:700;letter-spacing:.1em}.rhythm-stat strong{display:block;margin-top:22px;font:500 39px Georgia,serif}.rhythm-stat p{margin:3px 0 0;color:#647168;font-size:11px}.rhythm-board{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(270px,.75fr);gap:20px;margin-top:80px}.rhythm-panel{padding:28px;border:1px solid #102c22;background:#fffdf7}.rhythm-panel-title{display:flex;align-items:baseline;justify-content:space-between;gap:15px;margin-bottom:25px}.rhythm-panel-title h2{margin:0;font:500 29px Georgia,serif}.rhythm-panel-title span{color:#b42431;font-size:10px;font-weight:700;letter-spacing:.1em}.rhythm-course-row{padding:18px 0;border-top:1px solid #16231e2e}.rhythm-course-row>div{display:flex;justify-content:space-between;margin-bottom:10px;font-size:13px}.rhythm-course-row em{color:#b42431;font-style:normal;font-weight:700}.rhythm-course-row i{display:block;height:7px;background:#e6e7df}.rhythm-course-row i span{display:block;height:100%;background:#0047a0}.rhythm-weekly{min-height:325px;background:#102c22;color:#fffdf7}.rhythm-weekly .rhythm-panel-title h2{color:#fffdf7}.rhythm-weekly .rhythm-panel-title span{color:#dcbf6c}.rhythm-week-chart{display:flex;align-items:end;justify-content:space-between;gap:8px;height:155px;padding-top:12px;border-bottom:1px solid #ffffff59}.rhythm-week-chart div{display:flex;width:100%;flex-direction:column;align-items:center;gap:8px;color:#bfcac2;font-size:10px}.rhythm-week-chart i{display:block;width:100%;max-width:26px;min-height:4px;background:#ffffff2e}.rhythm-week-chart i.done{background:#dcbf6c}.rhythm-weekly>p{margin:19px 0 0;color:#c7d0c9;font-size:13px;line-height:1.55}.rhythm-directions{margin-top:80px}.rhythm-directions-head{display:flex;align-items:end;justify-content:space-between;gap:25px;margin-bottom:28px}.rhythm-directions h2{max-width:560px;margin:0;font:500 clamp(34px,4vw,52px)/1.04 Georgia,serif}.rhythm-directions-head p{max-width:360px;margin:0;color:#617069;font-size:14px;line-height:1.6}.rhythm-paths{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #102c22;border-left:1px solid #102c22}.rhythm-paths a{position:relative;min-height:280px;padding:23px;border-right:1px solid #102c22;border-bottom:1px solid #102c22;background:#fffdf7;color:#102c22;text-decoration:none}.rhythm-paths a:nth-child(2){background:#e8d7cb}.rhythm-paths a:nth-child(3){background:#d9e6db}.rhythm-paths h3{position:absolute;bottom:50px;left:23px;max-width:210px;margin:0;font:500 31px/1.02 Georgia,serif}.rhythm-paths p{position:absolute;bottom:20px;left:23px;margin:0;color:#59665f;font-size:12px}.rhythm-badges{display:grid;grid-template-columns:repeat(4,1fr);margin-top:20px;border-top:1px solid #102c22;border-left:1px solid #102c22}.rhythm-badges article{min-height:128px;padding:17px;border-right:1px solid #102c22;border-bottom:1px solid #102c22;background:#fffdf7}.rhythm-badges article.locked{color:#77817a;background:#edece4}.rhythm-badges i{font-size:22px;font-style:normal}.rhythm-badges b{display:block;margin-top:20px;font-size:12px}.rhythm-badges span{display:block;margin-top:4px;color:#627067;font-size:10px}@media(max-width:900px){.rhythm-links{display:none}.rhythm-hero,.rhythm-board{grid-template-columns:1fr}.rhythm-stats{grid-template-columns:repeat(2,1fr)}.rhythm-stat.level{grid-column:span 2}.rhythm-paths{grid-template-columns:1fr}.rhythm-badges{grid-template-columns:repeat(2,1fr)}}`;

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
  const clerkName = user?.firstName || user?.username || "ученица";
  const profileResult = await getOrCreateStudentProfile({ userId, displayName: clerkName, avatarUrl: user?.imageUrl ?? null }).catch(() => ({ profile: null, connected: false }));
  const name = profileResult.profile?.display_name || clerkName;
  const stats = await getLearningStats(userId);
  const xpToNext = 250 - (stats.totalXp % 250 || 0);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const nextLesson = stats.fourthLessonProgress === 100
    ? { title: "Checkpoint 01", description: "Итоговый тест по четырём урокам: 50 баллов и +50 XP.", href: "/checkpoint/section-01" }
    : stats.thirdLessonProgress === 100
    ? { title: "Мой день", description: "Расскажи о своём распорядке и потренируй вежливое настоящее время.", href: "/learn/lesson-04-my-day" }
    : stats.secondLessonProgress === 100
    ? { title: "Что это?", description: "Назови предметы вокруг себя и потренируй короткие фразы.", href: "/learn/lesson-03-objects" }
    : stats.firstLessonProgress === 100
      ? { title: "Откуда ты?", description: "Скажи, из какой ты страны, и собери свою первую мини‑визитку.", href: "/learn/lesson-02-country" }
      : { title: "Первый разговор", description: "Повтори приветствия и скажи AI‑наставнику, как тебя зовут.", href: "/learn/lesson-01-introduction" };

  return (
    <>
      <style>{studioStyleFix}</style>
      <nav className="rhythm-nav" aria-label="Главное меню K-Lab">
        <a className="rhythm-logo" href="/"><span className="rhythm-seal">ㅋ</span>K‑Lab</a>
        <div className="rhythm-links">
          <a className="active" href="/studio">МОЙ РИТМ</a><a href="https://k-lab-two.vercel.app/courses.html">УРОКИ</a><a href="/vocabulary">WORD DECK</a><a href="https://k-lab-two.vercel.app/speaking.html">SPEAKING</a><a href="/k-scene">K‑SCENE</a><a href="https://k-lab-two.vercel.app/universities.html">KOREA PATH</a>
        </div>
        <div className="rhythm-user"><span className="rhythm-name">{name}</span><UserButton appearance={{ elements: { avatarBox: "rhythm-avatar" } }} /></div>
      </nav>

      <main className="rhythm-wrap">
        <section className="rhythm-hero">
          <div><div className="rhythm-eyebrow">ТВОЙ УЧЕБНЫЙ ЖУРНАЛ · 오늘의 리듬</div><h1>{name}, сегодня можно<br />сделать <span>один шаг.</span></h1><p>Продолжай с того места, где остановилась. Даже десять минут практики меняют твой язык.</p></div>
          <aside className="rhythm-lesson"><small>СЛЕДУЮЩИЙ ШАГ · 08 МИНУТ</small><h2>{nextLesson.title}</h2><p>{nextLesson.description}</p><a href={nextLesson.href}>ПРОДОЛЖИТЬ УРОК →</a></aside>
        </section>

        <section className="rhythm-stats" aria-label="Статистика обучения">
          <article className="rhythm-stat level"><div>ТВОЙ УРОВЕНЬ</div><strong>{stats.level} <small>уровень</small></strong><p>{xpToNext} XP до следующего уровня</p></article>
          <article className="rhythm-stat"><div>СЕРИЯ ДНЕЙ</div><strong>{stats.streak}</strong><p>дней практики подряд</p></article>
          <article className="rhythm-stat"><div>ВСЕГО XP</div><strong>{stats.totalXp}</strong><p>заработано за обучение</p></article>
          <article className="rhythm-stat"><div>УРОКОВ ПРОЙДЕНО</div><strong>{stats.completed}</strong><p>завершённых уроков</p></article>
        </section>

        <section className="rhythm-board">
          <article className="rhythm-panel"><div className="rhythm-panel-title"><h2>Твой маршрут</h2><span>ЖИВОЙ ПРОГРЕСС</span></div><div className="rhythm-course-row"><div><b>Hangul Map · карта хангыля</b><em>0%</em></div><i><span style={{ width: "0%" }} /></i></div><div className="rhythm-course-row"><div><b>Урок 1 · Давайте познакомимся!</b><em>{stats.firstLessonProgress}%</em></div><i><span style={{ width: `${stats.firstLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 2 · Откуда ты?</b><em>{stats.secondLessonProgress}%</em></div><i><span style={{ width: `${stats.secondLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 3 · Что это?</b><em>{stats.thirdLessonProgress}%</em></div><i><span style={{ width: `${stats.thirdLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Урок 4 · Мой день</b><em>{stats.fourthLessonProgress}%</em></div><i><span style={{ width: `${stats.fourthLessonProgress}%` }} /></i></div><div className="rhythm-course-row"><div><b>Checkpoint 01 · Первый разговор</b><em>{stats.checkpointProgress}%</em></div><i><span style={{ width: `${stats.checkpointProgress}%` }} /></i></div></article>
          <aside className="rhythm-panel rhythm-weekly"><div className="rhythm-panel-title"><h2>Эта неделя</h2><span>{stats.streak ? `${stats.streak} ДН. В СЕРИИ` : "НАЧНИ СЕГОДНЯ"}</span></div><div className="rhythm-week-chart">{weekNames.map((day, index) => { const done = stats.streak > 0 && index <= todayIndex && index > todayIndex - stats.streak; return <div key={day}><i className={done ? "done" : ""} style={{ height: done ? "86px" : "8px" }} /><span>{day}</span></div>; })}</div><p>{stats.streak ? <>Ты практикуешься <b>{stats.streak} дней</b> подряд. Сохрани ритм коротким уроком сегодня.</> : "Практика появится здесь после первого завершённого урока."}</p></aside>
        </section>

        <section className="rhythm-directions"><div className="rhythm-directions-head"><h2>Выбери, как продолжить сегодня.</h2><p>Все направления сохраняют реальные действия в твоём профиле. Никаких «нарисованных» достижений.</p></div><div className="rhythm-paths">{paths.map((path) => <a href={path.href} key={path.number}><span>{path.number}</span><h3>{path.title}</h3><p>{path.note}</p></a>)}</div></section>

        <section className="rhythm-badges" aria-label="Бейджи">
          <article className={stats.completed >= 1 ? "unlocked" : "locked"}><i>{stats.completed >= 1 ? "✦" : "○"}</i><b>Первый шаг</b><span>Заверши один урок</span></article><article className={stats.streak >= 7 ? "unlocked" : "locked"}><i>{stats.streak >= 7 ? "✦" : "○"}</i><b>Семь дней</b><span>Практикуйся неделю</span></article><article className={stats.completed >= 5 ? "unlocked" : "locked"}><i>{stats.completed >= 5 ? "✦" : "○"}</i><b>Начинающий A1</b><span>Заверши пять уроков</span></article><article className={stats.speakingAttempts >= 1 ? "unlocked" : "locked"}><i>{stats.speakingAttempts >= 1 ? "✦" : "○"}</i><b>Голос K‑Lab</b><span>Первая практика речи</span></article>
        </section>
        {!stats.connected && <p className="rhythm-db-note">База подключается: после первого нового урока здесь появится прогресс.</p>}
      </main>
      <footer className="rhythm-footer">© 2026 K‑LAB · LEARN THE LANGUAGE. KEEP THE FEELING.</footer>
      <KTutor lessonContext="Пользователь находится в личном кабинете K-Lab. Помоги выбрать следующий шаг, объясни корейскую фразу или составь короткий план практики." />
    </>
  );
}
