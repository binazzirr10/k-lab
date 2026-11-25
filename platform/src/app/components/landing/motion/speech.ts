"use client";

import { koreanUtterance, type Speaker } from "@/lib/korean-voice";

type SpeechOptions = {
  onStart?: () => void;
  voice?: Speaker;
  onEnd?: () => void;
  onError?: () => void;
  onInterrupt?: () => void;
  onBoundary?: (index: number) => void;
};

let active: { speech: SpeechSynthesisUtterance; interrupt: () => void } | null = null;

export function speakKorean(text: string, options: SpeechOptions = {}) {
  if (!("speechSynthesis" in window)) { options.onError?.(); return () => {}; }
  const engine = window.speechSynthesis;
  if (active) active.interrupt();
  else engine.cancel();
  const speech = koreanUtterance(text, options.voice);
  speech.onstart = () => options.onStart?.();
  speech.onend = () => { if (active?.speech === speech) active = null; options.onEnd?.(); };
  speech.onerror = () => { if (active?.speech === speech) active = null; options.onError?.(); };
  speech.onboundary = (event) => options.onBoundary?.(event.charIndex);
  function cancel() {
    speech.onstart = null;
    speech.onend = null;
    speech.onerror = null;
    speech.onboundary = null;
    if (active?.speech === speech) { active = null; engine.cancel(); }
  }
  active = { speech, interrupt: () => { cancel(); options.onInterrupt?.(); } };
  engine.speak(speech);
  return cancel;
}
