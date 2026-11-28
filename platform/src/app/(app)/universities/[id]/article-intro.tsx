"use client";

import { useEffect, useLayoutEffect, useRef, useState, ViewTransition, type CSSProperties, type ReactNode } from "react";
import { arrivedByMorph, departureThumbnail } from "../university-navigation";
import s from "./university-article.module.css";

export function ArticleIntro({ id, title, korean, lead, photo, credit }: {
  id: string; title: string; korean: string; lead: string; photo?: ReactNode; credit?: ReactNode;
}) {
  const intro = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const [lines, setLines] = useState(0);

  useLayoutEffect(() => {
    const root = intro.current;
    if (root && arrivedByMorph(id)) {
      root.dataset.shared = "";
      root.dataset.photoState = "open";
      const thumbnail = departureThumbnail(id);
      const frame = root.querySelector<HTMLElement>("[data-campus]");
      if (thumbnail && frame) frame.style.backgroundImage = `url("${thumbnail.replace(/["\\\n]/g, encodeURIComponent)}")`;
    }
  }, [id]);

  useEffect(() => {
    const root = intro.current;
    const h1 = heading.current;
    if (!root || !h1 || root.hasAttribute("data-shared")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.photoState = "open";
      return;
    }
    let active = true;
    const img = root.querySelector("img");
    void img?.decode().then(() => {
      if (active && !root.hasAttribute("data-shared")) root.dataset.photoState = "opening";
    }, () => {
      if (active) root.dataset.photoState = "open";
    });
    const { fontFamily, fontSize, fontWeight } = getComputedStyle(h1);
    void document.fonts.load(`${fontWeight} ${fontSize} ${fontFamily}`, title).then(() => {
      if (!active || root.hasAttribute("data-shared")) return;
      const lineHeight = Number.parseFloat(getComputedStyle(h1).lineHeight);
      if (lineHeight > 0) setLines(Math.round(h1.clientHeight / lineHeight));
    }, () => {});
    return () => { active = false; };
  }, [title]);

  return <div className={s.intro} ref={intro} data-university-intro={id} data-photo-state={photo ? "loading" : undefined} data-title-ready={lines > 0 ? "" : undefined}
    style={lines > 0 ? { "--title-last": lines - 1 } as CSSProperties : undefined}>
    <header className={s.header}>
      <h1 ref={heading}>
        <span className={s.titleText}>{title}</span>
        {lines > 0 && <span className={s.titleLayers} aria-hidden="true">
          {Array.from({ length: lines }, (_, index) => <span key={index} className={s.titleLine}
            style={{ "--title-line": index } as CSSProperties}><span>{title}</span></span>)}
        </span>}
      </h1>
      <p lang="ko" className={s.korean} onAnimationEnd={() => setLines(0)}>{korean}</p>
      <p className={s.lead}>{lead}</p>
    </header>
    {photo && <figure className={s.figure}>
      <ViewTransition name={`university-${id}`} share="klab-morph" default="none">
        <div className={s.photo} data-campus={id} onAnimationEnd={(event) => {
          if (event.animationName.includes("photo-settle") && intro.current) {
            intro.current.dataset.photoState = "open";
          }
        }}>{photo}</div>
      </ViewTransition>
      <figcaption className={s.credit}>{credit}</figcaption>
    </figure>}
  </div>;
}
