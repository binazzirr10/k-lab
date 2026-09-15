import type { Metadata } from "next";
import { AppProviders } from "./providers";
import "./globals.css";

export const metadata: Metadata = { title: "K‑Lab — Korean Field Notes", description: "Персональная платформа изучения корейского языка." };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
