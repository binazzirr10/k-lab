"use client";

import { useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ink } from "./ink";
import styles from "./motion.module.css";

const query = "(prefers-reduced-motion: reduce)";
const preference = () => window.matchMedia(query).matches;
function subscribe(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, preference, () => true);
}

export function Reveal({ children, lines }: { children?: ReactNode; lines?: readonly string[] }) {
  return <Ink key={lines?.join("|") ?? (typeof children === "string" ? children : undefined)}>
    {lines ? lines.map((line) => <span className={styles.source} key={line}>{line}</span>) : children}
  </Ink>;
}

export function useDrawOnEnter() {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        if (node.getBoundingClientRect().top < window.innerHeight) return;
        ScrollTrigger.create({
          trigger: node, start: "top 92%", once: true,
          onEnter: () => {
            if (node.getBoundingClientRect().bottom > 0) {
              context.add(() => gsap.fromTo(node, { scaleX: 0 }, { scaleX: 1, duration: .85, ease: "power2.out" }));
            }
          },
          onEnterBack: () => { gsap.set(node, { clearProps: "transform" }); },
        });
      }, node);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);
  return ref;
}

export function LineArrow() {
  return <span aria-hidden="true" className={styles.arrow}>↗</span>;
}

export function MagneticPill({ children, className, ...props }: Omit<HTMLMotionProps<"a">, "children"> & { children: ReactNode }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 310, damping: 25 });
  const springY = useSpring(y, { stiffness: 310, damping: 25 });
  function reset() { x.set(0); y.set(0); }
  return <motion.a {...props} className={[styles.pill, className].filter(Boolean).join(" ")}
    style={{ ...props.style, x: reduced ? 0 : springX, y: reduced ? 0 : springY }}
    onPointerMove={(event) => {
      props.onPointerMove?.(event);
      if (reduced || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      x.set((event.clientX - rect.left - rect.width / 2) * .10);
      y.set((event.clientY - rect.top - rect.height / 2) * .14);
    }} onPointerLeave={(event) => { reset(); props.onPointerLeave?.(event); }}
    onBlur={(event) => { reset(); props.onBlur?.(event); }}>
    {children} <LineArrow />
  </motion.a>;
}
