import Link from "next/link";
import type { Lang } from "@/lib/landing/lang";
import { PlanCards } from "@/app/components/plan-cards";
import { Reveal } from "../motion";
import { Divider } from "../motion/divider";

const copy = {
  en: { title: "Plans", intro: "Start for free. Pro opens every K-Drama scene and lifts the daily Speaking limit. Items marked “soon” aren’t ready yet.", free: "Start for free", pro: "Choose Pro", plus: "See Pro+" },
  ru: { title: "Тарифы", intro: "Начни бесплатно. Pro открывает все K-Drama сцены и убирает дневной лимит Speaking. Пункты с пометкой «скоро» ещё не готовы.", free: "Начать бесплатно", pro: "Выбрать Pro", plus: "Подробнее о Pro+" },
};

export function Pricing({ lang }: { lang: Lang }) {
  const t = copy[lang];
  return <section className="landing-shell landing-pricing" id="pricing" aria-labelledby="pricing-heading">
    <Divider />
    <header><h2 id="pricing-heading"><Reveal lines={[t.title]} /></h2><p>{t.intro}</p></header>
    <PlanCards lang={lang} action={(plan) => <Link className="plan-action" prefetch={false} href={plan.id === "free" ? "/sign-up" : "/pricing"}>
      {plan.id === "free" ? t.free : plan.id === "pro" ? t.pro : t.plus}
    </Link>} />
  </section>;
}
