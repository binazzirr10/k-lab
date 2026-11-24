"use client";

import { useEffect, useRef } from "react";
import { soundOf } from "./jamo";
import styles from "./motion.module.css";

const turn = "cubic-bezier(.45, 0, .15, 1)";
const rolls = (hold: number): Keyframe[] => [
  { transform: "rotateX(0deg)", offset: 0, easing: turn }, { transform: "rotateX(90deg)", offset: .34 },
  { transform: "rotateX(90deg)", offset: .34 + hold, easing: turn }, { transform: "rotateX(180deg)", offset: 1 },
];

/**
 * Letters on little rollers: each one turns to the Korean letter of the same sound and back.
 * `sweep` plays the wave once on arrival; otherwise letters answer the pointer (or `active`).
 */
export function JamoText({ text, sweep = false, active = false }: { text: string; sweep?: boolean; active?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const swept = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rollers = [...node.querySelectorAll<HTMLElement>("[data-roller]")];
    const running = new Map<HTMLElement, Animation>();
    const timers: number[] = [];
    const roll = (roller: HTMLElement, hold: number) => {
      if (running.has(roller)) return;
      const animation = roller.animate(rolls(hold / (.9 + hold)), { duration: (.9 + hold) * 1000 });
      running.set(roller, animation);
      animation.onfinish = () => running.delete(roller);
    };
    const over = (event: PointerEvent) => {
      const roller = (event.target as Element).closest<HTMLElement>("[data-roller]");
      if (roller && event.pointerType === "mouse") roll(roller, .45);
    };
    node.addEventListener("pointerover", over);
    let cancelled = false;
    if (sweep && !swept.current) {
      void (document.fonts?.ready ?? Promise.resolve()).then(() => {
        if (cancelled) return;
        swept.current = true;
        rollers.forEach((roller, index) => {
          timers.push(window.setTimeout(() => roll(roller, .3), 350 + index * 62));
        });
      });
    }
    return () => {
      cancelled = true;
      node.removeEventListener("pointerover", over);
      timers.forEach(window.clearTimeout);
      running.forEach((animation) => animation.cancel());
    };
  }, [sweep, text]);

  useEffect(() => {
    const node = ref.current;
    if (!node || !active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rollers = node.querySelectorAll<HTMLElement>("[data-roller]");
    const animations = [...rollers].map((roller, index) => roller.animate(rolls(.22), { duration: 1100, delay: index * 26 }));
    return () => animations.forEach((animation) => animation.cancel());
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
