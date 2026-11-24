"use client";

import { useEffect, useRef } from "react";
import styles from "./motion.module.css";

/** Strokes thicken under the pointer like a pressed brush, and a slow swell runs through on arrival. */
export function WeightRipple({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = [...node.querySelectorAll<HTMLElement>("[data-letter]")];
    const weight = letters.map(() => 400);
    let pointer: { x: number; y: number } | null = null;
    let swell = -1;
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = Math.min(.05, (now - (last || now)) / 1000);
      last = now;
      if (swell >= 0) swell += dt * 7.5;
      let moving = false;
      letters.forEach((letter, i) => {
        const box = letter.getBoundingClientRect();
        let goal = 400;
        if (pointer) {
          const distance = Math.hypot(pointer.x - box.x - box.width / 2, pointer.y - box.y - box.height / 2);
          goal += 510 * Math.exp(-((distance / 105) ** 2)) - 180 * Math.exp(-(((distance - 210) / 90) ** 2));
        }
        if (swell >= 0) goal += 470 * Math.exp(-(((swell - 2 - i) / 1.5) ** 2));
        weight[i] += (goal - weight[i]) * (1 - Math.exp(-dt * 9));
        if (Math.abs(goal - weight[i]) > .6) moving = true;
        letter.style.fontVariationSettings = `"wght" ${weight[i].toFixed(0)}`;
        letter.style.transform = `translateY(${((weight[i] - 400) * -.018).toFixed(2)}px)`;
      });
      if (swell > letters.length + 6) swell = -1;
      frame = moving || pointer || swell >= 0 ? requestAnimationFrame(tick) : 0;
      if (!frame) last = 0;
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };
    const move = (event: PointerEvent) => { pointer = { x: event.clientX, y: event.clientY }; wake(); };
    const leave = () => { pointer = null; wake(); };
    const area = node.closest("section") ?? node;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { swell = 0; wake(); }
    }, { threshold: .6 });
    observer.observe(node);
    area.addEventListener("pointermove", move as EventListener);
    area.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      area.removeEventListener("pointermove", move as EventListener);
      area.removeEventListener("pointerleave", leave);
    };
  }, []);
  return <span ref={ref}><span className={styles.srOnly}>{text}</span><span aria-hidden="true">{text.split(" ").map((word, w) =>
    <span key={w}>{w > 0 && " "}<span className={styles.word}>{[...word].map((letter, i) => <span className={styles.letter} data-letter="" key={i}>{letter}</span>)}</span></span>)}</span></span>;
}
