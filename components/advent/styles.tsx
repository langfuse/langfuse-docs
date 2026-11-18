export function AdventStyles() {
  return (
    <style>{`
      .adv-page, .adv-dialog {
        --adv-paper: #f4ecd9;
        --adv-paper-shade: #e3d6b8;
        --adv-red: #b3262e;
        --adv-red-dark: #7f1a20;
        --adv-green: #1f5c3f;
        --adv-green-dark: #133d29;
        --adv-gold: #f2c14e;
        --adv-gold-soft: rgba(242, 193, 78, 0.55);
        --adv-mint: #9be7c4;
        --adv-accent-text: #b3262e;
        --adv-gold-text: #8a5d00;
        --adv-green-text: #1f7a4d;
      }
      :root.dark .adv-page, :root.dark .adv-dialog {
        --adv-accent-text: #ff8a7a;
        --adv-gold-text: #f2c14e;
        --adv-green-text: #9be7c4;
      }

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
      .adv-door-leaf.is-open { transform: rotateY(-97deg); }
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
      .adv-door.is-wiggle .adv-door-leaf { animation: adv-wiggle .45s ease-in-out; }
      @keyframes adv-wiggle {
        0%, 100% { transform: rotate(0); }
        25% { transform: rotate(-3deg); }
        50% { transform: rotate(3deg); }
        75% { transform: rotate(-2deg); }
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


      /* Snowball hint: a cursor clicks, a snowball flies in and splats */
      .adv-hint {
        position: relative;
        display: inline-block;
        width: 88px;
        height: 44px;
        flex-shrink: 0;
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

      @media (prefers-reduced-motion: reduce) {
        .adv-page *, .adv-page *::before, .adv-page *::after,
        .adv-dialog *, .adv-dialog *::before, .adv-dialog *::after {
          animation-duration: .01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: .01ms !important;
        }
      }
    `}</style>
  );
}
