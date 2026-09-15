"use client";
import { useState } from "react";

type Question = { q: string; options: string[]; correct: string };
const words: Question[] = [
  { q: "안녕하세요", options: ["Здравствуйте", "Спасибо", "До свидания"], correct: "Здравствуйте" },
  { q: "이름", options: ["Имя", "Страна", "Книга"], correct: "Имя" },
  { q: "나라", options: ["Страна", "Друг", "Кофе"], correct: "Страна" },
  { q: "가방", options: ["Сумка", "Ручка", "Школа"], correct: "Сумка" },
];
const grammar: Question[] = [
  { q: "아니에요", options: ["Нет / не являюсь", "Да, являюсь", "Спасибо"], correct: "Нет / не являюсь" },
  { q: "Что значит 이것?", options: ["Это рядом со мной", "То далеко", "Где?"], correct: "Это рядом со мной" },
  { q: "Как сказать «Я из Казахстана»?", options: ["저는 카자흐스탄 사람이에요", "저는 카자흐스탄 아니에요", "카자흐스탄 이름이에요"], correct: "저는 카자흐스탄 사람이에요" },
  { q: "Какое окончание делает фразу вежливой в настоящем времени?", options: ["-아요/어요", "-입니다", "-고"], correct: "-아요/어요" },
  { q: "먹어요", options: ["ем", "учусь", "встречаю"], correct: "ем" },
  { q: "저것", options: ["Вон то далеко", "Это рядом", "Я"], correct: "Вон то далеко" },
  { q: "Как сказать «Это книга»?", options: ["이것은 책이에요", "저는 책이에요", "책 아니에요"], correct: "이것은 책이에요" },
  { q: "친구를 만나요", options: ["Встречаю друга", "Пью кофе", "Учу корейский"], correct: "Встречаю друга" },
];
const phrases: Question[] = [
  { q: "Выбери правильный порядок: «Меня зовут Алина»", options: ["저는 알리나예요", "알리나 저는 예요", "예요 저는 알리나"], correct: "저는 알리나예요" },
  { q: "Выбери фразу: «Вы из какой страны?»", options: ["어느 나라 사람이에요?", "이름이 뭐예요?", "이것은 뭐예요?"], correct: "어느 나라 사람이에요?" },
  { q: "Выбери фразу: «Это сумка»", options: ["이것은 가방이에요", "가방을 먹어요", "저는 가방이에요"], correct: "이것은 가방이에요" },
  { q: "Выбери фразу: «Я пью кофе»", options: ["저는 커피를 마셔요", "저는 커피예요", "커피를 만나요"], correct: "저는 커피를 마셔요" },
  { q: "Выбери ответ на «한국 사람이에요?»", options: ["아니에요", "책이에요", "이름이에요"], correct: "아니에요" },
  { q: "Выбери фразу: «Я учу корейский»", options: ["한국어를 공부해요", "한국어를 먹어요", "한국어 사람이에요"], correct: "한국어를 공부해요" },
  { q: "Выбери фразу: «Как вас зовут?»", options: ["이름이 뭐예요?", "어느 나라예요?", "오늘 뭐 해요?"], correct: "이름이 뭐예요?" },
];
const listening: Question[] = [
  { q: "저는 카자흐스탄 사람이에요.", options: ["Я из Казахстана", "Я учу Казахстан", "Это Казахстан"], correct: "Я из Казахстана" },
  { q: "이것은 가방이에요.", options: ["Это сумка", "Это книга", "Я с сумкой"], correct: "Это сумка" },
  { q: "저는 커피를 마셔요.", options: ["Я пью кофе", "Я ем кофе", "Я покупаю кофе"], correct: "Я пью кофе" },
  { q: "친구를 만나요.", options: ["Встречаю друга", "Зову друга", "Друг учится"], correct: "Встречаю друга" },
];
function say(text: string) { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = "ko-KR"; utterance.rate = .78; window.speechSynthesis.speak(utterance); } }
function QuestionGroup({ title, points, items, answers, setAnswers, audible = false }: { title: string; points: string; items: Question[]; answers: Record<string, string>; setAnswers: (id: string, value: string) => void; audible?: boolean }) { return <article className="learn-card"><h2>{title} · {points}</h2><p className="learn-lead">{items.length} вопрос{items.length === 1 ? "" : "а"} × 2 балла.</p>{items.map((item, index) => { const id = `${title}-${index}`; return <section className="learn-question" key={id}><b>{index + 1}. {item.q}</b>{audible && <button className="inline-audio" onClick={() => say(item.q)}>🔊 слушать</button>}<div>{item.options.map(option => <button className={answers[id] === option ? "selected" : ""} onClick={() => setAnswers(id, option)} key={option}>{option}</button>)}</div></section>; })}</article>; }
export function CheckpointClient({ lessonId }: { lessonId: string }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mission, setMission] = useState([false, false]);
  const [status, setStatus] = useState("Ответь на вопросы и отметь две голосовые миссии.");
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const all = [["Слова", words], ["Грамматика", grammar], ["Собери фразу", phrases], ["Аудирование", listening]] as const;
  async function finish() { const answersCount = Object.keys(answers).length; if (answersCount < 23 || mission.some(value => !value)) return setStatus(`Пока заполнено ${answersCount} из 23 вопросов. Нужны ещё две голосовые миссии.`); const correct = all.reduce((sum, [title, items]) => sum + items.filter((item, index) => answers[`${title}-${index}`] === item.correct).length, 0); const score = correct * 2 + mission.filter(Boolean).length * 2; setResult(score); setStatus(score >= 35 ? `Пройдено: ${score} из 50.` : `Пока ${score} из 50. Для прохождения нужно 35.`); if (score < 35) return; setSaving(true); try { const response = await fetch("/api/progress/lesson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lessonId, score: Math.round(score / 50 * 100), xpReward: 50 }) }); if (!response.ok) throw new Error(); } catch { setStatus("Результат посчитан, но пока не получилось сохранить его. Нажми ещё раз."); } finally { setSaving(false); } }
  return <div className="learn-content"><article className="learn-card"><h2>Что проверяем</h2><p className="learn-lead">Слова, грамматику, семь фраз, аудирование и две голосовые миссии. Проходной балл — 35 из 50.</p></article><QuestionGroup title="Слова" points="8 баллов" items={words} answers={answers} setAnswers={(id, value) => setAnswers({ ...answers, [id]: value })} /><QuestionGroup title="Грамматика" points="16 баллов" items={grammar} answers={answers} setAnswers={(id, value) => setAnswers({ ...answers, [id]: value })} /><QuestionGroup title="Собери фразу" points="14 баллов" items={phrases} answers={answers} setAnswers={(id, value) => setAnswers({ ...answers, [id]: value })} /><QuestionGroup title="Аудирование" points="8 баллов" items={listening} answers={answers} setAnswers={(id, value) => setAnswers({ ...answers, [id]: value })} audible /><article className="learn-card"><h2>Speaking Mission · 4 балла</h2><p className="learn-lead">Открой две фразы в Speaking Lab, скажи их и отметь выполненные миссии.</p><div className="learn-question"><a className="learn-mini-link" href="https://k-lab-two.vercel.app/speaking.html?phrase=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94&lesson=checkpoint-intro">1 · 안녕하세요 →</a><label><input type="checkbox" checked={mission[0]} onChange={() => setMission([!mission[0], mission[1]])} /> Первая фраза записана</label></div><div className="learn-question"><a className="learn-mini-link" href="https://k-lab-two.vercel.app/speaking.html?phrase=%EC%A0%80%EB%8A%94%20%EC%B9%B4%EC%9E%90%ED%9D%90%EC%8A%A4%ED%83%84%20%EC%82%AC%EB%9E%8C%EC%9D%B4%EC%97%90%EC%9A%94&lesson=checkpoint-country">2 · Страна →</a><label><input type="checkbox" checked={mission[1]} onChange={() => setMission([mission[0], !mission[1]])} /> Вторая фраза записана</label></div><div className="learn-finish"><span>{status}</span><button disabled={saving} onClick={finish}>{saving ? "СОХРАНЯЕМ…" : "ЗАВЕРШИТЬ CHECKPOINT"}</button></div>{result !== null && <p className="learn-done">{result >= 35 ? <>Готово! Раздел 01 пройден. <b>+50 XP сохранены.</b></> : <>Результат: <b>{result} из 50.</b> Повтори сложные части и попробуй снова.</>}</p>}</article></div>;
}
