"use client";

import { useLayoutEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

export function useMaskedLines() {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const media = window.matchMedia(query);
    let disposed = false;
    let played = false;
    let trigger: ScrollTrigger | undefined;
    let split: SplitText | undefined;
    let tween: gsap.core.Tween | undefined;
    let safety = 0;
    let resize = 0;

    function finish() {
      played = true;
      window.clearTimeout(safety);
      try { tween?.progress(1).kill(); }
      finally { split?.lines.forEach((line) => { if (line instanceof HTMLElement) line.style.removeProperty("transform"); }); }
    }

    function rebuild() {
      trigger?.kill();
      if (tween) finish();
      split?.revert();
      if (disposed || !node?.isConnected || media.matches) return;
      try {
        split = SplitText.create(node.querySelectorAll("[data-reveal-source]"), {
          type: "lines", mask: "lines", tag: "span", aria: "none", linesClass: "klab-reveal-line",
        });
        if (!split.lines.length || played || node.getBoundingClientRect().top < window.innerHeight) {
          played = true;
          return;
        }
        trigger = ScrollTrigger.create({
          trigger: node, start: "top 92%", once: true,
          onEnter: () => {
            if (played || !split || node.getBoundingClientRect().bottom <= 0) { finish(); return; }
            played = true;
            safety = window.setTimeout(finish, 1100);
            try {
              tween = gsap.fromTo(split.lines, { yPercent: 112 }, {
                yPercent: 0, duration: .64, stagger: .07, ease: "power3.out", clearProps: "transform",
              });
            } catch { finish(); }
          },
          onEnterBack: finish,
          onLeave: finish,
        });
      } catch {
        finish();
        split?.revert();
      }
    }

    const context = gsap.context(() => {}, node);
    function schedule() {
      cancelAnimationFrame(resize);
      resize = requestAnimationFrame(() => context.add(rebuild));
    }
    (document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (disposed) return;
      gsap.registerPlugin(ScrollTrigger, SplitText);
      schedule();
      window.addEventListener("resize", schedule);
      media.addEventListener("change", schedule);
    }).catch(() => { /* The original text is visible. */ });

    return () => {
      disposed = true;
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      cancelAnimationFrame(resize);
      window.clearTimeout(safety);
      trigger?.kill();
      tween?.kill();
      context.revert();
      split?.revert();
    };
  }, []);
  return ref;
}

function RevealContent({ lines }: { lines: readonly ReactNode[] }) {
  const ref = useMaskedLines();
  return <span className={styles.lines} ref={ref}>{lines.map((line, index) =>
    <span className={styles.source} key={index} data-reveal-source>{line}</span>
  )}</span>;
}

export function Reveal({ children, lines }: { children?: ReactNode; lines?: readonly string[] }) {
  return <RevealContent key={lines?.join("|") ?? (typeof children === "string" ? children : undefined)} lines={lines ?? [children]} />;
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
