"use client";

import { AnimatePresence, motion } from "motion/react";
import { decompose, scatter } from "./jamo";
import { useReducedMotion } from "./index";
import styles from "./motion.module.css";

/** A phrase whose syllables are built from their letters; the old phrase drops into the strings below. */
export function AssembledPhrase({ text }: { text: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{text}</>;
  return <span className={styles.phrase}>
    <span className={styles.srOnly}>{text}</span>
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span key={text} className={styles.phraseLine} aria-hidden="true" exit="drop" initial="apart" animate="built">
        {text.split(" ").map((word, w, words) => {
          const start = words.slice(0, w).join("").length;
          return <span key={w} className={styles.word}>{[...word].map((syllable, i) => {
            const order = start + i;
            const letters = decompose(syllable);
            return <motion.span key={i} className={styles.syllable} variants={{
              drop: { y: 190 + scatter(order) * 40, rotate: scatter(order + 9) * 70, scaleY: .3, opacity: 0, transition: { duration: .55, delay: order * .028, ease: [.55, 0, .9, .4] } },
            }}>
              <motion.span style={{ display: "inline-block" }} variants={{
                apart: { opacity: 0, scale: .82 },
                built: { opacity: 1, scale: 1, transition: { delay: .4 + order * .07, type: "spring", stiffness: 420, damping: 17 } },
              }}>{syllable}</motion.span>
              {letters.length > 1 && letters.map((letter, k) => <motion.span key={k} className={styles.flying} variants={{
                apart: { x: scatter(order * 5 + k) * 170, y: -70 + scatter(order * 7 + k * 3) * 120, rotate: scatter(order + k * 11) * 160, opacity: 0, scale: .55 },
                built: {
                  x: 0, y: 0, rotate: 0, scale: .5, opacity: [0, 1, 1, 0],
                  transition: { duration: .62, delay: order * .07 + k * .05, ease: [.2, .75, .2, 1], opacity: { times: [0, .25, .8, 1], duration: .62, delay: order * .07 + k * .05 } },
                },
              }}>{letter}</motion.span>)}
            </motion.span>;
          })}{w < words.length - 1 && " "}</span>;
        })}
      </motion.span>
    </AnimatePresence>
  </span>;
}
