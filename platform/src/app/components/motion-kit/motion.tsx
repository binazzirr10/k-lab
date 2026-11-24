"use client";

import { LazyMotion, MotionConfig, domAnimation, m, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import styles from "./learning.module.css";

export const spring = { type: "spring", stiffness: 360, damping: 34 } as const;
const loadLayout = () => import("./features").then((module) => module.default);

export function MotionScope({ children, layout = false }: { children: ReactNode; layout?: boolean }) {
  return <MotionConfig reducedMotion="user"><LazyMotion strict features={layout ? loadLayout : domAnimation}>{children}</LazyMotion></MotionConfig>;
}

export function Stamp({ children, className }: { children: ReactNode; className: string }) {
  const reduced = useReducedMotion();
  return <m.p className={`${className} ${styles.motionOwnsAnimation}`} initial={reduced ? false : { scale: 1.09, rotate: -3 }} animate={{ scale: 1, rotate: 0 }} transition={spring}>{children}</m.p>;
}
