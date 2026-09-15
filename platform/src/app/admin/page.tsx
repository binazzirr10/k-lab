import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const adminStyle = `
  .admin-shell{width:min(1180px,calc(100% - 40px));margin:0 auto 84px;font-family:Arial,sans-serif;color:#102c22}
  .admin-nav{height:86px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid #102c22}
  .admin-logo{display:flex;align-items:center;gap:10px;color:#102c22;font:700 23px Georgia,serif;letter-spacing:-1px;text-decoration:none}.admin-seal{display:grid;place-items:center;width:35px;height:35px;border:1px solid #102c22;border-radius:50%;font:15px Arial}.admin-user{display:flex;align-items:center;gap:10px;font-size:12px;font-weight:700}
  .admin-hero{display:grid;grid-template-columns:1.25fr .75fr;gap:20px;margin-top:34px;padding:48px clamp(25px,5vw,64px);border:1px solid #102c22;background:#fffdf7}.admin-eyebrow{color:#b42431;font-size:11px;font-weight:700;letter-spacing:.12em}.admin-hero h1{max-width:650px;margin:13px 0;font:500 clamp(40px,6vw,70px)/.98 Georgia,serif;letter-spacing:-.07em}.admin-hero h1 span{color:#b42431}.admin-hero p{max-width:580px;color:#617069;font-size:15px;line-height:1.65}.admin-stamp{align-self:end;padding:25px;border:1px solid #102c22;background:#102c22;color:#fffdf7}.admin-stamp b{display:block;color:#dcbf6c;font-size:11px;letter-spacing:.12em}.admin-stamp strong{display:block;margin-top:14px;font:500 30px Georgia,serif}.admin-stamp p{margin:9px 0 0;color:#cad4cc;font-size:13px}
  .admin-grid{display:grid;grid-template-columns:repeat(3,1fr);margin-top:20px;border-top:1px solid #102c22;border-left:1px solid #102c22}.admin-card{min-height:215px;padding:25px;border-right:1px solid #102c22;border-bottom:1px solid #102c22;background:#fffdf7}.admin-card:nth-child(2){background:#d9e6db}.admin-card:nth-child(3){background:#e8d7cb}.admin-card small{color:#b42431;font-size:10px;font-weight:700;letter-spacing:.12em}.admin-card h2{margin:45px 0 10px;font:500 29px/1.03 Georgia,serif}.admin-card p{margin:0;color:#617069;font-size:13px;line-height:1.55}.admin-card a{display:inline-block;margin-top:22px;color:#102c22;font-size:12px;font-weight:700;text-decoration:none}.admin-note{display:flex;align-items:flex-start;gap:18px;margin-top:20px;padding:24px;border:1px solid #102c22;background:#102c22;color:#fffdf7}.admin-note b{color:#dcbf6c;font-size:11px;letter-spacing:.1em}.admin-note p{max-width:700px;margin:0;color:#d3ddd5;font-size:13px;line-height:1.6}
  @media(max-width:760px){.admin-hero{grid-template-columns:1fr}.admin-grid{grid-template-columns:1fr}.admin-shell{width:min(100% - 26px,1180px)}}
`;

export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = String(user?.publicMetadata?.role ?? "").toLowerCase();
  if (role !== "admin") redirect("/studio");

  const name = user?.firstName || user?.username || "Администратор";

  return (
    <>
      <style>{adminStyle}</style>
      <main className="admin-shell">
        <nav className="admin-nav" aria-label="Навигация администратора">
          <a className="admin-logo" href="/studio"><span className="admin-seal">ㅋ</span>K‑Lab</a>
          <div className="admin-user"><span>{name} · ADMIN</span><UserButton /></div>
        </nav>

        <section className="admin-hero">
          <div>
            <div className="admin-eyebrow">K‑LAB CONTROL ROOM · PRIVATE</div>
            <h1>Твоя<br /><span>админ‑мастерская.</span></h1>
            <p>Здесь ты управляешь учебным маршрутом K‑Lab: проверяешь, что видят ученики, открываешь новые разделы и держишь контент в одном месте.</p>
          </div>
          <aside className="admin-stamp"><b>ДОСТУП ПОДТВЕРЖДЁН</b><strong>Administrator</strong><p>Это закрытая страница. Обычные ученики автоматически возвращаются в свой кабинет.</p></aside>
        </section>

        <section className="admin-grid" aria-label="Инструменты управления">
          <article className="admin-card"><small>01 · CONTENT</small><h2>Учебный маршрут</h2><p>Проверь четыре урока, итоговый тест и порядок прохождения так, как его увидит ученик.</p><a href="/studio">ОТКРЫТЬ МАРШРУТ →</a></article>
          <article className="admin-card"><small>02 · WORD DECK</small><h2>Слова и повторение</h2><p>Просматривай наборы базовой лексики и тестовый режим карточек перед публикацией нового материала.</p><a href="/vocabulary">ОТКРЫТЬ WORD DECK →</a></article>
          <article className="admin-card"><small>03 · K‑SCENE</small><h2>Сцены и речь</h2><p>Проверь диалоги, озвучку и Shadowing‑сцены, которые ученик использует после уроков.</p><a href="/k-scene">ОТКРЫТЬ K‑SCENE →</a></article>
        </section>

        <section className="admin-note"><b>СЛЕДУЮЩАЯ НАСТРОЙКА</b><p>Сама роль администратора уже защищена через Clerk. Следующим шагом подключим в эту панель редактирование слов, уроков, доступов и список учеников напрямую из Supabase — без изменения кода сайта.</p></section>
      </main>
    </>
  );
}
