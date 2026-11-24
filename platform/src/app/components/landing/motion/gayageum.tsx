"use client";

import { useEffect, useRef } from "react";
import styles from "./motion.module.css";

// Twelve strings in a five-note Korean tuning, low to high.
const tuning = [98, 110, 130.8, 146.8, 164.8, 196, 220, 261.6, 293.7, 329.6, 392, 440];
type Pluck = { at: number; x: number; force: number };

function makeVoice() {
  let context: AudioContext | undefined;
  const notes = new Map<number, AudioBuffer>();
  return {
    play(index: number, force: number) {
      try {
        context ??= new AudioContext();
        void context.resume();
        let note = notes.get(index);
        if (!note) {
          // Karplus-Strong: a burst of noise circulating in a string-length delay.
          const rate = context.sampleRate;
          const period = Math.round(rate / tuning[index]);
          note = context.createBuffer(1, Math.round(rate * 1.9), rate);
          const data = note.getChannelData(0);
          let seed = 11 + index;
          for (let i = 0; i < period; i++) { seed = (seed * 16807) % 2147483647; data[i] = seed / 1073741823.5 - 1; }
          for (let i = period; i < data.length; i++) data[i] = .4975 * (data[i - period] + data[Math.max(0, i - period - 1)]);
          notes.set(index, note);
        }
        const source = context.createBufferSource();
        const gain = context.createGain();
        const soften = context.createBiquadFilter();
        soften.type = "lowpass";
        soften.frequency.value = 2300;
        source.buffer = note;
        gain.gain.setValueAtTime(.05 + force * .13, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(.0008, context.currentTime + 1.8);
        source.connect(soften).connect(gain).connect(context.destination);
        source.start();
      } catch { /* The strings still move without sound. */ }
    },
    close() { void context?.close().catch(() => {}); },
  };
}

/** Run the pointer across the strings and they ring; press while doing it and they sound. `pulse` strums them. */
export function Gayageum({ pulse, quiet }: { pulse: number; quiet: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const strum = useRef<((from: number) => void) | null>(null);
  const silent = useRef(quiet);
  useEffect(() => { silent.current = quiet; }, [quiet]);

  useEffect(() => {
    const canvas = ref.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plucks: Pluck[][] = tuning.map(() => []);
    const voice = makeVoice();
    let frame = 0;
    let width = 0;
    let height = 0;
    let previous: { x: number; y: number; at: number } | null = null;
    const line = (index: number) => height * (.21 + index * .71 / (tuning.length - 1));

    const draw = (now: number) => {
      frame = 0;
      const ratio = Math.min(2, devicePixelRatio || 1);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      let ringing = false;
      tuning.forEach((_, index) => {
        const list = plucks[index] = plucks[index].filter((pluck) => now - pluck.at < 2600);
        const y = line(index);
        let energy = 0;
        context.beginPath();
        for (let step = 0; step <= 96; step++) {
          const u = step / 96;
          let lift = 0;
          for (const pluck of list) {
            const t = (now - pluck.at) / 1000;
            for (let n = 1; n <= 6; n++) {
              lift += Math.sin(n * Math.PI * u) * Math.sin(n * Math.PI * pluck.x) / (n * n)
                * Math.cos(t * n * (21 + index * 1.9)) * Math.exp(-t * (1.5 + n * .55)) * pluck.force;
            }
          }
          energy = Math.max(energy, Math.abs(lift));
          context[step ? "lineTo" : "moveTo"](u * width, y + lift * Math.min(30, height * .13));
        }
        if (list.length) ringing = true;
        const glow = Math.min(1, energy * 1.5);
        context.lineWidth = .8 + (tuning.length - index) * .085 + glow * .9;
        context.strokeStyle = `rgba(${Math.round(112 - glow * 62)},${Math.round(130 - glow * 48)},${Math.round(94 - glow * 48)},${.5 + glow * .5})`;
        context.stroke();
        // The bridge of each string, in the stepped diagonal of the instrument.
        const bridge = width * (.115 + index * .0185);
        context.fillStyle = "rgba(70,84,62,.55)";
        context.beginPath();
        context.moveTo(bridge - 4, y + 5); context.lineTo(bridge, y - 5); context.lineTo(bridge + 4, y + 5); context.fill();
      });
      if (ringing && !reduced) frame = requestAnimationFrame(draw);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const pluck = (index: number, x: number, force: number, sound: boolean) => {
      if (reduced) return;
      plucks[index].push({ at: performance.now(), x: Math.min(.97, Math.max(.03, x)), force });
      if (plucks[index].length > 3) plucks[index].shift();
      if (sound && !silent.current) voice.play(index, force);
      wake();
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const ratio = Math.min(2, devicePixelRatio || 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      wake();
    });
    resize.observe(canvas);
    const move = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const now = { x: (event.clientX - box.left) / box.width, y: event.clientY - box.top, at: performance.now() };
      if (previous) {
        const speed = Math.abs(now.y - previous.y) / Math.max(8, now.at - previous.at);
        tuning.forEach((_, index) => {
          const y = line(index);
          if (previous && (previous.y - y) * (now.y - y) <= 0 && previous.y !== now.y) {
            pluck(index, now.x, Math.min(1, .32 + speed * .55), event.buttons > 0 || event.pointerType === "touch");
          }
        });
      }
      previous = now;
    };
    const press = (event: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const y = event.clientY - box.top;
      const nearest = tuning.reduce((best, _, index) => Math.abs(line(index) - y) < Math.abs(line(best) - y) ? index : best, 0);
      pluck(nearest, (event.clientX - box.left) / box.width, .85, true);
      previous = { x: 0, y, at: performance.now() };
    };
    const leave = () => { previous = null; };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", press);
    canvas.addEventListener("pointerleave", leave);
    const timers: number[] = [];
    strum.current = (from) => tuning.forEach((_, i) => timers.push(window.setTimeout(() =>
      pluck((from + i) % tuning.length, .25 + (i % 5) * .12, .75, false), i * 52)));
    return () => {
      strum.current = null;
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
      resize.disconnect();
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", press);
      canvas.removeEventListener("pointerleave", leave);
      voice.close();
    };
  }, []);

  useEffect(() => { if (pulse) strum.current?.(0); }, [pulse]);
  return <canvas ref={ref} className={styles.strings} aria-hidden="true" />;
}
