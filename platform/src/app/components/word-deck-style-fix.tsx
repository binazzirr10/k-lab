const deckCss = `
.deck-wrap{width:min(1120px,calc(100% - 40px));margin:35px auto 80px;font-family:Arial,sans-serif}
.deck-hero{display:grid;grid-template-columns:1.15fr .85fr;gap:20px;padding-bottom:30px;border-bottom:1px solid #15251e}
.deck-hero span{color:#9e2330;font-size:12px;font-weight:700;letter-spacing:.12em}
.deck-hero h1{margin:12px 0 0;font:500 clamp(36px,6vw,72px)/1.02 Georgia,serif;letter-spacing:-.03em}
.deck-hero p{margin:12px 0 0;max-width:560px;color:#4c5c53;font-size:14px;line-height:1.6}
.deck-stats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid #15251e;border-left:1px solid #15251e}
.deck-stats div{padding:19px;border-right:1px solid #15251e;border-bottom:1px solid #15251e;background:#e9efe5}
.deck-stats b{display:block;font:500 32px Georgia,serif}
.deck-stats small{color:#4c5c53;font-size:12px;letter-spacing:.08em}
.deck-tabs{display:flex;flex-wrap:wrap;gap:8px;margin:27px 0 17px}
.deck-tabs button{padding:10px 12px;border:1px solid #15251e;background:#fffdf8;color:#15251e;font:700 12px Arial;letter-spacing:.07em}
.deck-tabs button.active{background:#15251e;color:#fffdf8}
.deck-card{display:grid;grid-template-columns:.82fr 1.18fr;min-height:390px;border:1px solid #15251e;background:#fffdf8}
.deck-korean{display:flex;flex-direction:column;justify-content:space-between;padding:32px;background:#d9e6db}
.deck-korean i{color:#9e2330;font:700 12px Arial;letter-spacing:.12em;font-style:normal}
.deck-korean h2{margin:0;font:500 clamp(50px,7vw,85px) Georgia,Arial}
.deck-korean p{margin:0;color:#536158;font-size:13px}
.deck-card-body{padding:32px}
:is(.deck-back, .deck-card-body noscript) h3{margin:0;font:500 35px Georgia,serif}
.deck-card-body>p{color:#4c5c53;font-size:14px}
.deck-example{margin-top:27px;padding:17px;border-left:3px solid #294c3f;background:#edf1ed}
.deck-example b{font:600 19px Arial}
.deck-example span{display:block;margin-top:7px;color:#4c5c53;font-size:12px}
.deck-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:28px}
.deck-actions button,.deck-sound{padding:11px 13px;border:1px solid #15251e;background:#fffdf8;color:#15251e;font:700 12px Arial;letter-spacing:.06em}
.deck-actions button.known{background:#15251e;color:#fffdf8}
.deck-actions button.review{background:#dcbf6b}
.deck-status{margin-top:17px;color:#4c5c53;font-size:12px}
.deck-quiz{margin-top:20px;padding:23px;border:1px solid #15251e;background:#15251e;color:#fffdf8}
.deck-quiz h3{margin:0;font:500 27px Georgia,serif}
.deck-quiz p{color:#d0dbd2;font-size:12px}
.deck-quiz section{display:flex;flex-wrap:wrap;gap:8px}
.deck-quiz button{padding:9px 1.9rem 9px 11px;border:1px solid #dcbf6b;background:transparent;color:#dcbf6b;font:12px Arial}
.deck-quiz button.correct{background:#dcbf6b;color:#15251e}
@media(max-width:780px){.deck-hero,.deck-card{grid-template-columns:1fr}
.deck-stats{margin-top:18px}
.deck-wrap{width:calc(100% - 28px)}
.deck-korean{min-height:240px}
.deck-card-body{padding:24px}}
@media(max-width:500px){.deck-stats{grid-template-columns:1fr}}

.deck-hero { align-items: end; }
.deck-hero h1, .deck-quiz h3, :is(.deck-back, .deck-card-body noscript) h3 { letter-spacing: -.03em; line-height: 1.04; overflow-wrap: anywhere; }
.deck-stats { grid-template-columns: repeat(3,minmax(0,1fr)); }
.deck-stats div { padding: clamp(8px,1.6vw,19px); }
.deck-stats small { letter-spacing: .04em; overflow-wrap: anywhere; }
.deck-card { grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr); box-shadow: 5px 5px #15251e; }
.deck-korean { gap: 16px; padding: clamp(16px,3vw,32px); border-right: 1px solid #15251e; }
.deck-korean h2 { font-size: clamp(36px,4.8vw,64px); line-height: 1.08; overflow-wrap: anywhere; }
.deck-korean .deck-front p { margin-top: .6em; }
.deck-faces { display: grid; transform-style: preserve-3d; transition: transform var(--dur-enter, 520ms) var(--ease-in-out, cubic-bezier(.77,0,.175,1)); }
.deck-faces.flipped { transform: rotateY(180deg); }
.deck-front, .deck-back { grid-area: 1 / 1; min-width: 0; align-self: center; backface-visibility: hidden; }
.deck-back { transform: rotateY(180deg); }
.deck-flip { align-self: start; border: 1px solid #15251e; background: #fffdf8; font-size: 24px; }
.deck-quiz button.incorrect { background: #f5dfdb; color: #631c25; }
@media (scripting: none) {
  .deck-flip { display: none; }
}
@media (max-width: 780px) {
  .deck-card { grid-template-columns: minmax(0,1fr); }
  .deck-korean { min-height: 216px; border-right: 0; border-bottom: 1px solid #15251e; }
}
`;
export function WordDeckStyleFix() { return <style>{deckCss}</style>; }
