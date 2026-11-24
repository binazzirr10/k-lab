"use client";

import { useState } from "react";
import { AnimatePresence, m, useMotionValue, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "motion/react";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import { AudioButton } from "@/app/components/motion-kit/audio";
import styles from "@/app/components/motion-kit/reference.module.css";
import { finals } from "@/lib/content/syllables";
import { lastSyllable, orderSentences, particlePairs } from "@/lib/content/grammar";
import practice from "./practice.module.css";

export function WordOrder() {
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState(0);
  const [landed, setLanded] = useState(false);
  const [visibleKorean, setVisibleKorean] = useState(false);
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const lane = useSpring(progress, { stiffness: 115, damping: 22 });
  useMotionValueEvent(lane, "change", (position) => {
    setVisibleKorean(position >= .5);
    if (value === 100 && position > .985) setLanded(true);
  });
  const actionX = useTransform(lane, (p) => `${p * 100}%`);
  const objectX = useTransform(lane, (p) => `${-p * 100}%`);
  const actionY = useTransform(lane, (p) => reduced ? 0 : -Math.sin(Math.PI * p) * 57);
  const objectY = useTransform(lane, (p) => reduced ? 0 : Math.sin(Math.PI * p) * 42);
  const sentence = orderSentences[index];
  const fullSentence = `저는 ${sentence.noun}${sentence.particle} ${sentence.verb}.`;

  function move(next: number, scrub = false) {
    setValue(next);
    setLanded(next === 100 && (scrub || Boolean(reduced)));
    progress.set(next / 100);
    if (scrub || reduced) { lane.jump(next / 100); setVisibleKorean(next >= 50); }
  }

  return <section className={`${styles.panel} ${practice.hero}`}>
    <h2>Поставь действие в конец</h2>
    <p>Выбери фразу. Переведи её одним нажатием или двигай ползунок, чтобы рассмотреть перестановку.</p>
    <div className={styles.controls} role="group" aria-label="Предложения">{orderSentences.map((item, position) => <button type="button" key={item.id} aria-pressed={index === position} onClick={() => setIndex(position)}>{item.russian}</button>)}</div>
    <MotionScope>
      <div className={practice.lane} aria-hidden="true">
        <div className={practice.base}><div className={practice.tile}><small>Тема</small><b lang={visibleKorean ? "ko" : "ru"}>{visibleKorean ? "저" : "Я"}</b>{visibleKorean && <Suffix text="는" show={landed} />}</div></div>
        <m.div className={`${practice.base} ${practice.action}`} style={{ x: actionX, y: actionY }}><div className={practice.tile}><small>Действие</small><b lang={visibleKorean ? "ko" : "ru"}>{visibleKorean ? sentence.verb : sentence.action}</b></div></m.div>
        <m.div className={`${practice.base} ${practice.object}`} style={{ x: objectX, y: objectY }}><div className={practice.tile}><small>Объект</small><b lang={visibleKorean ? "ko" : "ru"}>{visibleKorean ? sentence.noun : sentence.object}</b>{visibleKorean && <Suffix text={sentence.particle} show={landed} />}</div></m.div>

      </div>
    </MotionScope>
    <div className={practice.scrub}>
      <button type="button" aria-pressed={value === 0} onClick={() => move(0)}>Русский</button>
      <label><span>Порядок слов</span><input type="range" min={0} max={100} value={value} aria-valuetext={value === 0 ? "Русский порядок" : value === 100 ? "Корейский порядок" : `${value}%`} onChange={(event) => move(Number(event.target.value), true)} /></label>
      <button type="button" aria-pressed={value === 100} onClick={() => move(100)}>Корейский</button>
    </div>
    <p className={practice.summary} role="status"><span lang={visibleKorean ? "ko" : "ru"}>{visibleKorean ? fullSentence : `${sentence.russian}.`}</span></p>
    <AudioButton text={fullSentence} />
  </section>;
}

function Suffix({ text, show }: { text: string; show: boolean }) {
  const reduced = useReducedMotion();
  return <AnimatePresence>{show && <m.span className={practice.suffix} initial={reduced ? false : { x: 18, opacity: .65 }} animate={{ x: 0, opacity: 1 }} transition={spring}>{text}</m.span>}</AnimatePresence>;
}

export function ParticleMachine() {
  const [noun, setNoun] = useState("책");
  const ending = lastSyllable(noun);
  const reduced = useReducedMotion();
  return <section className={styles.panel}>
    <h2>Какую форму выбрать?</h2><p>Последний слог определяет форму во всех четырёх парах.</p>
    <div className={styles.controls}>
      <label>Существительное<input lang="ko" value={noun} maxLength={48} onChange={(event) => setNoun(event.target.value)} /></label>
      {["책", "커피", "물", "가방", "알리나"].map((item) => <button type="button" lang="ko" aria-pressed={noun === item} key={item} onClick={() => setNoun(item)}>{item}</button>)}
    </div>
    <MotionScope layout><div aria-live="polite" className={practice.output}>{ending ? <>
      <AnimatePresence initial={false}><m.div className={practice.assembled} lang="ko" key={noun} initial={reduced ? false : { y: 7 }} animate={{ y: 0 }} transition={spring}>
        {ending.stem}<m.mark className={practice.last} initial={reduced ? false : { x: -10 }} animate={{ x: 0 }} transition={spring}>
          {ending.last}<small>{ending.batchim ? finals[ending.batchim] : "∅"}</small>
        </m.mark>
      </m.div></AnimatePresence>
      <p>{ending.batchim ? `В слоге ${ending.last} есть патчим ${finals[ending.batchim]}.` : `Слог ${ending.last} заканчивается на гласную.`}</p>
      <div className={practice.pairs}>{particlePairs.map((pair) => {
        const chosen = ending.batchim ? pair.consonant : pair.vowel;
        return <div className={practice.pair} key={pair.id}>
          <h3>{pair.label}</h3>
          <div className={practice.candidates}>{[pair.consonant, pair.vowel].map((candidate) => <m.span key={candidate} lang="ko"
            initial={false} animate={{ y: reduced ? 0 : candidate === chosen ? -3 : 4, opacity: candidate === chosen ? 1 : .72 }}
            transition={spring} data-chosen={candidate === chosen}>{candidate}</m.span>)}</div>
          <p className={practice.joined} lang="ko">{ending.stem}<b>{ending.last}</b><AnimatePresence initial={false}>
            <m.strong key={`${ending.last}-${chosen}`} initial={reduced ? false : { x: 14, opacity: .68 }} animate={{ x: 0, opacity: 1 }} transition={spring}>{chosen}</m.strong>
          </AnimatePresence></p>
        </div>;
      })}</div>
    </> : <p>Введи слово, которое заканчивается слогом хангыля, или выбери пример.</p>}</div></MotionScope>
  </section>;
}
