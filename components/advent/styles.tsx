export function AdventStyles() {
  return (
    <style>{`
      .adv-page, .adv-dialog {
        --adv-scene: 0;
        --adv-ink: 0;
        --adv-tension: 0;
        --color-text-primary: var(--text-primary);
        --color-text-secondary: var(--text-secondary);
        --color-surface-bg: var(--surface-bg);
        --color-surface-1: var(--surface-1);
        --color-line-structure: var(--line-structure);
        --color-line-cta: var(--line-structure);
        --adv-paper: color-mix(in srgb, #f4ecd9, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-paper-shade: color-mix(in srgb, #e3d6b8, #9bb64f calc(var(--adv-scene) * 100%));
        --adv-red: color-mix(in srgb, #b3262e, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-red-dark: color-mix(in srgb, #7f1a20, #151c10 calc(var(--adv-scene) * 100%));
        --adv-green: color-mix(in srgb, #1f5c3f, #252c22 calc(var(--adv-scene) * 100%));
        --adv-green-dark: color-mix(in srgb, #133d29, #0c100c calc(var(--adv-scene) * 100%));
        --adv-gold: color-mix(in srgb, #f2c14e, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-gold-soft: color-mix(in srgb, rgba(242, 193, 78, 0.55), #d4f87b30 calc(var(--adv-scene) * 100%));
        --adv-mint: color-mix(in srgb, #9be7c4, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-accent-text: color-mix(in srgb, #b3262e, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-gold-text: color-mix(in srgb, #8a5d00, #d4f87b calc(var(--adv-scene) * 100%));
        --adv-green-text: color-mix(in srgb, #1f7a4d, #d4f87b calc(var(--adv-scene) * 100%));
      }

      .adv-page, .adv-dialog {
        --surface-bg: color-mix(in srgb, #fcf5e9, #07080c calc(var(--adv-scene) * 100%));
        --surface-1: color-mix(in srgb, #eee4d1, #13151c calc(var(--adv-scene) * 100%));
        --text-primary: color-mix(in srgb, #18221a, #eff1e7 calc(var(--adv-ink) * 100%));
        --text-secondary: color-mix(in srgb, #374c3c, #a8b0a6 calc(var(--adv-ink) * 100%));
        --line-structure: color-mix(in srgb, #c4cfc1, #353c33 calc(var(--adv-scene) * 100%));
        background-color: var(--surface-bg);
        color: var(--text-primary);
      }
      .adv-page {
        user-select: none; -webkit-user-select: none;
        isolation: isolate;
        min-height: 100vh;
        background: var(--surface-bg);
        color: var(--text-primary);
        transition: background .3s;
      }
      .adv-atmosphere { z-index: 0; }
      .adv-atmosphere[data-renderer="fallback"] { opacity: 0; }
      .adv-page > section { z-index: 1; }
      .adv-mode-bar {
        display: flex; justify-content: space-between; align-items: center;
        width: 100%; gap: 16px; margin-bottom: 20px;
      }
      .adv-morph-track { width: 100%; height: 2px; background: var(--line-structure); opacity: .6; margin-bottom: 8px; }
      .adv-morph-track span { display: block; width: calc(var(--adv-scene) * 100%); height: 100%; background: var(--adv-gold); box-shadow: 0 0 20px var(--adv-gold); }
      .adv-door { transform: translateY(calc(var(--adv-tension) * 9px * var(--adv-door-dir, 1))) rotate(calc(var(--adv-tension) * -1.5deg * var(--adv-door-dir, 1))); }
      .adv-door:nth-child(2n) { --adv-door-dir: -1; }
      .adv-door-face, .adv-board { transition: border-color 4s, color .3s, box-shadow 4s; }
      .adv-location, .adv-scene-label {
        display: inline-flex; align-items: center; gap: 8px;
        font: 10px/1.5 var(--font-geist-mono), monospace;
        letter-spacing: .1em; text-transform: uppercase;
        color: var(--text-secondary);
      }
      .adv-live-dot { width: 5px; height: 5px; background: var(--adv-green-text); border-radius: 50%; }
      .adv-scene-label { color: var(--adv-accent-text); margin-bottom: 2px; }
      .adv-title-accent { font-family: Georgia, serif; font-style: italic; font-weight: 400; }
      .adv-hero h1 { font-size: clamp(42px, 6.2vw, 82px); letter-spacing: -.055em; }
      .adv-hero > p { max-width: 47ch; }

      .adv-page[data-scene-phase="berlin"], .adv-dialog[data-mode="techno"] { color-scheme: dark; }

      .adv-page[data-scene-phase="berlin"] .adv-hero h1 { font-weight: 750; letter-spacing: -.065em; }

      .adv-page[data-scene-phase="berlin"] .adv-board {
        border-radius: 2px; border-color: var(--line-structure);
        background: linear-gradient(155deg, #171b25ed, #06070bf5);
        box-shadow: 0 30px 100px #0008; backdrop-filter: blur(12px);
      }
      .adv-page[data-scene-phase="berlin"] .adv-garland { background: none; border-bottom: 1px solid var(--line-structure); height: 20px; }
      .adv-page[data-scene-phase="berlin"] .adv-bulb {
        width: 14px; height: 2px; border-radius: 0;
        background: var(--adv-gold); color: var(--adv-gold); animation: none;
        opacity: .6; box-shadow: 0 0 10px var(--adv-gold-soft);
      }
      .adv-page[data-scene-phase="berlin"] :is(.adv-door, .adv-door-face, .adv-door-back, .adv-door-recess) { border-radius: 1px; }
      .adv-page[data-scene-phase="berlin"] .adv-door-face {
        background: linear-gradient(145deg, #262b37, #101219);
        border: 1px solid #596279; color: #e0e6f1; box-shadow: none;
      }
      .adv-page[data-scene-phase="berlin"] .adv-door:nth-child(3n) .adv-door-face { background: #a5b3cc; color: #101219; }
      .adv-page[data-scene-phase="berlin"] .adv-door-face::before { border: 0; border-top: 1px solid currentColor; border-radius: 0; inset: 10px; opacity: .2; }
      .adv-page[data-scene-phase="berlin"] .adv-door.is-today .adv-door-face { background: var(--adv-gold); color: #151c10; animation: none; box-shadow: 0 0 28px var(--adv-gold-soft); }
      .adv-page[data-scene-phase="berlin"] .adv-door.is-today::after { animation: none; }
      .adv-page[data-scene-phase="berlin"] .adv-door-number { font-family: var(--font-geist-mono), monospace; font-weight: 400; letter-spacing: -.09em; }
      .adv-page[data-scene-phase="berlin"] .adv-door-ornament { opacity: .2; }
      .adv-page[data-scene-phase="berlin"] .adv-music-bars span { background: var(--adv-gold); }
      .adv-dialog[data-mode="techno"] { border-color: var(--line-structure); }
      /* The shared overlay uses the light site token; dim the dark scene instead. */
      [data-state]:has(+ .adv-dialog[data-mode="techno"]) { background-color: rgb(5 7 6 / .72); }
      @media (max-width: 639px) {
        .adv-mode-bar { align-items: center; gap: 8px; margin-bottom: 24px; }
        .adv-location { max-width: 95px; text-align: left; font-size: 9px; letter-spacing: .03em; }
        .adv-scene-label { font-size: 9px; letter-spacing: .06em; }
      }


      .adv-page :is(img, svg) { -webkit-user-drag: none; }
      .adv-dialog { user-select: text; -webkit-user-select: text; }
      .adv-audio-controls { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; min-height: 44px; }
      .adv-audio-controls .adv-music { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 10px 16px; border-radius: 24px; font-size: 14px; font-weight: 600; border: 1px solid var(--line-structure); }
      .adv-audio-hint { font-size: 12px; color: var(--text-secondary); }
      .adv-volume { display: flex; align-items: center; gap: 6px; padding: 8px; }
      .adv-volume input { width: 80px; accent-color: var(--adv-accent-text); }
      .adv-dialog-skip { position: absolute; right: 46px; top: 14px; font-size: 11px; padding: 4px 8px; border: 1px solid var(--line-structure); border-radius: 4px; }
      .adv-dialog[data-folded][data-state="open"] { animation: none !important; }
      .adv-dialog[data-arriving] {
        z-index: 102;
        animation: none !important;
        scale: calc(.12 + var(--adv-arrival, 0) * .88);
        filter: blur(calc((1 - var(--adv-arrival, 0)) * 12px));
        opacity: clamp(0, var(--adv-arrival, 0) * 3, 1);
        transform-origin: center;
      }
      .adv-dialog[data-journey="winter"] { z-index: 99; scale: 1; filter: blur(calc((1 - var(--adv-arrival, 0)) * 5px)); }
      .adv-dialog[data-journey="closing"] { z-index: 99; scale: 1; filter: none; opacity: 1; }
      .adv-fold-skip { pointer-events: auto; position: fixed; z-index: 101; right: 20px; bottom: 20px; background: #101219; color: #edf0fa; border: 1px solid #596279; border-radius: 6px; padding: 10px 14px; font-size: 12px; }
      .adv-fold-skip kbd { margin-left: 8px; opacity: .6; }
      .adv-scene-control { position: relative; min-width: 244px; text-align: right; }
      .adv-scene-switch { display: flex; align-items: center; justify-content: flex-end; gap: 12px; min-height: 44px; font-size: 12px; }
      .adv-scene-switch :is(span, label) { display: inline-flex; align-items: center; gap: 6px; }
      .adv-scene-switch [role="switch"] { width: 38px; height: 23px; background: var(--line-structure); }
      .adv-scene-switch [role="switch"][data-state="checked"] { background: var(--adv-gold); }
      .adv-scene-switch [data-slot="switch-thumb"] { width: 19px; height: 19px; background: var(--text-primary); }
      .adv-scene-switch [data-state="checked"] [data-slot="switch-thumb"] { background: #101219; }
      .adv-scene-status { font: 10px/1.5 var(--font-geist-mono), monospace; color: var(--text-secondary); }
      .adv-scene-progress { display: block; height: 2px; background: var(--line-structure); margin-top: 10px; }
      .adv-scene-progress > span { display: block; height: 100%; width: calc(var(--adv-scene) * 100%); background: var(--adv-gold); }
      .adv-title-swap { display: inline-grid; }
      .adv-title-swap > span { grid-area: 1 / 1; }
      .adv-title-day { opacity: clamp(0, 1 - var(--adv-scene) * 2, 1); }
      .adv-title-night { opacity: clamp(0, var(--adv-scene) * 2 - 1, 1); font-weight: 800; color: var(--adv-gold); letter-spacing: -.07em; }
      .adv-figures { pointer-events: none; }
      .adv-figures > * { pointer-events: auto; }
      .adv-figures .adv-santa-figure { position: relative; flex-shrink: 0; pointer-events: none; }
      .adv-santa-harness { opacity: clamp(0, var(--adv-scene) * 2 - .45, 1); }
      .adv-santa-coat { fill: color-mix(in srgb, #b3262e, #191c29 calc(var(--adv-scene) * 100%)); }
      .adv-santa-heart { transform-origin: 70px 146px; transform: scale(calc(1 + var(--adv-pulse, 0) * .12)); }
      .adv-page[data-scene-phase="berlin"] .adv-santa-wave { animation-duration: .6s; }
      .adv-page[data-scene-phase="berlin"] .adv-santa { animation-duration: .6s; }
      .adv-page[data-scene-phase="berlin"] .adv-bulb { opacity: calc(.35 + var(--adv-pulse, 0) * .65); }
      @media (max-width: 639px) {
        .adv-hero { gap: 12px; padding-top: 16px; padding-bottom: 24px; }
        .adv-hero h1 { font-size: 36px; }
        .adv-hero > p { font-size: 14px; line-height: 1.55; }
        .adv-mode-bar { align-items: flex-start; margin-bottom: 10px; }
        .adv-location { padding-top: 14px; }
        .adv-scene-control { min-width: 0; }
        .adv-scene-switch { gap: 7px; font-size: 11px; }
        .adv-scene-switch svg { display: none; }
      }


      html:has(.adv-page) body {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='11' fill='%23dde6f2' stroke='%2361779a' stroke-width='1.5'/%3E%3Ccircle cx='14.5' cy='14.5' r='8.6' fill='%23fff'/%3E%3Ccircle cx='19.5' cy='11.5' r='1.1' fill='%23c3d1e4'/%3E%3Ccircle cx='11.5' cy='18.5' r='1' fill='%23c3d1e4'/%3E%3Ccircle cx='16' cy='20' r='.8' fill='%23c3d1e4'/%3E%3C/svg%3E") 16 16, auto;
      }
      html:has(.adv-page) :is(a, button, summary, label, select, [role='button']) { cursor: pointer; }
      html:has(.adv-page) :is(input, textarea, [contenteditable='true']) { cursor: text; }
      html:has(.adv-page) [role='dialog'] { cursor: auto; }
      html:has(.adv-page) .adv-door.is-locked { cursor: inherit; }

      .adv-eyebrow {
        font-family: var(--font-geist-mono);
        font-size: 11px;
        letter-spacing: .08em;
        text-transform: uppercase;
        color: var(--adv-accent-text);
      }

      /* Garland of lights across the top of the board */
      .adv-garland {
        display: flex;
        justify-content: space-between;
        padding: 0 4%;
        height: 22px;
        background: radial-gradient(ellipse 50% 100% at 50% 0%, transparent 60%, rgba(31, 92, 63, .9) 61%, transparent 66%) repeat-x;
        background-size: 60px 22px;
      }
      .adv-bulb {
        width: 9px;
        height: 13px;
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        margin-top: 8px;
        animation: adv-twinkle 1.6s ease-in-out infinite;
      }
      .adv-bulb:nth-child(4n+1) { background: #ff6b6b; color: #ff6b6b; }
      .adv-bulb:nth-child(4n+2) { background: var(--adv-gold); color: var(--adv-gold); animation-delay: .4s; }
      .adv-bulb:nth-child(4n+3) { background: var(--adv-mint); color: var(--adv-mint); animation-delay: .8s; }
      .adv-bulb:nth-child(4n+4) { background: #7fb4ff; color: #7fb4ff; animation-delay: 1.2s; }
      @keyframes adv-twinkle {
        0%, 100% { opacity: 1; box-shadow: 0 0 10px 2px currentColor; }
        50% { opacity: .45; box-shadow: none; }
      }

      .adv-board {
        border-radius: 14px;
        background:
          repeating-linear-gradient(45deg, rgba(255,255,255,.025) 0 2px, transparent 2px 14px),
          linear-gradient(160deg, var(--adv-green), var(--adv-green-dark));
        border: 1px solid rgba(242, 193, 78, .35);
        box-shadow: 0 30px 80px rgba(0,0,0,.45), inset 0 0 0 6px rgba(0,0,0,.12);
      }

      /* Doors */
      .adv-door {
        position: relative;
        aspect-ratio: 1 / 1;
        perspective: 900px;
        border-radius: 8px;
        cursor: pointer;
        outline: none;
        -webkit-tap-highlight-color: transparent;
      }
      .adv-door:focus-visible { box-shadow: 0 0 0 3px var(--adv-gold); }
      .adv-door-recess {
        position: absolute;
        inset: 0;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px;
        text-align: center;
        background: var(--surface-1);
        box-shadow: inset 0 4px 12px rgba(0,0,0,.35);
        color: var(--text-primary);
      }
      .adv-door-recess-title {
        font-size: 11px;
        line-height: 1.25;
        font-weight: 500;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      @media (min-width: 640px) { .adv-door-recess-title { font-size: 12px; } }
      .adv-door-recess-icon {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: 999px;
        background: rgba(179, 38, 46, .1);
        color: var(--adv-accent-text);
      }
      .adv-door-leaf {
        position: absolute;
        inset: 0;
        transform-origin: left center;
        transform-style: preserve-3d;
        transition: transform 1s cubic-bezier(.3, 1.3, .5, 1);
        z-index: 1;
      }
      /* Past ~100deg the swung-open leaf would cover the neighboring door. */
      .adv-door-leaf.is-open { transform: rotateY(-90deg); }
      .adv-door:hover .adv-door-leaf:not(.is-open):not(.is-locked) { transform: rotateY(-14deg); }
      .adv-door-face, .adv-door-back {
        position: absolute;
        inset: 0;
        border-radius: 8px;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
      .adv-door-face {
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 14px rgba(0,0,0,.3);
      }
      .adv-door-face::before {
        content: "";
        position: absolute;
        inset: 6px;
        border-radius: 5px;
        border: 2px dashed currentColor;
        opacity: .35;
      }
      .adv-door-back {
        transform: rotateY(180deg);
        background: linear-gradient(90deg, var(--adv-paper-shade), var(--adv-paper));
        box-shadow: inset 0 0 0 1px rgba(0,0,0,.1);
      }
      .adv-door-paper { background: var(--adv-paper); color: var(--adv-red); }
      .adv-door-red { background: linear-gradient(150deg, var(--adv-red), var(--adv-red-dark)); color: var(--adv-paper); }
      .adv-door-forest { background: linear-gradient(150deg, #2d7a55, var(--adv-green-dark)); color: var(--adv-paper); }
      .adv-door-number {
        position: relative;
        font-size: clamp(26px, 6vw, 44px);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 1;
      }
      .adv-door-ornament {
        position: absolute;
        right: 12px;
        bottom: 12px;
        opacity: .45;
      }
      .adv-door-lock {
        position: absolute;
        left: 12px;
        top: 12px;
        opacity: .5;
      }
      .adv-door.is-today { z-index: 2; }
      .adv-door.is-today .adv-door-face {
        animation: adv-glow 1.8s ease-in-out infinite;
      }
      .adv-door.is-today::after {
        content: "";
        position: absolute;
        inset: -8px;
        border-radius: 14px;
        background: radial-gradient(circle, var(--adv-gold-soft), transparent 70%);
        filter: blur(8px);
        z-index: 0;
        animation: adv-halo 1.8s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes adv-glow {
        0%, 100% { box-shadow: 0 0 0 2px var(--adv-gold), 0 0 18px 4px var(--adv-gold-soft); }
        50% { box-shadow: 0 0 0 3px var(--adv-gold), 0 0 36px 12px var(--adv-gold-soft); }
      }
      @keyframes adv-halo {
        0%, 100% { opacity: .6; transform: scale(.98); }
        50% { opacity: 1; transform: scale(1.06); }
      }
      .adv-door.is-wiggle .adv-door-leaf { animation: adv-rattle .55s ease-out; }
      @keyframes adv-rattle {
        0%, 100% { transform: none; }
        10% { transform: translate(-3px, 1px) rotate(-4deg); }
        22% { transform: translate(3px, -1px) rotate(3.5deg); }
        36% { transform: translate(-2px, 1px) rotate(-3deg); }
        50% { transform: translate(2px, 0) rotate(2deg); }
        66% { transform: translate(-1px, 0) rotate(-1deg); }
        82% { transform: translate(1px, 0) rotate(.5deg); }
      }

      .adv-toast-msg {
        background: var(--adv-paper);
        color: var(--adv-red-dark);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        animation: adv-toast-in .25s ease-out;
      }
      @keyframes adv-toast-in { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }

      .adv-music {
        background: var(--surface-bg);
        color: var(--text-primary);
        border: 1px solid var(--line-structure);
      }
      .adv-music-bars { display: inline-flex; gap: 2px; align-items: flex-end; height: 12px; }
      .adv-music-bars span { width: 2px; background: var(--adv-red); animation: adv-eq 0.9s ease-in-out infinite; }
      .adv-music-bars span:nth-child(2) { animation-delay: .2s; }
      .adv-music-bars span:nth-child(3) { animation-delay: .4s; }
      @keyframes adv-eq { 0%, 100% { height: 3px; } 50% { height: 12px; } }


      /* Animation stage */
      .adv-stage {
        background:
          radial-gradient(ellipse 70% 80% at 50% 0%, rgba(242,193,78,.14), transparent 70%),
          var(--surface-1);
        border: 1px solid var(--line-structure);
        color: var(--text-primary);
      }

      .adv-pop { animation: adv-pop .5s cubic-bezier(.3,1.6,.5,1) both; }
      @keyframes adv-pop { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
      .adv-slide-in { animation: adv-slide .45s ease-out both; }
      @keyframes adv-slide { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: none; } }

      .adv-node {
        position: relative;
        z-index: 1;
        padding: 10px 8px;
        border-radius: 6px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        font-size: 12px;
        text-align: center;
        line-height: 1.3;
      }
      .adv-node-hub {
        background: rgba(242,193,78,.14);
        border-color: var(--adv-gold);
        font-weight: 600;
        padding: 12px 14px;
      }
      .adv-hub-glow {
        position: absolute; inset: -6px; border-radius: 10px;
        box-shadow: 0 0 24px var(--adv-gold-soft);
        animation: adv-halo 2.4s ease-in-out infinite;
      }
      .adv-trace-badge {
        position: absolute;
        left: 50%;
        top: -10px;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 999px;
        background: var(--adv-mint);
        color: #0b1626;
        white-space: nowrap;
        transform: translate(-50%, 0);
        animation: adv-badge 2.4s ease-out both;
      }
      @keyframes adv-badge {
        0%, 40% { opacity: 0; transform: translate(-50%, 6px); }
        50% { opacity: 1; transform: translate(-50%, -6px); }
        85% { opacity: 1; }
        100% { opacity: 0; transform: translate(-50%, -16px); }
      }
      .adv-wire {
        position: absolute;
        top: 50%;
        height: 2px;
        background: repeating-linear-gradient(90deg, var(--line-cta) 0 6px, transparent 6px 10px);
      }
      .adv-wire-left { left: 16%; width: 22%; }
      .adv-wire-right { right: 16%; width: 22%; }
      .adv-packet {
        position: absolute;
        top: -4px;
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--adv-gold);
        box-shadow: 0 0 12px var(--adv-gold);
        animation: adv-packet 1s ease-in-out both;
      }
      .adv-packet-late { animation-delay: 1.1s; }
      @keyframes adv-packet { from { left: 0; opacity: 1; } 90% { opacity: 1; } to { left: calc(100% - 10px); opacity: 0; } }

      /* Reindeer team crossing the page */
      .adv-reindeer {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 4;
        width: 210px;
        aspect-ratio: 210 / 66;
        transform-origin: center;
        will-change: transform;
        filter: drop-shadow(0 6px 8px rgb(24 34 26 / .18));
      }
      .adv-reindeer[data-state="idle"] { display: none; }
      .adv-reindeer-team { display: block; width: 100%; height: 100%; }
      .adv-reindeer[data-dir="-1"] .adv-reindeer-team { transform: scaleX(-1); }
      .adv-reindeer-legs-front, .adv-reindeer-legs-back { transform-box: fill-box; }
      .adv-reindeer-legs-front { transform-origin: 0 0; }
      .adv-reindeer-legs-back { transform-origin: 100% 0; }
      .adv-reindeer[data-state="flying"] .adv-reindeer-legs-front { animation: adv-gallop .45s ease-in-out infinite alternate; }
      .adv-reindeer[data-state="flying"] .adv-reindeer-legs-back { animation: adv-gallop .45s ease-in-out infinite alternate-reverse; }
      .adv-reindeer[data-state="falling"] .adv-reindeer-legs-front { transform: rotate(-35deg); }
      .adv-reindeer[data-state="falling"] .adv-reindeer-legs-back { transform: rotate(35deg); }
      @keyframes adv-gallop { from { transform: rotate(-12deg); } to { transform: rotate(14deg); } }

      /* Gateway flow (day 1) */
      .adv-flow-pulse {
        fill: none;
        stroke: var(--line-cta);
        stroke-width: 3;
        stroke-linecap: round;
        stroke-dasharray: 6 200;
        stroke-dashoffset: 10;
      }
      .adv-flow-ambient { opacity: .4; animation: adv-flow-dash 2.8s linear infinite; }
      .adv-flow-focus { animation: adv-flow-dash .7s ease-in both; }
      .adv-flow-focus-late { animation-delay: .7s; }
      @keyframes adv-flow-dash { from { stroke-dashoffset: 10; } to { stroke-dashoffset: -106; } }
      .adv-flow-hit { animation: adv-flow-hit 1s ease-out 1.35s both; }
      @keyframes adv-flow-hit {
        0% { stroke: var(--line-structure); stroke-width: 1; }
        15%, 55% { stroke: var(--line-cta); stroke-width: 1.75; }
        100% { stroke: var(--line-structure); stroke-width: 1; }
      }
      .adv-flow-ring { transform-box: fill-box; transform-origin: center; animation: adv-halo 2.4s ease-in-out infinite; }
      .adv-flow-trace { transform-box: fill-box; transform-origin: center; animation: adv-flow-trace 1.3s ease-out .65s both; }
      @keyframes adv-flow-trace {
        0% { opacity: 0; transform: translateY(4px); }
        20% { opacity: 1; transform: none; }
        75% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-6px); }
      }

      /* Guardrail templates (days 2-4) */
      .adv-guard-card {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
        padding: 8px;
        border-radius: 8px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
      }
      .adv-guard-active { padding: 10px; border-color: var(--line-cta); }
      .adv-guard-teased { gap: 6px; opacity: .5; }
      .adv-guard-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 0;
        padding: 12px 8px;
        border-radius: 6px;
        background:
          radial-gradient(ellipse 60% 90% at 25% 0%, rgba(167, 139, 250, .28), transparent 70%),
          radial-gradient(ellipse 60% 90% at 80% 100%, rgba(167, 139, 250, .16), transparent 70%),
          var(--surface-1);
      }
      .adv-guard-teased .adv-guard-preview { padding: 8px 6px; }
      .adv-guard-pill {
        display: inline-flex;
        gap: 4px;
        min-width: 0;
        max-width: 100%;
        padding: 3px 8px;
        border-radius: 5px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        box-shadow: 0 1px 2px rgba(0, 0, 0, .06);
        font-size: 11px;
        white-space: nowrap;
      }
      .adv-guard-teased .adv-guard-pill { padding: 2px 6px; font-size: 10px; }
      .adv-guard-pill-key { color: var(--text-tertiary); }
      .adv-guard-pill-value { overflow: hidden; text-overflow: ellipsis; color: var(--text-primary); }
      .adv-guard-active .adv-guard-pill-value { overflow: visible; }
      .adv-guard-live {
        padding: 1px 6px;
        border-radius: 999px;
        background: var(--adv-mint);
        color: #0b1626;
        font-size: 10px;
        font-weight: 600;
      }
      .adv-guard-prompt {
        padding: 8px 10px;
        border-radius: 6px;
        background: var(--surface-1);
        border: 1px solid var(--line-structure);
        color: var(--text-secondary);
        font-size: 12px;
        line-height: 1.5;
        overflow-wrap: anywhere;
        transition: opacity .3s;
      }
      .adv-guard-prompt[data-blocked="true"] { opacity: .5; }
      .adv-guard-match {
        padding: 0 2px;
        border-radius: 3px;
        color: var(--text-primary);
        transition: background-color .25s, box-shadow .25s;
      }
      .adv-guard-match[data-state="flagged"],
      .adv-guard-match[data-state="blocked"] {
        background: color-mix(in srgb, var(--adv-red) 18%, transparent);
        box-shadow: inset 0 -2px 0 var(--adv-red);
      }
      .adv-guard-match[data-state="blocked"] { text-decoration: line-through; }
      .adv-guard-match[data-state="redacted"] { background: color-mix(in srgb, var(--adv-mint) 45%, transparent); }
      .adv-guard-result { min-height: 1.5em; color: var(--text-tertiary); font-size: 11px; opacity: 0; transition: opacity .3s; }
      .adv-guard-result[data-visible="true"] { opacity: 1; }

      /* Provider tour (day 8) */
      .adv-tour-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        min-width: 0;
        padding: 7px 9px;
        border-radius: 6px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        font-size: 12px;
        transition: border-color .3s, box-shadow .3s, transform .3s;
      }
      .adv-tour-chip[data-active="true"] { border-color: var(--adv-gold); box-shadow: 0 0 0 3px var(--adv-gold-soft); transform: translateY(-1px); }
      .adv-tour-formats { display: flex; flex-direction: column; gap: 2px; min-height: 3.4em; font-size: 11px; color: var(--text-secondary); }

      /* Budget meter (day 6) */
      .adv-budget-track { position: relative; height: 14px; border-radius: 999px; background: var(--surface-bg); border: 1px solid var(--line-structure); overflow: hidden; }
      .adv-budget-bar { height: 100%; border-radius: 999px; background: var(--adv-gold); transition: width .6s cubic-bezier(.2, .9, .3, 1), background-color .3s; }
      .adv-budget-track[data-full="true"] .adv-budget-bar { background: var(--adv-red); }
      .adv-budget-mark { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--text-tertiary); opacity: .6; }
      .adv-budget-event { align-self: flex-start; padding: 6px 10px; border-radius: 6px; background: var(--surface-bg); border: 1px solid var(--line-structure); font-size: 12px; color: var(--text-secondary); }
      .adv-budget-event[data-tone="warn"] { border-color: var(--adv-gold); color: var(--text-primary); }
      .adv-budget-event[data-tone="block"] { border-color: var(--adv-red); color: var(--adv-accent-text); }

      /* Runtime benchmark (day 5) */
      .adv-bench-track { height: 10px; border-radius: 999px; background: var(--surface-bg); border: 1px solid var(--line-structure); overflow: hidden; }
      .adv-bench-bar { height: 100%; border-radius: 999px; background: var(--text-disabled); transform-origin: left; animation: adv-bench-grow .9s cubic-bezier(.2, .9, .3, 1) both; }
      .adv-bench-bar.is-ours { background: var(--adv-gold); box-shadow: 0 0 10px var(--adv-gold-soft); }
      @keyframes adv-bench-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

      .adv-terminal {
        border-radius: 6px;
        background: #050b14;
        border: 1px solid rgba(255,255,255,.12);
        overflow: hidden;
      }
      .adv-terminal-bar { display: flex; gap: 5px; padding: 8px 10px; border-bottom: 1px solid rgba(255,255,255,.08); }
      .adv-terminal-bar span { width: 8px; height: 8px; border-radius: 999px; background: rgba(255,255,255,.2); }
      .adv-terminal-bar span:first-child { background: #ff6b6b; }
      .adv-terminal-bar span:nth-child(2) { background: var(--adv-gold); }
      .adv-terminal-bar span:nth-child(3) { background: var(--adv-mint); }
      .adv-terminal-body {
        margin: 0;
        padding: 12px 14px;
        font-family: var(--font-geist-mono);
        font-size: 11.5px;
        line-height: 1.7;
        white-space: pre-wrap;
        word-break: break-all;
        color: #d7e3f4;
        background: transparent;
      }
      .adv-terminal-ok { color: var(--adv-mint); }
      .adv-terminal-key { color: var(--adv-gold); }
      .adv-cursor {
        display: inline-block;
        width: 7px;
        height: 14px;
        margin-left: 2px;
        vertical-align: text-bottom;
        background: currentColor;
        animation: adv-blink 1s steps(1) infinite;
      }
      @keyframes adv-blink { 50% { opacity: 0; } }

      .adv-vault {
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        padding: 14px 12px; border-radius: 8px;
        background: var(--surface-bg);
        border: 1px dashed var(--adv-gold);
        color: var(--adv-gold-text);
        text-align: center;
      }
      .adv-key-chip {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 3px 8px; border-radius: 999px;
        font-family: var(--font-geist-mono); font-size: 11px;
        background: var(--adv-gold); color: #0b1626;
        animation: adv-key 3s ease-in-out infinite both;
      }
      @keyframes adv-key {
        0% { opacity: 0; transform: translateX(-60px) rotate(-20deg); }
        25%, 85% { opacity: 1; transform: none; }
        100% { opacity: 0; transform: none; }
      }
      .adv-person {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; opacity: .85;
      }

      .adv-provider {
        position: relative;
        padding: 6px 10px; border-radius: 999px; font-size: 12px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        animation: adv-pop .5s cubic-bezier(.3,1.6,.5,1) both;
      }
      .adv-provider-new {
        background: rgba(242,193,78,.16);
        border-color: var(--adv-gold);
        animation: adv-drop .9s cubic-bezier(.3,1.6,.5,1) both, adv-glow-soft 2s ease-in-out 1s infinite;
      }
      @keyframes adv-drop { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: none; } }
      @keyframes adv-glow-soft { 0%, 100% { box-shadow: 0 0 0 transparent; } 50% { box-shadow: 0 0 18px var(--adv-gold-soft); } }
      .adv-new-tag {
        margin-left: 6px; padding: 1px 5px; border-radius: 4px;
        font-size: 9px; font-weight: 700; text-transform: uppercase;
        background: var(--adv-red); color: var(--adv-paper);
      }

      .adv-track { position: relative; height: 14px; border-radius: 3px; background: var(--line-structure); }
      .adv-bar {
        position: absolute; top: 0; bottom: 0; border-radius: 3px;
        background: linear-gradient(90deg, #4f8fd8, #7fb4ff);
        transform-origin: left center;
        animation: adv-grow .7s ease-out both;
      }
      .adv-bar-root { background: linear-gradient(90deg, var(--adv-gold), #f7d98a); }
      @keyframes adv-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

      .adv-segmented {
        display: grid; grid-template-columns: repeat(2, 1fr);
        padding: 3px; border-radius: 999px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        font-family: var(--font-geist-mono); font-size: 12px; text-align: center;
      }
      .adv-segmented span { padding: 6px 0; border-radius: 999px; transition: background .3s, color .3s; }
      .adv-segment-active { background: var(--adv-gold); color: #0b1626; font-weight: 600; }
      .adv-field {
        display: flex; align-items: center; gap: 8px;
        padding: 6px 10px; border-radius: 6px; font-size: 12px;
        background: var(--surface-bg);
        transition: opacity .3s, background .3s, color .3s;
      }
      .adv-field-off { opacity: .4; text-decoration: line-through; }
      .adv-field-match { background: rgba(31,122,77,.12); color: var(--adv-green-text); }

      .adv-trace-card {
        display: flex; flex-direction: column; gap: 8px;
        padding: 12px; border-radius: 8px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
      }
      .adv-chip {
        padding: 2px 8px; border-radius: 999px; font-size: 11px;
        background: rgba(31,122,77,.12); color: var(--adv-green-text);
      }

      .adv-column {
        flex: 1; border-radius: 3px 3px 0 0;
        background: linear-gradient(180deg, var(--adv-gold), #c9902a);
        transform-origin: bottom;
        animation: adv-rise .7s cubic-bezier(.3,1.4,.5,1) both;
      }
      @keyframes adv-rise { from { transform: scaleY(0); } to { transform: scaleY(1); } }
      .adv-counter { animation: adv-pop .6s ease-out .9s both; color: var(--adv-gold-text); }
      .adv-legend::before {
        content: ""; display: inline-block; width: 8px; height: 8px;
        border-radius: 2px; margin-right: 4px;
      }
      .adv-legend-a::before { background: var(--adv-gold); }
      .adv-legend-b::before { background: #7fb4ff; }
      .adv-legend-c::before { background: var(--adv-mint); }

      .adv-threshold { stroke: #ff6b6b; stroke-width: 1.5; }
      .adv-threshold-label { fill: #ff8a7a; font-size: 10px; font-family: var(--font-geist-mono); }
      .adv-line {
        fill: none; stroke: var(--adv-gold); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round;
        stroke-dasharray: 1; stroke-dashoffset: 1;
        animation: adv-draw 1.8s ease-in-out forwards;
      }
      @keyframes adv-draw { to { stroke-dashoffset: 0; } }
      .adv-toast {
        position: absolute; right: 0; top: -4px;
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
        background: var(--adv-paper); color: var(--adv-red-dark);
        box-shadow: 0 8px 20px rgba(0,0,0,.35);
        animation: adv-toast-drop .5s cubic-bezier(.3,1.6,.5,1) 1.5s both;
      }
      @keyframes adv-toast-drop { from { opacity: 0; transform: translateY(-14px) scale(.9); } to { opacity: 1; transform: none; } }
      .adv-bell { animation: adv-ring .8s ease-in-out 1.9s 3 both; transform-origin: 50% 0; }
      @keyframes adv-ring {
        0%, 100% { transform: rotate(0); }
        20% { transform: rotate(18deg); }
        40% { transform: rotate(-16deg); }
        60% { transform: rotate(10deg); }
        80% { transform: rotate(-6deg); }
      }

      .adv-switch {
        position: relative; width: 30px; height: 17px; border-radius: 999px;
        background: var(--line-structure); transition: background .3s;
        flex-shrink: 0;
      }
      .adv-switch span {
        position: absolute; top: 2px; left: 2px; width: 13px; height: 13px;
        border-radius: 999px; background: #fff; transition: transform .3s cubic-bezier(.3,1.4,.5,1);
      }
      .adv-switch-on { background: var(--adv-green-text); }
      .adv-switch-on span { transform: translateX(13px); }

      .adv-input {
        min-height: 36px; display: flex; align-items: center;
        padding: 6px 10px; border-radius: 6px;
        background: var(--surface-bg); border: 1px solid var(--adv-gold);
        color: var(--text-primary);
      }

      .adv-bubble { max-width: 85%; padding: 8px 12px; border-radius: 12px; font-size: 12.5px; line-height: 1.45; }
      .adv-bubble-user { align-self: flex-end; background: var(--adv-gold); color: #0b1626; border-bottom-right-radius: 3px; }
      .adv-bubble-typing {
        align-self: flex-start; display: inline-flex; gap: 4px;
        background: var(--surface-bg); border: 1px solid var(--line-structure); border-bottom-left-radius: 3px;
        animation: adv-typing-show 2.2s ease-in-out .6s both;
      }
      .adv-bubble-typing span { width: 6px; height: 6px; border-radius: 999px; background: var(--text-primary); animation: adv-dot 1s ease-in-out infinite; }
      .adv-bubble-typing span:nth-child(2) { animation-delay: .15s; }
      .adv-bubble-typing span:nth-child(3) { animation-delay: .3s; }
      @keyframes adv-dot { 0%, 100% { opacity: .3; transform: none; } 50% { opacity: 1; transform: translateY(-3px); } }
      @keyframes adv-typing-show { 0% { opacity: 0; } 10%, 90% { opacity: 1; } 100% { opacity: 0; height: 0; padding: 0; margin: -6px 0; } }
      .adv-bubble-halo {
        align-self: flex-start; background: var(--surface-bg); border: 1px solid var(--line-structure); border-bottom-left-radius: 3px;
        animation: adv-pop .5s cubic-bezier(.3,1.6,.5,1) 2.8s both;
      }


      /* Hero figures */
      .adv-shadow { fill: rgba(0, 0, 0, .08); }
      .adv-santa { animation: adv-bob 3s ease-in-out infinite; }
      @keyframes adv-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      .adv-santa-wave {
        transform-box: view-box;
        transform-origin: 84px 98px;
        animation: adv-wave 1.6s ease-in-out infinite;
      }
      @keyframes adv-wave { 0%, 100% { transform: rotate(0); } 50% { transform: rotate(-18deg); } }
      .adv-snowman-target { width: 100%; position: relative; border-radius: 12px; outline-offset: 4px; }
      .adv-snowman-target:focus-visible { outline: 2px solid var(--adv-accent-text); }
      .adv-snowman-score { position: absolute; top: 0; left: 0; width: 100%; font: 11px/1.5 var(--font-geist-mono), monospace; color: var(--adv-accent-text); }
      .adv-snowman-progress { display: flex; gap: 4px; }
      .adv-snowman-progress i { height: 3px; width: 16px; background: var(--line-structure); }
      .adv-snowman-progress [data-filled="true"] { background: var(--adv-accent-text); }
      .adv-snowman { transform-origin: 50% 100%; }
      .adv-snowman.is-hit { animation: adv-snowman-hit .35s ease-out; }
      @keyframes adv-snowman-hit {
        25% { transform: rotate(-5deg) scale(1.03, .97); }
        60% { transform: rotate(4deg); }
        100% { transform: none; }
      }
      .adv-snowman-ball {
        transform-box: fill-box;
        transform-origin: 50% 100%;
        animation: adv-ball-drop .55s cubic-bezier(.3, 1.5, .5, 1) both;
      }
      @keyframes adv-ball-drop {
        from { opacity: 0; transform: translateY(-40px) scale(1.15, .85); }
        to { opacity: 1; transform: none; }
      }
      .adv-snowman.is-crumbling .adv-snowman-ball {
        animation: adv-crumble .7s ease-in forwards;
      }
      .adv-snowman.is-crumbling .adv-snowman-ball:nth-of-type(2) { animation-delay: .05s; }
      .adv-snowman.is-crumbling .adv-snowman-ball:nth-of-type(3) { animation-delay: .1s; }
      @keyframes adv-crumble {
        30% { transform: rotate(8deg) scale(1.05, .95); }
        to { opacity: 0; transform: translateY(24px) scale(1.4, .1); }
      }
      .adv-snowman.is-annoyed .adv-snowman-head {
        transform-box: view-box;
        transform-origin: 60px 66px;
        animation: adv-fume .45s ease-in-out infinite;
      }
      @keyframes adv-fume {
        0%, 100% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
      }
      .adv-snowman-arm {
        transform-box: view-box;
        transform-origin: 78px 84px;
      }
      .adv-snowman.is-throwing .adv-snowman-arm { animation: adv-arm-throw .5s ease-in-out; }
      @keyframes adv-arm-throw {
        0%, 100% { transform: none; }
        45% { transform: rotate(-65deg); }
        62% { transform: rotate(18deg); }
      }
      .adv-snowman.is-throwing .adv-snowman-ammo { animation: adv-ammo-release .5s step-end forwards; }
      @keyframes adv-ammo-release {
        0% { opacity: 1; }
        56%, 100% { opacity: 0; }
      }

      /* Snowball hint: a cursor clicks, a snowball flies in and splats */
      .adv-hint {
        position: relative;
        display: inline-block;
        width: 88px;
        height: 44px;
        flex-shrink: 0;
      }
      /* Hang the animation off the left so the text centers under the button. */
      .adv-hint-row { position: relative; }
      .adv-hint-row .adv-hint {
        position: absolute;
        right: 100%;
        top: 50%;
        margin-right: 6px;
        transform: translateY(-50%) scale(.8);
        transform-origin: right center;
      }
      @media (min-width: 640px) {
        .adv-hint-row .adv-hint {
          margin-right: 8px;
          transform: translateY(-50%);
        }
      }
      .adv-hint-cursor, .adv-hint-ring, .adv-hint-ball, .adv-hint-splat {
        position: absolute; left: 0; top: 0;
      }
      .adv-hint-cursor {
        color: var(--text-primary);
        animation: adv-hint-cursor 3.2s ease-in-out infinite;
      }
      .adv-hint-ring {
        width: 18px; height: 18px; margin: -9px 0 0 -9px;
        border-radius: 999px; border: 2px solid var(--adv-red);
        transform: translate(64px, 14px) scale(0); opacity: 0;
        animation: adv-hint-ring 3.2s ease-out infinite;
      }
      .adv-hint-ball {
        width: 14px; height: 14px; margin: -7px 0 0 -7px;
        border-radius: 999px;
        background: radial-gradient(circle at 35% 35%, #fff, #dfe7f1 70%, #aebcd0);
        box-shadow: 0 1px 3px rgba(0,0,0,.25);
        opacity: 0;
        animation: adv-hint-ball 3.2s ease-in infinite;
      }
      .adv-hint-splat {
        width: 22px; height: 22px; margin: -11px 0 0 -11px;
        border-radius: 999px;
        background: radial-gradient(circle, #fff 45%, rgba(255,255,255,0) 46%),
          radial-gradient(circle at 15% 20%, #fff 18%, transparent 19%),
          radial-gradient(circle at 85% 30%, #fff 16%, transparent 17%),
          radial-gradient(circle at 30% 90%, #fff 15%, transparent 16%),
          radial-gradient(circle at 80% 85%, #fff 17%, transparent 18%);
        filter: drop-shadow(0 0 1px #aebcd0);
        transform: translate(64px, 14px) scale(0); opacity: 0;
        animation: adv-hint-splat 3.2s ease-out infinite;
      }
      @keyframes adv-hint-cursor {
        0% { transform: translate(78px, 34px); opacity: 0; }
        10% { opacity: 1; }
        28% { transform: translate(64px, 14px); }
        32% { transform: translate(64px, 14px) scale(.8); }
        36% { transform: translate(64px, 14px) scale(1); }
        80% { transform: translate(64px, 14px); opacity: 1; }
        92%, 100% { transform: translate(64px, 14px); opacity: 0; }
      }
      @keyframes adv-hint-ring {
        0%, 31% { transform: translate(64px, 14px) scale(0); opacity: 0; }
        33% { opacity: 1; }
        48%, 100% { transform: translate(64px, 14px) scale(1.6); opacity: 0; }
      }
      @keyframes adv-hint-ball {
        0%, 34% { transform: translate(2px, 42px) scale(1.5); opacity: 0; }
        36% { opacity: 1; }
        46% { transform: translate(30px, 0px) scale(1.1); }
        56% { transform: translate(64px, 14px) scale(.8); opacity: 1; }
        57%, 100% { transform: translate(64px, 14px) scale(.8); opacity: 0; }
      }
      @keyframes adv-hint-splat {
        0%, 55% { transform: translate(64px, 14px) scale(0); opacity: 0; }
        58% { transform: translate(64px, 14px) scale(1); opacity: 1; }
        85% { opacity: 1; }
        100% { transform: translate(64px, 14px) scale(1.15); opacity: 0; }
      }

      html:has(.adv-page), html:has(.adv-page) body { height: 100%; overflow: hidden; overscroll-behavior: none; }
      .adv-page { height: 100dvh; max-height: 100dvh; min-height: 0; display: grid; grid-template-rows: 64px minmax(0,1fr) 88px; overflow: hidden; --adv-pointer-x: 0; --adv-pointer-y: 0; }
      .adv-page:not([data-experience="intro"]) { grid-template-rows: 64px 124px minmax(0,1fr) 88px; }
      .adv-nav { position: relative; z-index: 5; display: flex; align-items: center; justify-content: space-between; padding: 0 28px; border-bottom: 1px solid var(--line-structure); background: color-mix(in srgb,var(--surface-bg) 85%,transparent); }
      .adv-brand { position: relative; display: block; width: 150px; }
      .adv-brand img { width: 100%; height: auto; display: block; }
      .adv-brand-night { position: absolute; inset: 0; opacity: var(--adv-scene); }
      .adv-nav-links { display: flex; align-items: center; gap: 26px; font-size: 12px; }
      .adv-nav-links a { display: inline-flex; align-items: center; gap: 5px; }
      .adv-nav-links a:hover { color: var(--adv-accent-text); }
      .adv-experience-header { position: relative; z-index: 3; min-height: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20px; gap: 26px; text-align: center; }
      .adv-heading { position: relative; z-index: 1; }
      .adv-heading h1 { font-size: clamp(46px,6.5vw,98px); font-weight: 650; letter-spacing: -.05em; line-height: 1.05; }
      .adv-intro-copy { font-size: clamp(14px,1.5vw,20px); line-height: 1.65; color: var(--text-secondary); margin-top: 26px; }
      .adv-start-action { position: relative; display: flex; flex-direction: column; align-items: center; gap: 14px; }
      .adv-start-action > span { font: 11px/1.5 var(--font-geist-mono),monospace; color: var(--text-secondary); }
      .adv-start-action button { min-width: 160px; min-height: 48px; }
      .adv-start-action button > span { font-size: 16px; gap: 10px; }
      .adv-header-controls { display: none; }
      .adv-page:not([data-experience="intro"]) .adv-experience-header { padding: 8px 20px; gap: 5px; }
      .adv-page:not([data-experience="intro"]) :is(.adv-heading,.adv-header-controls) { flex-shrink: 0; }
      /* Captures retain pixel widths: font rounding must not wrap the compact title into the switcher. */
      .adv-page:not([data-experience="intro"]) .adv-heading h1 { font-size: 32px; letter-spacing: -.04em; white-space: nowrap; }
      .adv-page:not([data-experience="intro"]) :is(.adv-intro-copy,.adv-start-action,.adv-knot-stage) { display: none; }
      .adv-page:not([data-experience="intro"]) .adv-header-controls { display: block; }
      .adv-scene-control { text-align: center; min-width: 0; width: min(420px,80vw); }
      .adv-scene-switch { position: relative; display: grid; grid-template-columns: 1fr 1fr; padding: 4px; gap: 4px; min-height: 52px; border: 1px solid var(--line-structure); border-radius: 28px; background: var(--surface-1); box-shadow: 0 3px 14px #18221a12; }
      .adv-scene-switch::before { content: ''; position: absolute; left: 4px; top: 4px; bottom: 4px; width: calc(50% - 6px); border-radius: 24px; background: var(--text-primary); transition: transform .5s cubic-bezier(.2,1,.3,1), background .5s; }
      .adv-scene-switch[data-techno="true"]::before { transform: translateX(calc(100% + 4px)); background: var(--adv-gold); }
      .adv-scene-switch button { position: relative; display: flex; align-items: center; justify-content: center; gap: 9px; border-radius: 24px; padding: 8px 16px; color: var(--text-secondary); font-size: 15px; font-weight: 550; }
      .adv-scene-switch button[aria-pressed="true"] { color: var(--surface-bg); }
      .adv-scene-switch[data-techno="true"] button[aria-pressed="true"] { color: #101219; }
      .adv-scene-switch button:focus-visible { outline: 2px solid var(--adv-accent-text); outline-offset: 4px; }
      .adv-scene-status { display: block; margin-top: 3px; font-size: 9px; }
      .adv-scene-progress { display: none; }
      .adv-knot-stage { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; overflow: hidden; }
      .adv-logo-knot { width: min(82vw,950px); height: min(82vh,950px); opacity: .16; transform: translate(calc(var(--adv-pointer-x) * 24px),calc(var(--adv-pointer-y) * 24px)) rotate(-12deg); }
      .adv-knot-strand { transform-box: fill-box; transform-origin: center; animation: adv-knot-weave 9s ease-in-out infinite alternate; }
      .adv-knot-strand:nth-child(2n) { animation-direction: alternate-reverse; animation-delay: -3s; }
      .adv-knot-strand:nth-child(3n) { animation-delay: -6s; }
      @keyframes adv-knot-weave { from { transform: translate(-20px,-8px) rotate(-8deg); } to { transform: translate(20px,12px) rotate(8deg); } }
      .adv-figures { position: absolute; z-index: 2; left: 3vw; right: 3vw; bottom: 80px; display: flex; align-items: end; justify-content: space-between; pointer-events: none; }
      .adv-figures > * { width: clamp(75px,12vw,160px); pointer-events: auto; }
      .adv-page:not([data-experience="intro"]) .adv-figures { top: 46%; bottom: auto; left: 14px; right: 14px; }
      .adv-page:not([data-experience="intro"]) .adv-figures > * { width: clamp(65px,9vw,130px); }
      .adv-calendar { position: relative; min-height: 0; width: min(1280px,calc(100% - 300px)); height: 100%; margin: 0 auto; padding: 4px 0 12px; display: grid; grid-template-rows: 20px minmax(0,1fr) 24px; gap: 8px; perspective: 1400px; }
      .adv-page[data-experience="intro"] .adv-calendar { display: none; }
      .adv-page[data-experience="flying"] .adv-calendar { opacity: 0; }
      .adv-calendar-status { text-align: center; margin: 0; align-self: center; font-size: 12px; color: var(--adv-accent-text); }
      .adv-calendar .adv-board { display: grid; grid-template-rows: 20px minmax(0,1fr); min-height: 0; height: 100%; overflow: visible; transform-style: flat; border-radius: calc(14px + var(--adv-slop) * 32px); }
      .adv-door-grid { display: grid; grid-template-columns: repeat(6,minmax(0,1fr)); grid-template-rows: repeat(4,minmax(0,1fr)); min-height: 0; gap: clamp(8px,1vw,15px); padding: 9px 18px 18px; transform-style: flat; }
      .adv-calendar .adv-door { aspect-ratio: auto; min-height: 0; transform: var(--adv-physics,none); transform-style: flat; }
      .adv-door::before { content: ''; position: absolute; inset: -3px; border-radius: inherit; opacity: 0; background: radial-gradient(circle at var(--adv-shine-x,50%) var(--adv-shine-y,50%),var(--adv-gold-soft),transparent 65%); transition: opacity .25s; filter: blur(8px); }
      .adv-door:hover::before { opacity: 1; }
      .adv-calendar .adv-door:hover .adv-door-leaf:not(.is-open) { transform: rotateY(-32deg); }
      .adv-door:hover .adv-door-leaf.is-open { transform: rotateY(-96deg); }
      .adv-door-leaf, .adv-door-recess, .adv-door::before { pointer-events: none; }
      .adv-door-face::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; opacity: 0; background: radial-gradient(circle at var(--adv-shine-x,50%) var(--adv-shine-y,50%),#ffffff70,transparent 65%); transition: opacity .3s; }
      .adv-door:hover .adv-door-face::after { opacity: 1; }
      .adv-page[data-experience="arriving"] .adv-door { animation: adv-door-arrive 1.5s cubic-bezier(.16,1,.3,1) both; animation-delay: var(--adv-enter-delay); }
      @keyframes adv-door-arrive { from { opacity: 0; transform: translate3d(var(--adv-enter-x),var(--adv-enter-y),0) scale(.12) rotate(var(--adv-enter-turn)); filter: blur(10px); } to { opacity: 1; transform: none; filter: none; } }
      .adv-calendar-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 0; color: var(--text-secondary); }
      .adv-calendar-footer a { display: inline-flex; align-items: center; gap: 4px; font-size: 10px; }
      .adv-calendar-footer .adv-hint-row { font-size: 10px; }
      .adv-mixer { position: relative; z-index: 5; display: flex; align-items: center; justify-content: center; gap: 24px; border-top: 1px solid var(--line-structure); background: color-mix(in srgb,var(--surface-bg) 90%,transparent); padding: 5px 18px; }
      .adv-volume { min-height: 36px; padding: 6px 10px; border: 1px solid var(--line-structure); border-radius: 24px; }
      .adv-volume input { cursor: pointer !important; width: 76px; }
      .adv-slop-control { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2px 24px; width: min(520px,65vw); padding: 7px 16px; border: 1px solid #b996ef; border-radius: 14px; color: #3d1664; background: linear-gradient(115deg,#f1e5ff,#ffe5f4); box-shadow: 0 2px 16px #a85bff20; }
      .adv-slop-title { display: flex; gap: 12px; align-items: baseline; font: 750 16px/1.3 var(--font-geist-mono),monospace; letter-spacing: .06em; }
      .adv-slop-control output { font-size: 14px; letter-spacing: 0; color: #7d26ba; }
      .adv-slop-level { font-size: 11px; font-weight: 600; text-align: right; }
      .adv-slop-control input { grid-column: 1 / -1; width: 100%; height: 24px; margin: 0; accent-color: #8733ce; cursor: pointer !important; }
      .adv-slop-control input:focus-visible { outline: 2px solid #8733ce; outline-offset: 2px; border-radius: 5px; }
      #adv-slop-description { grid-column: 1 / -1; font-size: 10px; line-height: 1.2; color: #6a457d; }
      .adv-slop-decorations { position: absolute; inset: 0; z-index: 4; pointer-events: none; overflow: hidden; }
      .adv-slop-decorations span { position: absolute; padding: 8px 14px; border-radius: 30px; background: linear-gradient(120deg,#9e5cffd9,#f28bd1e8); color: white; border: 1px solid #ffffff99; font-size: 12px; font-weight: 600; box-shadow: 0 6px 35px #a85bff80; animation: adv-brainrot 4s ease-in-out infinite alternate; }
      @keyframes adv-brainrot { to { transform: translate(24px,-35px) rotate(18deg) scale(1.2); } }
      .adv-page:not([data-slop-level="0"]) .adv-door-face { border-radius: calc(8px + var(--adv-slop) * 28px); filter: hue-rotate(calc(var(--adv-slop) * 180deg)) saturate(calc(1 + var(--adv-slop) * 2)); }
      .adv-page[data-slop-level="2"] .adv-title-accent, .adv-page[data-slop-level="3"] .adv-title-accent, .adv-page[data-slop-level="4"] .adv-title-accent { font-family: Georgia,serif; color: #b45dff; text-shadow: 3px 3px #ff92c866; }
      .adv-page[data-slop-level="4"] .adv-board { background: linear-gradient(135deg,#874af0,#ff7cc1,#3a77fa); box-shadow: 0 0 70px #a96dffaa; }
      .adv-welcome-flight { position: fixed; inset: 0; z-index: 110; }
      .adv-welcome-flight canvas { position: absolute; inset: 0; width: 100vw; height: 100dvh; }
      .adv-welcome-flight .adv-fold-skip { z-index: 111; }
      .adv-shatter-canvas { position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 59; pointer-events: none; }
      @media (min-width: 701px) and (max-height: 850px) {
        .adv-door-recess { padding: 5px 7px; gap: 4px; }
        .adv-door-recess-icon { width: 24px; height: 24px; flex-shrink: 0; }
        .adv-door-recess-icon svg { width: 14px; height: 14px; }
        .adv-door-recess-title { font-size: 11px; -webkit-line-clamp: 2; }
      }
      @media (max-width: 1050px) {
        .adv-calendar { width: calc(100% - 180px); }
        .adv-nav { padding: 0 20px; }
        .adv-nav-links { gap: 20px; }
      }
      @media (max-width: 700px) {
        .adv-page { grid-template-rows: 54px minmax(0,1fr) 88px; }
        .adv-page:not([data-experience="intro"]) { grid-template-rows: 54px 114px minmax(0,1fr) 88px; }
        .adv-nav { padding: 0 14px; }
        .adv-brand { width: 120px; }
        .adv-nav-links { gap: 16px; font-size: 11px; }
        .adv-nav-links a:last-child { display: none; }
        .adv-experience-header { padding: 20px; gap: 22px; }
        .adv-heading h1 { max-width: 12ch; font-size: clamp(42px,10vw,65px); }
        .adv-intro-copy { font-size: 14px; margin-top: 24px; }
        .adv-page:not([data-experience="intro"]) .adv-heading h1 { max-width: none; font-size: 24px; }
        .adv-scene-control { width: min(280px,74vw); }
        .adv-scene-switch { min-height: 44px; }
        .adv-scene-switch button { font-size: 12px; padding: 6px 8px; gap: 6px; }
        .adv-scene-switch svg { display: block; width: 14px; height: 14px; }
        .adv-page:not([data-experience="intro"]) .adv-figures { top: 77px; left: 3px; right: 3px; bottom: auto; }
        .adv-page:not([data-experience="intro"]) .adv-figures > * { width: 43px; }
        .adv-page:not([data-experience="intro"]) :is(.adv-snowman-figure > span,.adv-snowman-score) { display: none; }
        .adv-calendar { width: calc(100% - 24px); padding: 2px 0 8px; grid-template-rows: 22px minmax(0,1fr) 18px; gap: 5px; }
        .adv-calendar-status { font-size: 10px; line-height: 1.2; }
        .adv-door-grid { grid-template-columns: repeat(4,minmax(0,1fr)); grid-template-rows: repeat(6,minmax(0,1fr)); gap: 7px; padding: 7px 10px 10px; }
        .adv-door-number { font-size: 24px; }
        .adv-door-recess-title { font-size: 9px; -webkit-line-clamp: 2; }
        .adv-door-recess-icon { width: 18px; height: 18px; flex-shrink: 0; }
        .adv-door-recess { padding: 3px; gap: 2px; }
        .adv-door-recess-title { flex-shrink: 1; min-height: 0; }
        .adv-door-recess-icon svg { width: 12px; height: 12px; }
        .adv-door-face::before { inset: 4px; border-width: 1px; }
        .adv-door-lock { left: 7px; top: 7px; width: 9px; height: 9px; }
        .adv-door-ornament { right: 5px; bottom: 5px; width: 10px; height: 10px; }
        .adv-calendar-footer { justify-content: center; }
        .adv-calendar-footer a { display: none; }
        .adv-calendar-footer .adv-hint-row { font-size: 9px; }
        .adv-mixer { gap: 14px; padding: 5px 10px; }
        .adv-volume input { width: 50px; }
        .adv-slop-control { flex: 1; width: auto; min-width: 0; gap: 0 4px; padding: 7px 10px; }
        .adv-slop-title { font-size: 13px; gap: 8px; }
        .adv-slop-title output { font-size: 11px; }
        .adv-slop-level { font-size: 8px; }
        #adv-slop-description { font-size: 8px; }
        .adv-volume { padding: 6px; }
        .adv-volume input { width: 38px; }
      }
      @media (max-height: 600px) {
        .adv-slop-control { padding: 4px 12px; gap: 0 12px; }
        .adv-slop-title { font-size: 13px; }
        .adv-slop-control input { height: 18px; }
        #adv-slop-description { font-size: 9px; }
        .adv-brand > svg { top: -4px; width: 24px; }
        .adv-page:not([data-experience="intro"]) { grid-template-rows: 42px 58px minmax(0,1fr) 64px; }
        .adv-page:not([data-experience="intro"]) .adv-heading { display: none; }
        .adv-page:not([data-experience="intro"]) .adv-experience-header { padding: 4px; }
        .adv-calendar { grid-template-rows: 14px minmax(0,1fr); gap: 3px; padding-bottom: 4px; }
        .adv-calendar .adv-board { grid-template-rows: 10px minmax(0,1fr); }
        .adv-calendar-footer { display: none; }
        .adv-garland { height: 10px; }
        .adv-bulb { width: 5px; height: 6px; }
        .adv-door-grid { gap: 5px; padding: 4px 10px 8px; }
        .adv-door-recess-title { display: none; }
        .adv-door-number { font-size: 22px; }
        .adv-page:not([data-experience="intro"]) .adv-figures > * { width: 55px; }
        .adv-intro-copy { margin-top: 10px; font-size: 13px; }
        .adv-start-action { gap: 6px; }
        .adv-experience-header { gap: 12px; }
        .adv-heading h1 { font-size: 42px; }
      }

      .adv-debug-control { width: auto; padding: 2px 6px; background: var(--surface-bg); position: fixed; right: 8px; bottom: 94px; z-index: 110; font-size: 10px; }
      .adv-audio-preferences { display: grid; justify-items: center; gap: 0; flex-shrink: 0; }
      .adv-audio-preferences:has(.adv-motion-control) { min-width: 110px; }
      @media (max-width: 480px) { .adv-mixer:has(.adv-motion-control) .adv-slop-level { display: none; } }
      .adv-motion-control { display: grid; justify-items: center; font-size: 9px; line-height: 1.2; color: var(--text-secondary); }
      .adv-motion-control button { max-width: 112px; min-height: 24px; }
      .adv-motion-control button span { font-size: 10px; }
      html:has(.adv-page[data-motion="reduced"]) :is(.adv-page,.adv-dialog) *,
      html:has(.adv-page[data-motion="reduced"]) :is(.adv-page,.adv-dialog) *::before,
      html:has(.adv-page[data-motion="reduced"]) :is(.adv-page,.adv-dialog) *::after {
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }

    `}</style>
  );
}
