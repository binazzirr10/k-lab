import { AppNav } from "@/app/components/app-nav";
import { UserButton } from "@clerk/nextjs";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { paidPlanSchema } from "@/lib/plan-schema";
import { activePlan } from "@/lib/plans";
import { PlanManager, type PlanRow } from "./plan-manager";
import Link from "next/link";
import { redirect } from "next/navigation";


async function loadRows(query: string): Promise<{ rows: PlanRow[]; failed: boolean }> {
  try {
    const { users } = await clerkClient();
    const { data } = await users.getUserList({ limit: query ? 50 : 500, orderBy: "-created_at", ...(query && { query }) });
    const rows = data.map((user): PlanRow => {
      const { plan, until } = activePlan(user.publicMetadata);
      const request = paidPlanSchema.safeParse((user.privateMetadata.planRequest as { plan?: unknown } | undefined)?.plan);
      return {
        id: user.id, name: user.fullName || user.username || "Без имени",
        email: user.primaryEmailAddress?.emailAddress ?? "", plan, until, request: request.success ? request.data : null,
      };
    });
    const weight = (row: PlanRow) => (row.request ? 0 : row.plan !== "free" ? 1 : 2);
    return { rows: rows.sort((a, b) => weight(a) - weight(b)).slice(0, 60), failed: false };
  } catch (error) {
    console.error("Admin plan list failed:", error instanceof Error ? error.message : error);
    return { rows: [], failed: true };
  }
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const role = String(user?.publicMetadata?.role ?? "").toLowerCase();
  if (role !== "admin") redirect("/studio");

  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q ?? "").trim().slice(0, 80);
  const { rows, failed } = await loadRows(query);
  const name = user?.firstName || user?.username || "Администратор";

  return (
    <>
      <AppNav><span className="app-nav-name">{name}</span><UserButton /></AppNav>
      <main className="admin-shell">

        <section className="admin-hero">
          <div>
            <div className="admin-eyebrow">Управление K‑Lab</div>
            <h1>Панель администратора</h1>
            <p>Отсюда можно открыть разделы K‑Lab и проверить, что видят ученики. Здесь же открывается доступ к тарифам. Редактировать контент в панели пока нельзя.</p>
          </div>
          <aside className="admin-stamp"><b>Доступ подтверждён</b><strong>Администратор</strong><p>Ученики без роли администратора попадают с этой страницы в свой кабинет.</p></aside>
        </section>

        <section className="admin-grid" aria-label="Разделы для проверки">
          <article className="admin-card"><small>Уроки</small><h2>Учебный маршрут</h2><p>Проверь четыре урока, итоговый тест и порядок прохождения глазами ученика.</p><a href="/studio">Открыть кабинет →</a></article>
          <article className="admin-card"><small>Word Deck</small><h2>Слова и повторение</h2><p>Проверь наборы слов, озвучку примеров и быструю проверку. Отметки на карточках сохранятся в твоём профиле.</p><a href="/vocabulary">Открыть Word Deck →</a></article>
          <article className="admin-card"><small>K‑Scene</small><h2>Сцены и речь</h2><p>Проверь диалоги, переводы и озвучку сцен, которые ученик открывает к урокам.</p><Link href="/k-scene">Открыть K‑Scene →</Link></article>
        </section>

        <section className="admin-plan" aria-labelledby="admin-plan-title">
          <h2 id="admin-plan-title">Тарифы учеников</h2>
          <p>Сначала идут заявки, потом действующие тарифы. Открывай доступ после оплаты.</p>
          <form className="admin-plan-search" action="/admin"><input name="q" type="search" defaultValue={query} maxLength={80} placeholder="Имя или почта" aria-label="Найти ученика" /><button type="submit">Найти</button></form>
          {failed ? <p role="alert">Не удалось загрузить учеников. Обнови страницу.</p> : <PlanManager rows={rows} />}
        </section>

        <section className="admin-note"><b>Чего пока нет</b><p>Доступ к этой странице проверяется по роли в Clerk. Менять слова и уроки в панели пока нельзя.</p></section>
      </main>
    </>
  );
}
