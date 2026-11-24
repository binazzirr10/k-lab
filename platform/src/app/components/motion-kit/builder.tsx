"use client";

import { LayoutGroup, m } from "motion/react";
import type { ReactNode } from "react";
import { MotionScope, spring } from "./motion";
import styles from "./learning.module.css";

export function Builder({ parts, built, setBuilt, children }: {
  parts: readonly string[];
  built: number[];
  setBuilt: (selection: number[]) => void;
  children: ReactNode;
}) {
  return <MotionScope layout><LayoutGroup>
    <div className={`learn-builder ${styles.builder}`}>
      <div>{built.length ? built.map((index) => <m.span layoutId={`piece-${index}`} transition={spring} className={`learn-builder-piece ${styles.motionOwnsAnimation}`} key={index}>{parts[index]}</m.span>) : "Твоя фраза появится здесь"}</div>
      <section>{parts.map((part, index) => {
        const used = built.includes(index);
        return <button type="button" aria-disabled={used} aria-label={part} className={used ? "used" : ""} onClick={() => { if (!used) setBuilt([...built, index]); }} key={index}>
          {used ? <span aria-hidden="true">{part}</span> : <m.span className={styles.chip} layoutId={`piece-${index}`} transition={spring}>{part}</m.span>}
        </button>;
      })}<button className="reset" aria-label="Сбросить фразу" onClick={() => setBuilt([])}>↺</button></section>
      <p role="status">{children}</p>
    </div>
  </LayoutGroup></MotionScope>;
}
