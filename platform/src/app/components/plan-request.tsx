"use client";

import { useState } from "react";
import type { PaidPlan } from "@/lib/plans";

export function PlanRequest({ plan, label, initialSent }: { plan: PaidPlan; label: string; initialSent: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">(initialSent ? "sent" : "idle");
  const [error, setError] = useState("");

  async function send() {
    setState("sending");
    setError("");
    try {
      const response = await fetch("/api/plan/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      if (response.ok) return setState("sent");
      const body: unknown = await response.json().catch(() => null);
      setError(body && typeof body === "object" && "error" in body ? String(body.error) : "Не удалось отправить заявку.");
    } catch {
      setError("Нет связи. Попробуй ещё раз.");
    }
    setState("idle");
  }

  return <>
    <button className="plan-action" type="button" disabled={state !== "idle"} onClick={() => void send()}>
      {state === "sent" ? "Заявка отправлена" : state === "sending" ? "Отправляем…" : label}
    </button>
    <p className="plan-status" role="status">{error}</p>
  </>;
}
