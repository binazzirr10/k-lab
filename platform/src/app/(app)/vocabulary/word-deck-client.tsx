"use client";

import { AnimatePresence, m, useIsPresent, type PanInfo, type Variants } from "motion/react";
import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { MotionScope, spring } from "@/app/components/motion-kit/motion";
import { sayKorean as speak } from "@/lib/korean-voice";

type Word = {
  id: string;
  set: string;
  korean: string;
  romanization: string;
  russian: string;
  example: string;
  exampleRu: string;
};

const words: Word[] = [
  {
    id: "b2000000-0000-4000-8000-000000000001",
    set: "Приветствия",
    korean: "안녕하세요",
    romanization: "annyeonghaseyo",
    russian: "здравствуйте",
    example: "안녕하세요. 저는 알리나예요.",
    exampleRu: "Здравствуйте. Я Алина.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000002",
    set: "Приветствия",
    korean: "이름",
    romanization: "ireum",
    russian: "имя",
    example: "이름이 뭐예요?",
    exampleRu: "Как вас зовут?",
  },
  {
    id: "b2000000-0000-4000-8000-000000000003",
    set: "Приветствия",
    korean: "저는",
    romanization: "jeoneun",
    russian: "я (вежливо)",
    example: "저는 학생이에요.",
    exampleRu: "Я студент / студентка.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000004",
    set: "Приветствия",
    korean: "예요",
    romanization: "yeyo",
    russian: "являюсь, является (после гласной)",
    example: "저는 알리나예요.",
    exampleRu: "Я Алина.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000005",
    set: "Приветствия",
    korean: "감사합니다",
    romanization: "gamsahamnida",
    russian: "спасибо",
    example: "감사합니다.",
    exampleRu: "Спасибо.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000006",
    set: "Приветствия",
    korean: "친구",
    romanization: "chingu",
    russian: "друг / подруга",
    example: "친구를 만나요.",
    exampleRu: "Я встречаюсь с другом.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000007",
    set: "Страны",
    korean: "나라",
    romanization: "nara",
    russian: "страна",
    example: "어느 나라 사람이에요?",
    exampleRu: "Вы из какой страны?",
  },
  {
    id: "b2000000-0000-4000-8000-000000000008",
    set: "Страны",
    korean: "카자흐스탄",
    romanization: "Kajaheuseutan",
    russian: "Казахстан",
    example: "저는 카자흐스탄 사람이에요.",
    exampleRu: "Я из Казахстана.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000009",
    set: "Страны",
    korean: "한국",
    romanization: "Hanguk",
    russian: "Корея",
    example: "한국 사람이에요?",
    exampleRu: "Вы кореянка / кореец?",
  },
  {
    id: "b2000000-0000-4000-8000-000000000010",
    set: "Страны",
    korean: "사람",
    romanization: "saram",
    russian: "человек",
    example: "카자흐스탄 사람이에요.",
    exampleRu: "Я из Казахстана (буквально «человек из Казахстана»).",
  },
  {
    id: "b2000000-0000-4000-8000-000000000011",
    set: "Страны",
    korean: "아니에요",
    romanization: "anieyo",
    russian: "нет / не являюсь",
    example: "아니에요.",
    exampleRu: "Нет.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000012",
    set: "Страны",
    korean: "어느",
    romanization: "eoneu",
    russian: "какой",
    example: "어느 나라예요?",
    exampleRu: "Какая это страна?",
  },
  {
    id: "b2000000-0000-4000-8000-000000000013",
    set: "Вещи вокруг",
    korean: "이것",
    romanization: "igeot",
    russian: "это (рядом со мной)",
    example: "이것은 책이에요.",
    exampleRu: "Это книга.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000014",
    set: "Вещи вокруг",
    korean: "그것",
    romanization: "geugeot",
    russian: "то (рядом с собеседником)",
    example: "그것은 가방이에요.",
    exampleRu: "То (рядом с вами) — сумка.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000015",
    set: "Вещи вокруг",
    korean: "저것",
    romanization: "jeogeot",
    russian: "вон то (далеко от обоих)",
    example: "저것은 커피예요.",
    exampleRu: "Вон то — кофе.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000016",
    set: "Вещи вокруг",
    korean: "책",
    romanization: "chaek",
    russian: "книга",
    example: "이것은 책이에요.",
    exampleRu: "Это книга.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000017",
    set: "Вещи вокруг",
    korean: "가방",
    romanization: "gabang",
    russian: "сумка",
    example: "이것은 가방이에요.",
    exampleRu: "Это сумка.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000018",
    set: "Вещи вокруг",
    korean: "펜",
    romanization: "pen",
    russian: "ручка",
    example: "이것은 펜이에요.",
    exampleRu: "Это ручка.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000019",
    set: "Мой день",
    korean: "공부해요",
    romanization: "gongbuhaeyo",
    russian: "учу, учусь",
    example: "한국어를 공부해요.",
    exampleRu: "Я учу корейский язык.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000020",
    set: "Мой день",
    korean: "먹어요",
    romanization: "meogeoyo",
    russian: "ем",
    example: "김밥을 먹어요.",
    exampleRu: "Я ем кимбап.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000021",
    set: "Мой день",
    korean: "마셔요",
    romanization: "masyeoyo",
    russian: "пью",
    example: "커피를 마셔요.",
    exampleRu: "Я пью кофе.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000022",
    set: "Мой день",
    korean: "만나요",
    romanization: "mannayo",
    russian: "встречаюсь (с кем-то)",
    example: "친구를 만나요.",
    exampleRu: "Я встречаюсь с другом.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000023",
    set: "Мой день",
    korean: "오늘",
    romanization: "oneul",
    russian: "сегодня",
    example: "오늘 뭐 해요?",
    exampleRu: "Что вы делаете сегодня?",
  },
  {
    id: "b2000000-0000-4000-8000-000000000024",
    set: "Мой день",
    korean: "커피",
    romanization: "keopi",
    russian: "кофе",
    example: "커피를 마셔요.",
    exampleRu: "Я пью кофе.",
  },
];

const sets = ["Приветствия", "Страны", "Вещи вокруг", "Мой день"];
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
const firstPage = { index: 0, sequence: 0, travel: 0 };
const swipeThreshold = 0.25;
const flickVelocity = 650;
const flickDistance = 12;
const tapTolerance = 8;

type Mark = "known" | "review";
type Direction = -1 | 1;

const markLabels: Record<Mark, string> = {
  known: "Знаю",
  review: "Повторить",
};

const slideVariants = {
  enter: (travel: number) => ({ x: travel }),
  current: { x: 0 },
  exit: (travel: number) => ({
    x: -travel,
    transition: travel ? spring : { duration: 0 },
  }),
} satisfies Variants;

function listenForMotionPreference(change: () => void) {
  const preference = window.matchMedia(reducedMotionQuery);
  preference.addEventListener("change", change);
  return () => preference.removeEventListener("change", change);
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function serverMotionPreference() {
  return false;
}

function getMark(state: string | undefined) {
  return state === "known" || state === "review" ? state : undefined;
}

function CardSlide({
  word,
  mark,
  flipped,
  reduced,
  saving,
  travel,
  onDrag,
  onSwipe,
}: {
  word: Word;
  mark: Mark | undefined;
  flipped: boolean;
  reduced: boolean;
  saving: boolean;
  travel: number;
  onDrag: (event: PointerEvent, info: PanInfo) => void;
  onSwipe: (direction: Direction) => void;
}) {
  const slide = useRef<HTMLSpanElement>(null);
  const isPresent = useIsPresent();
  const canDrag = isPresent && !reduced && !saving;

  function handleDragEnd(event: PointerEvent, { offset, velocity }: PanInfo) {
    if (!canDrag || event.type === "pointercancel" || !slide.current) return;

    const distance = Math.abs(offset.x);
    if (distance <= Math.abs(offset.y)) return;

    const farEnough = distance >= slide.current.offsetWidth * swipeThreshold;
    const fastEnough = distance >= flickDistance
      && Math.abs(velocity.x) >= flickVelocity
      && Math.sign(offset.x) === Math.sign(velocity.x);

    if (farEnough || fastEnough) onSwipe(offset.x < 0 ? 1 : -1);
  }

  return (
    <m.span
      ref={slide}
      className="deck-slide"
      data-exiting={!isPresent}
      data-draggable={canDrag}
      aria-hidden="true"
      custom={travel}
      variants={slideVariants}
      initial={reduced ? false : "enter"}
      animate="current"
      exit="exit"
      transition={reduced ? { duration: 0 } : spring}
      drag={canDrag ? "x" : false}
      dragConstraints={{ left: -120, right: 120 }}
      dragElastic={0.55}
      dragMomentum={false}
      dragSnapToOrigin
      dragTransition={{ bounceStiffness: spring.stiffness, bounceDamping: spring.damping }}
      onDrag={onDrag}
      onDragEnd={handleDragEnd}
    >
      <span className="deck-card-mark" data-mark={mark}>{mark && markLabels[mark]}</span>
      <span className={flipped ? "deck-faces flipped" : "deck-faces"}>
        <span className="deck-front" aria-hidden={flipped}>
          <span className="deck-word" lang="ko">{word.korean}</span>
          <span className="deck-romanization">{word.romanization}</span>
        </span>
        <span className="deck-back" aria-hidden={!flipped}>
          <span className="deck-meaning">{word.russian}</span>
        </span>
      </span>
      <span className="deck-flip-hint">Перевернуть</span>
    </m.span>
  );
}

/** `intro` is the page heading; the counters next to it follow the marks made on this page. */
export function WordDeckClient({ initialStates, intro }: { initialStates: Record<string, string>; intro: ReactNode }) {
  const [set, setSet] = useState(sets[0]);
  const [page, setPage] = useState(firstPage);
  const [flipped, setFlipped] = useState(false);
  const [states, setStates] = useState(initialStates);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [quiz, setQuiz] = useState<string | null>(null);
  const savingRef = useRef(false);
  const flipButton = useRef<HTMLButtonElement>(null);
  const press = useRef<{ x: number; y: number; dragged: boolean } | null>(null);
  const cardTextId = useId();
  const reduced = useSyncExternalStore(listenForMotionPreference, prefersReducedMotion, serverMotionPreference);

  const currentWords = words.filter((word) => word.set === set);
  const { index } = page;
  const word = currentWords[index];
  const mark = getMark(states[word.id]);
  const travel = reduced ? 0 : page.travel;
  const choices = [1, 3].map((offset) => currentWords[(index + offset) % currentWords.length].russian);
  choices.splice(index % 3, 0, word.russian);

  function resetCard() {
    setFlipped(false);
    setQuiz(null);
    setSaveError(false);
  }

  function navigate(direction: Direction) {
    if (savingRef.current) return;

    const width = flipButton.current?.clientWidth ?? 0;
    setPage((current) => ({
      index: (current.index + direction + currentWords.length) % currentWords.length,
      sequence: current.sequence + 1,
      travel: direction * width,
    }));
    resetCard();
  }

  function selectSet(next: string) {
    if (savingRef.current || next === set) return;

    setSet(next);
    setPage(firstPage);
    resetCard();
  }

  async function save(state: Mark) {
    if (savingRef.current) return;

    savingRef.current = true;
    setSaving(true);
    setSaveError(false);

    try {
      const response = await fetch("/api/vocabulary/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: word.id, state }),
      });
      if (!response.ok) throw new Error();
      setStates((current) => ({ ...current, [word.id]: state }));
    } catch {
      setSaveError(true);
      return;
    } finally {
      savingRef.current = false;
      setSaving(false);
    }

    navigate(1);
  }

  function handleDeckKey(event: KeyboardEvent<HTMLElement>) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    navigate(event.key === "ArrowLeft" ? -1 : 1);
  }

  function handleCardClick(event: MouseEvent<HTMLButtonElement>) {
    const pointer = press.current;
    press.current = null;
    if (event.detail !== 0 && pointer) {
      const distance = Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y);
      if (pointer.dragged || distance > tapTolerance) return;
    }
    setFlipped((current) => !current);
  }

  const marked = (state: Mark) => words.filter((item) => states[item.id] === state).length;

  return (
    <>
      <header className="deck-hero">
        {intro}
        <div className="deck-stats">
          <div><b>{words.length}</b><small>Слова в колоде</small></div>
          <div><b>{marked("known")}</b><small>Уже выучено</small></div>
          <div><b>{marked("review")}</b><small>Нужно повторить</small></div>
        </div>
      </header>
      <div className="deck-tabs" role="group" aria-label="Темы слов">
        {sets.map((title) => (
          <button
            type="button"
            aria-pressed={set === title}
            aria-disabled={saving}
            className={set === title ? "active" : ""}
            onClick={() => selectSet(title)}
            key={title}
          >
            {title}
          </button>
        ))}
      </div>

      <section className="deck-card" aria-label={`Карточки. ${set}`} onKeyDown={handleDeckKey}>
        <div className="deck-korean">
          <button
            ref={flipButton}
            type="button"
            className="deck-flip"
            aria-label="Перевернуть карточку"
            aria-pressed={flipped}
            aria-describedby={cardTextId}
            onPointerDownCapture={(event) => {
              if (!event.isPrimary) return;
              press.current = { x: event.clientX, y: event.clientY, dragged: false };
            }}
            onClick={handleCardClick}
          >
            <MotionScope layout>
              <AnimatePresence initial={false} custom={travel} key={`${set}-${reduced}`}>
                <CardSlide
                  key={page.sequence}
                  word={word}
                  mark={mark}
                  flipped={flipped}
                  reduced={reduced}
                  saving={saving}
                  travel={travel}
                  onDrag={(_, { offset }) => {
                    if (press.current && Math.hypot(offset.x, offset.y) > tapTolerance) {
                      press.current.dragged = true;
                    }
                  }}
                  onSwipe={navigate}
                />
              </AnimatePresence>
            </MotionScope>
          </button>
          <span className="sr-only" id={cardTextId}>
            {flipped ? word.russian : <><span lang="ko">{word.korean}</span> {word.romanization}</>}
            {mark && ` · ${markLabels[mark]}`}
          </span>

          <div className="deck-pager" role="group" aria-label="Перелистывание карточек">
            <button type="button" aria-label="Предыдущая карточка" aria-disabled={saving} onClick={() => navigate(-1)}>
              ←
            </button>
            <div className="deck-progress">
              <p className="deck-count" role="status">
                <span aria-hidden="true">{index + 1} / {currentWords.length}</span>
                <span className="sr-only">Карточка {index + 1} из {currentWords.length}</span>
              </p>
              <ol className="deck-dots" role="list" aria-label="Отметки карточек">
                {currentWords.map((card, position) => {
                  const cardMark = getMark(states[card.id]);
                  return (
                    <li
                      key={card.id}
                      aria-current={position === index ? "true" : undefined}
                      data-mark={cardMark}
                    >
                      <span className="sr-only">
                        Карточка {position + 1} · {cardMark ? markLabels[cardMark] : "Без отметки"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            <button type="button" aria-label="Следующая карточка" aria-disabled={saving} onClick={() => navigate(1)}>
              →
            </button>
          </div>
        </div>

        <div className="deck-card-body">
          <noscript><p>{word.russian}</p></noscript>
          <div className="deck-example">
            <b lang="ko">{word.example}</b>
            <span>{word.exampleRu}</span>
          </div>
          <button type="button" className="deck-sound" onClick={() => speak(word.example)}>
            Слушать фразу
          </button>
          <div className="deck-actions">
            <button type="button" className="review" aria-disabled={saving} onClick={() => void save("review")}>
              Нужно повторить
            </button>
            <button type="button" className="known" aria-disabled={saving} onClick={() => void save("known")}>
              Знаю ✓
            </button>
          </div>
          <p className="deck-status" role="status" data-error={saveError}>
            {saveError ? "Не удалось сохранить отметку. Попробуй ещё раз." : saving ? "Сохраняю отметку…" : ""}
          </p>
        </div>
      </section>

      <section className="deck-quiz">
        <h2>Быстрая проверка</h2>
        <p>Что означает <b lang="ko">{word.korean}</b>?</p>
        <div className="deck-choices">
          {choices.map((choice) => (
            <button
              type="button"
              aria-pressed={quiz === choice}
              className={quiz === choice ? (choice === word.russian ? "correct" : "incorrect") : ""}
              onClick={() => setQuiz(choice)}
              key={choice}
            >
              {choice}
            </button>
          ))}
        </div>
        <p role="status">
          {quiz && (quiz === word.russian
            ? "Верно. Теперь закрепи слово кнопкой «Знаю»."
            : "Не совсем. Послушай пример ещё раз и попробуй снова.")}
        </p>
      </section>
    </>
  );
}
