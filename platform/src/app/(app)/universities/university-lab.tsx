"use client";

import Link from "next/link";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import {
  cities, COMPARE_LIMIT, documents, emptyEntry, fieldName, fields, matchUniversities, NOTE_LIMIT, readiness, statuses, steps,
  universityCatalog, type Entry, type Field, type Planner, type Status, type University,
} from "@/lib/universities";
import s from "./university-lab.module.css";

type Lab = { saved: string[]; planner: Planner };
type Props = Lab & { connected: boolean; signedIn: boolean; pro: boolean; today: string };
type SaveState = "idle" | "saving" | "saved" | "error";

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
    else setState("saved");
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
  return { lab, change, state, retry: () => void save.current() };
}

export function UniversityLab({ saved: initialSaved, planner: initialPlanner, connected, signedIn, pro, today }: Props) {
  const { lab, change, state, retry } = useAutosave({ saved: initialSaved, planner: initialPlanner }, signedIn && connected, pro);
  const { saved, planner } = lab;
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [field, setField] = useState<Field | "">("");
  const canSave = signedIn && connected;
  const plan = (patch: Partial<Planner>) => change({ saved, planner: { ...planner, ...patch } });
  const entry = (id: string, patch: Partial<Entry>) => plan({ entries: { ...planner.entries, [id]: { ...emptyEntry, ...planner.entries[id], ...patch } } });
  const toggleSaved = (id: string) => change({ saved: toggle(saved, id), planner });

  const needle = query.trim().toLowerCase();
  const shown = universityCatalog.filter((item) => (!city || item.city.includes(city)) && (!field || item.fields.includes(field))
    && (!needle || `${item.name} ${item.korean} ${item.city} ${item.about}`.toLowerCase().includes(needle)));
  const ready = readiness(planner.done);
  const next = saved.map((id) => planner.entries[id]?.deadline).filter((date): date is string => !!date && date >= today).sort()[0];
  const compared = planner.compare.map(find).filter((item): item is University => !!item);
  const matches = pro ? matchUniversities(planner.field, planner.city) : [];

  return <main className={s.main}>
    <header className={s.hero}>
      <div><h1>University Lab</h1><p>Найди университет в Корее, собери свой список и подготовься к поступлению шаг за шагом.</p></div>
      <dl className={s.facts}>
        <div><dt>В моём списке</dt><dd>{saved.length}</dd></div>
        {pro && <div><dt>Документы</dt><dd>{ready.percent}%</dd></div>}
        {pro && <div><dt>Ближайший срок</dt><dd>{next ? daysLeft(next, today) : "—"}</dd></div>}
      </dl>
    </header>

    {!signedIn && <p className={s.notice}>Каталог открыт для всех. <Link href="/sign-in">Войди</Link>, чтобы сохранять университеты в личный кабинет.</p>}
    {signedIn && !connected && <p className={s.notice} role="alert">Не удалось загрузить твой список. Обнови страницу, чтобы сохранять изменения.</p>}

    {saved.length > 0 && <section className={s.section} aria-labelledby="lab-list">
      <h2 id="lab-list">Мой список</h2>
      <ul className={s.saved}>{saved.map(find).filter((item): item is University => !!item).map((item) => {
        const own = planner.entries[item.id] ?? emptyEntry;
        return <li key={item.id}>
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
        </li>;
      })}</ul>
      {pro && <p className={s.hint}>Срок впиши сам с официального сайта: у каждой программы он свой.</p>}
    </section>}

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
        {matches.length > 0 ? <ol className={s.matches}>{matches.map(({ university, inField, inCity }) => <li key={university.id}>
          <div><h3>{university.name}</h3><p>{[inField && planner.field && fieldName(planner.field), inCity ? planner.city : university.city].filter(Boolean).join(" · ")}</p></div>
          <SaveButton on={saved.includes(university.id)} disabled={!canSave} name={university.name} onClick={() => toggleSaved(university.id)} />
        </li>)}</ol> : <p className={s.hint}>Выбери направление или город, и здесь появятся подходящие университеты.</p>}
      </section>

      <section className={s.section} aria-labelledby="lab-compare">
        <h2 id="lab-compare">Сравнение</h2>
        {compared.length > 0 ? <div className={s.tableWrap} tabIndex={0} role="region" aria-labelledby="lab-compare"><table className={s.table}>
          <thead><tr><th scope="col"><span className={s.srOnly}>Параметр</span></th>{compared.map((item) => <th scope="col" key={item.id}>{item.name}
            <button type="button" aria-label={`Убрать ${item.name} из сравнения`} onClick={() => plan({ compare: toggle(planner.compare, item.id) })}>×</button></th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Город</th>{compared.map((item) => <td key={item.id}>{item.city}</td>)}</tr>
            <tr><th scope="row">Направления</th>{compared.map((item) => <td key={item.id}>{item.fields.map(fieldName).join(", ")}</td>)}</tr>
            <tr><th scope="row">Мой срок</th>{compared.map((item) => { const date = planner.entries[item.id]?.deadline; return <td key={item.id}>{date ? daysLeft(date, today) : "не указан"}</td>; })}</tr>
            <tr><th scope="row">Требования</th>{compared.map((item) => <td key={item.id}><a href={item.url} target="_blank" rel="noreferrer">Официальный сайт ↗</a></td>)}</tr>
          </tbody>
        </table></div> : <p className={s.hint}>Нажми «Сравнить» в каталоге. Можно выбрать до трёх университетов.</p>}
      </section>

      <section className={s.section} aria-labelledby="lab-check">
        <h2 id="lab-check">Подготовка</h2>
        <div className={s.progress} role="progressbar" aria-label="Готовность документов" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready.percent}><span style={{ transform: `scaleX(${ready.percent / 100})` }} /></div>
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
      <p className={s.count} role="status">Найдено: {shown.length}</p>
      {shown.length === 0 && <p className={s.hint}>Ничего не нашли. <button type="button" className={s.reset} onClick={() => { setQuery(""); setCity(""); setField(""); }}>Сбросить фильтры</button></p>}
      <ul className={s.catalog}>{shown.map((item, i) => <li key={item.id} style={{ "--i": Math.min(i, 8) } as CSSProperties}>
        <div className={s.name}><h3>{item.name}</h3><span lang="ko">{item.korean}</span></div>
        <div className={s.about}><b>{item.city}</b><p>{item.about}</p><a href={item.url} target="_blank" rel="noreferrer">Официальный сайт ↗</a></div>
        <div className={s.actions}>
          <SaveButton on={saved.includes(item.id)} disabled={!canSave} name={item.name} onClick={() => toggleSaved(item.id)} />
          {pro && <button type="button" className={s.secondary} aria-pressed={planner.compare.includes(item.id)}
            disabled={!planner.compare.includes(item.id) && planner.compare.length >= COMPARE_LIMIT}
            onClick={() => plan({ compare: toggle(planner.compare, item.id) })}>{planner.compare.includes(item.id) ? "В сравнении" : "Сравнить"}</button>}
        </div>
      </li>)}</ul>
      <p className={s.hint}>Стоимость, баллы и сроки меняются каждый год, поэтому их здесь нет. Смотри официальный сайт.</p>
    </section>

    <p className={s.saveState} role="status" data-state={state}>
      {state === "saving" ? "Сохраняем…" : state === "saved" ? "Сохранено" : state === "error" ? <>Не удалось сохранить. <button type="button" onClick={retry}>Повторить</button></> : ""}
    </p>
  </main>;
}

function SaveButton({ on, disabled, name, onClick }: { on: boolean; disabled: boolean; name: string; onClick: () => void }) {
  return <button type="button" className={s.save} aria-pressed={on} disabled={disabled} aria-label={on ? `Убрать ${name} из списка` : `Сохранить ${name}`} onClick={onClick}>
    <span className={s.seal} aria-hidden="true" lang="ko">찜</span>{on ? "В списке" : "Сохранить"}
  </button>;
}

function Checks({ title, items, done, onToggle }: { title: string; items: readonly (readonly [string, string])[]; done: string[]; onToggle: (id: string) => void }) {
  return <fieldset className={s.check}><legend>{title}</legend>
    {items.map(([id, name]) => <label key={id}><input type="checkbox" checked={done.includes(id)} onChange={() => onToggle(id)} /><span>{name}</span></label>)}
  </fieldset>;
}
