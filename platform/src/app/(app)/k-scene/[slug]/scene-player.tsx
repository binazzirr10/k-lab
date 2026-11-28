"use client";

import { Fragment, useEffect, useRef, useState, ViewTransition } from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import styles from "@/app/components/motion-kit/learning.module.css";
import { koreanUtterance } from "@/lib/korean-voice";
import type { KScene } from "@/lib/k-scenes";

export function ScenePlayer({ scene, romanization = [] }: { scene: KScene; romanization?: readonly string[] }) {
  const [current, setCurrent] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const reduced = useReducedMotion();
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
    const utterance = koreanUtterance(text, voiceType);
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
    <ViewTransition name={`scene-${scene.slug}`} share="klab-morph" default="none"><section className="scene-stage"><img className="scene-stage-bg" src={scene.cover} alt={scene.location} /><MotionScope>
      <m.img className="scene-stage-cast" src={scene.cast} alt="Персонаж сцены" initial={false}
        animate={{ scale: !reduced && scene.slug === "joons-day" && line.speaker === "준" && current > 0 ? 1.035 : 1 }}
        transition={spring} />
    </MotionScope><aside className={`scene-player-caption ${styles.caption}${speaking === current ? " speaking" : ""}`}>
      {scene.lines.map((item, index) => <div className={styles.captionMeasure} aria-hidden="true" key={index}>
        <small>{item.speaker} · РЕПЛИКА {index + 1}/{scene.lines.length}</small><b>{item.text}</b>{romanization[index] && <i className="scene-roman">{romanization[index]}</i>}<span>{item.translation}</span>
      </div>)}
      <div aria-live="polite"><MotionScope><AnimatePresence initial={false}><m.div key={current} initial={reduced ? false : { y: 7, opacity: .78 }} animate={{ y: 0, opacity: 1 }} transition={spring}>
        <m.small className={styles.captionSpeaker} initial={reduced ? false : { x: -8 }} animate={{ x: 0 }} transition={spring}>{line.speaker} · РЕПЛИКА {current + 1}/{scene.lines.length}</m.small>
        <b lang="ko">{line.text.split(" ").map((word, index) => <Fragment key={index}>
          {index > 0 && " "}<m.em className={styles.captionWord} initial={reduced ? false : { y: 6, opacity: .65 }}
            animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: reduced ? 0 : index * .035 }}>{word}</m.em>
        </Fragment>)}</b>{romanization[current] && <i className="scene-roman">{romanization[current]}</i>}<span>{line.translation}</span>
      </m.div></AnimatePresence></MotionScope></div></aside></section></ViewTransition>
    <div className="scene-controls"><button className="primary" onClick={() => speak(current)}>▶ СЛУШАТЬ РЕПЛИКУ</button><button onClick={() => setCurrent((value) => Math.max(0, value - 1))} disabled={current === 0}>← НАЗАД</button><button onClick={() => setCurrent((value) => Math.min(scene.lines.length - 1, value + 1))} disabled={current === scene.lines.length - 1}>ДАЛЬШЕ →</button><a href={`/speaking?phrase=${encodeURIComponent(line.text)}`}>ЗАПИСАТЬ В SPEAKING LAB →</a>{current === scene.lines.length - 1 && <button className="primary" disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ СЦЕНУ ✓"}</button>}</div>
    <div className="scene-result" role="status">{done && <p className="scene-note">Готово, прохождение сцены сохранено. Её можно открыть ещё раз в любое время.</p>}{saveError && <p className="scene-note">Не удалось сохранить прохождение. Нажми «Завершить сцену» ещё раз.</p>}</div>
    <section className="scene-script"><h2>Все реплики</h2>{scene.lines.map((item, index) => <div className={`scene-line ${index === current ? "active" : ""}${speaking === index ? " speaking" : ""}`} key={`${item.speaker}-${index}`}><small aria-current={index === current ? "step" : undefined}>{item.speaker}</small><div><b>{item.text}</b>{romanization[index] && <i className="scene-roman">{romanization[index]}</i>}<span>{item.translation}</span></div><button aria-label={`Слушать реплику ${index + 1}`} onClick={() => { setCurrent(index); speak(index); }}>🔊</button></div>)}</section>
  </>;
}
