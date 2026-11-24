"use client";

import { useState } from "react";

const actions = [
  { time: "09:00", korean: "한국어를 공부해요.", russian: "Я учу корейский язык." },
  { time: "13:00", korean: "김밥을 먹어요.", russian: "Я ем кимбап." },
  { time: "18:00", korean: "친구를 만나요.", russian: "Я встречаюсь с другом." },
  { time: "20:00", korean: "커피를 마셔요.", russian: "Я пью кофе." },
  { time: "21:00", korean: "책을 읽어요.", russian: "Я читаю книгу." },
  { time: "22:00", korean: "드라마를 봐요.", russian: "Я смотрю сериал." },
];
const test = [
  ["먹어요", ["ем", "иду", "учусь"], "ем"],
  ["한국어를 공부해요", ["Я учу корейский", "Я ем корейский", "Я пью кофе"], "Я учу корейский"],
  ["-아요/어요", ["вежливое настоящее", "прошедшее время", "будущее время"], "вежливое настоящее"],
] as const;

function speak(text: string) { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "ko-KR"; utterance.rate = .78; window.speechSynthesis.speak(utterance); } }

export function LessonFourClient({ lessonId }: { lessonId: string }) {
  const [chosen, setChosen] = useState(0);
  const [heard, setHeard] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState("Ответь на три вопроса.");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  async function finish() {
    if (Object.keys(answers).length < 3) return setStatus("Сначала ответь на все вопросы.");
    const score = test.filter((item, index) => answers[index] === item[2]).length;
    if (score < 2) return setStatus(`Верно: ${score} из 3. Повтори материал и попробуй ещё раз.`);
    setSaving(true);
    try { const response = await fetch("/api/progress/lesson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, score: Math.round(score / 3 * 100), xpReward: 25 }) }); if (!response.ok) throw new Error(); setStatus(`Верно: ${score} из 3.`); setComplete(true); } catch { setStatus("Тест пройден, но пока не получилось сохранить результат. Нажми ещё раз."); } finally { setSaving(false); }
  }

  const phrase = `저는 ${actions[chosen].korean}`;
  return <div className="learn-content">
    <article className="learn-card"><h2>1. Ритм дня</h2><p className="learn-lead">Слушай короткие действия и повторяй их. Спросить о планах можно так: 오늘 뭐 해요? («Что вы делаете сегодня?»)</p><div className="learn-dialogue">{actions.slice(0, 3).map(item => <div className="learn-line" key={item.time}><span>{item.time}</span><b>{item.korean}<small>{item.russian}</small></b><button aria-label="Слушать" onClick={() => speak(item.korean)}>🔊</button></div>)}</div></article>
    <article className="learn-card"><h2>2. Как говорить «делаю»</h2><p className="learn-lead">Глагол стоит в конце, как в казахском, и не меняется по лицам: 먹어요 — это и «ем», и «ест», и «едят».</p><div className="learn-grammar"><b>공부하다 → 공부해요<br />먹다 → 먹어요</b><p>Окончания <strong>-아요/어요</strong> делают фразу вежливой: <strong>공부해요</strong> — учусь, <strong>먹어요</strong> — ем, <strong>마셔요</strong> — пью. Последняя гласная основы ㅏ или ㅗ требует -아요: 만나다 → 만나요, 보다 → 봐요. Остальные берут -어요: 먹다 → 먹어요, 마시다 → 마셔요. Глаголы на 하다 дают 해요. Слушай, как звучит: 먹어요 [머거요], 읽어요 [일거요].</p></div></article>
    <article className="learn-card"><h2>3. Собери свой ритм</h2><p className="learn-lead">Выбери действие — появится твоя фраза. Частица 을/를 показывает, что именно ты ешь, пьёшь или учишь: 김밥을 (после согласной), 커피를 (после гласной). С 만나요 тоже нужно 를, хотя по‑русски «с другом», а по‑казахски «досыммен».</p><div className="learn-countries">{actions.map((item, index) => <button aria-pressed={chosen === index} className={chosen === index ? "selected" : ""} onClick={() => { setChosen(index); speak(`저는 ${item.korean}`); }} key={item.korean}><b>{item.korean}</b><span>{item.russian}</span></button>)}</div><div className="learn-passport"><i>오늘</i><div><small>MY K‑LAB DAY</small><b>{phrase}</b></div></div></article>
    <article className="learn-card"><h2>4. Аудирование</h2><p className="learn-lead">Нажми на звук и выбери, что делает собеседник.</p><div className="learn-listening"><div><b>Что делает собеседник?</b><section>{["Учится", "Пьёт кофе", "Ест кимбап"].map(option => <button aria-pressed={heard === option} className={heard === option ? (option === "Пьёт кофе" ? "correct" : "incorrect") : ""} onClick={() => setHeard(option)} key={option}>{option}</button>)}</section><p role="status">{heard ? heard === "Пьёт кофе" ? "Верно! 마셔요 — «пью»." : "Послушай ещё раз: последнее слово 마셔요." : ""}</p></div><button className="learn-audio" aria-label="Слушать" onClick={() => speak("저는 커피를 마셔요")}>🔊</button></div></article>
    <article className="learn-speak"><div><h2>5. Скажи о себе</h2><p>Потренируй фразу своего дня с Gemini в Speaking Lab.</p></div><a href={`https://k-lab-two.vercel.app/speaking.html?phrase=${encodeURIComponent(phrase)}&lesson=daily-routine`}>ПРАКТИКОВАТЬ ФРАЗУ →</a></article>
    <article className="learn-card"><h2>6. Mini test</h2><p className="learn-lead">Нужно 2 правильных ответа из 3, чтобы завершить урок.</p>{test.map(([question, choices], index) => <section className="learn-question" key={question}><b>{index + 1}. {question}</b><div>{choices.map(choice => <button aria-pressed={answers[index] === choice} className={answers[index] === choice ? "selected" : ""} onClick={() => setAnswers({ ...answers, [index]: choice })} key={choice}>{choice}</button>)}</div></section>)}<div className="learn-finish"><span role="status">{status}</span><button disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ УРОК"}</button></div><div className="learn-result" role="status">{complete && <p className="learn-done">Готово! <b>Lesson 04 завершён</b>. +25 XP сохранены.</p>}</div></article>
  </div>;
}
