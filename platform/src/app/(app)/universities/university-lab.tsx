"use client";

import Link from "next/link";
import { signInFor } from "@/lib/sign-in";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, ViewTransition, type MouseEventHandler, type ReactNode } from "react";
import { getCatalogReturn, rememberCatalog, restoreCatalogRow, universityMorph } from "./university-navigation";
import { RollNumber, SaveSeal, SaveToast, UniversityMotionScope, useMotionRuntime, useUniversityMotion } from "./university-motion";
import {
  cities, COMPARE_LIMIT, documents, emptyEntry, fieldName, fields, matchUniversities, NOTE_LIMIT, readiness, statuses, steps,
  universityCatalog, type Entry, type Field, type Planner, type Status, type University,
} from "@/lib/universities";
import s from "./university-lab.module.css";

type Lab = { saved: string[]; planner: Planner };
type Props = Lab & {
  connected: boolean;
  signedIn: boolean;
  pro: boolean;
  today: string;
  thumbnails: Record<string, { src: string; alt: string } | null>;
};
type SaveState = "idle" | "saving" | "saved" | "error";

const rowEntrance = { opacity: 1, y: 0 };
const rowStart = { opacity: 0, y: 12 };
const rowExit = { opacity: 0, y: -8, transition: { duration: .2 } };
const rowViewport = { once: true, amount: .12 } as const;

function StaticPresence({ children }: { children: ReactNode }) {
  return children;
}

const toggle = (list: string[], id: string) => list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
const find = (id: string) => universityCatalog.find((university) => university.id === id);
const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`) / 86_400_000;

function daysLeft(deadline: string, today: string) {
  const left = day(deadline) - day(today);
  if (left < 0) return "срок прошёл";
  if (left === 0) return "сегодня";
  const form = new Intl.PluralRules("ru").select(left);
  return `${left} ${form === "one" ? "день" : form === "few" ? "дня" : "дней"}`;
}

/** Saves one request at a time and always ends with the latest state. */
function useAutosave(initial: Lab, enabled: boolean, pro: boolean) {
  const [lab, setLab] = useState(initial);
  const [state, setState] = useState<SaveState>("idle");
  const [saveGeneration, setSaveGeneration] = useState(0);
  const work = useRef({ latest: initial, timer: 0, running: false, dirty: false });

  async function flush() {
    const job = work.current;
    window.clearTimeout(job.timer);
    if (job.running || !job.dirty) return;
    job.running = true;
    job.dirty = false;
    setState("saving");
    let ok = false;
    try {
      const response = await fetch("/api/universities", {
        method: "PUT", keepalive: true, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pro ? job.latest : { saved: job.latest.saved }),
      });
      ok = response.ok;
    } catch { /* Reported below. */ }
    job.running = false;
    if (!ok) { job.dirty = true; setState("error"); return; }
    if (job.dirty) void flush();
    else {
      setSaveGeneration((generation) => generation + 1);
      setState("saved");
    }
  }
  const save = useRef(flush);
  useEffect(() => { save.current = flush; });

  useEffect(() => {
    const leave = () => { if (document.visibilityState === "hidden") void save.current(); };
    document.addEventListener("visibilitychange", leave);
    return () => {
      document.removeEventListener("visibilitychange", leave);
      void save.current();
    };
  }, []);

  function change(next: Lab) {
    setLab(next);
    if (!enabled) return;
    const job = work.current;
    job.latest = next;
    job.dirty = true;
    window.clearTimeout(job.timer);
    job.timer = window.setTimeout(() => void save.current(), 600);
  }
  return { lab, change, state, saveGeneration, retry: () => void save.current() };
}

export function UniversityLab({ saved: initialSaved, planner: initialPlanner, connected, signedIn, pro, today, thumbnails }: Props) {
  const main = useRef<HTMLElement>(null);
  const runtime = useUniversityMotion(main);
  const Presence = runtime?.AnimatePresence ?? StaticPresence;
  const Row = runtime?.PresenceRow ?? "li";
  const Section = runtime?.m.section ?? "section";
  const Progress = runtime?.m.span ?? "span";
  const rowMotion = runtime ? {
    layout: "position" as const, initial: rowStart, animate: rowEntrance, exit: rowExit,
    transition: { ...runtime.spring, opacity: { duration: .24 } },
  } : {};
  const { lab, change, state, saveGeneration, retry } = useAutosave({ saved: initialSaved, planner: initialPlanner }, signedIn && connected, pro);
  const { saved, planner } = lab;
  const [catalogReturn] = useState(getCatalogReturn);
  const [query, setQuery] = useState(catalogReturn?.departure?.filters.query ?? "");
  const [city, setCity] = useState(catalogReturn?.departure?.filters.city ?? "");
  const [field, setField] = useState<Field | "">(catalogReturn?.departure?.filters.field ?? "");
  const saveAnchor = useRef<{ row: HTMLElement; top: number } | null>(null);

  useLayoutEffect(() => {
    const request = getCatalogReturn();
    if (request) restoreCatalogRow(request);
  }, []);

  useLayoutEffect(() => {
    const anchor = saveAnchor.current;
    if (!anchor) return;
    saveAnchor.current = null;
    if (anchor.row.isConnected) {
      window.scrollBy({ top: anchor.row.getBoundingClientRect().top - anchor.top, behavior: "instant" });
    }
  }, [saved]);
  const canSave = signedIn && connected;
  const plan = (patch: Partial<Planner>) => change({ saved, planner: { ...planner, ...patch } });
  const entry = (id: string, patch: Partial<Entry>) => plan({ entries: { ...planner.entries, [id]: { ...emptyEntry, ...planner.entries[id], ...patch } } });
  function toggleSaved(id: string, button?: HTMLButtonElement) {
    const row = button?.closest("li");
    if (row) saveAnchor.current = { row, top: row.getBoundingClientRect().top };
    change({ saved: toggle(saved, id), planner });
  }

  const needle = query.trim().toLowerCase();
  const shown = universityCatalog.filter((item) => (!city || item.city.includes(city)) && (!field || item.fields.includes(field))
    && (!needle || `${item.name} ${item.korean} ${item.city} ${item.about}`.toLowerCase().includes(needle)));
  const catalogLayout = shown.map(({ id }) => id).join(",");
  const ready = readiness(planner.done);
  const next = saved.map((id) => planner.entries[id]?.deadline).filter((date): date is string => !!date && date >= today).sort()[0];
  const compared = planner.compare.map(find).filter((item): item is University => !!item);
  const matches = pro ? matchUniversities(planner.field, planner.city) : [];

  return <UniversityMotionScope runtime={runtime} layout>
    <main className={s.main} data-university-page ref={main}>
      <header className={s.hero}>
        <div><h1>University Lab</h1><p>Найди университет в Корее, собери свой список и подготовься к поступлению шаг за шагом.</p></div>
        <dl className={s.facts}>
          <div><dt>В моём списке</dt><dd>{saved.length}</dd></div>
          {pro && <div><dt>Документы</dt><dd>{ready.percent}%</dd></div>}
          {pro && <div><dt>Ближайший срок</dt><dd>{next ? daysLeft(next, today) : "—"}</dd></div>}
        </dl>
      </header>

      {!signedIn && <p className={s.notice}>Каталог открыт для всех. <Link href={signInFor("/universities")}>Войди</Link>, чтобы сохранять университеты в личный кабинет.</p>}
      {signedIn && !connected && <p className={s.notice} role="alert">Не удалось загрузить твой список. Обнови страницу, чтобы сохранять изменения.</p>}

      <Presence initial={false} mode="popLayout">
        {saved.length > 0 && <Section key="saved" className={s.section} aria-labelledby="lab-list" {...rowMotion}>
          <h2 id="lab-list">Мой список</h2>
          <ul className={s.saved}><Presence initial={false} mode="popLayout">{saved.map(find).filter((item): item is University => !!item).map((item) => {
            const own = planner.entries[item.id] ?? emptyEntry;
            return <Row key={item.id} {...rowMotion}>
              <div className={s.savedHead}>
                <h3>{item.name}</h3><span lang="ko">{item.korean}</span>
                <button type="button" onClick={() => toggleSaved(item.id)}>Убрать</button>
              </div>
              {pro && <div className={s.entry}>
                <label>Статус<select value={own.status} onChange={(event) => entry(item.id, { status: event.target.value as Status })}>
                  {statuses.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                </select></label>
                <label>Срок подачи{own.deadline && <em data-late={own.deadline < today}>{daysLeft(own.deadline, today)}</em>}
                  <input type="date" value={own.deadline} min="2020-01-01" max="2099-12-31" onChange={(event) => { if (/^(\d{4}-\d\d-\d\d)?$/.test(event.target.value)) entry(item.id, { deadline: event.target.value }); }} /></label>
                <label className={s.note}>Заметка<textarea value={own.note} maxLength={NOTE_LIMIT} rows={2} placeholder="Программа, вопросы, контакты" onChange={(event) => entry(item.id, { note: event.target.value })} /></label>
              </div>}
            </Row>;
          })}</Presence></ul>
          {pro && <p className={s.hint}>Срок впиши сам с официального сайта: у каждой программы он свой.</p>}
        </Section>}
      </Presence>

      {pro ? <>
        <section className={s.section} aria-labelledby="lab-match">
          <h2 id="lab-match">Подбор</h2>
          <div className={s.filters}>
            <label>Направление<select value={planner.field} onChange={(event) => plan({ field: event.target.value as Field | "" })}>
              <option value="">Не выбрано</option>{fields.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
            </select></label>
            <label>Город<select value={planner.city} onChange={(event) => plan({ city: event.target.value })}>
              <option value="">Любой</option>{cities.map((name) => <option key={name}>{name}</option>)}
            </select></label>
          </div>
          <div className={s.listStage}>
            <ol className={s.matches} data-empty={matches.length === 0}>
              <Presence initial={false} mode="popLayout">
                {matches.map(({ university, inField, inCity }) => <Row key={university.id} {...rowMotion}>
                  <div><h3>{university.name}</h3><p>{[inField && planner.field && fieldName(planner.field), inCity ? planner.city : university.city].filter(Boolean).join(" · ")}</p></div>
                  <SaveButton on={saved.includes(university.id)} disabled={!canSave} name={university.name} onClick={(event) => toggleSaved(university.id, event.currentTarget)} />
                </Row>)}
              </Presence>
            </ol>
            {matches.length === 0 && <p className={s.hint}>Выбери направление или город, и здесь появятся подходящие университеты.</p>}
          </div>
        </section>

        <section className={s.section} aria-labelledby="lab-compare">
          <h2 id="lab-compare">Сравнение</h2>
          <CompareTable items={compared} entries={planner.entries} today={today}
            onRemove={(id) => plan({ compare: toggle(planner.compare, id) })} />
        </section>

        <section className={s.section} aria-labelledby="lab-check">
          <h2 id="lab-check">Подготовка</h2>
          <div className={s.progress} role="progressbar" aria-label="Готовность документов" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready.percent}><Progress {...(runtime ? { initial: false, animate: { scaleX: ready.percent / 100 }, transition: runtime.spring } : {
            style: { transform: `scaleX(${ready.percent / 100})` },
          })} /></div>
          <div className={s.checks}>
            <Checks title={`Документы: ${ready.count} из ${ready.total}`} items={documents} done={planner.done} onToggle={(id) => plan({ done: toggle(planner.done, id) })} />
            <Checks title="Шаги" items={steps} done={planner.done} onToggle={(id) => plan({ done: toggle(planner.done, id) })} />
          </div>
          <p className={s.hint}>Это общий список. Точный набор документов проверь на сайте университета.</p>
        </section>
      </> : <section className={s.locked} aria-labelledby="lab-pro">
        <h2 id="lab-pro">University Hub Pro</h2>
        <p>Подбор по направлению и городу, сравнение трёх университетов, чек-лист документов, свои сроки и заметки. Доступно в Pro+.</p>
        <Link className={s.action} href="/pricing">Смотреть тарифы</Link>
      </section>}

      <section className={s.section} aria-labelledby="lab-catalog">
        <h2 id="lab-catalog">Каталог</h2>
        <div className={s.filters} role="search">
          <label className={s.search}>Поиск<input type="search" value={query} maxLength={60} placeholder="Название, город или направление" onChange={(event) => setQuery(event.target.value)} /></label>
          <label>Город<select value={city} onChange={(event) => setCity(event.target.value)}><option value="">Все города</option>{cities.map((name) => <option key={name}>{name}</option>)}</select></label>
          <label>Направление<select value={field} onChange={(event) => setField(event.target.value as Field | "")}><option value="">Все направления</option>{fields.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></label>
        </div>
        <p className={s.count} role="status">Найдено: <RollNumber value={shown.length} /></p>
        <div className={s.listStage}>
          <ul className={s.catalog}><Presence mode="popLayout">{shown.map((item, index) => {
            const thumbnail = thumbnails[item.id];
            const href = `/universities/${item.id}`;
            const catalogLink = {
              href, transitionTypes: universityMorph,
              onNavigate: () => rememberCatalog(item.id, { query, city, field }),
            };
            return <Row id={`university-${item.id}`} key={item.id} {...(runtime ? {
              layout: "position", layoutDependency: catalogLayout, initial: false, animate: rowEntrance, viewport: rowViewport, exit: rowExit,
              whileInView: catalogReturn ? undefined : { opacity: [.2, 1], y: [14, 0], transition: {
                duration: .44, delay: Math.min(index, 7) * .035, ease: [.16, .8, .24, 1],
              } },
              transition: { layout: runtime.spring },
            } : {})}>
              <div className={s.name}>
                {thumbnail && <Link {...catalogLink} prefetch={true} className={s.thumbnail} data-campus={item.id} aria-label={`Фото кампуса ${item.name}`}>
                  <ViewTransition name={`university-${item.id}`} share="klab-morph" default="none"
                    onShare={() => {
                      document.querySelector(`[data-university-intro="${item.id}"]`)?.setAttribute("data-shared", "");
                    }}>
                    <div className={s.thumbnailFrame}>
                      <Image src={thumbnail.src} alt={thumbnail.alt} fill loading="lazy"
                        sizes="(max-width: 480px) 104px, 148px" />
                    </div>
                  </ViewTransition>
                </Link>}
                <div><h3><Link {...catalogLink}>{item.name}</Link></h3><span lang="ko">{item.korean}</span></div>
              </div>
              <div className={s.about}>
                <b>{item.city}</b><p>{item.about}</p>
                <div className={s.catalogLinks}>
                  <Link {...catalogLink} aria-label={`Читать статью о ${item.name}`}>Читать статью</Link>
                  <a href={item.url} target="_blank" rel="noreferrer">Официальный сайт ↗</a>
                </div>
              </div>
              <div className={s.actions}>
                <SaveButton on={saved.includes(item.id)} disabled={!canSave} name={item.name} onClick={(event) => toggleSaved(item.id, event.currentTarget)} />
                {pro && <button type="button" className={s.secondary} aria-pressed={planner.compare.includes(item.id)}
                  disabled={!planner.compare.includes(item.id) && planner.compare.length >= COMPARE_LIMIT}
                  onClick={() => plan({ compare: toggle(planner.compare, item.id) })}>{planner.compare.includes(item.id) ? "В сравнении" : "Сравнить"}</button>}
              </div>
            </Row>;
          })}</Presence></ul>
          {shown.length === 0 && <p className={s.hint}>Ничего не нашли. <button type="button" className={s.reset} onClick={() => { setQuery(""); setCity(""); setField(""); }}>Сбросить фильтры</button></p>}
        </div>
        <p className={s.hint}>Стоимость, баллы и сроки меняются каждый год, поэтому их здесь нет. Смотри официальный сайт.</p>
      </section>

      <SaveToast state={state} className={s.saveState} generation={saveGeneration}
        error={<>Не удалось сохранить. <button type="button" onClick={retry}>Повторить</button></>} />
    </main>
  </UniversityMotionScope>;
}

function SaveButton({ on, disabled, name, onClick }: { on: boolean; disabled: boolean; name: string; onClick: MouseEventHandler<HTMLButtonElement> }) {
  const runtime = useMotionRuntime();
  const Button = runtime?.m.button ?? "button";
  return <Button type="button" className={s.save} aria-pressed={on} disabled={disabled}
    aria-label={on ? `Убрать ${name} из списка` : `Сохранить ${name}`} onClick={onClick}
    {...(runtime && !disabled ? { whileTap: { scale: .97 }, transition: runtime.spring } : {})}>
    <SaveSeal on={on} className={s.seal} />{on ? "В списке" : "Сохранить"}
  </Button>;
}

function CompareTable({ items, entries, today, onRemove }: {
  items: University[]; entries: Planner["entries"]; today: string; onRemove: (id: string) => void;
}) {
  const runtime = useMotionRuntime();
  const Presence = runtime?.AnimatePresence ?? StaticPresence;
  const Wrap = runtime?.m.div ?? "div";
  const Head = runtime?.PresenceHeader ?? "th";
  const Cell = runtime?.PresenceCell ?? "td";
  const cellMotion = runtime ? {
    layout: "position" as const,
    initial: { opacity: 0, x: 14 }, animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 12, transition: { duration: .18 } },
    transition: { ...runtime.spring, opacity: { duration: .22 } },
  } : {};
  const rows: [string, (item: University) => ReactNode][] = [
    ["Город", (item) => item.city],
    ["Направления", (item) => item.fields.map(fieldName).join(", ")],
    ["Мой срок", (item) => {
      const date = entries[item.id]?.deadline;
      return date ? daysLeft(date, today) : "не указан";
    }],
    ["Требования", (item) => <a href={item.url} target="_blank" rel="noreferrer">Официальный сайт ↗</a>],
  ];

  return <div className={s.listStage}>
    <Presence initial={false} mode="popLayout">
      {items.length > 0 && <Wrap key="table" className={s.tableWrap} tabIndex={0} role="region" aria-labelledby="lab-compare"
        {...(runtime ? { layoutScroll: true, initial: rowStart, animate: rowEntrance, exit: rowExit } : {})}>
        <table className={s.table}>
          <colgroup><col className={s.tableLabel} /><col span={COMPARE_LIMIT} /></colgroup>
          <thead><tr>
            <th scope="col"><span className={s.srOnly}>Параметр</span></th>
            <Presence initial={false} mode="popLayout">
              {items.map((item) => <Head scope="col" key={item.id} {...cellMotion}>{item.name}
                <button type="button" aria-label={`Убрать ${item.name} из сравнения`} onClick={() => onRemove(item.id)}>×</button>
              </Head>)}
            </Presence>
          </tr></thead>
          <tbody>
            {rows.map(([label, render]) => <tr key={label}><th scope="row">{label}</th>
              <Presence initial={false} mode="popLayout">
                {items.map((item) => <Cell key={item.id} {...cellMotion}>{render(item)}</Cell>)}
              </Presence>
            </tr>)}
          </tbody>
        </table>
      </Wrap>}
    </Presence>
    {items.length === 0 && <p className={s.hint}>Нажми «Сравнить» в каталоге. Можно выбрать до трёх университетов.</p>}
  </div>;
}

function Checks({ title, items, done, onToggle }: { title: string; items: readonly (readonly [string, string])[]; done: string[]; onToggle: (id: string) => void }) {
  return <fieldset className={s.check}><legend>{title}</legend>
    {items.map(([id, name]) => <Check key={id} name={name} checked={done.includes(id)} onToggle={() => onToggle(id)} />)}
  </fieldset>;
}

function Check({ name, checked, onToggle }: { name: string; checked: boolean; onToggle: () => void }) {
  const runtime = useMotionRuntime();
  const Fill = runtime?.m.i ?? "i";
  return <label>
    <span className={s.checkCircle}>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <Fill aria-hidden="true" {...(runtime ? {
        initial: false, animate: { scale: checked ? 1 : 0 },
        transition: { ...runtime.spring, damping: 19 },
      } : { style: { transform: `scale(${checked ? 1 : 0})` } })} />
    </span>
    <span className={s.checkText}>{name}</span>
  </label>;
}
