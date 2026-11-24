"use client";

import { useState } from "react";

const objects = [
  { icon: "📘", korean: "책", russian: "книга" },
  { icon: "🖊", korean: "펜", russian: "ручка" },
  { icon: "👜", korean: "가방", russian: "сумка" },
  { icon: "📱", korean: "휴대폰", russian: "телефон" },
  { icon: "✏️", korean: "연필", russian: "карандаш" },
  { icon: "💧", korean: "물", russian: "вода" },
  { icon: "👓", korean: "안경", russian: "очки" },
  { icon: "📷", korean: "사진", russian: "фотография" },
];
const test = [
  ["Что означает 이것?", ["Это рядом со мной", "Это далеко", "Спасибо"], "Это рядом со мной"],
  ["Как сказать «Это сумка»?", ["이것은 가방이에요", "저는 가방이에요", "가방 아니에요"], "이것은 가방이에요"],
  ["Что означает 저것?", ["Это рядом", "То далеко", "Ручка"], "То далеко"],
] as const;

function speak(text: string) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ko-KR";
  utterance.rate = 0.78;
  window.speechSynthesis.speak(utterance);
}

export function LessonThreeClient({ lessonId }: { lessonId: string }) {
  const [objectIndex, setObjectIndex] = useState(0);
  const [built, setBuilt] = useState<number[]>([]);
  const [heard, setHeard] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [status, setStatus] = useState("Ответь на три вопроса.");
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);
  const current = objects[objectIndex];
  const phrase = `이것은 ${current.korean}이에요`;
  const parts = ["이것은", "책이에요"];

  async function finish() {
    if (Object.keys(answers).length < 3) return setStatus("Сначала ответь на все вопросы.");
    const score = test.filter((item, index) => answers[index] === item[2]).length;
    if (score < 2) return setStatus(`Верно: ${score} из 3. Повтори материал и попробуй ещё раз.`);
    setSaving(true);
    try {
      const response = await fetch("/api/progress/lesson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, score: Math.round(score / 3 * 100), xpReward: 25 }) });
      if (!response.ok) throw new Error("save failed");
      setStatus(`Верно: ${score} из 3.`);
      setComplete(true);
    } catch {
      setStatus("Тест пройден, но пока не получилось сохранить результат. Нажми ещё раз.");
    } finally { setSaving(false); }
  }

  return <div className="learn-content">
    <article className="learn-card"><h2>1. Интерактивный стол</h2><p className="learn-lead">Выбери предмет, послушай фразу и запомни его название. Согласная переходит к гласной: 책이에요 [채기에요], 이것은 [이거슨]. А в 가방이에요 звук ㅇ [ng] остаётся на месте.</p><div className="learn-words">{objects.map((item, index) => <button key={item.korean} aria-pressed={objectIndex === index} className={objectIndex === index ? "selected" : ""} onClick={() => { setObjectIndex(index); speak(`이것은 ${item.korean}이에요`); }}><b>{item.icon} {item.korean}</b><span>{item.russian}</span></button>)}</div><div className="learn-kz"><b>ТВОЯ ФРАЗА</b><br /><strong>{phrase}.</strong> — Это {current.russian}. <button className="inline-audio" onClick={() => speak(phrase)}>🔊 Слушать</button></div></article>
    <article className="learn-card"><h2>2. Указательные слова</h2><p className="learn-lead">Важно, где находится предмет. Чтобы спросить «Что это?», скажи 이것은 뭐예요?</p><div className="learn-grammar"><b>이것<br />그것<br />저것</b><p><strong>이것</strong> — это рядом со мной.<br /><strong>그것</strong> — то рядом с собеседником или то, о чём уже говорили.<br /><strong>저것</strong> — вон то далеко от нас обоих. Похоже на казахские «мынау» (рядом) и «анау» (вон там). После согласной ставь 이에요: 책이에요. После гласной 예요: 커피예요.</p></div></article>
    <article className="learn-card"><h2>3. Собери фразу</h2><p className="learn-lead">Собери: «Это книга». Тема после согласной получает 은 (이것은), после гласной 는 (저는).</p><div className="learn-builder"><div>{built.length ? built.map(index => <span className="learn-builder-piece" key={index}>{parts[index]}</span>) : "Твоя фраза появится здесь"}</div><section>{parts.map((part, index) => <button aria-disabled={built.includes(index)} className={built.includes(index) ? "used" : ""} onClick={() => !built.includes(index) && setBuilt([...built, index])} key={part}>{part}</button>)}<button className="reset" aria-label="Сбросить фразу" onClick={() => setBuilt([])}>↺</button></section><p role="status">{built.join(",") === "0,1" ? "Верно! 이것은 책이에요. Читается [이거슨 채기에요]." : "Подсказка: сначала «это», затем предмет вместе со связкой."}</p></div></article>
    <article className="learn-card"><h2>4. Аудирование</h2><p className="learn-lead">Нажми на звук и выбери предмет, который слышишь.</p><div className="learn-listening"><div><b>Что назвал собеседник?</b><section>{["Книга", "Сумка", "Телефон"].map(option => <button aria-pressed={heard === option} className={heard === option ? (option === "Сумка" ? "correct" : "incorrect") : ""} onClick={() => setHeard(option)} key={option}>{option}</button>)}</section><p role="status">{heard ? heard === "Сумка" ? "Верно! 가방 — это сумка." : "Послушай ещё раз: слово начинается со слога 가." : ""}</p></div><button className="learn-audio" aria-label="Слушать" onClick={() => speak("이것은 가방이에요")}>🔊</button></div></article>
    <article className="learn-speak"><div><h2>5. Скажи вслух</h2><p>Выбери предмет, затем потренируй его в Speaking Lab.</p></div><a href={`https://k-lab-two.vercel.app/speaking.html?phrase=${encodeURIComponent(phrase)}&lesson=objects-${current.korean}`}>ПРАКТИКОВАТЬ ФРАЗУ →</a></article>
    <article className="learn-card"><h2>6. Mini test</h2><p className="learn-lead">Нужно 2 правильных ответа из 3, чтобы завершить урок.</p>{test.map(([question, choices], index) => <section className="learn-question" key={question}><b>{index + 1}. {question}</b><div>{choices.map(choice => <button aria-pressed={answers[index] === choice} className={answers[index] === choice ? "selected" : ""} onClick={() => setAnswers({ ...answers, [index]: choice })} key={choice}>{choice}</button>)}</div></section>)}<div className="learn-finish"><span role="status">{status}</span><button disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ УРОК"}</button></div><div className="learn-result" role="status">{complete && <p className="learn-done">Готово! <b>Lesson 03 завершён</b>. +25 XP сохранены.</p>}</div></article>
  </div>;
}
