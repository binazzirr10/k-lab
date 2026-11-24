import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function AdminPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = String(user?.publicMetadata?.role ?? "").toLowerCase();
  if (role !== "admin") redirect("/studio");

  const name = user?.firstName || user?.username || "Администратор";

  return (
    <>
      <AppNav><span className="app-nav-name">{name}</span><UserButton /></AppNav>
      <main className="admin-shell">

        <section className="admin-hero">
          <div>
            <div className="admin-eyebrow">Управление K‑Lab</div>
            <h1>Панель администратора</h1>
            <p>Отсюда можно открыть разделы K‑Lab и проверить, что видят ученики. Редактировать контент в панели пока нельзя.</p>
          </div>
          <aside className="admin-stamp"><b>Доступ подтверждён</b><strong>Администратор</strong><p>Ученики без роли администратора попадают с этой страницы в свой кабинет.</p></aside>
        </section>

        <section className="admin-grid" aria-label="Разделы для проверки">
          <article className="admin-card"><small>Уроки</small><h2>Учебный маршрут</h2><p>Проверь четыре урока, итоговый тест и порядок прохождения глазами ученика.</p><a href="/studio">Открыть кабинет →</a></article>
          <article className="admin-card"><small>Word Deck</small><h2>Слова и повторение</h2><p>Проверь наборы слов, озвучку примеров и быструю проверку. Отметки на карточках сохранятся в твоём профиле.</p><a href="/vocabulary">Открыть Word Deck →</a></article>
          <article className="admin-card"><small>K‑Scene</small><h2>Сцены и речь</h2><p>Проверь диалоги, переводы и озвучку сцен, которые ученик открывает к урокам.</p><Link href="/k-scene">Открыть K‑Scene →</Link></article>
        </section>

        <section className="admin-note"><b>Чего пока нет</b><p>Доступ к этой странице проверяется по роли в Clerk. Менять слова, уроки и доступы или смотреть список учеников в панели пока нельзя.</p></section>
      </main>
    </>
  );
}
