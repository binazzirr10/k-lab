import type { Metadata } from "next";
import { Onest, Tenor_Sans } from "next/font/google";
import { AppProviders } from "../providers";
import { PageTransition } from "../components/page-transition";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";
import "../view-transitions.css";

const tenor = Tenor_Sans({ weight: "400", subsets: ["cyrillic", "latin"], variable: "--font-tenor", display: "swap" });
const onest = Onest({ subsets: ["cyrillic"], variable: "--font-onest", display: "swap" });

export const metadata: Metadata = { title: "K‑Lab: курс корейского языка A1 на русском", description: "Курс корейского для начинающих из Казахстана: четыре урока уровня A1 на русском, карточки слов с озвучкой, короткие диалоги и итоговый тест." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${tenor.variable} ${onest.variable}`}>
      <body><AppProviders><PageTransition>{children}</PageTransition></AppProviders></body>
    </html>
  );
}
