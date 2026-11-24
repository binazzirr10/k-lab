"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LayoutGroup, motion } from "motion/react";
import type { Lang } from "@/lib/landing/lang";
import { landingScenes, wordGlosses } from "@/lib/landing/scenes";
import { sceneImage } from "@/lib/landing/scene-images";
import { MagneticPill, Reveal, useReducedMotion } from "../motion";
import { speakKorean } from "../motion/speech";
import e from "./editorial.module.css";
import s from "./drama-mode.module.css";

const copy = {
  en: { title: ["K‑Drama Mode"], intro: "Follow four original illustrated K‑Scene dialogues from the course, one line at a time.", open: "Open the full K‑Scene", play: "Play", pause: "Pause", previous: "Previous line", next: "Next line", scrub: "Dialogue line", subtitles: "Subtitles", romanization: "Romanization", translation: "English", scenes: "Choose a scene", word: "Word meaning", voice: "Korean audio is unavailable in this browser." },
  ru: { title: ["Режим K‑Drama"], intro: "Читай и слушай четыре авторских иллюстрированных диалога K‑Scene из курса, реплика за репликой.", open: "Открыть сцену целиком", play: "Воспроизвести", pause: "Пауза", previous: "Предыдущая реплика", next: "Следующая реплика", scrub: "Реплика диалога", subtitles: "Субтитры", romanization: "Латиница", translation: "Русский", scenes: "Выбери сцену", word: "Значение слова", voice: "Корейская озвучка недоступна в этом браузере." },
};
const tracks = ["korean", "romanization", "translation"] as const;
type Track = typeof tracks[number];

export function DramaMode({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduced = useReducedMotion();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeWord, setActiveWord] = useState(-1);
  const [pickedWord, setPickedWord] = useState("");
  const [voiceError, setVoiceError] = useState(false);
  const [visible, setVisible] = useState<Record<Track, boolean>>({ korean: true, romanization: true, translation: true });
  const sound = useRef<{ cancel?: () => void; timers: number[]; resumeWord: number }>({ timers: [], resumeWord: 0 });
  const scene = landingScenes[sceneIndex];
  const line = scene.lines[lineIndex];

  useEffect(() => {
    const current = sound.current;
    return () => { current.cancel?.(); current.timers.forEach(window.clearTimeout); };
  }, []);

  function stop() {
    sound.current.cancel?.();
    sound.current.timers.forEach(window.clearTimeout);
    sound.current.timers = [];
    setPlaying(false);
    setActiveWord(-1);
  }
  function togglePlayback() {
    if (playing) {
      sound.current.resumeWord = Math.max(0, activeWord);
      stop();
    } else {
      play(lineIndex, sound.current.resumeWord);
    }
  }
  function play(index: number, resumeWord = 0) {
    const item = scene.lines[index];
    const words = [...item.text.matchAll(/\S+/g)].slice(resumeWord);
    const startOffset = words[0]?.index ?? 0;
    let hasBoundaries = false;
    setVoiceError(false);
    setPlaying(true);
    sound.current.cancel = speakKorean(item.text.slice(startOffset), {
      voice: item.voice,
      onStart: () => {
        setActiveWord(resumeWord);
        let delay = 0;
        words.forEach((word, i) => {
          if (i > 0) sound.current.timers.push(window.setTimeout(() => {
            if (!hasBoundaries) setActiveWord(resumeWord + i);
          }, delay));
          delay += 95 + word[0].length * 155;
        });
      },
      onBoundary: (offset) => {
        if (offset > 0) hasBoundaries = true;
        setActiveWord(resumeWord + Math.max(0, words.findLastIndex((word) => word.index <= offset + startOffset)));
      },
      onEnd: () => {
        sound.current.resumeWord = 0;
        stop();
        if (index < scene.lines.length - 1) {
          sound.current.timers.push(window.setTimeout(() => {
            setLineIndex(index + 1);
            setPickedWord("");
            play(index + 1);
          }, 360));
          setPlaying(true);
        }
      },
      onError: () => { stop(); setVoiceError(true); },
      onInterrupt: stop,
    });
  }
  function seek(index: number) {
    const next = Math.max(0, Math.min(scene.lines.length - 1, index));
    if (next === lineIndex) return;
    sound.current.resumeWord = 0;
    stop(); setLineIndex(next); setPickedWord(""); setVoiceError(false);
    if (playing) play(next);
  }
  function onPlayerKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLInputElement || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      seek(lineIndex + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === " " && event.target === event.currentTarget) {
      event.preventDefault();
      togglePlayback();
    }
  }
  const title = (item: typeof scene) => lang === "en" ? item.englishTitle : item.title;
  const location = lang === "en" ? scene.englishLocation : scene.location;
  const gloss = wordGlosses[pickedWord]?.[lang === "en" ? 0 : 1];
  const heading = "drama-heading";

  return <section className={`${e.section} ${s.section}`} id="drama" data-scene="drama" lang={lang} aria-labelledby={heading}>
    <div className={e.frame}>
      <header className={`${e.intro} ${s.intro}`}>
        <span className={e.number} aria-hidden="true">02</span>
        <h2 className={e.title} id={heading}><Reveal lines={t.title} /></h2>
      </header>
      <div className={`${e.paper} ${s.about}`}>
        <p className={e.lead}>{t.intro}</p>
        <MagneticPill href={`/k-scene/${scene.slug}`}>{t.open}</MagneticPill>
      </div>
      <div className={s.player} role="group" tabIndex={0} aria-keyshortcuts="ArrowLeft ArrowRight Space" aria-label={title(scene)} onKeyDown={onPlayerKey}>
        <figure className={s.film}>
          <div className={s.still}>
            <motion.div className={s.camera} initial={false}
              animate={reduced ? { scale: 1, x: "0%" } : { scale: lineIndex % 2 ? 1.16 : 1.07, x: lineIndex % 2 ? "2.3%" : "-1.4%" }}
              transition={{ duration: reduced ? 0 : 1.85, ease: [.22, .61, .36, 1] }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- Existing responsive WebP variants. */}
              <img className={s.background} {...sceneImage(scene.cover, "100vw")} alt="" decoding="async" fetchPriority="low" />
              {/* eslint-disable-next-line @next/next/no-img-element -- Existing transparent WebP variants. */}
              <img className={s.cast} data-solo={scene.slug === "joons-day"} {...sceneImage(scene.cast, "(max-width: 760px) 95vw, 57vw")} alt="" decoding="async" fetchPriority="low" />
            </motion.div>
          </div>
          <figcaption className={s.filmCaption}><span>{title(scene)}</span><span>{location}</span></figcaption>
          <div className={s.overlay}>
            <div className={s.subtitles} aria-live={playing ? "off" : "polite"}>
              <span className={s.speaker} lang="ko">{line.speaker}</span>
              {visible.korean && <div className={s.korean} lang="ko">
                {line.text.split(" ").map((word, i) => {
                  const key = word.replace(/[^가-힣]/g, "");
                  return <button key={i} type="button" className={s.word} data-current={activeWord === i}
                    aria-pressed={pickedWord === key} onClick={() => setPickedWord((current) => current === key ? "" : key)}>{word}</button>;
                })}
              </div>}
              {visible.romanization && <p className={s.roman}>{line.romanization}</p>}
              {visible.translation && <p className={s.translation}>{lang === "en" ? line.english : line.translation}</p>}
            </div>
            <div className={s.transport}>
              <div className={s.transportButtons}>
                <button type="button" aria-label={t.previous} disabled={lineIndex === 0} onClick={() => seek(lineIndex - 1)}><Icon name="previous" /></button>
                <button type="button" aria-label={playing ? t.pause : t.play} onClick={togglePlayback}><Icon name={playing ? "pause" : "play"} /></button>
                <button type="button" aria-label={t.next} disabled={lineIndex === scene.lines.length - 1} onClick={() => seek(lineIndex + 1)}><Icon name="next" /></button>
              </div>
              <label className={s.scrub}>
                <span className={s.count}><span className={s.srOnly}>{t.scrub} </span>{lineIndex + 1} / {scene.lines.length}</span>
                <span className={s.scrubTrack}>
                  <span className={s.ticks} aria-hidden="true">{scene.lines.map((_, i) => <i key={i} data-active={i <= lineIndex} />)}</span>
                  <input type="range" min={0} max={scene.lines.length - 1} value={lineIndex} aria-valuetext={`${lineIndex + 1} / ${scene.lines.length}`} onChange={(event) => seek(Number(event.currentTarget.value))} />
                </span>
              </label>
            </div>
          </div>
        </figure>
        <div className={s.underPlayer}>
          <div className={s.layers} role="group" aria-label={t.subtitles}>
            <span className={e.label}>{t.subtitles}</span>
            {tracks.map((track) => <button key={track} type="button" lang={track === "korean" ? "ko" : undefined} className={e.button} aria-pressed={visible[track]} onClick={() => {
              if (track === "korean") setPickedWord("");
              setVisible((current) => ({ ...current, [track]: !current[track] }));
            }}>{track === "korean" ? "한국어" : t[track]}</button>)}
          </div>
          {gloss && <p className={s.gloss} role="status"><span className={e.label}>{t.word}</span> <b lang="ko">{pickedWord}</b> · {gloss}</p>}
          {voiceError && <p className={e.note} role="status">{t.voice}</p>}
        </div>
        <LayoutGroup id="scene-film-strip">
          <div className={s.strip} role="group" aria-label={t.scenes}>
            {landingScenes.map((item, i) => <motion.button layout={!reduced} transition={{ layout: { duration: .38, ease: [.22, .61, .36, 1] } }}
              type="button" key={item.slug} className={s.frame} aria-pressed={i === sceneIndex} onClick={() => {
                sound.current.resumeWord = 0;
                stop(); setSceneIndex(i); setLineIndex(0); setPickedWord(""); setVoiceError(false);
              }}>
              <span className={s.thumbnail}>
                {/* eslint-disable-next-line @next/next/no-img-element -- Existing responsive WebP variants. */}
                <img {...sceneImage(item.cover, "(max-width: 760px) 45vw, 29vw")} width="320" height="180" alt="" loading="lazy" />
              </span>
              <span className={s.frameTitle}><span>{String(i + 1).padStart(2, "0")}</span><span>{title(item)}</span></span>
            </motion.button>)}
          </div>
        </LayoutGroup>
      </div>
    </div>
  </section>;
}

function Icon({ name }: { name: "previous" | "next" | "play" | "pause" }) {
  const paths = {
    previous: "M19 12H5m6-6-6 6 6 6",
    next: "M5 12h14m-6-6 6 6-6 6",
    play: "m9 5 11 7-11 7z",
    pause: "M9 5v14m6-14v14",
  };
  return <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35"><path d={paths[name]} /></svg>;
}
