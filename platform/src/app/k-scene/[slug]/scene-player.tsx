"use client";

import { useState } from "react";
import type { KScene } from "@/lib/k-scenes";

function speak(text: string, voiceType: "female" | "male") {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.78;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang.startsWith("ko") && (voiceType === "male" ? /male|man|남성/i.test(item.name) : !/male|man|남성/i.test(item.name)));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

export function ScenePlayer({ scene }: { scene: KScene }) {
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const line = scene.lines[current];

  async function finish() {
    setSaving(true);
    try {
      const response = await fetch("/api/progress/scene", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sceneId: scene.id, score: 100 }) });
      if (!response.ok) throw new Error();
      setDone(true);
    } finally { setSaving(false); }
  }

  return <>
    <section className="scene-stage"><img className="scene-stage-bg" src={scene.cover} alt={scene.location} /><img className="scene-stage-cast" src={scene.cast} alt="Персонаж сцены" /><aside className="scene-caption"><small>{line.speaker} · РЕПЛИКА {current + 1}/{scene.lines.length}</small><b>{line.text}</b><span>{line.translation}</span></aside></section>
    <div className="scene-controls"><button className="primary" onClick={() => speak(line.text, line.voice)}>▶ СЛУШАТЬ РЕПЛИКУ</button><button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← НАЗАД</button><button onClick={() => setCurrent((value) => Math.min(scene.lines.length - 1, value + 1))} disabled={current === scene.lines.length - 1}>ДАЛЬШЕ →</button><a href={`https://k-lab-two.vercel.app/speaking.html?phrase=${encodeURIComponent(line.text)}&lesson=scene-${scene.slug}`}>ПОВТОРИТЬ В SPEAKING →</a>{current === scene.lines.length - 1 && <button className="primary" disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ СЦЕНУ ✓"}</button>}</div>
    {done && <p className="scene-note">Готово: сцена сохранена в твоём учебном профиле. Теперь можно вернуться к ней для повторения.</p>}
    <section className="scene-script"><h2>Line by line</h2>{scene.lines.map((item, index) => <div className={`scene-line ${index === current ? "active" : ""}`} key={`${item.speaker}-${index}`}><small>{item.speaker}</small><div><b>{item.text}</b><span>{item.translation}</span></div><button onClick={() => { setCurrent(index); speak(item.text, item.voice); }}>🔊</button></div>)}</section>
  </>;
}
