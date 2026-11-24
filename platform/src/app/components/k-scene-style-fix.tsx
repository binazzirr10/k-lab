const sceneCss = `
.scene-hub,.scene-player{width:min(1120px,calc(100% - 40px));margin:35px auto 80px;font-family:Arial,sans-serif}
.scene-hero{display:grid;grid-template-columns:1.15fr .85fr;gap:24px;align-items:end;padding-bottom:30px;border-bottom:1px solid #15251e}
.scene-hero span{color:#9e2330;font-size:12px;font-weight:700;letter-spacing:.12em}
.scene-hero h1{margin:12px 0 0;font:500 clamp(38px,6vw,74px)/1.02 Georgia,serif;letter-spacing:-.03em}
.scene-hero p{margin:12px 0 0;color:#4c5c53;font-size:14px;line-height:1.6}
.scene-hero aside{padding:20px;border:1px solid #15251e;background:#15251e;color:#fffdf8}
.scene-hero aside b{color:#dcbf6b;font-size:12px;letter-spacing:.1em}
.scene-hero aside p{color:#d0dbd2;font-size:12px}
.scene-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:28px}
.scene-card{border:1px solid #15251e;background:#fffdf8;color:#15251e;text-decoration:none}
.scene-card figure{position:relative;height:260px;margin:0;overflow:hidden;background:#294c3f}
.scene-card figure>img:first-child{width:100%;height:100%;object-fit:cover;opacity:.88}
.scene-card figure>img:last-child{position:absolute;bottom:-4px;left:8%;max-width:74%;max-height:92%;object-fit:contain;filter:drop-shadow(0 8px 8px #06150c80)}
.scene-card>div{padding:19px}
.scene-card small{color:#9e2330;font-size:12px;font-weight:700;letter-spacing:.1em}
.scene-card h2{margin:12px 0 7px;font:500 30px Georgia,serif}
.scene-card p{margin:0;color:#4c5c53;font-size:12px}
.scene-stage{position:relative;min-height:460px;overflow:hidden;border:1px solid #15251e;background:#294c3f}
.scene-stage-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.78}
.scene-stage-cast{position:absolute;z-index:2;bottom:-8px;left:7%;max-width:72%;max-height:93%;object-fit:contain;filter:drop-shadow(0 12px 12px #06150c85);transform-origin:bottom}
.scene-player-caption{position:absolute;z-index:3;right:22px;top:24px;width:min(350px,44%);padding:17px;border:1px solid #15251e;background:#fffdf8;box-shadow:5px 5px #dcbf6b}
.scene-player-caption small{color:#9e2330;font-size:12px;font-weight:700;letter-spacing:.1em}
.scene-player-caption b{display:block;margin-top:8px;font:500 23px Arial}
.scene-player-caption span{display:block;margin-top:6px;color:#4c5c53;font-size:12px}
.scene-controls{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}
.scene-controls button,.scene-controls a{padding:12px 14px;border:1px solid #15251e;background:#fffdf8;color:#15251e;text-decoration:none;font:700 12px Arial;letter-spacing:.07em}
.scene-controls button.primary{background:#15251e;color:#fffdf8}
.scene-script{margin-top:20px;padding:24px;border:1px solid #15251e;background:#fffdf8}
.scene-script h2{margin:0 0 14px;font:500 29px Georgia,serif}
.scene-line{display:grid;grid-template-columns:80px 1fr auto;gap:12px;align-items:start;padding:14px 0;border-top:1px solid #15251e2e}
.scene-line.active{margin:0 -10px;padding:14px 10px;background:#d9e6db}
.scene-line small{color:#9e2330;font-size:12px;font-weight:700}
.scene-line b{font:600 18px Arial}
.scene-line span{display:block;margin-top:4px;color:#4c5c53;font-size:12px}
.scene-line button{border:1px solid #15251e;background:#fffdf8;width:31px;height:31px}
.scene-note{margin-top:20px;padding:20px;border:1px solid #15251e;background:#e9efe5;color:#536158;font-size:13px;line-height:1.55}
@media(max-width:760px){.scene-hub,.scene-player{width:calc(100% - 28px)}
.scene-hero{grid-template-columns:1fr}
.scene-grid{grid-template-columns:1fr}
.scene-stage{min-height:390px}
.scene-player-caption{width:62%;right:12px;top:12px}
.scene-card figure{height:230px}}

.scene-hero h1, .scene-card h2, .scene-script h2 { letter-spacing: -.03em; line-height: 1.04; overflow-wrap: anywhere; }
.scene-hero aside { box-shadow: 4px 4px #dcbf6b; }
.scene-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
.scene-card { box-shadow: 4px 4px #15251e; }
.scene-controls a { display: inline-flex; align-items: center; }
.scene-controls button:disabled { color: #4c5c53; background: #e9efe5; }
.scene-line, .scene-line.active { margin: 0; padding: 14px 10px; }
.scene-line { grid-template-columns: minmax(50px,80px) minmax(0,1fr) 44px; }
.scene-line button { width: 44px; height: 44px; }
.scene-line.active { box-shadow: inset 3px 0 #294c3f; }
.scene-line.speaking, .scene-player-caption.speaking { background: #f2dc98; }
.scene-line.speaking { box-shadow: inset 4px 0 #9e2330; }
.scene-line.speaking button { animation: learning-mark var(--dur-ui, 220ms) var(--ease-out, cubic-bezier(.23,1,.32,1)); }
.scene-result { min-block-size: 6rem; display: flow-root; }
.scene-note { animation: learning-mark var(--dur-enter, 520ms) var(--ease-out, cubic-bezier(.23,1,.32,1)); }
@media (max-width: 780px) {
  .scene-hero, .scene-grid { grid-template-columns: minmax(0,1fr); }
}
@media (max-width: 550px) {
  .scene-stage { display: grid; align-items: end; justify-items: center; padding: 250px 16px 16px 12px; }
  .scene-player-caption { position: relative; inset: auto; width: min(100%,350px); }
  .scene-script { padding: 14px; }
  .scene-line { grid-template-columns: minmax(0,1fr) 44px; gap: 4px 8px; }
  .scene-line > small { grid-column: 1; }
  .scene-line > div { grid-row: 2; }
  .scene-line button { grid-column: 2; grid-row: 1 / 3; }
}
`;
export function KSceneStyleFix(){return <style>{sceneCss}</style>}
