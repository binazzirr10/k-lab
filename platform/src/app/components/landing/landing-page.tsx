"use client";

import { useEffect, useRef } from "react";
import { SiteHeader } from "./site-header";
import { Hero } from "./hero";
import type { HangulPosters } from "./hangul-scene/stage";
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

function LandingContent({ posters }: { posters: HangulPosters }) {
  const { lang } = useLanguage();
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled || !root.current) return;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        media.add("(prefers-reduced-motion: no-preference)", () => {
          const context = gsap.context(() => {
            for (const section of root.current?.querySelectorAll(".landing-hero, .landing-discover") ?? []) {
              if (section.getBoundingClientRect().top < window.innerHeight) continue;
              const lines = [...section.querySelectorAll("[data-line]")];
              if (!lines.length) continue;
              gsap.from(lines, {
                yPercent: 105, duration: .75, stagger: .08, ease: "power3.out",
                scrollTrigger: { trigger: section, start: "top 91%", once: true },
              });
            }
          }, root);
          return () => context.revert();
        });
        cleanup = () => media.revert();
      }).catch(() => { /* Content stays visible without choreography. */ });
    }
    return () => { cancelled = true; cleanup?.(); };
  }, [lang]);

  return <div ref={root} className="landing">
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
  </div>;
}

export function LandingPage({ posters }: { posters: HangulPosters }) {
  return <LangProvider><LandingContent posters={posters} /></LangProvider>;
}
