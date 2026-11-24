"use client";

import { useState } from "react";
import { motion } from "motion/react";
import type { Lang } from "@/lib/landing/lang";
import { admissionSteps, universities } from "@/lib/landing/universities";
import { LineArrow, MagneticPill, Reveal, useDrawOnEnter, useReducedMotion } from "../motion";
import e from "./editorial.module.css";
import s from "./university-hub.module.css";

const copy = {
  en: {
    title: ["University", "Hub"], intro: "Explore Korean universities and the usual steps to applying.",
    directory: "See the university directory", index: "University index", path: "From research to application",
    language: "Language of instruction varies by program. Check the official page.",
    official: "Official admissions", city: "City", areas: "Areas of study", instruction: "Language of instruction",
  },
  ru: {
    title: ["Вузы", "Кореи"], intro: "Познакомься с университетами Кореи и узнай, как обычно проходит поступление.",
    directory: "Открыть каталог вузов", index: "Список университетов", path: "От выбора вуза до поступления",
    language: "Язык обучения зависит от программы. Уточни на официальном сайте.",
    official: "Официальный сайт приёмной комиссии", city: "Город", areas: "Направления", instruction: "Язык обучения",
  },
};

export function UniversityHub({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduced = useReducedMotion();
  const pathLine = useDrawOnEnter();
  const [selected, setSelected] = useState<number | null>(0);
  const [preview, setPreview] = useState<number | null>(null);
  const open = preview ?? selected;
  const heading = "universities-heading";
  return <section className={e.section} id="university" data-scene="university" lang={lang} aria-labelledby={heading}>
    <div className={e.frame}>
      <div className={`${e.intro} ${s.intro}`}>
        <span className={e.number} aria-hidden="true">03</span>
        <h2 className={e.title} id={heading}><Reveal lines={t.title} /></h2>
        <p className={e.lead}>{t.intro}</p>
        <MagneticPill href="https://k-lab-two.vercel.app/universities.html">{t.directory}</MagneticPill>
      </div>
      <div className={`${e.paper} ${s.index}`}>
        <h3 className={s.indexLabel}>{t.index}</h3>
        <ul role="list" className={s.list} onPointerLeave={() => setPreview(null)}>
          {universities.map((university, i) => (
            <li key={university.korean} className={s.row} onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !event.currentTarget.parentElement?.querySelector(":focus-visible")) setPreview(i);
            }}>
              <button type="button" className={s.trigger} aria-controls={`university-details-${i}`} aria-expanded={open === i}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) { setSelected(i); setPreview(null); }
                }}
                onClick={() => { setSelected(selected === i && preview === null ? null : i); setPreview(null); }}>
                <span className={s.name}>{university.name}</span>
                <span className={s.korean} lang="ko">{university.korean}</span>
                <span className={s.indicator} aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
              <motion.div initial={false} animate={{ height: open === i ? "auto" : 0 }}
                transition={{ duration: reduced ? 0 : .32, ease: [.22, .61, .36, 1] }}
                className={s.details} id={`university-details-${i}`} inert={open !== i} aria-hidden={open !== i}>
                <div className={s.detailInner}>
                  <span className={s.outlineName} aria-hidden="true" lang="ko">{university.korean}</span>
                  <dl className={s.facts}>
                    <div><dt>{t.city}</dt><dd>{university.city[lang]}</dd></div>
                    <div><dt>{t.areas}</dt><dd>{university.areas[lang]}</dd></div>
                    <div><dt>{t.instruction}</dt><dd>{university.language?.[lang] ?? t.language}</dd></div>
                  </dl>
                  <a className={s.official} href={university.admissions}>{t.official} <LineArrow /></a>
                </div>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
      <aside className={`${e.paper} ${s.path}`}>
        <h3>{t.path}</h3>
        <ol role="list">
          <li className={s.pathRule} role="presentation" aria-hidden="true"><span ref={pathLine} /></li>
          {admissionSteps[lang].map(([title, detail], i) => <li key={title}>
            <span className={s.step} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{detail}</p>
          </li>)}
        </ol>
      </aside>
    </div>
  </section>;
}
