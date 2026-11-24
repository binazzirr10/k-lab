"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { resolveTutorContext, type TutorContextId } from "@/lib/tutor-contexts";

type Message = { role: "tutor" | "user"; text: string };

const tutorCss = `
.k-tutor{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:Arial,sans-serif}
.k-tutor-launch{display:flex;align-items:center;gap:9px;padding:12px 15px;border:1px solid #15251e;border-radius:999px;background:#dcbf6b;box-shadow:4px 4px #15251e;color:#15251e;font:700 12px Arial;letter-spacing:.06em}
.k-tutor-launch i{width:8px;height:8px;border-radius:50%;background:#9e2330}
.k-tutor-panel{position:absolute;right:0;bottom:64px;width:min(355px,calc(100vw - 34px));overflow:hidden;border:1px solid #15251e;background:#fffdf8;box-shadow:7px 7px #15251e;color:#15251e}
.k-tutor-panel header{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;background:#15251e;color:#fffdf8}
.k-tutor-panel header b{display:block;font:500 21px Georgia,serif}
.k-tutor-panel header span{display:block;margin-top:3px;color:#c4cec6;font-size:12px;font-weight:700;letter-spacing:.09em}
.k-tutor-panel header button{border:0;background:transparent;color:#fffdf8;font-size:20px}
.k-tutor-context{margin:0;padding:10px 14px;background:#e9efe5;color:#536158;font-size:12px}
.k-tutor-messages{display:grid;gap:9px;min-height:160px;max-height:310px;overflow:auto;padding:14px}
.k-tutor-messages p{max-width:92%;margin:0;padding:10px 11px;background:#edf1ed;color:#25342d;font-size:12px;line-height:1.52;white-space:pre-wrap}
.k-tutor-messages .user{justify-self:end;background:#dcbf6b}
.k-tutor-messages .thinking{color:#637169;font-style:italic}
.k-tutor-panel form{display:flex;gap:7px;padding:12px;border-top:1px solid #15251e2e}
.k-tutor-panel input{min-width:0;flex:1;padding:10px;border:1px solid #15251e;background:#fffdf8;color:#15251e;font:12px Arial}
.k-tutor-panel form button{padding:10px 12px;border:1px solid #15251e;background:#15251e;color:#fffdf8;font:700 12px Arial;letter-spacing:.07em}

.k-tutor { right: max(16px,env(safe-area-inset-right)); bottom: max(16px,env(safe-area-inset-bottom)); }
.k-tutor-launch { min-height: 44px; border-radius: 0; }
.k-tutor-panel {
  display: flex;
  flex-direction: column;
  max-height: calc(100dvh - 88px);
  transform-origin: bottom right;
  animation: tutor-open var(--dur-ui, 220ms) var(--ease-out, cubic-bezier(.23,1,.32,1));
}
.k-tutor-panel header, .k-tutor-context, .k-tutor-panel form { flex: none; }
.k-tutor-panel header b { letter-spacing: -.03em; line-height: 1.05; }
.k-tutor button {
  min-width: 44px;
  min-height: 44px;
  transition: transform var(--dur-press, 140ms) var(--ease-out, cubic-bezier(.23,1,.32,1));
}
.k-tutor .k-tutor-launch { transform: none; box-shadow: 4px 4px #15251e; }
.k-tutor button:enabled:active { transform: scale(.97); }
.k-tutor :is(button,input):focus-visible {
  outline: 2px solid #9e2330;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px #fffdf8;
}
.k-tutor form button:disabled { opacity: 1; background: #e9efe5; color: #4c5c53; cursor: default; }
@media (hover:hover) and (pointer:fine) {
  .k-tutor button:enabled:hover { text-decoration: underline; text-underline-offset: .2em; }
}
@media (prefers-reduced-motion: reduce) {
  .k-tutor-panel { animation: none; }
  .k-tutor button { transition: none; }
  .k-tutor button:enabled:active { transform: none; }
}
.k-tutor-panel header { padding: 8px 12px; }
.k-tutor-panel input { min-height: 44px; font-size: 16px; }
.k-tutor-messages { min-height: 0; overscroll-behavior: contain; align-content: start; }
.k-tutor-messages p { overflow-wrap: anywhere; font-size: 14px; }

@keyframes tutor-open {
  from { transform: translateY(7px) scale(.96); opacity: .65; }
}
`;

const unavailableText = "Ответ не пришёл. Проверь интернет и отправь вопрос ещё раз.";

export function KTutor({ context }: { context: TutorContextId }) {
  const label = resolveTutorContext(context)?.label ?? "K‑LAB";
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "tutor", text: "Привет! Я K‑Tutor, AI‑наставник. Задай один вопрос о корейском или этом разделе. Прошлые сообщения я не помню и могу ошибаться." },
  ]);

  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const transcript = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();

    function onEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      close();
    }

    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  useEffect(() => {
    const log = transcript.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [open, messages, loading]);

  function close() {
    setOpen(false);
    launcher.current?.focus();
  }

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
        body: JSON.stringify({ message, context }),
      });
      const data: { answer?: unknown; error?: unknown } = await response.json().catch(() => ({}));
      if (!response.ok || typeof data.answer !== "string") {
        const text = typeof data.error === "string" && data.error ? data.error : unavailableText;
        setMessages((current) => [...current, { role: "tutor", text }]);
        return;
      }
      const answer = data.answer;
      setMessages((current) => [...current, { role: "tutor", text: answer }]);
    } catch {
      setMessages((current) => [...current, { role: "tutor", text: unavailableText }]);
    } finally {
      setLoading(false);
    }
  }

  return (<>
    <style>{tutorCss}</style>
    <aside className="k-tutor" aria-label="Чат с K-Tutor">
      {open && <section className="k-tutor-panel">
        <header><div><b>K‑Tutor</b><span>AI‑НАСТАВНИК K‑LAB</span></div><button type="button" onClick={close} aria-label="Закрыть чат">×</button></header>
        <p className="k-tutor-context">ТЕКУЩИЙ РАЗДЕЛ · {label}</p>
        <div ref={transcript} className="k-tutor-messages" role="log" aria-live="polite">
          {messages.map((item, index) => <p className={item.role} key={`${item.role}-${index}`}>{item.text}</p>)}
          {loading && <p className="thinking">K‑Tutor думает…</p>}
        </div>
        <form onSubmit={askTutor}><input ref={input} aria-label="Вопрос для K-Tutor" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={700} placeholder="Например: почему здесь 은/는?" /><button type="submit" disabled={loading}>СПРОСИТЬ</button></form>
      </section>}
      <button ref={launcher} className="k-tutor-launch" type="button" aria-expanded={open} onClick={() => open ? close() : setOpen(true)}><i />СПРОСИ K‑TUTOR</button>
    </aside>
  </>);
}
