import type { Metadata } from "next";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { AppNav } from "@/app/components/app-nav";
import { AuthActions } from "@/app/components/auth-actions";
import { PlanCards } from "@/app/components/plan-cards";
import { PlanRequest } from "@/app/components/plan-request";
import styles from "@/app/components/motion-kit/reference.module.css";
import { signInFor } from "@/lib/sign-in";
import { activePlan, comparison, type Plan } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Тарифы | K‑Lab",
  description: "Бесплатный доступ, Pro и Pro+: что входит в каждый тариф K‑Lab.",
};

export default async function PricingPage() {
  const user = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? await currentUser() : null;
  const { plan: active, until } = activePlan(user?.publicMetadata);
  const requested = (user?.privateMetadata.planRequest as { plan?: string } | undefined)?.plan;

  function action(plan: Plan) {
    if (plan.id === active && user) {
      return <p className="plan-current">Твой тариф{until && ` до ${new Date(until).toLocaleDateString("ru-RU", { timeZone: "Asia/Almaty" })}`}</p>;
    }
    if (plan.id === "free") {
      return user ? <p className="plan-current">Всегда доступно</p> : <Link className="plan-action" href="/sign-up">Начать бесплатно</Link>;
    }
    if (!user) return <Link className="plan-action" href={signInFor("/pricing")}>Войти и оставить заявку</Link>;
    if (active === "pro_plus") return <p className="plan-current">Входит в Pro+</p>;
    return <PlanRequest plan={plan.id} initialSent={requested === plan.id}
      label={plan.id === "pro" ? "Оставить заявку на Pro" : "Оставить заявку на Pro+"} />;
  }

  return <div className={styles.shell}>
    <AppNav active="pricing"><AuthActions /></AppNav>
    <main className={styles.main}>
      <header className={styles.hero}><h1>Тарифы</h1><p>Начни бесплатно. Pro открывает все K-Drama сцены и убирает дневной лимит Speaking. Pro+ добавляет инструменты University Lab.</p></header>
      <PlanCards lang="ru" action={action} />
      <p className="plan-note">Онлайн-оплаты пока нет. Заявка ничего не списывает: команда K‑Lab свяжется с тобой по почте аккаунта и откроет доступ после оплаты. Пункты с пометкой «скоро» ещё не готовы.</p>
      <section className={styles.panel}>
        <h2>Что входит</h2>
        <table className="plan-table">
          <thead><tr><th scope="col">Раздел</th><th scope="col">Бесплатно</th><th scope="col">По подписке</th></tr></thead>
          <tbody>{comparison.map((row) => <tr key={row.section}>
            <th scope="row">{row.section}</th>
            <td data-label="Бесплатно">{row.free}</td>
            <td data-label="По подписке">{row.paid}{row.soon && <small>скоро</small>}</td>
          </tr>)}</tbody>
        </table>
      </section>
    </main>
  </div>;
}
