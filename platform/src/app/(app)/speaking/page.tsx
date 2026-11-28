import type { Metadata } from "next";
import { AppNav } from "@/app/components/app-nav";
import { AuthActions } from "@/app/components/auth-actions";
import { practiceFor } from "@/lib/speaking";
import { SpeakingPage } from "./speaking-page";

export const metadata: Metadata = {
  title: "Speaking Lab: произношение корейских фраз | K‑Lab",
  description: "Послушай фразу из курса, запиши себя и сравни произношение по слогам.",
};

export default async function Speaking({ searchParams }: { searchParams: Promise<{ phrase?: string | string[] }> }) {
  const { phrase } = await searchParams;
  return <>
    <AppNav active="speaking"><AuthActions /></AppNav>
    <SpeakingPage phrases={practiceFor(Array.isArray(phrase) ? phrase[0] : phrase)} />
  </>;
}
