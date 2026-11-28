"use client";

import { useRef, type ReactNode } from "react";
import { UniversityMotionScope, useMotionRuntime, useUniversityMotion } from "../university-motion";
import s from "./university-article.module.css";

const viewport = { once: true, amount: .18 } as const;
const ease = [.16, .8, .24, 1] as const;

export function ArticleMotion({ intro, facts, sections, actions, sources, pagination }: {
  intro: ReactNode; facts: ReactNode; sections: ReactNode; actions: ReactNode; sources: ReactNode; pagination: ReactNode;
}) {
  const article = useRef<HTMLElement>(null);
  const runtime = useUniversityMotion(article);
  return <>
    <article ref={article}>
      {intro}
      <UniversityMotionScope runtime={runtime}>{facts}</UniversityMotionScope>
      <div className={s.body}>
        <UniversityMotionScope runtime={runtime}>{sections}</UniversityMotionScope>
        {actions}
        <UniversityMotionScope runtime={runtime}>{sources}</UniversityMotionScope>
      </div>
    </article>
    <UniversityMotionScope runtime={runtime}>{pagination}</UniversityMotionScope>
  </>;
}

export function ArticleReveal({ as, className, delay = 0, children, label }: {
  as: "div" | "p" | "ul" | "nav"; className?: string; delay?: number; children: ReactNode; label?: string;
}) {
  const runtime = useMotionRuntime();
  const Element = runtime?.m[as] ?? as;
  return <Element className={className} aria-label={label} {...(runtime ? {
    initial: false, whileInView: "visible", viewport,
    variants: { visible: { opacity: [.28, 1], y: [20, 0], transition: { duration: .58, delay, ease } } },
  } : {})}>{children}</Element>;
}

export function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  const runtime = useMotionRuntime();
  if (!runtime) return <h2 id={id} className={s.sectionHeading}>{children}<span aria-hidden="true" /></h2>;

  return <runtime.m.h2 id={id} className={s.sectionHeading} initial={false} whileInView="visible" viewport={viewport}
    variants={{ visible: { y: [8, 0], opacity: [.5, 1], transition: { duration: .45, ease } } }}>
    {children}
    <runtime.m.span aria-hidden="true" variants={{ visible: { scaleX: [0, 1], transition: { duration: .65, ease } } }} />
  </runtime.m.h2>;
}
