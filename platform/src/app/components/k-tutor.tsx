"use client";

import { FormEvent, useState } from "react";

type Message = { role: "tutor" | "user"; text: string };

const tutorCss = `.k-tutor{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Arial,sans-serif}.k-tutor-launch{display:flex;align-items:center;gap:9px;padding:12px 15px;border:1px solid #15251e;border-radius:999px;background:#dcbf6b;box-shadow:4px 4px #15251e;color:#15251e;font:700 11px Arial;letter-spacing:.06em}.k-tutor-launch i{width:8px;height:8px;border-radius:50%;background:#b52432}.k-tutor-panel{position:absolute;right:0;bottom:64px;width:min(355px,calc(100vw - 34px));overflow:hidden;border:1px solid #15251e;background:#fffdf8;box-shadow:7px 7px #15251e;color:#15251e}.k-tutor-panel header{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;background:#15251e;color:#fffdf8}.k-tutor-panel header b{display:block;font:500 21px Georgia,serif}.k-tutor-panel header span{display:block;margin-top:3px;color:#c4cec6;font-size:9px;font-weight:700;letter-spacing:.09em}.k-tutor-panel header button{border:0;background:transparent;color:#fffdf8;font-size:20px}.k-tutor-context{margin:0;padding:10px 14px;background:#e9efe5;color:#536158;font-size:10px}.k-tutor-messages{display:grid;gap:9px;min-height:160px;max-height:310px;overflow:auto;padding:14px}.k-tutor-messages p{max-width:92%;margin:0;padding:10px 11px;background:#edf1ed;color:#25342d;font-size:12px;line-height:1.52;white-space:pre-wrap}.k-tutor-messages .user{justify-self:end;background:#dcbf6b}.k-tutor-messages .thinking{color:#637169;font-style:italic}.k-tutor-panel form{display:flex;gap:7px;padding:12px;border-top:1px solid #15251e2e}.k-tutor-panel input{min-width:0;flex:1;padding:10px;border:1px solid #15251e;background:#fffdf8;color:#15251e;font:12px Arial}.k-tutor-panel form button{padding:10px 12px;border:1px solid #15251e;background:#15251e;color:#fffdf8;font:700 10px Arial;letter-spacing:.07em}`;

export function KTutor({ lessonContext }: { lessonContext: string }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "tutor", text: "Привет! Я K‑Tutor. Помогу с корейским, уроком и фразами — спроси коротко и конкретно." },
  ]);

  async function askTutor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = question.trim();
    if (!message || loading) return;

    setQuestion("");
    setMessages((current) => [...current, { role: "user", text: message }]);
    setLoading(true);
    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, lessonContext }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Ошибка ответа");
      setMessages((current) => [...current, { role: "tutor", text: data.answer }]);
    } catch {
      setMessages((current) => [...current, { role: "tutor", text: "Сейчас не получилось получить ответ. Попробуй ещё раз через несколько секунд." }]);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <style>{tutorCss}</style>
    <aside className="k-tutor" aria-label="Чат с K-Tutor">
      {open && <section className="k-tutor-panel">
        <header><div><b>K‑Tutor</b><span>AI‑НАСТАВНИК K‑LAB</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Закрыть чат">×</button></header>
        <p className="k-tutor-context">ТЕКУЩИЙ РАЗДЕЛ · МОЙ РИТМ</p>
        <div className="k-tutor-messages" aria-live="polite">
          {messages.map((item, index) => <p className={item.role} key={`${item.role}-${index}`}>{item.text}</p>)}
          {loading && <p className="thinking">K‑Tutor думает…</p>}
        </div>
        <form onSubmit={askTutor}><input value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={700} placeholder="Например: почему здесь 은/는?" /><button type="submit" disabled={loading}>ОТПР.</button></form>
      </section>}
      <button className="k-tutor-launch" type="button" onClick={() => setOpen((value) => !value)}><i />ASK K‑TUTOR</button>
    </aside>
  </>);
}
