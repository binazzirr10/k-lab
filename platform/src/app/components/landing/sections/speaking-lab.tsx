"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { LayoutGroup } from "motion/react";
import * as m from "motion/react-m";
import type { Lang } from "@/lib/landing/lang";
import type { PracticePhrases } from "@/lib/landing/phrases";
import { MagneticPill, Reveal, useReducedMotion } from "../motion";
import { Divider } from "../motion/divider";
import { AssembledPhrase } from "../motion/assemble";
import { Gayageum } from "../motion/gayageum";
import { speakKorean } from "../motion/speech";
import { compareSyllables, usePracticeRecorder } from "./use-practice-recorder";
import { countAttempt, useSpeakingQuota } from "./use-speaking-quota";
import e from "./editorial.module.css";
import s from "./speaking-lab.module.css";

const copy = {
  en: {
    title: ["Speaking Lab"], intro: "Try a line from the course. Listen, say it aloud, then play back your take.",
    link: "Open the full Speaking Lab", phrase: "Practice phrase", playbackError: "Couldn’t play this recording.", listen: "Listen", record: "Record", stop: "Stop recording", cancel: "Cancel",
    reference: "Twelve gayageum strings. Drag to play.", mic: "Your microphone", take: "Your recording", exchange: "In conversation", minji: "Minji", answer: "You",
    privacy: "K-Lab doesn’t upload your recording. Your browser may use its own speech service.",
    left: ["1 free attempt left today.", "2 free attempts left today.", "3 free attempts a day."], spent: "You’ve used today’s 3 free attempts.", plans: "No limit in Pro",
    idle: "Record up to 8 seconds.", asking: "Waiting for microphone permission…", denied: "Microphone permission was denied. Check your browser settings to try again.",
    recording: "Recording", processing: "Preparing your take…", result: "Your take is ready.", unsupported: "This browser or connection doesn’t support microphone recording.",
    error: "Couldn’t record. Check your microphone and try again.", heard: "The browser heard", missing: "Speech recognition is unavailable in this browser.",
    failed: "The browser couldn’t transcribe this take.", empty: "The browser didn’t detect any words.", match: "Expected / heard", voice: "Korean audio is unavailable in this browser.",
  },
  ru: {
    title: ["Speaking Lab"], intro: "Выбери фразу из курса. Послушай её, произнеси вслух и включи свою запись.",
    link: "Открыть полную версию", phrase: "Фраза для практики", playbackError: "Не удалось воспроизвести запись.", listen: "Послушать", record: "Записать", stop: "Остановить запись", cancel: "Отмена",
    reference: "Двенадцать струн каягыма. Проведи по ним.", mic: "Твой микрофон", take: "Твоя запись", exchange: "В диалоге", minji: "Минджи", answer: "Ты",
    privacy: "K-Lab не загружает твою запись. Браузер может использовать собственную службу распознавания речи.",
    left: ["Сегодня осталась 1 бесплатная попытка.", "Сегодня осталось 2 бесплатные попытки.", "3 бесплатные попытки в день."], spent: "На сегодня 3 бесплатные попытки закончились.", plans: "В Pro без лимита",
    idle: "Запись до 8 секунд.", asking: "Ожидаем разрешения на доступ к микрофону…", denied: "Доступ к микрофону запрещён. Проверь настройки браузера и попробуй снова.",
    recording: "Идёт запись", processing: "Готовим твою запись…", result: "Твоя запись готова.", unsupported: "В этом браузере или при таком соединении запись недоступна.",
    error: "Записать не удалось. Проверь микрофон и попробуй снова.", heard: "Браузер распознал", missing: "Этот браузер не поддерживает распознавание речи.",
    failed: "Браузер не смог расшифровать запись.", empty: "Браузер не распознал слова.", match: "Ожидалось / распознано", voice: "Корейская озвучка недоступна в этом браузере.",
  },
};

/** `standalone` is the full page: the heading is the page title and there is no link to itself. */
export function SpeakingLab({ lang, phrases, standalone = false }: { lang: Lang; phrases: PracticePhrases; standalone?: boolean }) {
  const t = copy[lang];
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [strums, setStrums] = useState(0);
  const [audioError, setAudioError] = useState<"voice" | "playbackError" | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const playback = useRef<HTMLAudioElement>(null);
  const cancelSpeech = useRef<(() => void) | null>(null);
  const { line, cue } = phrases[index];
  const { status, seconds, url, heard, recognition, canvas, start, stop, reset } = usePracticeRecorder();
  const left = useSpeakingQuota();
  const spent = left === 0 && (status === "idle" || status === "result" || status === "denied" || status === "error");
  useEffect(() => {
    if (status === "recording") countAttempt();
  }, [status]);
  const busy = ["asking", "recording", "processing"].includes(status);
  useEffect(() => () => cancelSpeech.current?.(), []);
  useEffect(() => {
    // A transcript can contain any syllable, so the full font family is fetched only now.
    if (status === "result") void import("pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css");
  }, [status]);

  const active = status === "recording";
  const progress = active ? Math.min(1, (seconds + 1) / 8) : position;
  function changePhrase(i: number) {
    cancelSpeech.current?.();
    reset();
    setIndex(i);
    setStrums((count) => count + 1);
    setPosition(0);
    setPlaying(false);
    setAudioError(null);
  }
  function togglePlayback() {
    const audio = playback.current;
    if (!audio) return;
    setAudioError(null);
    if (audio.paused) void audio.play().catch(() => setAudioError("playbackError"));
    else audio.pause();
  }

  return <section className={`${e.section} ${standalone ? s.standalone : ""}`} id="speaking" data-scene="speaking" lang={lang} aria-labelledby="speaking-heading">
    <div className={e.frame}>
      {!standalone && <Divider />}
      <header className={`${e.intro} ${s.intro}`}>
        {!standalone && <span className={e.number} aria-hidden="true">01</span>}
        {standalone ? <h1 className={e.title} id="speaking-heading"><Reveal lines={t.title} /></h1> : <h2 className={e.title} id="speaking-heading"><Reveal lines={t.title} /></h2>}
      </header>
      <div className={`${e.paper} ${s.about}`}>
        <p className={e.lead}>{t.intro}</p>
        {!standalone && <MagneticPill href="/speaking">{t.link}</MagneticPill>}
      </div>
      <div className={`${e.paper} ${s.instrument}`}>
        <LayoutGroup id="practice-phrases">
          <div className={s.choices} role="group" aria-label={t.phrase}>
            {phrases.map(({ line: phrase }, i) => <button type="button" disabled={busy} aria-pressed={index === i} data-enter="rise" style={{ "--i": i } as CSSProperties}
              key={phrase.text} onClick={() => changePhrase(i)}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span lang="ko">{phrase.text}</span>
              {index === i && <m.span className={s.underline} layoutId={reduced ? undefined : "phrase-underline"} transition={{ duration: .26 }} />}
            </button>)}
          </div>
        </LayoutGroup>
        <div className={s.readout}>
          <div>
            <p className={s.hangul} lang="ko"><AssembledPhrase text={line.text} /></p>
            <div className={s.translation}>{line.romanization && <span>{line.romanization}</span>}<span>{lang === "en" ? line.english : line.translation}</span></div>
          </div>
          <div className={s.exchange}>
            <span className={e.label}>{t.exchange}</span>
            {(cue ? [cue, line] : [line]).map((turn, i) => <div className={s.turn} key={i}>
              <span>{cue && i === 0 ? t.minji : t.answer}</span>
              <div><span lang="ko">{turn.text}</span><small>{lang === "en" ? turn.english : turn.translation}</small></div>
            </div>)}
          </div>
        </div>
        <div className={s.wavefield} data-handoff="" data-open-on-view="unroll">
          <div className={s.legend}><span>{t.reference}</span><span>{t.mic}</span></div>
          <Gayageum pulse={strums} quiet={busy} />
          <canvas className={s.trace} ref={canvas} width={1200} height={220} aria-hidden="true" />
          {(active || playing) && <m.span className={s.playhead} aria-hidden="true" initial={reduced ? false : { left: "0%" }}
            animate={{ left: `${progress * 100}%` }} transition={{ duration: reduced ? 0 : active ? .92 : .24, ease: "linear" }} />}
          <div className={s.micWell}>
            <svg className={s.ring} viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="47" />
              <m.circle cx="50" cy="50" r="47" initial={false} animate={{ pathLength: active ? Math.min(1, (seconds + 1) / 8) : 0 }}
                transition={{ duration: reduced ? 0 : active ? 1 : .2, ease: "linear" }} />
            </svg>
            <button className={s.microphone} type="button" aria-label={active ? t.stop : status === "asking" ? t.cancel : t.record}
              disabled={spent || status === "processing" || status === "unsupported"} onClick={() => {
                if (active) stop();
                else if (status === "asking") reset();
                else { cancelSpeech.current?.(); playback.current?.pause(); setPosition(0); setAudioError(null); void start(); }
              }}>
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {active ? <rect x="10" y="10" width="12" height="12" /> : status === "asking" ? <path d="m10 10 12 12m0-12L10 22" /> : <>
                  <rect x="12" y="5" width="8" height="15" rx="4" /><path d="M8 15v1a8 8 0 0 0 16 0v-1M16 24v5m-4 0h8" />
                </>}
              </svg>
            </button>
          </div>
          {active && <span className={s.timer} aria-hidden="true">0:{String(seconds).padStart(2, "0")} / 0:08</span>}
        </div>
        <div className={s.below}>
          <div className={e.controls}>
            <button type="button" className={e.button} disabled={busy} onClick={() => {
              setAudioError(null); cancelSpeech.current?.(); playback.current?.pause();
              setStrums((count) => count + 1);
              cancelSpeech.current = speakKorean(line.text, { onError: () => setAudioError("voice") });
            }}>▷ {t.listen}</button>
            {url && <>
              <audio ref={playback} src={url} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)} onTimeUpdate={(event) => {
                  const audio = event.currentTarget;
                  setPosition(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration : audio.currentTime / 8);
                }} />
              <button className={e.button} type="button" aria-pressed={playing} onClick={togglePlayback}>{playing ? "Ⅱ" : "▷"} {t.take}</button>
            </>}
          </div>
          <div><p className={e.note} role="status">{t[status]}{audioError && ` ${t[audioError]}`}</p>{left !== null && <p className={e.note} role="status">{left === 0 ? t.spent : t.left[left - 1]} <a href={standalone ? "/pricing" : "#pricing"}>{t.plans}</a></p>}<p className={e.note}>{t.privacy}</p></div>
        </div>
        {status === "result" && (heard ? <div className={s.result}>
          <p className={e.note}>{t.heard} <b lang="ko">{heard}</b> · {t.match}</p>
          <ul className={s.syllables} lang="ko">{compareSyllables(line.text, heard).map((pair, i) =>
            <m.li key={i} data-match={pair.target === pair.actual} initial={reduced ? false : { opacity: .35, y: 4 }}
              animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .22, delay: reduced ? 0 : i * .055 }}>
              <span>{pair.target || "–"}</span><small>{pair.actual || "–"}</small>
            </m.li>)}</ul>
        </div> : <p className={e.note}>{recognition === "unavailable" ? t.missing : recognition === "failed" ? t.failed : t.empty}</p>)}
      </div>
    </div>
  </section>;
}
