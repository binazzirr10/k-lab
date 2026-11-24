import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const adminStyle = `
  .admin-shell{width:min(1180px,calc(100% - 40px));margin:0 auto 84px;font-family:Arial,sans-serif;color:#102c22}
  .admin-nav{min-height:86px;padding-block:8px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid #102c22}
  .admin-logo{display:flex;align-items:center;gap:10px;min-height:44px;color:#102c22;font:700 23px Georgia,serif;letter-spacing:-.03em;text-decoration:none}
  .admin-seal{display:grid;place-items:center;width:35px;height:35px;border:1px solid #102c22;border-radius:50%;font:15px Arial}
  .admin-user{display:flex;min-width:0;align-items:center;gap:10px;font-size:12px;font-weight:700}
  .admin-user>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .admin-hero{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:20px;margin-top:34px;padding:48px clamp(25px,5vw,64px);border:1px solid #102c22;background:#fffdf7}
  .admin-eyebrow{color:#b42431;font-size:12px;font-weight:700;letter-spacing:.12em}
  .admin-hero h1{max-width:650px;overflow-wrap:anywhere;margin:13px 0;font:500 clamp(33px,5.5vw,70px)/1.02 Georgia,serif;letter-spacing:-.03em}
  .admin-hero h1 span{color:#b42431}
  .admin-hero p{max-width:580px;color:#617069;font-size:15px;line-height:1.65}
  .admin-stamp{align-self:end;padding:25px;border:1px solid #102c22;background:#102c22;box-shadow:6px 6px 0 var(--sun);color:#fffdf7}
  .admin-stamp b{display:block;color:#dcbf6c;font-size:12px;letter-spacing:.12em}
  .admin-stamp strong{display:block;margin-top:14px;font:500 30px Georgia,serif}
  .admin-stamp p{margin:9px 0 0;color:#cad4cc;font-size:13px}
  .admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));margin-top:20px;border-top:1px solid #102c22;border-left:1px solid #102c22}
  .admin-card{min-height:215px;padding:25px;display:flex;flex-direction:column;align-items:flex-start;border-right:1px solid #102c22;border-bottom:1px solid #102c22;background:#fffdf7}
  .admin-card:nth-child(2){background:#d9e6db}
  .admin-card:nth-child(3){background:#e8d7cb}
  .admin-card small{color:#b42431;font-size:12px;font-weight:700;letter-spacing:.12em}
  .admin-card h2{margin:45px 0 10px;font:500 29px/1.03 Georgia,serif;letter-spacing:-.03em}
  .admin-card p{margin:0 0 12px;color:#536259;font-size:13px;line-height:1.55}
  .admin-card a{margin-top:auto;padding-top:8px;color:#102c22;font-size:12px;font-weight:700;text-decoration:none}
  .admin-note{display:flex;align-items:flex-start;gap:18px;margin-top:20px;padding:24px;border:1px solid #102c22;background:#102c22;color:#fffdf7}
  .admin-note b{color:#dcbf6c;font-size:12px;letter-spacing:.1em}
  .admin-note p{max-width:700px;margin:0;color:#d3ddd5;font-size:13px;line-height:1.6}
  @media (max-width: 800px) {
    .admin-hero,.admin-grid{grid-template-columns:minmax(0,1fr)}
    .admin-shell{width:calc(100% - 28px)}
    .admin-note{flex-direction:column;gap:8px}
  }
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
        <nav className="admin-nav" aria-label="Меню администратора">
          <a className="admin-logo" href="/studio"><span className="admin-seal">ㅋ</span>K‑Lab</a>
          <div className="admin-user"><span>{name} · АДМИН</span><UserButton /></div>
        </nav>

        <section className="admin-hero">
          <div>
            <div className="admin-eyebrow">K‑LAB · ЗАКРЫТАЯ СТРАНИЦА</div>
            <h1>Панель<br /><span>администратора.</span></h1>
            <p>Отсюда можно открыть разделы K‑Lab и проверить, что видят ученики. Редактировать контент в панели пока нельзя.</p>
          </div>
          <aside className="admin-stamp"><b>ДОСТУП ПОДТВЕРЖДЁН</b><strong>Администратор</strong><p>Ученики без роли администратора попадают с этой страницы в свой кабинет.</p></aside>
        </section>

        <section className="admin-grid" aria-label="Разделы для проверки">
          <article className="admin-card"><small>01 · УРОКИ</small><h2>Учебный маршрут</h2><p>Проверь четыре урока, итоговый тест и порядок прохождения глазами ученика.</p><a href="/studio">ОТКРЫТЬ КАБИНЕТ →</a></article>
          <article className="admin-card"><small>02 · WORD DECK</small><h2>Слова и повторение</h2><p>Проверь наборы слов, озвучку примеров и быструю проверку. Отметки на карточках сохранятся в твоём профиле.</p><a href="/vocabulary">ОТКРЫТЬ WORD DECK →</a></article>
          <article className="admin-card"><small>03 · K‑SCENE</small><h2>Сцены и речь</h2><p>Проверь диалоги, переводы и озвучку сцен, которые ученик открывает к урокам.</p><Link href="/k-scene">ОТКРЫТЬ K‑SCENE →</Link></article>
        </section>

        <section className="admin-note"><b>ЧЕГО ПОКА НЕТ</b><p>Доступ к этой странице проверяется по роли в Clerk. Менять слова, уроки и доступы или смотреть список учеников в панели пока нельзя.</p></section>
      </main>
    </>
  );
}
