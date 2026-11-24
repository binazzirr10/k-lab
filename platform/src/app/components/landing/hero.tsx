import type { Lang } from "@/lib/landing/lang";
import { HangulStage, type HangulPosters } from "./hangul-scene/stage";

const copy = {
  en: {
    eyebrow: "A NEW LANGUAGE EXPERIENCE",
    lines: ["Korean,", "beyond the", "textbook."],
    intro: ["Learn Korean through real conversations, K‑dramas,", "and university-level content — a more immersive,", "cultural, and practical way to make Korean your own."],
    button: "Explore K-Lab",
  },
  ru: {
    eyebrow: "Новый опыт изучения языка",
    lines: ["Корейский", "за рамками", "учебника."],
    intro: "Учи корейский через живые разговоры, дорамы и материалы университетского уровня: погружайся в культуру, практикуйся и сделай язык своим.",
    button: "Открыть K-Lab",
  },
};

export function Hero({ lang, posters }: { lang: Lang; posters: HangulPosters }) {
  const content = copy[lang];
  return <section id="top" tabIndex={-1} data-scene="hero" className="landing-shell landing-hero">
    <div className="landing-hero-copy">
      <p className="landing-eyebrow">{content.eyebrow}</p>
      <h1 aria-label={content.lines.join(" ")}>{content.lines.map((line) =>
        <span className="landing-type-mask" key={line} aria-hidden="true"><span data-line>{line}</span></span>
      )}</h1>
      <p className="landing-intro">{typeof content.intro === "string" ? content.intro :
        content.intro.map((line, index) => <span key={line}>{index > 0 && " "}{line}</span>)}</p>
      <a className="landing-pill landing-explore" href="#discover">{content.button}<span aria-hidden="true">↗</span></a>
    </div>
    <HangulStage posters={posters} />
  </section>;
}
