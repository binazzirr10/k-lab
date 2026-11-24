import type { Metadata, Viewport } from "next";
import { AppProviders } from "../providers";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import "./marketing.css";

export const metadata: Metadata = {
  title: "K-Lab — Korean, beyond the textbook.",
  description: "A Korean A1 course taught in Russian for beginners in Kazakhstan.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#F6F3EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- Marketing root typography. */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400..700&family=Tenor+Sans&display=swap" />
      </head>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
