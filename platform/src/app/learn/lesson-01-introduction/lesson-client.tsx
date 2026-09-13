"use client";

import { useState } from "react";

const words = ["저는", "알리나", "예요"];
const testQuestions = [
  { question: "Как по-корейски «Здравствуйте»?", answers: ["안녕하세요", "감사합니다", "미안합니다"], correct: "안녕하세요" },
  { question: "После имени Алина нужна форма…", answers: ["이에요", "예요", "입니다만"], correct: "예요" },
  { question: "Что означает 반갑습니다?", answers: ["Спасибо", "Приятно познакомиться", "До свидания"], correct: "Приятно познакомиться" },
];

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "ko-KR";
  voice.rate = 0.78;
  window.speechSynthesis.speak(voice);
}

export function LessonClient({ lessonId }: { lessonId: string }) {
  const [builder, setBuilder] = useState<number[]>([]);
  const [listeningAnswer, setListeningAnswer] = useState<string>();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState("Ответь на три вопроса.");
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);
  const sentence = builder.map((index) => words[index]).join(" ");
  const builderCorrect = builder.join(",") === "0,1,2";

  async function finishLesson() {
    if (Object.keys(answers).length < 3) return setStatus("Сначала ответь на все вопросы.");
    const correct = testQuestions.filter((item, index) => answers[index] === item.correct).length;
    if (correct < 2) return setStatus(`Верно: ${correct} из 3. Повтори материал и попробуй ещё раз.`);
    setSaving(true);
    try {
      const response = await fetch("/api/progress/lesson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, score: Math.round((correct / 3) * 100), xpReward: 25 }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setStatus(`Верно: ${correct} из 3.`);
      setComplete(true);
    } catch {
      setStatus("Тест пройден, но пока не получилось сохранить результат. Нажми ещё раз.");
    } finally {
      setSaving(false);
    }
  }

  return <div className="learn-content">
    <article className="learn-card"><h2>1. Мини‑диалог</h2><p className="learn-lead">Сначала слушай, затем прочитай вслух. Нажми на динамик у каждой реплики.</p><div className="learn-dialogue">
      {[ ["민지", "안녕하세요?", "Здравствуйте!"], ["너", "안녕하세요. 저는 알리나예요.", "Здравствуйте. Я Алина."], ["민지", "반갑습니다.", "Приятно познакомиться."] ].map(([speaker, korean, russian]) => <div className="learn-line" key={korean}><span>{speaker}</span><b>{korean}<small>{russian}</small></b><button onClick={() => speak(korean)}>🔊</button></div>)}
    </div></article>
    <article className="learn-card"><h2>2. Слова в карман</h2><p className="learn-lead">Нажми на карточку, чтобы услышать слово.</p><div className="learn-words">{[["안녕하세요", "здравствуйте"], ["저는", "я (вежливо)"], ["이름", "имя"], ["반갑습니다", "приятно познакомиться"], ["학생", "студент"], ["카자흐스탄", "Казахстан"]].map(([korean, russian]) => <button key={korean} onClick={() => speak(korean)}><b>{korean}</b><span>{russian}</span></button>)}</div></article>
    <article className="learn-card"><h2>3. Грамматика без страха</h2><p className="learn-lead">Слово‑связка «быть» приклеивается к существительному.</p><div className="learn-grammar"><b>이에요 / 예요</b><p>После согласной используй <strong>이에요</strong>: 학생이에요 — «я студент». После гласной — <strong>예요</strong>: 알리나예요 — «я Алина».</p></div><div className="learn-kz"><b>KZ NOTE</b><br />В корейском часто не нужно отдельно говорить «я есть». Достаточно: 저는 알리나예요. Буквально: «что касается меня — Алина».</div></article>
    <article className="learn-card"><h2>4. Собери фразу</h2><p className="learn-lead">Нажимай на слова в правильном порядке.</p><div className="learn-builder"><div>{sentence || "Твоя фраза появится здесь"}</div><section>{words.map((word, index) => <button className={builder.includes(index) ? "used" : ""} onClick={() => !builder.includes(index) && setBuilder([...builder, index])} key={word}>{word}</button>)}<button className="reset" onClick={() => setBuilder([])}>↺</button></section><p>{builderCorrect ? "Верно! 저는 알리나예요 — «Я Алина»." : "Подсказка: сначала «я», затем имя, затем связка."}</p></div></article>
    <article className="learn-card"><h2>5. Аудирование</h2><p className="learn-lead">Нажми на кнопку и выбери фразу, которую услышала.</p><div className="learn-listening"><div><b>Что сказал собеседник?</b><section>{["안녕하세요", "반갑습니다", "감사합니다"].map((answer) => <button className={listeningAnswer === answer ? "selected" : ""} onClick={() => setListeningAnswer(answer)} key={answer}>{answer}</button>)}</section><p>{listeningAnswer ? listeningAnswer === "반갑습니다" ? "Верно! Это «Приятно познакомиться»." : "Послушай ещё раз: в этой фразе слышно 반갑습니다." : ""}</p></div><button className="learn-audio" onClick={() => speak("반갑습니다")}>🔊</button></div></article>
    <article className="learn-speak"><div><h2>6. Скажи это сама</h2><p>Перейди в Speaking Lab: Gemini даст AI‑отзыв по твоей записи.</p></div><a href="https://k-lab-two.vercel.app/speaking.html?phrase=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94&lesson=intro-greeting">ПРАКТИКОВАТЬ 안녕하세요 →</a></article>
    <article className="learn-card"><h2>7. Mini test</h2><p className="learn-lead">Нужно 2 правильных ответа из 3, чтобы завершить урок.</p>{testQuestions.map((item, index) => <section className="learn-question" key={item.question}><b>{index + 1}. {item.question}</b><div>{item.answers.map((answer) => <button className={answers[index] === answer ? "selected" : ""} onClick={() => setAnswers({ ...answers, [index]: answer })} key={answer}>{answer}</button>)}</div></section>)}<div className="learn-finish"><span>{status}</span><button disabled={saving} onClick={finishLesson}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ УРОК"}</button></div>{complete && <p className="learn-done">Готово! <b>Lesson 01 завершён</b>. +25 XP сохранены. Вернись в «Мой ритм» — цифры обновятся.</p>}</article>
  </div>;
}
