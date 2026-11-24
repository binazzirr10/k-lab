import Link from "next/link";
import { AuthActions } from "./components/auth-actions";
import { PillarGrid } from "./components/motion/pillar-grid";

const pillarRoutes = ["https://k-lab-two.vercel.app/speaking.html", "/vocabulary", "/k-scene"];

const pillars = [
  { tag: "РЕЧЬ", title: "Speaking Lab", copy: "Запиши фразу из урока и прочитай AI‑отзыв: что он услышал и что стоит повторить." },
  { tag: "СЛОВА", title: "Word Deck", copy: "Слова по темам уроков с озвучкой и примерами. Отмечай, что знаешь и что хочешь повторить." },
  { tag: "СЦЕНЫ", title: "K-Scene", copy: "Короткие диалоги к урокам с переводом. Слушай реплики и повторяй их вслух." },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Главное меню">
        <a className="wordmark" href="#top"><span>ㄱ</span>K‑Lab</a>
        <p className="edition">КОРЕЙСКИЙ ДЛЯ НАЧИНАЮЩИХ</p>
        <div className="nav-cluster"><a className="nav-link" href="#roadmap">Смотреть разделы <span>↗</span></a><AuthActions /></div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">한국어를 나의 언어로</p>
          <h1>Корейский A1:<br /><em>первый разговор</em><br />за четыре урока.</h1>
          <p className="lead">Научись здороваться, называть своё имя и страну, спрашивать «что это?» и рассказывать о своём дне. Объяснения на русском, фразы с озвучкой.</p>
          <div className="hero-actions">
            <Link className="ink-button" href="/sign-up">Начать учиться <span>→</span></Link>
            <a className="text-button" href="#roadmap">Как устроен K‑Lab</a>
          </div>
        </div>

        <aside className="route-card" aria-label="Программа курса">
          <div className="route-stamp">КУРС A1 · 4 УРОКА</div>
          <p className="route-number">01 <span>/ 04</span></p>
          <h2>Первый разговор</h2>
          <p>Знакомство, страна, предметы вокруг и твой день.</p>
          <div className="route-line"><i /><i /><i className="muted" /><i className="muted" /></div>
          <div className="route-footer"><span>안녕하세요</span><b>→</b></div>
        </aside>
      </section>

      <section className="signal" aria-label="Что есть в уроках">
        <p>ЧТО ЕСТЬ В КАЖДОМ УРОКЕ</p>
        <div><span>ОЗВУЧКА</span><b>·</b><span>РЕЧЬ</span><b>·</b><span>ГРАММАТИКА</span><b>·</b><span>МИНИ‑ТЕСТ</span></div>
      </section>

      <section className="pillars" id="roadmap">
        <div className="section-heading"><p>РАЗДЕЛЫ K‑LAB</p><h2>Кроме уроков:<br />речь, слова и диалоги.</h2></div>
        <PillarGrid>
          {pillars.map((pillar, index) => (
            <article className={`pillar pillar-${index + 1}`} key={pillar.tag}>
              <span className="pillar-tag">{pillar.tag} · 0{index + 1}</span>
              <div className="glyph" aria-hidden="true">{index === 0 ? "◌" : index === 1 ? "ㅁ" : "⌁"}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <Link className="pillar-link" href={pillarRoutes[index]} aria-label={`Открыть ${pillar.title}`}>→</Link>
            </article>
          ))}
        </PillarGrid>
      </section>

      <section className="promise">
        <p className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p>
        <blockquote>Кабинет показывает, какие уроки пройдены и какое задание следующее.</blockquote>
        <div className="promise-notes"><span>серия дней</span><span>XP за уроки</span><span>прогресс по урокам</span></div>
      </section>

      <footer><span>K‑LAB · 2026</span><span>КУРС КОРЕЙСКОГО ЯЗЫКА A1</span></footer>
    </main>
  );
}
