"use client";

import { useEffect, useRef, useState } from "react";
import { speakKorean } from "./audio";

type Status = "idle" | "playing" | "paused" | "done" | "error";

export function useDialoguePlayback(lines: readonly string[]) {
  const [current, setCurrent] = useState(-1);
  const [status, setStatus] = useState<Status>("idle");
  const token = useRef(0);
  const cancelSpeech = useRef<(() => void) | undefined>(undefined);

  function interrupt() {
    token.current += 1;
    cancelSpeech.current?.();
    cancelSpeech.current = undefined;
  }

  useEffect(() => () => {
    token.current += 1;
    cancelSpeech.current?.();
  }, []);

  function play(start: number, sequence = true) {
    interrupt();
    const run = token.current;
    function next(index: number) {
      if (run !== token.current) return;
      if (index >= lines.length) {
        cancelSpeech.current = undefined;
        setStatus("done");
        return;
      }
      setCurrent(index);
      setStatus("playing");
      cancelSpeech.current = speakKorean(lines[index], () => next(sequence ? index + 1 : lines.length), () => {
        if (run !== token.current) return;
        cancelSpeech.current = undefined;
        setStatus("error");
      }, () => {
        if (run !== token.current) return;
        cancelSpeech.current = undefined;
        setStatus("idle");
      });
    }
    next(start);
  }

  function toggle() {
    if (status === "playing") {
      if (cancelSpeech.current) window.speechSynthesis?.pause();
      setStatus("paused");
    } else if (status === "paused") {
      if (cancelSpeech.current) window.speechSynthesis?.resume();
      setStatus("playing");
    } else play(status === "idle" || status === "error" ? Math.max(0, current) : 0);
  }

  function step(next: number) {
    interrupt();
    setCurrent(Math.max(0, Math.min(lines.length - 1, next)));
    setStatus("idle");
  }

  return { current, status, play, toggle, step };
}
