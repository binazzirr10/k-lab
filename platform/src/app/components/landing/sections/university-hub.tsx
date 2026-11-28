"use client";

import { type CSSProperties, useState } from "react";
import Link from "next/link";
import * as m from "motion/react-m";
import type { Lang } from "@/lib/landing/lang";
import { admissionSteps, universities } from "@/lib/landing/universities";
import { universityCatalog } from "@/lib/universities";
import { LineArrow, MagneticPill, Reveal, useReducedMotion } from "../motion";
import { Divider } from "../motion/divider";
import { JamoText } from "../motion/jamo-text";
import { SplitFlap } from "../motion/split-flap";
import e from "./editorial.module.css";
import s from "./university-hub.module.css";

const copy = {
  en: {
    title: ["University", "Hub"], intro: "Explore Korean universities and the usual steps to applying.",
    directory: "See the university directory", index: "University index", path: "From research to application",
    language: "Language of instruction varies by program. Check the official page.",
    official: "Official admissions", article: "Read the article", city: "City", areas: "Areas of study", instruction: "Language of instruction",
  },
  ru: {
    title: ["Вузы", "Кореи"], intro: "Познакомься с университетами Кореи и узнай, как обычно проходит поступление.",
    directory: "Открыть каталог вузов", index: "Список университетов", path: "От выбора вуза до поступления",
    language: "Язык обучения зависит от программы. Уточни на официальном сайте.",
    official: "Официальный сайт приёмной комиссии", article: "Читать статью", city: "Город", areas: "Направления", instruction: "Язык обучения",
  },
};

const universityIds = new Map(universityCatalog.map(({ name, id }) => [name, id]));
const universityIndex = universities.map((university) => ({ university, id: universityIds.get(university.name) }));

export function UniversityHub({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(0);
  const [preview, setPreview] = useState<number | null>(null);
  const open = preview ?? selected;
  const heading = "universities-heading";
  return <section className={e.section} id="university" data-scene="university" lang={lang} aria-labelledby={heading}>
    <div className={e.frame}>
      <Divider />
      <div className={`${e.intro} ${s.intro}`}>
        <span className={e.number} aria-hidden="true">03</span>
        <h2 className={e.title} id={heading}><Reveal lines={t.title} /></h2>
        <p className={e.lead}>{t.intro}</p>
        <MagneticPill href="/universities">{t.directory}</MagneticPill>
      </div>
      <div className={`${e.paper} ${s.index}`} data-handoff="">
        <h3 className={s.indexLabel}>{t.index}</h3>
        <ul role="list" className={s.list} onPointerLeave={() => setPreview(null)}>
          {universityIndex.map(({ university, id }, i) => (
            <li key={university.korean} className={s.row} data-enter="slide" style={{ "--i": i } as CSSProperties} onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && !event.currentTarget.parentElement?.querySelector(":focus-visible")) setPreview(i);
            }}>
              <button type="button" className={s.trigger} aria-controls={`university-details-${i}`} aria-expanded={open === i}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) { setSelected(i); setPreview(null); }
                }}
                onClick={() => { setSelected(selected === i && preview === null ? null : i); setPreview(null); }}>
                <span className={s.name}><JamoText text={university.name} active={open === i} /></span>
                <span className={s.korean} lang="ko">{university.korean}</span>
                <span className={s.indicator} aria-hidden="true">{open === i ? "−" : "+"}</span>
              </button>
              <m.div initial={false} animate={{ height: open === i ? "auto" : 0 }}
                transition={{ duration: reduced ? 0 : .32, ease: [.22, .61, .36, 1] }}
                className={s.details} data-open={open === i} id={`university-details-${i}`} inert={open !== i} aria-hidden={open !== i}>
                <div className={s.detailInner}>
                  <span className={s.outlineName} lang="ko"><SplitFlap text={university.korean} active={open === i} /></span>
                  <dl className={s.facts}>
                    <div><dt>{t.city}</dt><dd>{university.city[lang]}</dd></div>
                    <div><dt>{t.areas}</dt><dd>{university.areas[lang]}</dd></div>
                    <div><dt>{t.instruction}</dt><dd>{university.language?.[lang] ?? t.language}</dd></div>
                  </dl>
                  <div className={s.links}>
                    <a className={s.official} href={university.admissions}>{t.official} <LineArrow /></a>
                    {id && <Link className={s.official} href={`/universities/${id}`} prefetch={false}>{t.article} <LineArrow /></Link>}
                  </div>
                </div>
              </m.div>
            </li>
          ))}
        </ul>
      </div>
      <aside className={`${e.paper} ${s.path}`}>
        <h3>{t.path}</h3>
        <ol role="list">
          <li className={s.pathRule} role="presentation" aria-hidden="true"><span /></li>
          {admissionSteps[lang].map(([title, detail], i) => <li key={title} data-enter="rise" style={{ "--i": i } as CSSProperties}>
            <span className={s.step} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><strong>{title}</strong><p>{detail}</p>
          </li>)}
        </ol>
      </aside>
    </div>
  </section>;
}
