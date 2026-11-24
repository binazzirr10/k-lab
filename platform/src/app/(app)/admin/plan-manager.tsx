"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { planName, type PaidPlan, type PlanId } from "@/lib/plans";

export type PlanRow = { id: string; name: string; email: string; plan: PlanId; until: string | null; request: PaidPlan | null };

export function PlanManager({ rows }: { rows: PlanRow[] }) {
  return rows.length === 0 ? <p className="admin-plan-empty">Никого не нашли.</p>
    : <ul className="admin-plans">{rows.map((row) => <Row key={row.id} row={row} />)}</ul>;
}

function Row({ row }: { row: PlanRow }) {
  const router = useRouter();
  const [plan, setPlan] = useState<PaidPlan>(row.request ?? "pro");
  const [months, setMonths] = useState(1);
  const [busy, setBusy] = useState(false);
  const [refreshing, refresh] = useTransition();
  const [message, setMessage] = useState("");

  async function send(body: object, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: row.id, ...body }) });
      if (!response.ok) throw new Error();
      setMessage("Сохранено.");
      refresh(() => router.refresh());
    } catch {
      setMessage("Не удалось сохранить.");
    } finally { setBusy(false); }
  }

  const disabled = busy || refreshing;
  return <li>
    <div className="admin-plan-user"><b>{row.name}</b><span>{row.email}</span></div>
    <div className="admin-plan-state">
      <b>{planName(row.plan)}</b>{row.until && <span>до {new Date(row.until).toLocaleDateString("ru-RU", { timeZone: "Asia/Almaty" })}</span>}
      {row.request && <mark>Заявка: {planName(row.request)}</mark>}
    </div>
    <div className="admin-plan-form">
      <select aria-label={`Тариф для ${row.name}`} value={plan} disabled={disabled} onChange={(event) => setPlan(event.target.value as PaidPlan)}>
        <option value="pro">Pro</option><option value="pro_plus">Pro+</option>
      </select>
      <select aria-label={`Срок для ${row.name}`} value={months} disabled={disabled} onChange={(event) => setMonths(Number(event.target.value))}>
        <option value={1}>1 месяц</option><option value={3}>3 месяца</option><option value={12}>12 месяцев</option>
      </select>
      <button type="button" disabled={disabled} onClick={() => void send({ action: "grant", plan, months })}>Открыть доступ</button>
      {row.request && <button type="button" disabled={disabled} onClick={() => void send({ action: "dismiss" })}>Убрать заявку</button>}
      {row.plan !== "free" && <button type="button" disabled={disabled} onClick={() => void send({ action: "revoke" }, `Забрать тариф у ${row.name}?`)}>Забрать</button>}
      <span role="status">{message}</span>
    </div>
  </li>;
}
