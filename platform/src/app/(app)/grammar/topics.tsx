"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, LayoutGroup, m, useReducedMotion } from "motion/react";
import { AudioButton } from "@/app/components/motion-kit/audio";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import ui from "@/app/components/motion-kit/reference.module.css";
import { topics, type Topic } from "@/lib/content/grammar";
import styles from "./topics.module.css";

export function GrammarTopics() {
  const [active, setActive] = useState(topics[0].id);
  useEffect(() => {
    const sections = topics.map(({ id }) => document.getElementById(id)).filter((section) => section !== null);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (current) setActive(current.target.id);
    }, { rootMargin: "-8% 0px -64% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <section className={styles.reference}>
    <nav className={styles.index} aria-label="Темы грамматики">
      <h2>Правила с примерами</h2>
      <MotionScope layout><LayoutGroup>
        {topics.map((topic) => <a href={`#${topic.id}`} key={topic.id} aria-current={active === topic.id ? "location" : undefined} onClick={() => setActive(topic.id)}>
          {active === topic.id && <m.i aria-hidden="true" className={styles.marker} layoutId="grammar-index-marker" transition={spring} />}
          <span>{topic.title}</span>
        </a>)}
      </LayoutGroup></MotionScope>
    </nav>
    <div className={styles.chapters}>{topics.map((topic) => <TopicChapter topic={topic} key={topic.id} />)}</div>
  </section>;
}

function TopicChapter({ topic }: { topic: Topic }) {
  const [example, setExample] = useState(0);
  const reduced = useReducedMotion();
  const group = useId();
  const [korean, russian] = topic.examples[example];
  return <article className={styles.chapter} id={topic.id}>
    <h2>{topic.title}</h2><p>{topic.rule}</p>
    <div className={styles.example} role="status">
      <MotionScope><AnimatePresence initial={false}><m.div key={example}
        initial={reduced ? false : { x: 10, opacity: .7 }} animate={{ x: 0, opacity: 1 }} transition={spring}>
        <b lang="ko">{korean}</b><p>{russian}</p><AudioButton text={korean} />
      </m.div></AnimatePresence></MotionScope>
    </div>
    <fieldset className={styles.examples}><legend>Примеры</legend>
      {topic.examples.map(([line], index) => <label key={line} data-active={example === index}>
        <input type="radio" name={group} checked={example === index} onChange={() => setExample(index)} /><span lang="ko">{line}</span>
      </label>)}
    </fieldset>
    <details><summary>Все переводы</summary><ul>{topic.examples.map(([line, translation]) => <li key={line}><b lang="ko">{line}</b> — {translation}</li>)}</ul></details>
    <p><strong>На что обратить внимание.</strong> {topic.mistake}</p>
    {topic.kazakh && <p className={ui.meta}><strong>Сравни с казахским.</strong> {topic.kazakh}</p>}
  </article>;
}
