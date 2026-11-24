"use client";

import { LazyMotion } from "motion/react";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import type { HangulPosters } from "./hangul-scene/stage";
import { useEntrances } from "./motion/use-entrances";
import { WeightRipple } from "./motion/weight-ripple";
import { Discover } from "./discover";
import { SiteFooter } from "./site-footer";
import { LangProvider, useLanguage } from "./lang-provider";
import { SpeakingLab } from "./sections/speaking-lab";
import { DramaMode } from "./sections/drama-mode";
import { UniversityHub } from "./sections/university-hub";
import { VocabularyDeck } from "./sections/vocabulary";

const resources = [
  ["/hangul", "Hangul", "Хангыль"],
  ["/grammar", "Grammar", "Грамматика"],
  ["/phrases", "Phrases", "Фразы"],
  ["/learn/lesson-01-introduction", "01 / Introductions", "01 / Знакомство"],
  ["/learn/lesson-02-country", "02 / Countries", "02 / Страны"],
  ["/learn/lesson-03-objects", "03 / Objects", "03 / Предметы"],
  ["/learn/lesson-04-my-day", "04 / My day", "04 / Мой день"],
] as const;

const loadMotion = () => import("../motion-kit/features").then((module) => module.default);

function LandingContent({ posters }: { posters: HangulPosters }) {
  const { lang } = useLanguage();
  useEntrances();
  return <LazyMotion strict features={loadMotion}><div className="landing">
    <a className="landing-skip" href="#top">{lang === "en" ? "Skip to content" : "К содержанию"}</a>
    <SiteHeader />
    <main>
      <Hero lang={lang} posters={posters} />
      <Discover lang={lang} />
      <SpeakingLab lang={lang} />
      <DramaMode lang={lang} />
      <UniversityHub lang={lang} />
      <VocabularyDeck lang={lang} />
      <section className="landing-shell landing-resources" aria-labelledby="landing-resources">
        <div className="landing-closing">
          <h2 id="landing-resources" lang="ko"><WeightRipple text="천천히, 하지만 꾸준히." /></h2>
          <p>{lang === "en" ? "Slowly, but steadily." : "Медленно, но уверенно."}</p>
        </div>
        <div>
          <h3>{lang === "en" ? "The Korean A1 course" : "Курс корейского A1"}</h3>
          <div className="landing-course-index">{resources.map(([href, en, ru]) => <a href={href} key={href}>{lang === "en" ? en : ru}<span aria-hidden="true">↗</span></a>)}</div>
        </div>
      </section>
    </main>
    <SiteFooter lang={lang} />
  </div></LazyMotion>;
}

export function LandingPage({ posters }: { posters: HangulPosters }) {
  return <LangProvider><LandingContent posters={posters} /></LangProvider>;
}
