"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "motion/react";
import { AudioButton } from "./audio";
import { MotionScope, spring } from "./motion";
import styles from "./learning.module.css";

export type SwapChoice = { word: string; form: string; translation: string };

export function PracticeSwap({ choices, ending }: { choices: readonly SwapChoice[]; ending: string }) {
  const [selected, setSelected] = useState(0);
  const reduced = useReducedMotion();
  const choice = choices[selected];
  return <div className={styles.swap}>
    <p>Замени выделенное слово. Посмотри, что изменилось во фразе.</p>
    <MotionScope layout><LayoutGroup>
      <div className={styles.swapLine} lang="ko" aria-live="polite">
        <m.span layout="position" transition={spring}>저는</m.span>{" "}
        <AnimatePresence initial={false}>
          <m.mark key={choice.word} initial={reduced ? false : { y: 8, opacity: .7 }} animate={{ y: 0, opacity: 1 }} transition={spring}>
            {choice.form}
          </m.mark>
        </AnimatePresence>{" "}
        <m.span layout="position" transition={spring}>{ending}</m.span>
      </div>
      <p>{choice.translation}</p>
      <div className={styles.swapOptions}>{choices.map((item, index) => <button lang="ko" type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} key={item.word}>{item.word}</button>)}</div>
      <AudioButton text={`저는 ${choice.form} ${ending}`} />
    </LayoutGroup></MotionScope>
  </div>;
}
