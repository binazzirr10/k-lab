"use client";

import { createContext, useContext, useEffect, useState, type ReactNode, type RefObject } from "react";
import s from "./university-motion.module.css";

type Runtime = typeof import("./motion-runtime");
let loading: Promise<Runtime> | undefined;
const RuntimeContext = createContext<Runtime | null>(null);

export function useUniversityMotion(root?: RefObject<HTMLElement | null>) {
  const [runtime, setRuntime] = useState<Runtime | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true;
    let focusFrame = 0;
    function update() {
      if (preference.matches) {
        setRuntime(null);
        return;
      }
      loading ??= import("./motion-runtime");
      void loading.then((module) => {
        if (!active || preference.matches || root?.current?.contains(document.activeElement)) return;
        setRuntime(module);
      }, () => { loading = undefined; });
    }
    function afterBlur() {
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(update);
    }
    update();
    preference.addEventListener("change", update);
    if (root) document.addEventListener("focusout", afterBlur);
    return () => {
      active = false;
      cancelAnimationFrame(focusFrame);
      preference.removeEventListener("change", update);
      if (root) document.removeEventListener("focusout", afterBlur);
    };
  }, [root]);

  return runtime;
}

export function UniversityMotionScope({ runtime, layout, children }: {
  runtime: Runtime | null; layout?: boolean; children: ReactNode;
}) {
  return <RuntimeContext value={runtime}>
    {runtime ? <runtime.MotionScope layout={layout}>{children}</runtime.MotionScope> : children}
  </RuntimeContext>;
}

export function useMotionRuntime() {
  return useContext(RuntimeContext);
}

const digits = Array.from({ length: 10 }, (_, digit) => <span key={digit} data-digit={digit} />);

export function RollNumber({ value, onReveal = false }: { value: string | number; onReveal?: boolean }) {
  const runtime = useMotionRuntime();
  const number = String(value);
  if (!runtime) return <span className={s.number}>{number}</span>;
  const { m } = runtime;

  return <span className={s.number}>
    <span className={s.srOnly}>{number}</span>
    <span aria-hidden="true">{Array.from(number, (digit, index) => {
      const y = `${-Number(digit) * 10}%`;
      const transition = { duration: .46, delay: index * .045, ease: [.16, .8, .24, 1] as const };
      return <span className={s.reel} key={number.length - index}>
        <m.span className={s.strip} initial={false} style={onReveal ? { y } : undefined}
          animate={onReveal ? undefined : { y }}
          variants={onReveal ? { visible: { y: ["0%", y], transition } } : undefined}
          transition={transition}>{digits}</m.span>
      </span>;
    })}</span>
  </span>;
}

export function SaveSeal({ on, className }: { on: boolean; className?: string }) {
  const runtime = useMotionRuntime();
  return <span className={[s.seal, className].filter(Boolean).join(" ")} aria-hidden="true" lang="ko" data-stamped={on}>
    <span>찜</span>
    {runtime ? <runtime.m.span className={s.stamp} initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : -12, rotate: on ? 0 : -20, scale: on ? 1 : 1.4 }}
      transition={{ ...runtime.spring, damping: 16, opacity: { duration: .12 } }}>
      찜
      <runtime.m.span className={s.ink} initial={false}
        animate={on ? { scale: [.9, 1.34], opacity: [.48, 0] } : { scale: .9, opacity: 0 }}
        transition={{ duration: on ? .42 : 0, delay: on ? .09 : 0 }} />
    </runtime.m.span> : on && <span className={s.stamp}>찜</span>}
  </span>;
}

export function SaveToast({ state, className, error, savedDescription, generation = 0 }: {
  state: "idle" | "saving" | "saved" | "error";
  className: string;
  error?: ReactNode;
  savedDescription?: string;
  generation?: number;
}) {
  const runtime = useMotionRuntime();
  const [dismissed, setDismissed] = useState<number | null>(null);

  useEffect(() => {
    if (state !== "saved") return;
    const timer = window.setTimeout(() => setDismissed(generation), 1800);
    return () => window.clearTimeout(timer);
  }, [state, generation]);

  const success = state === "saved" && dismissed !== generation;
  const content = state === "saving" ? "Сохраняем…" : success ? "Сохранено" : state === "error" ? error : null;
  const hasDescription = state === "saved" && !!savedDescription;
  return <p className={className} role="status" data-state={state}>
    {hasDescription && <span className={s.srOnly}>{savedDescription}</span>}
    {runtime ? <runtime.AnimatePresence initial={false}>
      {content && <runtime.m.span className={s.toast} key={success ? `saved-${generation}` : state} aria-hidden={hasDescription || undefined} initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        transition={{ duration: .22, ease: "easeOut" }}>{content}</runtime.m.span>}
    </runtime.AnimatePresence> : content && <span className={s.toast} aria-hidden={hasDescription || undefined}>{content}</span>}
  </p>;
}
