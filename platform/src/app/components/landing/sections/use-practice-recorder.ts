"use client";

import { useEffect, useRef, useState } from "react";

type Recognition = {
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: (track?: MediaStreamTrack) => void;
  stop: () => void;
  abort: () => void;
};

type Status = "idle" | "asking" | "denied" | "recording" | "processing" | "result" | "unsupported" | "error";
type Session = {
  stream?: MediaStream;
  recorder?: MediaRecorder;
  recognition?: Recognition;
  audio?: AudioContext;
  frame?: number;
  timeout?: number;
  release?: number;
  finishing?: boolean;
};
const limit = 8000;

function release(session: Session) {
  window.clearTimeout(session.timeout);
  window.clearTimeout(session.release);
  if (session.frame !== undefined) cancelAnimationFrame(session.frame);
  if (session.recorder && session.recorder.state !== "inactive") session.recorder.stop();
  session.stream?.getTracks().forEach((track) => track.stop());
  if (session.audio && session.audio.state !== "closed") void session.audio.close().catch(() => {});
  if (session.recognition) {
    session.recognition.onend = null;
    session.recognition.onresult = null;
    session.recognition.onerror = null;
    try { session.recognition.abort(); } catch { /* Recognition already ended. */ }
  }
}

export function usePracticeRecorder() {
  const [status, setStatus] = useState<Status>("idle");
  const [seconds, setSeconds] = useState(0);
  const [url, setUrl] = useState("");
  const [heard, setHeard] = useState("");
  const [recognition, setRecognition] = useState<"unavailable" | "failed" | "ready">("ready");
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useRef<Session | null>(null);
  const take = useRef("");
  const clear = () => {
    if (take.current) URL.revokeObjectURL(take.current);
    take.current = "";
  };

  useEffect(() => {
    function close() {
      const session = active.current;
      active.current = null;
      if (session) release(session);
    }
    function onVisibility() {
      if (!document.hidden || !active.current) return;
      close();
      setStatus(take.current ? "result" : "idle");
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      close();
      clear();
    };
  }, []);

  function reset() {
    const session = active.current;
    active.current = null;
    if (session) release(session);
    clear();
    const surface = canvas.current;
    surface?.getContext("2d")?.clearRect(0, 0, surface.width, surface.height);
    setUrl("");
    setHeard("");
    setSeconds(0);
    setStatus("idle");
  }

  function stop() {
    const session = active.current;
    if (!session?.recorder || session.finishing) return;
    session.finishing = true;
    window.clearTimeout(session.timeout);
    if (session.frame !== undefined) cancelAnimationFrame(session.frame);
    setStatus("processing");
    if (session.recorder.state !== "inactive") session.recorder.stop();
    try { session.recognition?.stop(); } catch { /* Recognition already ended. */ }
    session.stream?.getTracks().forEach((track) => track.stop());
    if (session.audio && session.audio.state !== "closed") void session.audio.close().catch(() => {});
    session.release = window.setTimeout(() => {
      if (active.current !== session) return;
      if (session.recognition) setRecognition("failed");
      active.current = null;
      release(session);
      setStatus(take.current ? "result" : "error");
    }, 2400);
  }

  async function start() {
    if (active.current || document.hidden) return;
    reset();
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }
    const session: Session = {};
    active.current = session;
    setStatus("asking");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (active.current !== session || document.hidden) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      session.stream = stream;
      const recorder = new MediaRecorder(stream);
      session.recorder = recorder;
      const chunks: Blob[] = [];
      let recorderDone = false;
      let recognitionDone = false;
      function result() {
        if (active.current !== session || !recorderDone || !recognitionDone) return;
        active.current = null;
        release(session);
        setStatus(take.current ? "result" : "error");
      }
      recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      recorder.onstop = () => {
        if (active.current !== session) return;
        if (!session.finishing) stop();
        if (chunks.length) {
          take.current = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
          setUrl(take.current);
        }
        recorderDone = true;
        result();
      };
      recorder.onerror = () => {
        if (active.current !== session) return;
        active.current = null;
        release(session);
        setStatus("error");
      };
      const browser = window as Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
      const Recognizer = browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
      setRecognition(Recognizer ? "ready" : "unavailable");
      recognitionDone = !Recognizer;
      recorder.start();
      setStatus("recording");
      const started = performance.now();
      session.timeout = window.setTimeout(stop, limit);
      if (Recognizer) {
        try {
          const recognizer = new Recognizer();
          recognizer.lang = "ko-KR";
          recognizer.onresult = (event) => {
            if (active.current === session) setHeard(event.results[0]?.[0]?.transcript ?? "");
          };
          recognizer.onerror = (event) => {
            if (active.current === session && event.error !== "no-speech") setRecognition("failed");
          };
          recognizer.onend = () => { recognitionDone = true; result(); };
          recognizer.start(stream.getAudioTracks()[0]);
          session.recognition = recognizer;
        } catch {
          recognitionDone = true;
          setRecognition("failed");
        }
      }
      let analyser: AnalyserNode | undefined;
      try {
        session.audio = new AudioContext();
        analyser = session.audio.createAnalyser();
        analyser.fftSize = 512;
        session.audio.createMediaStreamSource(stream).connect(analyser);
        void session.audio.resume().catch(() => {});
      } catch { /* Recording and playback also work without Web Audio. */ }
      const samples = new Uint8Array(512);
      let lastSecond = 0;
      function draw() {
        if (active.current !== session) return;
        const second = Math.min(8, Math.floor((performance.now() - started) / 1000));
        if (second !== lastSecond) {
          lastSecond = second;
          setSeconds(second);
        }
        const surface = canvas.current;
        const pen = surface?.getContext("2d");
        if (surface && pen && analyser) {
          analyser.getByteTimeDomainData(samples);
          pen.clearRect(0, 0, surface.width, surface.height);
          pen.beginPath();
          pen.strokeStyle = "#232521";
          pen.lineWidth = 1.5;
          for (let i = 0; i < samples.length; i++) {
            const x = i * surface.width / (samples.length - 1);
            const y = samples[i] * surface.height / 256;
            if (i === 0) pen.moveTo(x, y); else pen.lineTo(x, y);
          }
          pen.stroke();
        }
        session.frame = requestAnimationFrame(draw);
      }
      draw();
    } catch (error) {
      if (active.current !== session) return;
      active.current = null;
      release(session);
      setStatus(error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name) ? "denied" : "error");
    }
  }

  return { status, seconds, url, heard, recognition, canvas, start, stop, reset };
}

export function compareSyllables(expected: string, heard: string) {
  const syllables = (value: string) => [...value.normalize("NFC")].filter((char) => /[가-힣]/.test(char));
  const target = syllables(expected);
  const actual = syllables(heard);
  const distances = Array.from({ length: target.length + 1 }, (_, row) =>
    Array.from({ length: actual.length + 1 }, (_, col) => row === 0 ? col : col === 0 ? row : 0));
  for (let row = 1; row <= target.length; row++) {
    for (let col = 1; col <= actual.length; col++) {
      distances[row][col] = Math.min(distances[row - 1][col] + 1, distances[row][col - 1] + 1,
        distances[row - 1][col - 1] + Number(target[row - 1] !== actual[col - 1]));
    }
  }
  const pairs: { target: string; actual: string }[] = [];
  let row = target.length;
  let col = actual.length;
  while (row || col) {
    if (row && col && distances[row][col] === distances[row - 1][col - 1] + Number(target[row - 1] !== actual[col - 1])) {
      pairs.push({ target: target[--row], actual: actual[--col] });
    } else if (row && distances[row][col] === distances[row - 1][col] + 1) {
      pairs.push({ target: target[--row], actual: "" });
    } else {
      pairs.push({ target: "", actual: actual[--col] });
    }
  }
  return pairs.reverse();
}
