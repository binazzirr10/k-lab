"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./lang-provider";

const links = [
  ["discover", "Discover", "Обзор"],
  ["speaking", "Speaking Lab", "Speaking Lab"],
  ["drama", "K-Drama", "K-Drama"],
  ["university", "University Hub", "Университеты"],
] as const;

function EntryLinks({ signedIn = false }: { signedIn?: boolean }) {
  const { lang } = useLanguage();
  return <div className="landing-entry">
    {!signedIn && <Link href="/sign-in">{lang === "en" ? "Sign in" : "Войти"}</Link>}
    <Link className="landing-pill" href={signedIn ? "/studio" : "/sign-up"}>
      {signedIn ? (lang === "en" ? "Studio" : "Студия") : (lang === "en" ? "Start learning" : "Начать обучение")}
    </Link>
  </div>;
}

function ClerkEntry() {
  const { isSignedIn } = useAuth();
  return <EntryLinks signedIn={isSignedIn} />;
}

const Account = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? ClerkEntry : EntryLinks;

export function Wordmark() {
  return <span className="landing-wordmark" aria-label="K-Lab">K<span aria-hidden="true" />LAB</span>;
}

export function SiteHeader() {
  const { lang, setLang } = useLanguage();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const update = () => {
      const edge = window.innerHeight * .36;
      setActive(links.findLast(([id]) => {
        const bounds = document.getElementById(id)?.getBoundingClientRect();
        return bounds && bounds.top <= edge && bounds.bottom > edge;
      })?.[0]);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const desktop = matchMedia("(min-width: 1100px)");
    const close = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener("change", close);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      desktop.removeEventListener("change", close);
    };
  }, []);

  const nav = (mobile: boolean) => <nav aria-label={lang === "en" ? "Main navigation" : "Основная навигация"}>
    {links.map(([id, en, ru]) => <a key={id} href={`#${id}`} aria-current={active === id ? "location" : undefined}
      onClick={mobile ? () => dialog.current?.close() : undefined}>
      {lang === "en" ? en : ru}
      {!mobile && active === id && <m.span className="landing-nav-mark" layoutId={reduce ? undefined : "landing-active"} />}
    </a>)}
  </nav>;

  return <header className="landing-header">
    <div className="landing-shell landing-header-grid">
      <a href="#top"><Wordmark /></a>
      <div className="landing-desktop">{nav(false)}</div>
      <div className="landing-header-actions">
        <div className="landing-language" aria-label={lang === "en" ? "Language" : "Язык"}>
          <button type="button" lang="en" aria-pressed={lang === "en"} onClick={(event) => setLang("en", event.currentTarget)}>EN</button>
          <span aria-hidden="true">/</span>
          <button type="button" lang="ru" aria-pressed={lang === "ru"} onClick={(event) => setLang("ru", event.currentTarget)}>RU</button>
        </div>
        <div className="landing-desktop"><Account /></div>
        <button ref={menuButton} className="landing-menu-toggle" type="button" aria-haspopup="dialog" aria-expanded={open}
          onClick={() => { dialog.current?.showModal(); setOpen(true); }}>
          {lang === "en" ? "Menu" : "Меню"}
        </button>
      </div>
    </div>
    <dialog ref={dialog} className="landing-menu" aria-label={lang === "en" ? "Menu" : "Меню"}
      onClose={() => { setOpen(false); if (menuButton.current?.offsetWidth) menuButton.current.focus(); }}>
      <div className="landing-menu-top"><Wordmark />
        <button type="button" onClick={() => dialog.current?.close()}>{lang === "en" ? "Close" : "Закрыть"} <span aria-hidden="true">×</span></button>
      </div>
      {nav(true)}
      {open && <Account />}
    </dialog>
  </header>;
}
