"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import type { Lang } from "@/lib/landing/lang";

const key = "klab-language";
const signals = new EventTarget();

function read(): Lang {
  try { return localStorage.getItem(key) === "ru" ? "ru" : "en"; }
  catch { return document.documentElement.lang === "ru" ? "ru" : "en"; }
}

function subscribe(callback: () => void) {
  const update = () => {
    document.documentElement.lang = read();
    callback();
  };
  window.addEventListener("storage", update);
  signals.addEventListener("change", update);
  update();
  return () => {
    window.removeEventListener("storage", update);
    signals.removeEventListener("change", update);
  };
}

function setLang(lang: Lang) {
  document.documentElement.lang = lang;
  try { localStorage.setItem(key, lang); } catch { /* The current document retains the choice. */ }
  signals.dispatchEvent(new Event("change"));
}

const Language = createContext<Lang>("en");

export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribe, read, () => "en");
  return <Language.Provider value={lang}>{children}</Language.Provider>;
}

export function useLanguage() {
  return { lang: useContext(Language), setLang };
}
