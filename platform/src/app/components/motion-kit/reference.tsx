import Link from "next/link";
import { AppNav, type AppSection } from "@/app/components/app-nav";
import { AuthActions } from "@/app/components/auth-actions";
import type { ReactNode } from "react";
import styles from "./reference.module.css";

const lessons = [
  ["Знакомство", "lesson-01-introduction", "new-friend"],
  ["Страны", "lesson-02-country", "where-are-you-from"],
  ["Предметы", "lesson-03-objects", "what-is-this"],
  ["Мой день", "lesson-04-my-day", "joons-day"],
] as const;

export function Reference({ active, title, description, children }: {
  active: AppSection; title: string; description: string; children: ReactNode;
}) {
  return <div className={styles.shell}>
    <AppNav active={active}><AuthActions /></AppNav>
    <main className={styles.main}>
      <header className={styles.hero}><h1>{title}</h1><p>{description}</p></header>
      {children}
      <section className={styles.panel}>
        <h2>Продолжи практику</h2>
        <ul className={styles.links}>{lessons.map(([name, lesson, scene]) => <li key={lesson}>
          <Link href={`/learn/${lesson}`}>Урок «{name}»</Link>
          <Link href={`/k-scene/${scene}`}>Сцена «{name}»</Link>
        </li>)}<li><Link href="/vocabulary">Word Deck</Link></li></ul>
      </section>
    </main>
  </div>;
}
