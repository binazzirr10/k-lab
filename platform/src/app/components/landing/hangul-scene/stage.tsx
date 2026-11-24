"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { scenes, type Scene, type SceneConfig, type StageInput } from "./composition";
import { HangulIllustration } from "./poster";

const CanvasScene = dynamic(() => import("./canvas-scene"), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type PreviewDevice = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

function canAnimate() {
  const device = navigator as PreviewDevice;
  if (device.connection?.saveData || (device.deviceMemory ?? 8) <= 4 || (device.hardwareConcurrency || 8) <= 4) return false;
  try {
    const probe = document.createElement("canvas").getContext("webgl2");
    if (!probe) return false;
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}

export type HangulPosters = { desktop?: string; mobile?: string };

export function HangulStage({ posters }: { posters: HangulPosters }) {
  const marker = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const input = useRef<StageInput>({ scene: "hero", pointer: [0, 0], impulse: [0, 0], leave: 0, inside: false, taps: 0 });
  const [enabled, setEnabled] = useState(false);
  const [running, setRunning] = useState(false);
  const [capture, setCapture] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    const mode = matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    const snapshot = (process.env.NODE_ENV === "development" || local) &&
      new URLSearchParams(location.search).get("capture") === "1";
    let idle: number | undefined;
    let timer: number | undefined;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const load = () => {
          let capable: boolean | undefined;
          const update = () => {
            const animate = snapshot || (mode.matches && (capable ??= canAnimate()));
            setEnabled(animate);
            if (!animate) setReady(false);
          };
          setCapture(snapshot);
          update();
          mode.addEventListener("change", update);
          clearMedia = () => mode.removeEventListener("change", update);
        };
        if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(load, { timeout: 1200 });
        else timer = window.setTimeout(load, 40);
      });
    });
    let clearMedia: (() => void) | undefined;
    return () => {
      cancelAnimationFrame(frame);
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      clearMedia?.();
    };
  }, []);

  useEffect(() => {
    const target = marker.current;
    const visual = layer.current;
    if (!target || !visual || !enabled || failed) return;
    const sections = [...document.querySelectorAll<HTMLElement>("[data-scene]")];
    const siteHeader = document.querySelector(".landing-header");
    let frame = 0;
    let hasBounds = false;
    let drag: { id: number; x: number; y: number } | undefined;
    let origin: typeof drag;
    const update = () => {
      frame = 0;
      const bounds = target.getBoundingClientRect();
      const line = innerHeight * .46;
      const current = sections.findLast((section) => section.getBoundingClientRect().top <= line);
      const key = current?.dataset.scene;
      const section = key && Object.hasOwn(scenes, key) ? key as Scene : "hero";
      const name = capture ? "hero" : section;
      const hero = name === "hero";
      const header = siteHeader?.getBoundingClientRect().bottom ?? 0;
      input.current.scene = name;
      input.current.leave = hero ? Math.max(0, Math.min(1, (header - bounds.top) / Math.max(1, bounds.height * .8))) : 0;
      // After the hero the letters travel: each section keeps one empty spot for them.
      const config: SceneConfig = scenes[name];
      const host = hero ? undefined : current?.getBoundingClientRect();
      const columns = Math.min(1480, document.documentElement.clientWidth * .918);
      const box = host && config.place ? {
        left: (document.documentElement.clientWidth - columns) / 2 + columns * config.place.x,
        top: host.top + config.place.top, width: columns * config.place.width, height: config.place.height,
      } : bounds;
      if (visual.dataset.scene !== name) {
        visual.dataset.scene = name;
        visual.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 650, easing: "ease-out" });
      }
      visual.style.setProperty("--scene-left", `${box.left}px`);
      visual.style.setProperty("--scene-top", `${box.top}px`);
      visual.style.setProperty("--scene-width", `${box.width}px`);
      visual.style.setProperty("--scene-height", `${box.height}px`);
      const roomy = hero || innerWidth >= 1200;
      const visible = roomy && box.top + box.height > header && box.top < innerHeight;
      visual.style.opacity = visible ? "1" : "0";
      visual.dataset.hero = String(hero);
      hasBounds = visible;
      setRunning((visible || capture) && !document.hidden);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const point = (event: PointerEvent) => {
      if (!hasBounds) { input.current.inside = false; return; }
      const box = visual.getBoundingClientRect();
      input.current.inside = within(event);
      const clamp = (value: number) => Math.max(-1, Math.min(1, value));
      input.current.pointer = [clamp((event.clientX - box.left) / box.width * 2 - 1), clamp(1 - (event.clientY - box.top) / box.height * 2)];
      if (drag?.id === event.pointerId) {
        const dx = event.clientX - drag.x;
        const dy = event.clientY - drag.y;
        input.current.impulse = [input.current.impulse[0] + dx * .014, input.current.impulse[1] - dy * .014];
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      }
    };
    // The canvas lies behind the page, so the stage listens to the document instead.
    const within = (event: PointerEvent) => {
      const box = visual.getBoundingClientRect();
      const header = siteHeader?.getBoundingClientRect().bottom ?? 0;
      return event.clientX > box.left && event.clientX < box.right && event.clientY > Math.max(box.top, header) && event.clientY < box.bottom
        && !(event.target instanceof Element && event.target.closest("a, button, input, h1, h2, p, [role=group]"));
    };
    const start = (event: PointerEvent) => {
      if (event.button !== 0 || event.pointerType !== "mouse" || !hasBounds || !within(event)) return;
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      origin = drag;
    };
    const release = (event: PointerEvent) => {
      if (origin && within(event) && Math.hypot(event.clientX - origin.x, event.clientY - origin.y) < 7) input.current.taps += 1;
      origin = undefined;
      endDrag();
    };
    const endDrag = () => { drag = undefined; };
    const reset = () => { input.current.pointer = [0, 0]; input.current.inside = false; };
    const observer = new ResizeObserver(schedule);
    observer.observe(target);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", point, { passive: true });
    document.addEventListener("visibilitychange", update);
    document.documentElement.addEventListener("pointerleave", reset);
    document.addEventListener("pointerdown", start);
    document.addEventListener("pointerup", release);
    document.addEventListener("pointercancel", endDrag);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", point);
      document.removeEventListener("visibilitychange", update);
      document.documentElement.removeEventListener("pointerleave", reset);
      document.removeEventListener("pointerdown", start);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", endDrag);
    };
  }, [enabled, failed, capture]);

  const live = enabled && !failed;
  return <div ref={marker} className="hangul-stage" aria-hidden="true" data-live={live && ready} data-capture={capture}>
    <div className="hangul-static">
      <HangulIllustration />
      {!posterFailed && (posters.desktop || posters.mobile) && <picture>
        {posters.mobile && <source media="(max-width: 899px)" srcSet={posters.mobile} />}
        <img src={posters.desktop ?? posters.mobile} alt="" onError={() => setPosterFailed(true)} />
      </picture>}
    </div>
    <div ref={layer} className="hangul-live">
      {live && <SceneBoundary onFailure={() => setFailed(true)}>
        <CanvasScene capture={capture} running={running} input={input}
          onReady={() => setReady(true)} onFailure={() => setFailed(true)} />
      </SceneBoundary>}
    </div>
  </div>;
}
