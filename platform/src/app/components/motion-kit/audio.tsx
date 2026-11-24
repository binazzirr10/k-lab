"use client";

import { useState } from "react";

let activeUtterance: SpeechSynthesisUtterance | undefined;

export function speakKorean(text: string, onEnd?: () => void, onError?: () => void, onCancel?: () => void) {
  if (!("speechSynthesis" in window)) { onError?.(); return; }
  const synthesis = window.speechSynthesis;
  synthesis.cancel();
  if (synthesis.paused) synthesis.resume();
  const utterance = new SpeechSynthesisUtterance(text);
  activeUtterance = utterance;
  utterance.lang = "ko-KR";
  utterance.rate = .82;
  const voice = synthesis.getVoices().find((item) => /^ko(?:-|$)/i.test(item.lang));
  if (voice) utterance.voice = voice;
  utterance.onend = () => {
    if (activeUtterance === utterance) activeUtterance = undefined;
    onEnd?.();
  };
  utterance.onerror = (event) => {
    if (activeUtterance === utterance) activeUtterance = undefined;
    if (event.error === "canceled" || event.error === "interrupted") onCancel?.();
    else onError?.();
  };
  synthesis.speak(utterance);
  return () => {
    if (activeUtterance !== utterance) return;
    activeUtterance = undefined;
    synthesis.cancel();
  };
}

export function AudioButton({ text }: { text: string }) {
  const [failed, setFailed] = useState(false);
  return <><button type="button" aria-label={`Слушать: ${text}`} onClick={() => {
    setFailed(false);
    speakKorean(text, undefined, () => setFailed(true));
  }}>🔊 Слушать</button>{failed && <small role="status">Корейская озвучка недоступна.</small>}</>;
}
