import type { Metadata } from "next";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = { title: "K‑Lab: курс корейского языка A1 на русском", description: "Курс корейского для начинающих из Казахстана: четыре урока уровня A1 на русском, карточки слов с озвучкой, короткие диалоги и итоговый тест." };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
