import Link from "next/link";
import type { Lang } from "@/lib/landing/lang";
import { Wordmark } from "./site-header";

const columns = [
  {
    title: ["Explore", "Обзор"],
    links: [
      ["#speaking", "Speaking Lab", "Speaking Lab"],
      ["#drama", "K-Drama Mode", "Режим K-Drama"],
      ["#university", "University Hub", "Университеты"],
    ],
  },
  {
    title: ["Learn", "Учёба"],
    links: [
      ["/learn/lesson-01-introduction", "Start the A1 course", "Начать курс A1"],
      ["/vocabulary", "Word Deck", "Карточки слов"],
      ["/checkpoint/section-01", "Checkpoint", "Итоговая проверка"],
    ],
  },
] as const;

export function SiteFooter({ lang }: { lang: Lang }) {
  const index = lang === "en" ? 0 : 1;
  return <footer className="landing-shell landing-footer">
    <div className="landing-footer-brand">
      <a href="#top"><Wordmark /></a>
      <p>{lang === "en" ? "A Korean A1 course in Russian for beginners in Kazakhstan." : "Курс корейского A1 на русском для начинающих в Казахстане."}</p>
    </div>
    {columns.map(({ title, links }) => <nav key={title[0]} aria-label={title[index]}>
      <h2>{title[index]}</h2>
      {links.map(([href, en, ru]) => <Link key={href} href={href} prefetch={false}>{lang === "en" ? en : ru}</Link>)}
    </nav>)}
    <a className="landing-footer-top" href="#top">{lang === "en" ? "Back to top" : "Наверх"} <span aria-hidden="true">↑</span></a>
  </footer>;
}
