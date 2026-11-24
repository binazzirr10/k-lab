"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import styles from "./motion.module.css";

// The four corners of the cloth: where each flap is cut and which edge it hangs on.
const flaps = [
  { clip: "polygon(0 0, 100% 0, 50% 50%)", origin: "50% 0%", axis: "rotateX", open: 116 },
  { clip: "polygon(100% 0, 100% 100%, 50% 50%)", origin: "100% 50%", axis: "rotateY", open: 116 },
  { clip: "polygon(100% 100%, 0 100%, 50% 50%)", origin: "50% 100%", axis: "rotateX", open: -116 },
  { clip: "polygon(0 100%, 0 0, 50% 50%)", origin: "0% 50%", axis: "rotateY", open: -116 },
] as const;

/** A meaning wrapped in a bojagi: the word is printed on the cloth, and the four corners unfold. */
export function Bojagi({ open, reduced, children }: { open: boolean; reduced: boolean; children: ReactNode }) {
  return <div className={styles.cloth} aria-hidden={open} inert={open}>{flaps.map((flap, i) =>
    <motion.div key={i} className={styles.flap} style={{ clipPath: flap.clip, transformOrigin: flap.origin, transformPerspective: 2400 }} initial={false}
      animate={{ [flap.axis]: open ? flap.open : 0, opacity: open ? 0 : 1 }}
      transition={reduced ? { duration: 0 } : open
        ? { type: "spring", stiffness: 52, damping: 13, delay: i * .13, opacity: { duration: .2, delay: .3 + i * .13 } }
        : { type: "spring", stiffness: 95, damping: 15, delay: (3 - i) * .08, opacity: { duration: .12, delay: (3 - i) * .08 } }}>
      <div className={styles.print}>{children}</div>
    </motion.div>)}
  </div>;
}
