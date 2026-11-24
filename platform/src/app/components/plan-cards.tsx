import type { ReactNode } from "react";
import type { Lang } from "@/lib/landing/lang";
import { formatTenge, plans, type Plan } from "@/lib/plans";
import "./plan-cards.css";

const words = {
  en: { popular: "Most popular", soon: "soon" },
  ru: { popular: "Популярный", soon: "скоро" },
};

export function PlanCards({ lang, action }: { lang: Lang; action: (plan: Plan) => ReactNode }) {
  const t = words[lang];
  return <div className="plan-cards">
    {plans.map((plan) => <article key={plan.id} className="plan-card" data-plan={plan.id} data-enter="rise">
      <header>
        <h3>{plan.name}{plan.id === "pro" && <span>{t.popular}</span>}</h3>
        <p><b>{formatTenge(plan.price)}</b> {plan.note[lang]}</p>
      </header>
      <ul>{plan.features.map((feature) => <li key={feature.en} data-soon={feature.soon}>
        {feature[lang]}{feature.soon && <small>{t.soon}</small>}
      </li>)}</ul>
      <div className="plan-foot">{action(plan)}</div>
    </article>)}
  </div>;
}
