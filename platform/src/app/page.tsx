import { AuthActions } from "./components/auth-actions";

const pillars = [
  { tag: "SPEAK", title: "Speaking Studio", copy: "Запиши реплику, сравни попытки и получи понятный план следующей практики." },
  { tag: "RECALL", title: "Word Deck", copy: "Карточки сами возвращаются в нужный момент — до того, как слово успело забыться." },
  { tag: "WATCH", title: "K-Scene", copy: "Мини-сцены, живые реплики, shadowing и словарь прямо из диалога." },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="topbar" aria-label="Главное меню">
        <a className="wordmark" href="#top"><span>ㄱ</span>K‑Lab</a>
        <p className="edition">KOREAN FIELD NOTES · 01</p>
        <div className="nav-cluster"><a className="nav-link" href="#roadmap">Смотреть путь <span>↗</span></a><AuthActions /></div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">한국어를 나의 언어로</p>
          <h1>Корейский —<br /><em>как личная история,</em><br />а не набор правил.</h1>
          <p className="lead">K‑Lab собирает уроки, речь, слова и цели поступления в один понятный маршрут. Учишься — видишь, что именно получилось.</p>
          <div className="hero-actions">
            <a className="ink-button" href="/sign-up">Начать маршрут <span>→</span></a>
            <button className="text-button" type="button">Как устроен K‑Lab</button>
          </div>
        </div>

        <aside className="route-card" aria-label="Пример маршрута ученика">
          <div className="route-stamp">СЕГОДНЯ · 12 МИН</div>
          <p className="route-number">01 <span>/ 04</span></p>
          <h2>Новый разговор</h2>
          <p>Знакомство, страна, предметы вокруг тебя.</p>
          <div className="route-line"><i /><i /><i className="muted" /><i className="muted" /></div>
          <div className="route-footer"><span>안녕하세요</span><b>→</b></div>
        </aside>
      </section>

      <section className="signal" aria-label="Принципы платформы">
        <p>НЕ ПРОСТО «ПРОШЛА УРОК»</p>
        <div><span>СЛУШАЮ</span><b>·</b><span>ГОВОРЮ</span><b>·</b><span>ВСПОМИНАЮ</span><b>·</b><span>ПРИМЕНЯЮ</span></div>
      </section>

      <section className="pillars" id="roadmap">
        <div className="section-heading"><p>ЛАБОРАТОРИИ</p><h2>Один язык.<br />Три способа стать увереннее.</h2></div>
        <div className="pillar-grid">
          {pillars.map((pillar, index) => (
            <article className={`pillar pillar-${index + 1}`} key={pillar.tag}>
              <span className="pillar-tag">{pillar.tag} · 0{index + 1}</span>
              <div className="glyph" aria-hidden="true">{index === 0 ? "◌" : index === 1 ? "ㅁ" : "⌁"}</div>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <button type="button" aria-label={`Открыть ${pillar.title}`}>→</button>
            </article>
          ))}
        </div>
      </section>

      <section className="promise">
        <p className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</p>
        <blockquote>«Не показываем цифры ради цифр. Показываем следующий маленький шаг.»</blockquote>
        <div className="promise-notes"><span>серия занятий</span><span>ошибки без стыда</span><span>реальный прогресс речи</span></div>
      </section>

      <footer><span>K‑LAB · 2026</span><span>BUILT FOR CURIOUS LEARNERS</span></footer>
    </main>
  );
}
