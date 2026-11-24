"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Lang } from "@/lib/landing/lang";
import { landingWords } from "@/lib/landing/words";
import { MagneticPill, Reveal, useReducedMotion } from "../motion";
import { speakKorean } from "../motion/speech";
import e from "./editorial.module.css";
import s from "./vocabulary.module.css";

const copy = {
  en: { title: ["Vocabulary"], intro: "Turn over a card to hear a word in context. Send it back into the stack if you want another try.", link: "Open the full word deck", again: "Again", know: "I know it", reset: "Reset progress", reveal: "Show meaning", hide: "Show word", listen: "Listen", example: "Listen to example", progress: "Words known", reviews: "Practice attempts", done: "You’ve reviewed this deck", complete: "All words in this set are marked as known.", space: "Space", gap: "Missing word", voice: "Korean audio is unavailable in this browser." },
  ru: { title: ["Словарь"], intro: "Переверни карточку и послушай слово в контексте. Верни её в стопку, если хочешь повторить слово.", link: "Открыть полный словарь", again: "Повторить", know: "Уже знаю", reset: "Сбросить прогресс", reveal: "Показать значение", hide: "Показать слово", listen: "Послушать", example: "Послушать пример", progress: "Выучено слов", reviews: "Попыток", done: "Колода пройдена", complete: "Все слова в этой подборке отмечены как выученные.", space: "Пробел", gap: "Пропущенное слово", voice: "Корейская озвучка недоступна в этом браузере." },
};
const key = "klab-landing-vocabulary-v1";
const empty = '{"known":[],"attempts":0}';
const order = landingWords.map((word) => word.id);
let fallback: string | undefined;
const localEvent = "klab-vocabulary-change";
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(localEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(localEvent, callback);
  };
}
function stored() {
  if (fallback !== undefined) return fallback;
  try { return localStorage.getItem(key) ?? empty; } catch { return empty; }
}
function read(raw: string): { known: string[]; attempts: number } {
  try {
    const value = JSON.parse(raw);
    return {
      known: Array.isArray(value?.known) ? order.filter((id) => value.known.includes(id)) : [],
      attempts: Number.isSafeInteger(value?.attempts) && value.attempts >= 0 ? value.attempts : 0,
    };
  } catch { return { known: [], attempts: 0 }; }
}
function save(value: ReturnType<typeof read>) {
  const raw = JSON.stringify(value);
  try { localStorage.setItem(key, raw); fallback = undefined; } catch { fallback = raw; }
  window.dispatchEvent(new Event(localEvent));
}

export function VocabularyDeck({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const reduced = useReducedMotion();
  const progress = read(useSyncExternalStore(subscribe, stored, () => empty));
  const [queue, setQueue] = useState(order);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(1);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState(false);
  const audio = useRef<(() => void) | null>(null);
  const deck = useRef<HTMLDivElement>(null);
  const id = queue.find((candidate) => !progress.known.includes(candidate));
  const word = landingWords.find((candidate) => candidate.id === id);
  useEffect(() => () => audio.current?.(), []);

  function play(text: string) {
    setError(false);
    audio.current?.();
    audio.current = speakKorean(text, { onError: () => setError(true) });
  }
  function review(known: boolean) {
    if (!id) return;
    if (deck.current?.contains(document.activeElement)) deck.current.focus({ preventScroll: true });
    audio.current?.();
    const latest = read(stored());
    if (latest.known.includes(id)) return;
    setDirection(known ? 1 : -1);
    setFlipped(false);
    setError(false);
    setVersion((current) => current + 1);
    const remaining = queue.filter((candidate) => candidate !== id && !latest.known.includes(candidate));
    if (!known) remaining.splice(Math.min(3, remaining.length), 0, id);
    setQueue(remaining.concat(queue.filter((candidate) => latest.known.includes(candidate) || (known && candidate === id))));
    save({ known: known ? [...latest.known, id] : latest.known, attempts: latest.attempts + 1 });
  }
  function reset() {
    audio.current?.();
    setFlipped(false);
    setError(false);
    setQueue(order);
    setVersion((current) => current + 1);
    save({ known: [], attempts: 0 });
  }
  function shortcuts(event: KeyboardEvent<HTMLDivElement>) {
    if (!word || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      review(event.key === "ArrowRight");
    } else if (event.key === " " && event.target === event.currentTarget) {
      event.preventDefault();
      setFlipped(!flipped);
    }
  }

  const heading = "vocabulary-heading";
  return <section className={e.section} id="vocabulary" data-scene="vocabulary" lang={lang} aria-labelledby={heading}>
    <div className={e.frame}>
      <div className={`${e.intro} ${s.intro}`}>
        <span className={e.number} aria-hidden="true">04</span>
        <h2 className={e.title} id={heading}><Reveal lines={t.title} /></h2>
        <p className={e.lead}>{t.intro}</p>
        <div className={s.progressGroup}>
          <div className={s.strokes} aria-hidden="true">{order.map((item, i) => <span key={item}>
            <motion.i initial={false} animate={{ scaleY: i < progress.known.length ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : .32, ease: [.22, .61, .36, 1] }} />
          </span>)}</div>
          <div className={s.progress} role="status">
            <span><b>{progress.known.length}<i> / {order.length}</i></b>{t.progress}</span>
            <span><b>{progress.attempts}</b>{t.reviews}</span>
          </div>
          <button type="button" className={s.reset} disabled={!progress.attempts && !progress.known.length} onClick={reset}>{t.reset}</button>
        </div>
        <MagneticPill href="/vocabulary">{t.link}</MagneticPill>
      </div>
      <div className={`${e.paper} ${s.workbench}`} ref={deck} role="group" aria-labelledby={heading} tabIndex={0} aria-keyshortcuts="ArrowLeft ArrowRight Space" onKeyDown={shortcuts}>
        <div className={s.deck} data-empty={!word}>
          <AnimatePresence initial={false} mode="popLayout" custom={direction}>
            {word ? <motion.div key={`${word.id}-${version}`} className={s.card}
              drag={reduced ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={.38} dragMomentum={false}
              onDragEnd={(_, { offset, velocity }) => {
                const projected = offset.x + velocity.x * .11;
                if (Math.abs(projected) > 78) review(projected > 0);
              }}
              variants={{
                in: { x: 0, opacity: 1, rotate: 0, scale: 1 },
                out: (to: number) => reduced ? { x: 0, opacity: 1 } : { x: to * 165, rotate: to * 6, opacity: 0 },
              }}
              initial={reduced ? false : { opacity: .8, scale: .98 }} animate="in" exit="out"
              transition={{ duration: reduced ? 0 : .25, ease: [.22, .61, .36, 1] }}>
              <motion.div className={s.cardContent} initial={false} animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: reduced ? 0 : .38, ease: [.22, .61, .36, 1] }}>
                <div className={s.face} inert={flipped} aria-hidden={flipped}>
                  <div className={s.word} lang="ko">{word.korean}</div>
                  <p className={s.roman}>{word.romanization}</p>
                </div>
                <div className={`${s.face} ${s.back}`} inert={!flipped} aria-hidden={!flipped}>
                  <p className={s.meaning}>{lang === "en" ? word.english : word.russian}</p>
                  <p className={s.roman} lang="ko">{word.korean}</p>
                </div>
              </motion.div>
            </motion.div> : <div className={`${s.card} ${s.complete}`} key="complete">
              <h3>{t.done}</h3><p className={e.note}>{t.complete}</p>
            </div>}
          </AnimatePresence>
        </div>
        {word && <>
          <div className={s.actions}>
            <button type="button" onClick={() => review(false)}><kbd aria-hidden="true">←</kbd>{t.again}</button>
            <button type="button" onClick={() => setFlipped(!flipped)} aria-pressed={flipped}><kbd aria-hidden="true">{t.space}</kbd>{flipped ? t.hide : t.reveal}</button>
            <button type="button" onClick={() => review(true)}>{t.know}<kbd aria-hidden="true">→</kbd></button>
          </div>
          <div className={s.context}>
            <p className={s.example} lang="ko">{word.example.split(word.korean).map((part, i) =>
              <span key={i}>{i > 0 && <span data-revealed={flipped} className={s.gap}>
                <span aria-hidden={!flipped}>{word.korean}</span>
                {!flipped && <span className={s.srOnly} lang={lang}>{t.gap}</span>}
              </span>}{part}</span>)}</p>
            {flipped && <p className={s.exampleTranslation}>{lang === "en" ? word.exampleEn : word.exampleRu}</p>}
            <button type="button" className={e.button} onClick={() => play(flipped ? word.example : word.korean)}>▷ {flipped ? t.example : t.listen}</button>
          </div>
        </>}
        {error && <p className={e.note} role="status">{t.voice}</p>}
      </div>
    </div>
  </section>;
}
