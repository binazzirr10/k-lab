"use client";

import { useEffect, useRef, useState } from "react";
import type { KScene } from "@/lib/k-scenes";

export function ScenePlayer({ scene }: { scene: KScene }) {
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const line = scene.lines[current];
  const [speaking, setSpeaking] = useState<number | null>(null);
  const activeUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    if (!activeUtterance.current) return;
    activeUtterance.current = null;
    window.speechSynthesis.cancel();
  }, []);

  function speak(index: number) {
    if (!("speechSynthesis" in window)) return;
    const { text, voice: voiceType } = scene.lines[index];
    activeUtterance.current = null;
    setSpeaking(null);
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ko-KR";
    utterance.rate = 0.78;
    const voice = window.speechSynthesis.getVoices().find((item) => item.lang.startsWith("ko") && (voiceType === "male" ? /male|man|남성/i.test(item.name) : !/male|man|남성/i.test(item.name)));
    if (voice) utterance.voice = voice;
    activeUtterance.current = utterance;
    utterance.onstart = () => {
      if (activeUtterance.current === utterance) setSpeaking(index);
    };
    utterance.onend = utterance.onerror = () => {
      if (activeUtterance.current !== utterance) return;
      activeUtterance.current = null;
      setSpeaking(null);
    };
    window.speechSynthesis.speak(utterance);
  }

  async function finish() {
    setSaving(true);
    setSaveError(false);
    try {
      const response = await fetch("/api/progress/scene", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sceneId: scene.id, score: 100 }) });
      if (!response.ok) throw new Error();
      setDone(true);
    } catch {
      setSaveError(true);
    } finally { setSaving(false); }
  }

  return <>
    <section className="scene-stage"><img className="scene-stage-bg" src={scene.cover} alt={scene.location} /><img className="scene-stage-cast" src={scene.cast} alt="Персонаж сцены" /><aside className={speaking === current ? "scene-player-caption speaking" : "scene-player-caption"}><small>{line.speaker} · РЕПЛИКА {current + 1}/{scene.lines.length}</small><b>{line.text}</b><span>{line.translation}</span></aside></section>
    <div className="scene-controls"><button className="primary" onClick={() => speak(current)}>▶ СЛУШАТЬ РЕПЛИКУ</button><button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← НАЗАД</button><button onClick={() => setCurrent((value) => Math.min(scene.lines.length - 1, value + 1))} disabled={current === scene.lines.length - 1}>ДАЛЬШЕ →</button><a href={`https://k-lab-two.vercel.app/speaking.html?phrase=${encodeURIComponent(line.text)}&lesson=scene-${scene.slug}`}>ЗАПИСАТЬ В SPEAKING LAB →</a>{current === scene.lines.length - 1 && <button className="primary" disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ СЦЕНУ ✓"}</button>}</div>
    <div className="scene-result" role="status">{done && <p className="scene-note">Готово, прохождение сцены сохранено. Её можно открыть ещё раз в любое время.</p>}{saveError && <p className="scene-note">Не удалось сохранить прохождение. Нажми «Завершить сцену» ещё раз.</p>}</div>
    <section className="scene-script"><h2>Все реплики</h2>{scene.lines.map((item, index) => <div className={`scene-line ${index === current ? "active" : ""}${speaking === index ? " speaking" : ""}`} key={`${item.speaker}-${index}`}><small aria-current={index === current ? "step" : undefined}>{item.speaker}</small><div><b>{item.text}</b><span>{item.translation}</span></div><button aria-label={`Слушать реплику ${index + 1}`} onClick={() => { setCurrent(index); speak(index); }}>🔊</button></div>)}</section>
  </>;
}
