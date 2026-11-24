"use client";

import { useEffect, useRef } from "react";
import styles from "./motion.module.css";

/** The hairline between sections is a string: it rings when you cross it by scrolling or with the pointer. */
export function Divider() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    const path = svg?.querySelector("path");
    if (!svg || !path || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let began = 0;
    let force = 0;
    let at = .5;
    let side = 0;
    const draw = (now: number) => {
      const t = (now - began) / 1000;
      const left = Math.exp(-t * 2.1) * force;
      let d = "";
      for (let step = 0; step <= 60; step++) {
        const u = step / 60;
        let y = 0;
        for (let n = 1; n <= 5; n++) y += Math.sin(n * Math.PI * u) * Math.sin(n * Math.PI * at) / n * Math.cos(t * n * 17) * Math.exp(-t * n * .5);
        d += `${step ? "L" : "M"}${(u * 1000).toFixed(1)} ${(40 + y * left).toFixed(2)}`;
      }
      path.setAttribute("d", d);
      frame = Math.abs(left) > .25 ? requestAnimationFrame(draw) : 0;
      if (!frame) path.setAttribute("d", "M0 40H1000");
    };
    const ring = (strength: number, where: number) => {
      force = strength;
      at = Math.min(.92, Math.max(.08, where));
      began = performance.now();
      if (!frame) frame = requestAnimationFrame(draw);
    };
    // Crossing the middle of the screen plucks it.
    const watch = new IntersectionObserver(([entry]) => {
      const now = entry.boundingClientRect.top < innerHeight * .6 ? -1 : 1;
      if (side && now !== side) ring(now < 0 ? -26 : 26, now < 0 ? .28 : .72);
      side = now;
    }, { rootMargin: "0px 0px -40% 0px" });
    watch.observe(svg);
    const enter = (event: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      if (event.pointerType === "mouse") ring((event.movementY || 8) > 0 ? 20 : -20, (event.clientX - box.left) / box.width);
    };
    const strip = svg.parentElement;
    strip?.addEventListener("pointerenter", enter);
    return () => { watch.disconnect(); cancelAnimationFrame(frame); strip?.removeEventListener("pointerenter", enter); };
  }, []);
  return <span className={styles.divider} aria-hidden="true">
    <svg ref={ref} viewBox="0 0 1000 80" preserveAspectRatio="none"><path d="M0 40H1000" vectorEffect="non-scaling-stroke" /></svg>
  </span>;
}
