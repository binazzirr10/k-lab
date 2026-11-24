"use client";

type SpeechOptions = {
  onStart?: () => void;
  voice?: "male" | "female";
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
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "ko-KR";
  speech.rate = .82;
  const voices = engine.getVoices().filter((candidate) => /^ko([-_]|$)/i.test(candidate.lang));
  const voice = (options.voice && voices.find((candidate) => /\b(?:male|man)\b|남성/i.test(candidate.name) === (options.voice === "male"))) || voices[0];
  if (voice) speech.voice = voice;
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
