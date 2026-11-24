import { useSyncExternalStore } from "react";
import { useUser } from "@clerk/nextjs";
import { activePlan, FREE_SPEAKING_PER_DAY } from "@/lib/plans";

const key = "klab-speaking-day";
const signals = new EventTarget();
let memory = "";

const today = () => new Date().toLocaleDateString("en-CA");

function read() {
  try { memory = localStorage.getItem(key) ?? memory; } catch { /* Kept for this visit only. */ }
  const [day, count] = memory.split(":");
  return day === today() ? Math.max(0, Number(count) || 0) : 0;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  signals.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    signals.removeEventListener("change", callback);
  };
}

export function countAttempt() {
  memory = `${today()}:${read() + 1}`;
  try { localStorage.setItem(key, memory); } catch { /* Kept for this visit only. */ }
  signals.dispatchEvent(new Event("change"));
}

const useClerkPlan = () => activePlan(useUser().user?.publicMetadata).plan;
const useFreePlan = () => "free" as const;
const usePlan = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? useClerkPlan : useFreePlan;

/** How many recordings are left today, or null when the plan has no limit. */
export function useSpeakingQuota() {
  const plan = usePlan();
  const used = useSyncExternalStore(subscribe, read, () => 0);
  return plan === "free" ? Math.max(0, FREE_SPEAKING_PER_DAY - used) : null;
}
