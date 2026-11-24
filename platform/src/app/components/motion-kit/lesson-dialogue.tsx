"use client";

import { m, useReducedMotion } from "motion/react";
import { useDialoguePlayback } from "./dialogue-playback";
import { MotionScope, spring } from "./motion";
import styles from "./learning.module.css";

type DialogueLine = readonly [speaker: string, korean: string, russian: string];

export function LessonDialogue({ lines }: { lines: readonly DialogueLine[] }) {
  const { current, status, play, toggle } = useDialoguePlayback(lines.map((line) => line[1]));
  const reduced = useReducedMotion();
  const running = status === "playing" || status === "paused";
  return <div className={`learn-dialogue ${styles.lessonDialogue}`}>
    <button type="button" onClick={toggle}>{status === "playing" ? "Пауза" : status === "paused" ? "Продолжить диалог" : "Слушать диалог"}</button>
    <MotionScope>
      {lines.map(([speaker, korean, russian], index) => {
        const active = running && current === index;
        return <m.div className={`learn-line ${styles.lessonLine}`} key={korean} aria-current={active ? "step" : undefined} initial={false}
          animate={{ y: reduced ? 0 : active ? -4 : running ? 2 : 0, scale: reduced || !running || active ? 1 : .985 }}
          transition={spring}>
          <span>{speaker}</span><b lang="ko">{korean}<small lang="ru">{russian}</small></b>
          <button aria-label={`Слушать реплику ${index + 1}`} type="button" onClick={() => play(index, false)}>🔊</button>
        </m.div>;
      })}
    </MotionScope>
    {status === "error" && <p role="status">Корейская озвучка недоступна.</p>}
  </div>;
}
