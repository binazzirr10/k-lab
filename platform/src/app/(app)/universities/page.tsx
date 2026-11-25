import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { AppNav } from "@/app/components/app-nav";
import { AuthActions } from "@/app/components/auth-actions";
import { activePlan } from "@/lib/plans";
import { emptyPlanner } from "@/lib/universities";
import { loadUniversityLab } from "@/lib/university-lab";
import { UniversityLab } from "./university-lab";

export const metadata: Metadata = {
  title: "University Lab: университеты Кореи | K‑Lab",
  description: "Каталог 25 университетов Южной Кореи, личный список, подбор, сравнение и чек-лист документов.",
};

export default async function UniversitiesPage() {
  const user = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? await currentUser() : null;
  const lab = user ? await loadUniversityLab(user.id) : { saved: [], planner: emptyPlanner, connected: true };
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Almaty" });
  return <>
    <AppNav active="universities"><AuthActions /></AppNav>
    <UniversityLab saved={lab.saved} planner={lab.planner} connected={lab.connected} signedIn={!!user}
      pro={activePlan(user?.publicMetadata).plan === "pro_plus"} today={today} />
  </>;
}
