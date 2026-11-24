const learningInteractions = `
:where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) :is(button,a,input):focus-visible {
  outline: 2px solid #9e2330;
  outline-offset: 3px;
  box-shadow: 0 0 0 3px #fffdf8;
}

:where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) :is(button,a) {
  min-height: 44px;
}
:where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) button {
  min-width: 44px;
  transition: transform var(--dur-press, 140ms) var(--ease-out, cubic-bezier(.23,1,.32,1));
}
:where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) button:enabled:active {
  transform: scale(.97);
}
:where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) button:disabled {
  cursor: default;
}

@media (hover:hover) and (pointer:fine) {
  :where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) :is(button:enabled,a):hover {
    text-decoration: underline;
    text-underline-offset: .2em;
  }
}

@keyframes learning-arrive {
  from { transform: translateY(7px); opacity: .7; }
}
@keyframes learning-mark {
  from { transform: translateY(3px) rotate(-2deg); opacity: .7; }
}

@media (prefers-reduced-motion: reduce) {
  :where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) * {
    animation: none !important;
    transition: none !important;
  }
  :where(.learn-nav,.learn-wrap,.scene-hub,.scene-player,.deck-wrap) button:enabled:active {
    transform: none;
  }
}
`;

export function LessonStyleFix() {
  return <style>{learningInteractions}</style>;
}
