"use client";

import { sayKorean as speak } from "@/lib/korean-voice";
import { useState } from "react";
import { Builder } from "@/app/components/motion-kit/builder";
import { MotionScope, Stamp } from "@/app/components/motion-kit/motion";
import { LessonDialogue } from "@/app/components/motion-kit/lesson-dialogue";
import { LessonPractice } from "@/app/components/motion-kit/lesson-practice";


const words = ["안녕하세요.", "저는", "알리나예요"];
const testQuestions = [
  { question: "Как по-корейски «Здравствуйте»?", answers: ["안녕하세요", "감사합니다", "미안합니다"], correct: "안녕하세요" },
  { question: "Что нужно вставить: 저는 알리나__?", answers: ["이에요", "예요", "해요"], correct: "예요" },
  { question: "Что означает 반갑습니다?", answers: ["Спасибо", "Приятно познакомиться", "До свидания"], correct: "Приятно познакомиться" },
];

export function LessonClient({ lessonId }: { lessonId: string }) {
  const [builder, setBuilder] = useState<number[]>([]);
  const [listeningAnswer, setListeningAnswer] = useState<string>();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState("Ответь на три вопроса.");
  const [complete, setComplete] = useState(false);
  const [saving, setSaving] = useState(false);
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
    <article className="learn-card"><h2>1. Мини‑диалог</h2><p className="learn-lead">Сначала слушай, затем прочитай вслух. Нажми на динамик у каждой реплики. Конечная согласная переходит к следующей гласной: 이름이 звучит [이르미]. А 반갑습니다 звучит [반갑씀니다].</p><LessonDialogue lines={[ ["민지", "안녕하세요?", "Здравствуйте!"], ["나", "안녕하세요.", "Здравствуйте."], ["민지", "저는 민지예요. 이름이 뭐예요?", "Я Минджи. Как вас зовут?"], ["나", "저는 알리나예요.", "Я Алина."], ["민지", "반갑습니다.", "Приятно познакомиться."], ["나", "네, 반갑습니다.", "Да, и мне приятно."] ]} /></article>
    <article className="learn-card"><h2>2. Слова в карман</h2><p className="learn-lead">Нажми на карточку, чтобы услышать слово.</p><div className="learn-words">{[["안녕하세요", "здравствуйте"], ["저는", "я (вежливо)"], ["이름", "имя"], ["반갑습니다", "приятно познакомиться"], ["학생", "студент / студентка"], ["카자흐스탄", "Казахстан"], ["감사합니다", "спасибо"], ["선생님", "учитель"], ["네", "да"]].map(([korean, russian]) => <button key={korean} onClick={() => speak(korean)}><b>{korean}</b><span>{russian}</span></button>)}</div></article>
    <article className="learn-card"><h2>3. Грамматика без страха</h2><p className="learn-lead">Связка «быть» пишется слитно со словом перед ней.</p><div className="learn-grammar"><b>이에요 / 예요</b><p>После согласной используй <strong>이에요</strong>: 학생이에요 — «я студент / студентка». После гласной — <strong>예요</strong>: 알리나예요 — «я Алина». Частица 는 в 저는 показывает, о ком идёт речь.</p></div><div className="learn-kz"><b>KZ NOTE</b><br />В русском «Я Алина» связку не слышно, а в корейском она нужна и стоит в конце: 저는 알리나예요. Похоже на казахское «Мен Алинамын»: показатель тоже в конце. Но -мын меняется по лицам, а 예요 не меняется.</div></article>
    <article className="learn-card"><h2>4. Собери фразу</h2><p className="learn-lead">Собери: «Здравствуйте. Я Алина». Нажимай на слова в правильном порядке.</p><Builder parts={words} built={builder} setBuilt={setBuilder}>{builderCorrect ? "Верно! 안녕하세요. 저는 알리나예요 — «Здравствуйте. Я Алина». Связка 예요 пишется слитно с именем." : "Подсказка: сначала приветствие, затем «я», затем имя вместе со связкой."}</Builder></article>
    <article className="learn-card"><h2>5. Аудирование</h2><p className="learn-lead">Нажми на кнопку и выбери фразу, которую слышишь.</p><div className="learn-listening"><div><b>Что сказал собеседник?</b><section>{["안녕하세요", "반갑습니다", "감사합니다"].map((answer) => <button aria-pressed={listeningAnswer === answer} className={listeningAnswer === answer ? (answer === "반갑습니다" ? "correct" : "incorrect") : ""} onClick={() => setListeningAnswer(answer)} key={answer}>{answer}</button>)}</section><p role="status">{listeningAnswer ? listeningAnswer === "반갑습니다" ? "Верно! Это «Приятно познакомиться». Звучит [반갑씀니다]." : "Послушай ещё раз: фраза начинается со слога 반." : ""}</p></div><button className="learn-audio" aria-label="Слушать" onClick={() => speak("반갑습니다")}>🔊</button></div></article>
    <article className="learn-speak"><div><h2>6. Скажи это вслух</h2><p>Перейди в Speaking Lab: Gemini даст AI‑отзыв по твоей записи.</p></div><a href="https://k-lab-two.vercel.app/speaking.html?phrase=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94&lesson=intro-greeting">ПРАКТИКОВАТЬ 안녕하세요 →</a></article>
    <LessonPractice number={7} examples={[["Я — Минджи.", "저는 민지예요."], ["Я — Джун.", "저는 준이에요."], ["Я учитель.", "저는 선생님이에요."], ["Да, я Алина.", "네, 알리나예요."]]} />
    <article className="learn-card"><h2>8. Mini test</h2><p className="learn-lead">Нужно 2 правильных ответа из 3, чтобы завершить урок.</p>{testQuestions.map((item, index) => <section className="learn-question" key={item.question}><b>{index + 1}. {item.question}</b><div>{item.answers.map((answer) => <button aria-pressed={answers[index] === answer} className={answers[index] === answer ? "selected" : ""} onClick={() => setAnswers({ ...answers, [index]: answer })} key={answer}>{answer}</button>)}</div></section>)}<div className="learn-finish"><span role="status">{status}</span><button disabled={saving} onClick={finishLesson}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ УРОК"}</button></div><div className="learn-result" role="status">{complete && <MotionScope><Stamp className="learn-done">Готово! <b>Lesson 01 завершён</b>. +25 XP сохранены. Вернись в «Мой ритм» — цифры обновятся.</Stamp></MotionScope>}</div></article>
  </div>;
}
