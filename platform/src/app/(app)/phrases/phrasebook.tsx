"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "motion/react";
import { speakKorean } from "@/app/components/motion-kit/audio";
import { useDialoguePlayback } from "@/app/components/motion-kit/dialogue-playback";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import ui from "@/app/components/motion-kit/reference.module.css";
import { phrases, situations } from "@/lib/content/phrases";
import styles from "./phrasebook.module.css";

type Phrase = (typeof phrases)[number];

function normalize(text: string) {
  return text.normalize("NFC").toLowerCase().replaceAll("ё", "е");
}

function words(text: string) {
  return normalize(text).match(/[\p{L}\p{N}]+/gu) ?? [];
}

function stem(word: string) {
  if (!/^[а-я]{5,}$/.test(word)) return word;
  const base = word.replace(/(?:ами|ями|ого|ему|ых|их|ый|ая|ое|ую|ом|ам|ям|ах|ях|[аяеыиуюо])$/, "");
  return base.length >= 4 ? base : word;
}

function matches(query: string[], phrase: Phrase, situation: (typeof situations)[number]) {
  const fields = [phrase.korean, phrase.romanization, phrase.russian, phrase.note ?? "", situation.title, situation.terms ?? ""];
  if (!query.length) return true;
  const compact = query.join("");
  if (fields.some((field) => words(field).join("").includes(compact))) return true;
  const tokens = fields.flatMap(words);
  return query.every((part) => tokens.some((token) => token.includes(part) || stem(token) === stem(part)));
}

export function Phrasebook() {
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState("");
  const [failed, setFailed] = useState("");
  const opener = useRef<HTMLButtonElement | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const filter = words(query);
  const visible = situations.flatMap((situation) => (!category || category === situation.id)
    ? situation.phrases.filter((phrase) => matches(filter, phrase, situation)).map((phrase) => ({ phrase, situation }))
    : []);

  function close(returnFocus = false) {
    setExpanded("");
    if (returnFocus) requestAnimationFrame(() => {
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
      else search.current?.focus({ preventScroll: true });
    });
  }

  function clear() {
    setQuery("");
    setCategory("");
    close();
    search.current?.focus();
  }

  return <section className={`${ui.panel} ${styles.hero}`}>
    <h2>Фразы по ситуациям</h2>
    <MotionScope layout><LayoutGroup>
      <div className={ui.controls}><label>Поиск по фразам<input ref={search} type="search" value={query} onChange={(event) => { close(); setQuery(event.target.value); }} /></label></div>
      <div className={styles.chips} role="group" aria-label="Ситуации">
        {[{ id: "", title: "Все ситуации" }, ...situations].map((item) => <button type="button" key={item.id} className={styles.chip} aria-pressed={category === item.id}
          onClick={() => { close(); setCategory(item.id); }}>
          {category === item.id && <m.i className={styles.pill} layoutId="active-situation" transition={spring} aria-hidden="true" />}
          <span>{item.title}</span>
        </button>)}
      </div>
      <p role="status">Найдено фраз: {visible.length}</p>
      {visible.length === 0 && <div className={styles.empty}><h3>По этому запросу ничего нет</h3><p>Попробуй одно слово, латиницу или другую ситуацию.</p><button type="button" onClick={clear}>Очистить поиск и фильтр</button></div>}
      <div className={`${ui.grid} ${styles.cards}`}>{visible.map(({ phrase, situation }) => {
        const inDialogue = situation.phrases.slice(0, 2).some((line) => line.id === phrase.id);
        return <Fragment key={phrase.id}><m.article className={`${ui.card} ${styles.card}`} layout="position" transition={spring} key={phrase.id}>
          <m.div layout="position" layoutId={phrase.id === expanded ? undefined : `line-${phrase.id}`} transition={spring}>
            <button className={styles.say} type="button" aria-label={`Слушать: ${phrase.korean}`} onClick={() => {
              close();
              setFailed("");
              void speakKorean(phrase.korean, undefined, () => setFailed(phrase.id));
            }}><b lang="ko">{phrase.korean}</b><span aria-hidden="true">◖))</span></button>
            <p lang="ko-Latn" className={ui.meta}>{phrase.romanization}</p>
            <p>{phrase.russian}</p>{phrase.note && <p className={ui.meta}>{phrase.note}</p>}
          </m.div>
          {inDialogue && <button type="button" aria-expanded={phrase.id === expanded} aria-controls={phrase.id === expanded ? "phrase-dialogue" : undefined}
            onClick={(event) => {
              if (phrase.id === expanded) { close(true); return; }
              opener.current = event.currentTarget;
              setExpanded(phrase.id);
            }}>Диалог</button>}
          {failed === phrase.id && <p role="status">Корейская озвучка недоступна.</p>}
        </m.article>
        {expanded === phrase.id && <DialoguePanel key="dialogue" phrase={phrase} title={situation.title}
          lines={situation.phrases.slice(0, 2)} close={() => close(true)} />}
        </Fragment>;
      })}</div>
    </LayoutGroup></MotionScope>
  </section>;
}

function DialoguePanel({ phrase, title, lines, close }: { phrase: Phrase; title: string; lines: Phrase[]; close: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const { current, status, toggle, step, play } = useDialoguePlayback(lines.map((line) => line.korean));
  const visibleIndex = current < 0 ? lines.findIndex((line) => line.id === phrase.id) : current;
  const activeIndex = current < 0 ? lines.findIndex((line) => line.id === phrase.id) : current;
  const reduced = useReducedMotion();
  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        close();
      }
    }
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [close]);

  return <m.section layout="position" transition={spring} className={styles.panel} id="phrase-dialogue" aria-labelledby="phrase-dialogue-heading">
    <header><h3 id="phrase-dialogue-heading" ref={heading} tabIndex={-1}>Диалог · {title}</h3><button type="button" onClick={close}>Закрыть</button></header>
    <ol className={styles.exchange} aria-live="polite"><AnimatePresence initial={false}>
      {lines.slice(0, Math.max(0, visibleIndex) + 1).map((line, index) => <m.li key={line.id}
        layout="position" layoutId={line.id === phrase.id ? `line-${phrase.id}` : undefined}
        data-side={index % 2} initial={reduced ? false : { x: index % 2 ? 12 : -12, opacity: .72 }} animate={{ x: 0, opacity: 1 }}
        transition={spring} aria-current={activeIndex === index ? "step" : undefined}>
        <small>{index % 2 === 0 ? "Собеседник А" : "Собеседник Б"}</small>
        <b lang="ko">{line.korean}</b><span lang="ko-Latn" className={ui.meta}>{line.romanization}</span><span>{line.russian}</span>
      </m.li>)}
    </AnimatePresence></ol>
    <div className={ui.controls}>
      <button type="button" disabled={activeIndex === 0} onClick={() => step(activeIndex - 1)}>← Назад</button>
      <button type="button" onClick={toggle}>{status === "playing" ? "Пауза" : status === "paused" ? "Продолжить" : "Слушать диалог"}</button>
      <button type="button" disabled={activeIndex === lines.length - 1} onClick={() => step(activeIndex + 1)}>Дальше →</button>
      <button type="button" onClick={() => play(activeIndex, false)}>Слушать реплику {activeIndex + 1}</button>
    </div>
    {status === "error" && <p role="status">Корейская озвучка недоступна. Переключай реплики кнопками.</p>}
  </m.section>;
}
