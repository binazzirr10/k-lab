"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { SaveSeal, SaveToast, UniversityMotionScope, useUniversityMotion } from "../university-motion";
import s from "./university-article.module.css";

type Props = { id: string; initialSaved: string[]; initialRevision: string | null };

export function SaveUniversity({ id, initialSaved, initialRevision }: Props) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const root = useRef<HTMLDivElement>(null);
  const runtime = useUniversityMotion(root);
  const Button = runtime?.m.button ?? "button";
  const saved = state === "saved" || initialSaved.includes(id);

  async function save() {
    setState("saving");
    let current = { saved: initialSaved, revision: initialRevision };

    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        const response = await fetch("/api/universities", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "If-Match": JSON.stringify(current.revision ?? "new") },
          body: JSON.stringify({ saved: [...new Set([...current.saved, id])] }),
        });
        if (response.ok) {
          setState("saved");
          router.refresh();
          return;
        }
        if (response.status !== 412) break;
        current = await response.json();
        if (current.saved.includes(id)) {
          setState("saved");
          router.refresh();
          return;
        }
      }
    } catch {
      // The action stays available for a retry.
    }
    setState("error");
  }

  return <div className={s.save} ref={root}>
    <UniversityMotionScope runtime={runtime}>
      <Button type="button" disabled={saved || state === "saving"} onClick={save}
        {...(runtime && !saved && state !== "saving" ? { whileTap: { scale: .97 }, transition: runtime.spring } : {})}>
        <SaveSeal on={saved} />
        {saved ? "В моём списке" : state === "saving" ? "Сохраняем…" : "Сохранить в мой список"}
      </Button>
      <SaveToast state={state === "saved" ? "saved" : "idle"} className={s.saveState} savedDescription="Университет сохранён." />
    </UniversityMotionScope>
    {state === "error" && <p role="alert">Не удалось сохранить. Попробуй ещё раз.</p>}
  </div>;
}
