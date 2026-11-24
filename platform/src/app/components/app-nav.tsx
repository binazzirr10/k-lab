"use client";

import Link from "next/link";
import { useId, useRef, useState, type ReactNode } from "react";

export type AppSection = "studio" | "learn" | "hangul" | "grammar" | "phrases" | "words" | "scenes" | "pricing";

const items: { id: AppSection; label: string; href: string }[] = [
  { id: "studio", label: "Мой ритм", href: "/studio" },
  { id: "learn", label: "Уроки", href: "/learn/lesson-01-introduction" },
  { id: "hangul", label: "Хангыль", href: "/hangul" },
  { id: "grammar", label: "Грамматика", href: "/grammar" },
  { id: "phrases", label: "Фразы", href: "/phrases" },
  { id: "words", label: "Word Deck", href: "/vocabulary" },
  { id: "scenes", label: "K‑Scene", href: "/k-scene" },
  { id: "pricing", label: "Тарифы", href: "/pricing" },
];

export function AppNav({ active, children }: { active?: AppSection; children?: ReactNode }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <nav className="learn-nav app-nav" aria-label="Разделы K‑Lab" onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggle.current?.focus();
      }
    }}>
      <Link className="learn-logo" href="/" onClick={() => setOpen(false)} aria-label="K-Lab">K<span aria-hidden="true">—</span>LAB</Link>
      <button ref={toggle} className="app-nav-toggle" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
        {open ? "Закрыть меню" : "Меню"}
      </button>
      <div id={id} className="app-nav-links" data-open={open}>
        {items.map((item) => (
          <Link className={item.id === active ? "active" : undefined} aria-current={item.id === active ? "page" : undefined} href={item.href} key={item.id} onClick={() => setOpen(false)}>{item.label}</Link>
        ))}
      </div>
      {children && <section className="app-nav-account" aria-label="Аккаунт">{children}</section>}
    </nav>
  );
}
