export function HangulIllustration() {
  return <svg viewBox="0 0 720 610" aria-hidden="true" className="hangul-illustration" fill="none">
    <defs>
      <linearGradient id="hangul-glass" x2=".83" y2="1">
        <stop stopColor="#fefdf7"/><stop offset=".27" stopColor="#e4ead9"/>
        <stop offset=".53" stopColor="#c0cbb2"/><stop offset=".74" stopColor="#eef1e4"/>
        <stop offset="1" stopColor="#a6b498"/>
      </linearGradient>
      <linearGradient id="hangul-edge" x2=".73" y2="1">
        <stop stopColor="#fffef7"/><stop offset=".44" stopColor="#f1f3e7"/>
        <stop offset=".7" stopColor="#80916f"/><stop offset="1" stopColor="#c2cbb2"/>
      </linearGradient>
      <filter id="hangul-ghost"><feGaussianBlur stdDeviation="15"/></filter>
      <filter id="hangul-shadow"><feGaussianBlur stdDeviation="11"/></filter>
      <filter id="hangul-caustic"><feGaussianBlur stdDeviation="6"/></filter>
      <g id="hangul-han" fillRule="evenodd">
        <path d="M30 1h57v13H30zM4 27h111v17H4zM59 55c-27 0-44 13-44 32s17 32 44 32 46-13 46-32-19-32-46-32Zm0 18c16 0 25 6 25 14s-9 14-25 14-25-6-25-14 9-14 25-14Z"/>
        <path d="M136 9h24v44h38v20h-38v55h-24zM21 136h25v40h126v23H21z"/>
      </g>
      <g id="hangul-geul">
        <path d="m26 3 156-2v53h-23V24L26 25zM2 71l207-3v22L2 93zM26 108l156-1v53l-132 1v20l138-1v21L25 203v-60l132-1v-16l-131 1z"/>
      </g>
      <g id="hangul-mal" fillRule="evenodd">
        <path d="M5 10 104 8v92L5 102zM28 31v49l53-1V30zM132 0h24v45h37v19h-37v45h-24zM17 119l155-2v48H42v19l137-2v21l-162 2v-58l130-1v-10l-130 1z"/>
      </g>
    </defs>
    <g fill="#859376" opacity=".21" filter="url(#hangul-ghost)">
      <use href="#hangul-han" transform="translate(90 110) rotate(-15) skewX(23) scale(1 .9)"/>
      <use href="#hangul-geul" transform="translate(480 154) rotate(18) skewX(-19)"/>
      <use href="#hangul-mal" transform="translate(313 432) rotate(-10) skewX(24)"/>
    </g>
    <g fill="#829170" opacity=".20" filter="url(#hangul-shadow)">
      <use href="#hangul-han" transform="translate(157 132) rotate(-12) skewX(11)"/>
      <use href="#hangul-geul" transform="translate(429 199) rotate(12) skewX(-11)"/>
      <use href="#hangul-mal" transform="translate(290 394) rotate(-10) skewX(12)"/>
    </g>
    <g stroke="#fffef8" strokeWidth="16" opacity=".85" filter="url(#hangul-caustic)">
      <path d="M208 314l116-24m166 76 98 24M340 574l130-24"/>
    </g>
    <g fill="#95a385" stroke="#a4b391" strokeWidth="8" strokeLinejoin="round">
      <use href="#hangul-han" transform="translate(135 105) rotate(-12) skewX(8)"/>
      <use href="#hangul-geul" transform="translate(419 172) rotate(12) skewX(-8)"/>
      <use href="#hangul-mal" transform="translate(267 366) rotate(-10) skewX(8)"/>
    </g>
    <g fill="url(#hangul-glass)" stroke="url(#hangul-edge)" strokeWidth="5" strokeLinejoin="round">
      <use href="#hangul-han" transform="translate(125 96) rotate(-12) skewX(8)"/>
      <use href="#hangul-geul" transform="translate(412 162) rotate(12) skewX(-8)"/>
      <use href="#hangul-mal" transform="translate(258 356) rotate(-10) skewX(8)"/>
    </g>
  </svg>;
}
