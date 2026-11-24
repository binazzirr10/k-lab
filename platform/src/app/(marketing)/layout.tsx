import type { Metadata, Viewport } from "next";
import { Onest, Tenor_Sans } from "next/font/google";
import { AppProviders } from "../providers";
import "./marketing.css";
import "./scroll.css";
import "../view-transitions.css";

const tenor = Tenor_Sans({ weight: "400", subsets: ["latin"], variable: "--font-tenor", display: "swap" });
// Only Russian text needs it here, so it is not fetched ahead of time.
const onest = Onest({ subsets: ["cyrillic"], variable: "--font-onest", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "K-Lab — Korean, beyond the textbook.",
  description: "A Korean A1 course taught in Russian for beginners in Kazakhstan.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#F6F3EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${tenor.variable} ${onest.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/pretendard-landing.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/hangul-poster.webp" as="image" type="image/webp" media="(min-width: 900px)" fetchPriority="high" />
        <link rel="preload" href="/assets/hangul-poster-mobile.webp" as="image" type="image/webp" media="(max-width: 899px)" fetchPriority="high" />
      </head>
      <body><AppProviders>{children}</AppProviders></body>
    </html>
  );
}
