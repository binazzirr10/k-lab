import type { Metadata } from "next";
import { Reference } from "@/app/components/motion-kit/reference";
import { AudioButton } from "@/app/components/motion-kit/audio";
import styles from "@/app/components/motion-kit/reference.module.css";
import { finalSounds, letters, liaison, readingLevels, readingWords } from "@/lib/content/hangul";
import { strokes } from "@/lib/content/strokes";
import { StrokeOrder } from "./stroke-order";
import { Assembler } from "./assembler";

export const metadata: Metadata = {
  title: "Хангыль: корейский алфавит и чтение | K‑Lab",
  description: "Выучи 40 букв и сочетаний хангыля, собери корейский слог и потренируй чтение с озвучкой.",
};

export default function HangulPage() {
  return <Reference active="hangul" title="Хангыль" description="Корейские буквы складываются в слоговые блоки. Собери свой блок, послушай его и попробуй прочитать слова.">
    <Assembler />
    {["14 основных согласных", "5 удвоенных согласных", "10 основных гласных", "11 составных гласных"].map((heading, index) => <section className={styles.panel} key={heading}>
      <h2>{heading}</h2>
      {index === 0 && <p>Русские подсказки приблизительные. Для записи латиницей используется Revised Romanization. У гласных название записано нейтральным слогом с ㅇ.</p>}
      {index === 3 && <p>«Составные» здесь означает, что знак складывается из более простых букв. Некоторые из них, например ㅐ и ㅔ, обычно звучат как один гласный звук.</p>}
      <div className={styles.grid}>{letters.filter((letter) => letter.group === index).map((letter) => <article className={styles.card} key={letter.id}>
        <h3 lang="ko">{letter.symbol} · {letter.name}</h3><p className={styles.meta}>{letter.romanization}</p><p>{letter.hint}</p>
        {strokes[letter.symbol] && <StrokeOrder letter={letter.symbol} paths={strokes[letter.symbol]} />}
        <p><b lang="ko">{letter.word}</b> — {letter.translation}</p><AudioButton text={letter.word} />
      </article>)}</div>
    </section>)}
    <section className={styles.panel}><h2>Патчим и семь конечных звуков</h2>
      <p>Патчим (받침) — нижняя согласная или пара согласных в слоге. Перед паузой различаются только семь конечных звуков. В конце к, т и п останови воздух и не добавляй гласную. Ниже показаны одиночные согласные. Пары подчиняются отдельным правилам.</p>
      <ul>{finalSounds.map((item) => <li key={item.id}><b>{item.sound}</b> · <span lang="ko">{item.letters} → {item.word} [{item.pronunciation}]</span> <AudioButton text={item.word} /></li>)}</ul>
    </section>
    <section className={styles.panel}><h2>Как слоги связываются</h2>
      <p>Перед окончанием или частицей, которые начинаются с гласной, конечная согласная часто звучит в начале следующего слога. Письмо сохраняется. Конечная ㅇ остаётся носовой. С ㅎ и парами согласных действуют отдельные правила.</p>
      <ul>{liaison.map((item) => <li key={item.id}><b lang="ko">{item.word} [{item.pronunciation}]</b> — {item.translation} <AudioButton text={item.word} /></li>)}</ul>
    </section>
    <section className={styles.panel}><h2>Тренажёр чтения</h2><p>Прочитай слово вслух, раскрой перевод и сравни своё произношение с озвучкой.</p>
      {readingLevels.map((level, index) => <section key={level}>
        <h3>{level}</h3>
        <div className={styles.grid}>{readingWords.filter((item) => item.level === index).map((item) => <details className={styles.card} key={item.id}><summary lang="ko">{item.word}</summary><p>{item.translation}</p><AudioButton text={item.word} /></details>)}</div>
      </section>)}
    </section>
  </Reference>;
}
