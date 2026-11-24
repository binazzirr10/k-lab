"use client";

import { useEffect, useRef } from "react";
import styles from "./motion.module.css";

const drum = [..."가나다라마바사아자차카타파하고노도로모보소오조코토포호"];

/** A departure board: each cell flaps through syllables until the right one stops. */
export function SplitFlap({ text, active }: { text: string; active: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cells = [...node.querySelectorAll<HTMLElement>("[data-cell]")];
    const target = [...text];
    const timers: number[] = [];
    cells.forEach((cell, index) => {
      const flips = 6 + index * 3;
      for (let flip = 0; flip <= flips; flip++) {
        const when = flip * (58 + flip * 3.2);
        timers.push(window.setTimeout(() => {
          const next = flip === flips ? target[index] : drum[(index * 7 + flip * 5) % drum.length];
          const [top, bottom, leaf, rise] = cell.children as unknown as HTMLElement[];
          leaf.firstElementChild!.textContent = bottom.firstElementChild!.textContent;
          rise.firstElementChild!.textContent = next;
          top.firstElementChild!.textContent = next;
          leaf.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], { duration: 46, easing: "ease-in", fill: "both" });
          const settle = rise.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], { duration: 52, delay: 46, easing: "ease-out", fill: "both" });
          settle.onfinish = () => { bottom.firstElementChild!.textContent = next; };
        }, when));
      }
    });
    return () => {
      timers.forEach(window.clearTimeout);
      cells.forEach((cell, index) => {
        [...cell.children].forEach((half) => {
          half.getAnimations().forEach((animation) => animation.cancel());
          if (half.firstElementChild) half.firstElementChild.textContent = target[index];
        });
      });
    };
  }, [active, text]);

  return <span ref={ref} className={styles.board} aria-hidden="true">{[...text].map((syllable, i) =>
    <span className={styles.cell} data-cell="" key={i}>
      <span className={styles.top}><b>{syllable}</b></span><span className={styles.bottom}><b>{syllable}</b></span>
      <span className={`${styles.top} ${styles.leaf}`}><b>{syllable}</b></span><span className={`${styles.bottom} ${styles.rise}`}><b>{syllable}</b></span>
    </span>)}</span>;
}
