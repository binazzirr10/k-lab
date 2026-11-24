"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { LayoutGroup, m, useReducedMotion } from "motion/react";
import { AudioButton, speakKorean } from "@/app/components/motion-kit/audio";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import ui from "@/app/components/motion-kit/reference.module.css";
import { composeSyllable, decomposeSyllable, finals, initials, vowels, wordPresets } from "@/lib/content/syllables";
import styles from "./assembler.module.css";

const keyboards = [initials, vowels, finals];
const labels = ["Согласные", "Гласные", "Патчим"];
const mixed: Partial<Record<string, readonly [string, string]>> = {
  "ㅘ": ["ㅗ", "ㅏ"], "ㅙ": ["ㅗ", "ㅐ"], "ㅚ": ["ㅗ", "ㅣ"], "ㅝ": ["ㅜ", "ㅓ"],
  "ㅞ": ["ㅜ", "ㅔ"], "ㅟ": ["ㅜ", "ㅣ"], "ㅢ": ["ㅡ", "ㅣ"],
};
const doubleFinals: Partial<Record<string, string>> = {
  "ㄲ": "ㄱㄱ", "ㅆ": "ㅅㅅ", "ㄳ": "ㄱㅅ", "ㄵ": "ㄴㅈ", "ㄶ": "ㄴㅎ", "ㄺ": "ㄹㄱ", "ㄻ": "ㄹㅁ",
  "ㄼ": "ㄹㅂ", "ㄽ": "ㄹㅅ", "ㄾ": "ㄹㅌ", "ㄿ": "ㄹㅍ", "ㅀ": "ㄹㅎ", "ㅄ": "ㅂㅅ",
};
type Flight = { glyph: string; x: number; y: number; dx: number; dy: number; scale: number; id: number };

export function Assembler() {
  const [selected, setSelected] = useState<[number, number, number]>([0, 0, 0]);
  const [tab, setTab] = useState(0);
  const [closed, setClosed] = useState(true);
  const [stamp, setStamp] = useState(0);
  const [placing, setPlacing] = useState<number | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [chain, setChain] = useState<string[]>([]);
  const [word, setWord] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const generation = useRef(0);
  const dragKey = useRef<{ row: number; index: number; origin: DOMRect } | null>(null);
  const touchKey = useRef<{ row: number; index: number; origin: DOMRect; x: number; y: number } | null>(null);
  const skipClick = useRef(false);
  const reduced = useReducedMotion();
  const [initial, vowel, final] = selected;
  const syllable = composeSyllable(...selected);
  const compound = mixed[vowels[vowel]];
  const shape = compound ? "mixed" : "ㅗㅛㅜㅠㅡ".includes(vowels[vowel]) ? "horizontal" : "vertical";
  const vowelNote = {
    mixed: "Части гласной стоят снизу и справа.",
    horizontal: "Гласная стоит под начальной согласной.",
    vertical: "Гласная стоит справа от начальной согласной.",
  }[shape];

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function interrupt() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setFlight(null);
    setPlacing(null);
    return ++generation.current;
  }

  function close(withSound?: string) {
    setFlight(null);
    setPlacing(null);
    setClosed(true);
    setStamp((value) => value + 1);
    if (withSound) void speakKorean(withSound);
  }

  function choose(row: number, index: number, origin: DOMRect) {
    const id = interrupt();
    const next: [number, number, number] = [...selected];
    next[row] = index;
    setSelected(next);
    setWord("");
    setChain([]);
    const result = composeSyllable(...next);
    if (reduced) { close(result); return; }
    setClosed(false);
    const glyph = keyboards[row][index];
    if (glyph) {
      setPlacing(row);
      timers.current.push(setTimeout(() => {
        const board = stage.current?.getBoundingClientRect();
        const zone = stage.current?.querySelector(`[data-zone="${row}"]`);
        const target = stage.current?.querySelector(`[data-guide="${row}"]`)?.getBoundingClientRect();
        if (!board || !zone || !target || id !== generation.current) return;
        const x = origin.left + origin.width / 2 - board.left;
        const y = origin.top + origin.height / 2 - board.top;
        setFlight({ glyph, x, y, dx: target.left + target.width / 2 - board.left - x, dy: target.top + target.height / 2 - board.top - y, scale: Math.min(4.6, parseFloat(getComputedStyle(zone).fontSize) / 23), id });
      }, 24));
    }
    // Speech synthesis needs to start in the user gesture on some browsers.
    void speakKorean(result);
    timers.current.push(setTimeout(() => close(), 1010));
  }

  function buildWord(value: string) {
    interrupt();
    setWord(value);
    const syllables = [...value];
    void speakKorean(value);
    if (reduced) {
      setChain(syllables);
      setSelected(decomposeSyllable(syllables.at(-1)!));
      close();
      return;
    }
    setChain([]);
    syllables.forEach((letter, index) => {
      timers.current.push(setTimeout(() => {
        setSelected(decomposeSyllable(letter));
        setClosed(false);
      }, index * 740));
      timers.current.push(setTimeout(() => {
        close();
        setChain(syllables.slice(0, index + 1));
      }, index * 740 + 470));
    });
  }

  function drop(event: DragEvent) {
    event.preventDefault();
    setDragOver(false);
    const key = dragKey.current;
    dragKey.current = null;
    if (key) choose(key.row, key.index, key.origin);
  }

  function finalCharacters(glyph: string) {
    return [...(doubleFinals[glyph] ?? glyph)];
  }

  return <section className={`${ui.panel} ${styles.hero}`}>
    <h2>Собери слог</h2>
    <p>Нажми на букву или перетащи её на сцену. Посмотри, как согласная, гласная и патчим занимают свои места.</p>
    <MotionScope layout><LayoutGroup>
      <div className={styles.workspace}>
        <div className={styles.preview}>
          <div ref={stage} data-shape={shape} data-final={Boolean(final)} data-drop={dragOver}
            className={styles.block} aria-hidden="true"
            onDragOver={(event) => { if (dragKey.current) { event.preventDefault(); setDragOver(true); } }}
            onDragLeave={(event) => { if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setDragOver(false); }}
            onDrop={drop}>
            <div className={styles.guides}><i className={styles.initial} data-guide="0" /><i className={styles.vowel} data-guide="1" />
              {compound && <i className={styles.wrap} />}<i className={styles.final} data-guide="2" />
            </div>
            <m.div className={styles.parts} initial={false} animate={{ opacity: closed ? 0 : 1 }} transition={{ duration: reduced ? 0 : .22 }}>
              <m.div layout="position" transition={spring} data-zone="0" className={styles.initial}>
                {placing !== 0 && <Landing glyph={initials[initial]} animate={Boolean(flight)} />}
              </m.div>
              <m.div layout="position" transition={spring} data-zone="1" className={styles.vowel}>
                {placing !== 1 && <Landing glyph={compound?.[1] ?? vowels[vowel]} animate={Boolean(flight)} />}
              </m.div>
              {compound && <m.div layout="position" transition={spring} className={styles.wrap}>{placing !== 1 && compound[0]}</m.div>}
              <m.div layout="position" transition={spring} data-zone="2" className={styles.final}>{placing !== 2 && finalCharacters(finals[final]).map((part, index) => <Landing key={index} glyph={part} animate={Boolean(flight)} />)}</m.div>
            </m.div>
            <m.div className={styles.glyph} lang="ko" initial={false} animate={{ opacity: closed ? 1 : 0 }} transition={{ duration: reduced ? 0 : .23 }}>{syllable}</m.div>
            {stamp > 0 && !reduced && <m.i key={stamp} className={styles.ring} initial={{ scale: 1.12, opacity: .85 }} animate={{ scale: 1, opacity: 0 }} transition={{ duration: .62, ease: "easeOut" }} />}
            {flight && <m.span key={flight.id} className={styles.flight} style={{ left: flight.x, top: flight.y }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
              animate={{ x: [0, flight.dx * .55, flight.dx, flight.dx], y: [0, flight.dy * .48 - 55, flight.dy, flight.dy], scale: [1, 1.65, flight.scale, flight.scale * .94], opacity: [1, 1, 1, 0] }}
              transition={{ duration: .62, times: [0, .48, .85, 1], ease: ["easeOut", "easeIn", "easeOut"] }}
              onAnimationComplete={() => { if (flight.id === generation.current) setPlacing(null); }}>{flight.glyph}</m.span>}
          </div>
          <div className={styles.stageTools}>
            <AudioButton text={syllable} />
            <button type="button" aria-pressed={!closed} onClick={() => { interrupt(); setClosed(!closed); }}>По буквам</button>
          </div>
          <p className={styles.changed} role="status">
            Слог <b lang="ko">{syllable}</b>. {vowelNote} {initials[initial] === "ㅇ" && "Начальная ㅇ не звучит. "}
            {finals[final] === "ㅇ" ? "Конечная ㅇ звучит как носовое ng." : final ? `Патчим ${finals[final]} занимает нижнюю треть.` : "Патчима нет."}
          </p>
        </div>
        <div className={styles.console}>
          <div className={styles.tabs} role="group" aria-label="Клавиатура хангыля">{labels.map((label, row) => <button type="button" key={label} aria-pressed={tab === row} onClick={() => setTab(row)}>{label}</button>)}</div>
          {keyboards.map((keys, row) => <fieldset data-active={tab === row} className={styles.keys} key={labels[row]}><legend>{labels[row]}</legend>
            {keys.map((letter, index) => <button type="button" draggable={Boolean(letter)} lang={letter ? "ko" : undefined}
              aria-pressed={selected[row] === index} key={letter}
              onClick={(event) => { if (skipClick.current) { skipClick.current = false; return; } choose(row, index, event.currentTarget.getBoundingClientRect()); }}
              onDragStart={(event) => { dragKey.current = { row, index, origin: event.currentTarget.getBoundingClientRect() }; event.dataTransfer.setData("text/plain", letter); event.dataTransfer.effectAllowed = "copy"; }}
              onDragEnd={() => { dragKey.current = null; setDragOver(false); }}
              onPointerDown={(event) => {
                skipClick.current = false;
                if (event.pointerType !== "touch" || !letter) return;
                touchKey.current = { row, index, origin: event.currentTarget.getBoundingClientRect(), x: event.clientX, y: event.clientY };
              }}
              onPointerCancel={() => { touchKey.current = null; setDragOver(false); }}
              onPointerUp={(event) => {
                const key = touchKey.current;
                touchKey.current = null;
                const target = stage.current?.getBoundingClientRect();
                if (!key || !target || Math.hypot(event.clientX - key.x, event.clientY - key.y) < 20) return;
                if (event.clientX >= target.left && event.clientX <= target.right && event.clientY >= target.top && event.clientY <= target.bottom) {
                  skipClick.current = true;
                  choose(key.row, key.index, key.origin);
                }
              }}>{letter || "Без патчима"}</button>)}
          </fieldset>)}
          <h3>Собери целое слово</h3>
          <div className={styles.presets}>{wordPresets.map((item) => <button key={item.id} type="button" aria-pressed={word === item.word} onClick={() => buildWord(item.word)}><b lang="ko">{item.word}</b><small>{item.translation}</small></button>)}</div>
          <div className={styles.chain} aria-live="polite" lang="ko">{chain.map((letter, index) => <m.b layout="position" transition={spring} key={index} initial={reduced ? false : { y: 6 }} animate={{ y: 0 }}>{letter}</m.b>)}</div>
        </div>
      </div>
    </LayoutGroup></MotionScope>
  </section>;
}

function Landing({ glyph, animate }: { glyph: string; animate: boolean }) {
  return <m.span initial={animate ? { scale: .94 } : false} animate={{ scale: 1 }} transition={spring}>{glyph}</m.span>;
}
