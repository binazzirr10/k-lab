"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "motion/react";
import { soundOf } from "./jamo";
import styles from "./motion.module.css";

const turn = [.45, 0, .15, 1] as const;

/**
 * Letters on little rollers: each one turns to the Korean letter of the same sound and back.
 * `sweep` plays the wave once on arrival; otherwise letters answer the pointer (or `active`).
 */
export function JamoText({ text, sweep = false, active = false }: { text: string; sweep?: boolean; active?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rollers = [...node.querySelectorAll<HTMLElement>("[data-roller]")];
    const running = new Map<HTMLElement, { stop: () => void }>();
    const roll = (roller: HTMLElement, hold: number) => {
      if (running.has(roller)) return;
      const controls = animate(roller, { rotateX: [0, 90, 90, 180] }, { duration: .9 + hold, times: [0, .34, .34 + hold / (.9 + hold), 1], ease: [.45, 0, .15, 1] });
      running.set(roller, controls);
      void controls.then(() => { running.delete(roller); roller.style.transform = ""; });
    };
    const over = (event: PointerEvent) => {
      const roller = (event.target as Element).closest<HTMLElement>("[data-roller]");
      if (roller && event.pointerType === "mouse") roll(roller, .45);
    };
    node.addEventListener("pointerover", over);
    let cancelled = false;
    if (sweep) {
      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (cancelled) return;
        rollers.forEach((roller, index) => {
          const timer = window.setTimeout(() => roll(roller, .3), 350 + index * 62);
          running.set(document.createElement("i"), { stop: () => window.clearTimeout(timer) });
        });
      });
    }
    return () => {
      cancelled = true;
      node.removeEventListener("pointerover", over);
      running.forEach((controls) => controls.stop());
    };
  }, [sweep, text]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rollers = node.querySelectorAll<HTMLElement>("[data-roller]");
    if (!rollers.length) return;
    const controls = animate(rollers, { rotateX: [0, 90, 90, 180] }, { duration: 1.1, ease: turn, times: [0, .34, .56, 1], delay: stagger(.026) });
    return () => { controls.stop(); rollers.forEach((roller) => { roller.style.transform = ""; }); };
  }, [active]);

  return <span ref={ref} className={styles.jamoText}>
    <span className={styles.srOnly}>{text}</span>
    <span aria-hidden="true">{text.split(" ").map((word, w) => <span key={w}>{w > 0 && " "}<span className={styles.word}>
      {[...word].map((letter, i) => {
        const sound = soundOf(letter);
        return sound ? <span className={styles.roller} data-roller key={i}>
          <span className={styles.front}>{letter}</span><span className={styles.back} lang="ko">{sound}</span><span className={styles.again}>{letter}</span>
        </span> : <span key={i}>{letter}</span>;
      })}
    </span></span>)}</span>
  </span>;
}
