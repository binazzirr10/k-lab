"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { animate, useMotionValue, useTransform, type MotionValue } from "motion/react";
import * as m from "motion/react-m";
import styles from "./motion.module.css";

const count = 8;

function Panel({ index, progress, width, children }: { index: number; progress: MotionValue<number>; width: number; children: ReactNode }) {
  const lean = index % 2 ? -1 : 1;
  const angle = useTransform(progress, (p) => Math.min(1, Math.max(0, p * 1.28 - index * .035)) * Math.PI / 2);
  // Neighbouring hinges stay joined: every panel starts where the narrowed ones before it end.
  const x = useTransform(progress, (p) => {
    let offset = 0;
    for (let k = 0; k < index; k++) offset += width * Math.cos(Math.min(1, Math.max(0, p * 1.28 - k * .035)) * Math.PI / 2);
    return offset - index * width;
  });
  const scaleX = useTransform(angle, (a) => Math.max(.001, Math.cos(a)));
  const skewY = useTransform(angle, (a) => lean * Math.sin(a) * 17);
  const y = useTransform(angle, (a) => lean < 0 ? Math.tan(17 * Math.sin(a) * Math.PI / 180) * width * Math.cos(a) : 0);
  const shade = useTransform(angle, (a) => Math.sin(a) * (lean > 0 ? .28 : .62));
  return <m.div className={styles.panel} style={{ left: `${index * 100 / count}%`, x, y, scaleX, skewY }}>
    <div className={styles.panelView} style={{ left: `${-index * 100}%` }}>{children}</div>
    <m.div className={styles.panelShade} style={{ opacity: shade }} />
  </m.div>;
}

/** The old scene closes like a byeongpung, the Korean folding screen, and uncovers the new one. */
export function FoldingScreen({ children, onFolded }: { children: ReactNode; onFolded: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useMotionValue(0);
  const [width, setWidth] = useState(0);
  const done = useRef(onFolded);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width / count));
    measure.observe(node);
    const controls = animate(progress, 1, { duration: 2.3, ease: [.42, 0, .42, 1], onComplete: () => done.current() });
    return () => { measure.disconnect(); controls.stop(); };
  }, [progress]);
  return <div ref={ref} className={styles.screen} aria-hidden="true">{Array.from({ length: count }, (_, index) =>
    <Panel key={index} index={index} progress={progress} width={width}>{children}</Panel>)}</div>;
}
