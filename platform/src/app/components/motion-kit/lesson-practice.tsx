import { AudioButton } from "./audio";
import type { ReactNode } from "react";
import styles from "./learning.module.css";

export function LessonPractice({ number, examples, children }: {
  number: number;
  examples: readonly (readonly [russian: string, korean: string])[];
  children?: ReactNode;
}) {
  return <article className="learn-card">
    <h2>{number}. Скажи по-другому</h2>
    <p className="learn-lead">Скажи фразу по-корейски, затем открой пример и послушай.</p>
    <div className={styles.practice}>{examples.map(([russian, korean]) => <details key={korean}>
      <summary>{russian}</summary><p><b lang="ko">{korean}</b></p><AudioButton text={korean} />
    </details>)}</div>
    {children}
  </article>;
}
