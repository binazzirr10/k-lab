"use client";

import type { MouseEvent } from "react";
import type { Lang } from "@/lib/landing/lang";
import { withTransition } from "./motion/transition";

const features = [
  {
    id: "speaking", image: null, crop: undefined,
    en: ["Speaking Lab", "Practise speaking Korean. Record a phrase and get an AI comment on how it sounds."],
    ru: ["Speaking Lab", "Запиши фразу на корейском и получи комментарий от ИИ."],
  },
  {
    id: "drama", image: "/assets/kscene-cafe-table-480.webp", crop: "42% center",
    en: ["K-Drama Mode", "Follow four original illustrated K‑Scene dialogues and read the Korean line by line."],
    ru: ["Режим K-Drama", "Читай четыре авторских иллюстрированных диалога K‑Scene на корейском."],
  },
  {
    id: "university", image: "/assets/kscene-campus-morning-480.webp", crop: "66% center",
    en: ["University Hub", "Explore universities in South Korea and find links to their official admissions pages."],
    ru: ["Университеты", "Посмотри список университетов Южной Кореи."],
  },
] as const;

function SpeakingArtwork() {
  return <svg viewBox="0 0 195 197" aria-hidden="true" fill="none">
    <defs>
      <linearGradient id="speech-wall" x1="0" y1="1" x2="1" y2="0">
        <stop stopColor="#a9b29d" /><stop offset=".55" stopColor="#e3e1d6" /><stop offset="1" stopColor="#f6f3ec" />
      </linearGradient>
      <linearGradient id="speech-metal">
        <stop stopColor="#a2a28e" /><stop offset=".44" stopColor="#efede1" /><stop offset="1" stopColor="#aaa998" />
      </linearGradient>
      <pattern id="speech-mesh" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
        <path d="M0 0l2.4 2.4m0-2.4L0 2.4" stroke="#5e6258" strokeWidth=".34" />
      </pattern>
      <filter id="speech-window"><feGaussianBlur stdDeviation="3.3" /></filter>
    </defs>
    <path fill="url(#speech-wall)" d="M0 0h195v197H0z" />
    <g filter="url(#speech-window)" transform="rotate(27 95 75)">
      <path fill="#fdfaf0" opacity=".65" d="M-45 12h300v47H-45zm0 61h300v54H-45z" />
      <path fill="#666b5c" opacity=".3" d="M-45 58h300v8H-45zm0 65h300v7H-45zM132-60h10v290h-10z" />
    </g>
    <g stroke="#53634d" strokeWidth=".7" opacity=".62">
      <path d="M8 104h179" opacity=".31" />
      {Array.from({ length: 55 }, (_, i) => {
        // Rounded so the server and the browser print the same path.
        const height = Math.round((1 + (Math.sin(i * 2.7) ** 2) * (7 + 22 * Math.exp(-((i - 15) ** 2) / 40) + 15 * Math.exp(-((i - 43) ** 2) / 28))) * 100) / 100;
        return <path key={i} d={`M${9 + i * 3.25} ${(104 - height / 2).toFixed(2)}v${height}`} />;
      })}
    </g>
    <g stroke="#41473d" strokeWidth="1.15">
      <path d="M119 157v40m7-40v40M99 184h45" />
      <path d="M96 115v18a26 26 0 0 0 52 0v-18" strokeWidth="1.6" />
      <circle cx="97" cy="119" r="3" fill="#b6b7a7" />
      <circle cx="148" cy="119" r="3" fill="#b6b7a7" />
      <rect x="103" y="48" width="38" height="99" rx="18" fill="url(#speech-metal)" />
      <path d="M103 99V66a18 18 0 0 1 18-18h2a18 18 0 0 1 18 18v33z" fill="url(#speech-mesh)" />
      <path d="M103 105h38m-35 33h32" strokeOpacity=".58" />
      <path d="M145 132c24 3 21 45 33 65" strokeOpacity=".74" />
    </g>
  </svg>;
}

/** The picture on the card grows into the main picture of its section. */
function handOff(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const art = event.currentTarget.querySelector<HTMLElement>(".landing-feature-art");
  const section = document.getElementById(id);
  const target = section?.querySelector<HTMLElement>("[data-handoff]");
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !art || !section || !target
    || !("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  event.preventDefault();
  art.style.setProperty("view-transition-name", "handoff");
  withTransition("handoff", () => {
    art.style.removeProperty("view-transition-name");
    delete target.dataset.closed;
    target.style.setProperty("view-transition-name", "handoff");
    history.pushState(null, "", `#${id}`);
    section.scrollIntoView({ behavior: "instant", block: "start" });
  }, () => {
    target.style.removeProperty("view-transition-name");
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  });
}

export function Discover({ lang }: { lang: Lang }) {
  return <section className="landing-shell landing-discover" id="discover" aria-label={lang === "en" ? "Discover K-Lab" : "Обзор K-Lab"}>
    {features.map(({ id, image, crop, ...copy }, i) =>
      <a className="landing-feature" key={id} href={`#${id}`} onClick={(event) => handOff(event, id)}>
        <div>
          <span className="landing-index" aria-hidden="true">0{i + 1}</span>
          <h2 className="landing-type-mask"><span data-line>{copy[lang][0]}</span></h2>
          <p>{copy[lang][1]}</p>
          <svg className="landing-feature-arrow" viewBox="0 0 22 16" aria-hidden="true"><path d="M1 8h18m-6-6 6 6-6 6" stroke="currentColor" fill="none" /></svg>
        </div>
        <div className="landing-feature-art">
          {/* eslint-disable-next-line @next/next/no-img-element -- Sized static artwork with a prebuilt crop. */}
          {image ? <img src={image} width="480" height="480" alt="" style={{ objectPosition: crop }} /> : <SpeakingArtwork />}
        </div>
      </a>
    )}
  </section>;
}
