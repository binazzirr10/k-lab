"use client";

import { useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { MotionScope } from "@/app/components/motion-kit/motion";
import styles from "./stroke-order.module.css";

export function StrokeOrder({ letter, paths }: { letter: string; paths: readonly string[] }) {
  const [trace, setTrace] = useState(0);
  const reduced = useReducedMotion();
  return <button className={styles.guide} type="button" aria-label={`Показать порядок штрихов: ${letter}`}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setTrace((value) => value + 1); }}
    onFocus={() => setTrace((value) => value + 1)} onClick={() => setTrace((value) => value + 1)}>
    <MotionScope>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        {paths.map((path, index) => <path className={styles.underlay} d={path} key={index} />)}
        {paths.map((path, index) => <m.path d={path} key={`${trace}-${index}`} initial={trace && !reduced ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : .23, delay: trace && !reduced ? index * .22 : 0, ease: "linear" }} />)}
      </svg>
    </MotionScope>
    <span>Порядок штрихов</span>
  </button>;
}
