import type { Metadata } from "next";
import { AppProviders } from "../providers";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./globals.css";

export const metadata: Metadata = { title: "K‑Lab: курс корейского языка A1 на русском", description: "Курс корейского для начинающих из Казахстана: четыре урока уровня A1 на русском, карточки слов с озвучкой, короткие диалоги и итоговый тест." };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- This App Router root layout serves every app route. */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400..700&family=Tenor+Sans&display=swap" />
      </head>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
