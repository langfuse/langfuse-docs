export function GovernmentStyles() {
  return (
    <style>{`
      .gov-page {
        background: var(--surface-bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      .gov-page,
      .gov-page p {
        line-height: 1.7;
      }

      .gov-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      @media (min-width: 768px) {
        .gov-section { padding-left: 32px; padding-right: 32px; }
      }

      .gov-corners::before {
        content: "";
        position: absolute;
        inset: -1px;
        pointer-events: none;
        background-color: var(--line-cta);
        -webkit-mask-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M8 8V7H3C1.89543 7 1 6.10457 1 5V0H0V8H8Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 8V7H5C6.10457 7 7 6.10457 7 5V0H8V8H0Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 0V1H5C6.10457 1 7 1.89543 7 3V8H8V0H0Z' fill='black'/%3E%3C/svg%3E");
        mask-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M8 8V7H3C1.89543 7 1 6.10457 1 5V0H0V8H8Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 8V7H5C6.10457 7 7 6.10457 7 5V0H8V8H0Z' fill='black'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Cpath d='M0 0V1H5C6.10457 1 7 1.89543 7 3V8H8V0H0Z' fill='black'/%3E%3C/svg%3E");
        -webkit-mask-position: top left, bottom left, bottom right, top right;
        mask-position: top left, bottom left, bottom right, top right;
        -webkit-mask-size: 8px 8px;
        mask-size: 8px 8px;
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
      }
      .gov-corners.no-tl::before { -webkit-mask-position: 50% 150%, bottom left, bottom right, top right; mask-position: 50% 150%, bottom left, bottom right, top right; }
      .gov-corners.no-tr::before { -webkit-mask-position: top left, bottom left, bottom right, 50% 150%; mask-position: top left, bottom left, bottom right, 50% 150%; }
      .gov-corners.no-bl::before { -webkit-mask-position: top left, 50% 150%, bottom right, top right; mask-position: top left, 50% 150%, bottom right, top right; }
      .gov-corners.no-br::before { -webkit-mask-position: top left, bottom left, 50% 150%, top right; mask-position: top left, bottom left, 50% 150%, top right; }
      .gov-corners.no-tl.no-tr::before { -webkit-mask-position: 50% 150%, bottom left, bottom right, 50% 150%; mask-position: 50% 150%, bottom left, bottom right, 50% 150%; }
      .gov-corners.no-bl.no-br::before { -webkit-mask-position: top left, 50% 150%, 50% 150%, top right; mask-position: top left, 50% 150%, 50% 150%, top right; }
      .gov-corners.no-tl.no-bl::before { -webkit-mask-position: 50% 150%, 50% 150%, bottom right, top right; mask-position: 50% 150%, 50% 150%, bottom right, top right; }
      .gov-corners.no-tr.no-br::before { -webkit-mask-position: top left, bottom left, 50% 150%, 50% 150%; mask-position: top left, bottom left, 50% 150%, 50% 150%; }
      .gov-corners.no-tl.no-tr.no-bl::before { -webkit-mask-position: 50% 150%, 50% 150%, bottom right, 50% 150%; mask-position: 50% 150%, 50% 150%, bottom right, 50% 150%; }
      .gov-corners.no-tl.no-tr.no-br::before { -webkit-mask-position: 50% 150%, bottom left, 50% 150%, 50% 150%; mask-position: 50% 150%, bottom left, 50% 150%, 50% 150%; }
      .gov-corners.no-tl.no-bl.no-br::before { -webkit-mask-position: 50% 150%, 50% 150%, 50% 150%, top right; mask-position: 50% 150%, 50% 150%, 50% 150%, top right; }
      .gov-corners.no-tr.no-bl.no-br::before { -webkit-mask-position: top left, 50% 150%, 50% 150%, 50% 150%; mask-position: top left, 50% 150%, 50% 150%, 50% 150%; }
      .gov-corners.no-tl.no-tr.no-bl.no-br::before { -webkit-mask-position: 50% 150%, 50% 150%, 50% 150%, 50% 150%; mask-position: 50% 150%, 50% 150%, 50% 150%, 50% 150%; }

      .gov-card-shadow {
        box-shadow:
          -15px 33px 14px 0 rgba(0,0,0,0.01),
          -8px 18px 12px 0 rgba(0,0,0,0.02),
          -4px 8px 9px 0 rgba(0,0,0,0.03),
          -1px 2px 5px 0 rgba(0,0,0,0.04),
          0 8px 24px rgba(0,0,0,0.08);
      }

      .gov-masthead {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(26px, 3.2vw, 40px);
        line-height: 1.12;
        letter-spacing: -0.02em;
        color: var(--text-primary);
        margin: 0;
      }

      .gov-claim-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 14px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .gov-claim-row li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.02em;
        color: var(--text-secondary);
      }
      .gov-claim-row li::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 1px;
        background: var(--surface-cta-primary);
        box-shadow: 0 0 0 1px var(--line-cta);
        flex-shrink: 0;
      }

      .gov-hero-art {
        isolation: isolate;
      }
      .gov-polaroid {
        position: absolute;
        width: 156px;
        padding: 10px;
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
        left: var(--x);
        top: var(--y);
        z-index: var(--z);
        transform: rotate(var(--rest-rot)) scale(var(--rest-scale, 1));
        transform-origin: 50% 60%;
        box-shadow:
          -15px 33px 14px 0 rgba(0,0,0,0.01),
          -8px 18px 12px 0 rgba(0,0,0,0.03),
          -4px 8px 9px 0 rgba(0,0,0,0.04),
          0 10px 28px rgba(0,0,0,0.10);
        transition:
          transform 480ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 480ms cubic-bezier(0.22, 1, 0.36, 1),
          opacity 280ms ease,
          border-color 200ms ease;
        cursor: default;
        pointer-events: auto;
      }
      .gov-polaroid.is-featured {
        width: 196px;
        padding: 12px;
      }
      .gov-polaroid.is-featured::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--surface-cta-primary);
      }
      .gov-polaroid-well {
        display: flex;
        aspect-ratio: 1;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--surface-cta-primary) 28%, var(--surface-1));
        transition: background 320ms ease;
      }
      .gov-hero-art.is-engaged .gov-polaroid {
        opacity: 0.46;
      }
      .gov-polaroid.is-lifted {
        opacity: 1 !important;
        z-index: 20;
        border-color: var(--line-cta);
        transform: rotate(calc(var(--rest-rot) * 0.12)) translateY(-16px) scale(calc(var(--rest-scale, 1) * 1.08));
        box-shadow:
          0 32px 48px rgba(0,0,0,0.14),
          0 12px 20px rgba(0,0,0,0.07),
          0 0 0 1px color-mix(in srgb, var(--line-cta) 60%, transparent);
      }
      .gov-polaroid.is-lifted .gov-polaroid-well {
        background: color-mix(in srgb, var(--surface-cta-primary) 70%, var(--surface-1));
      }
      @media (prefers-reduced-motion: reduce) {
        .gov-polaroid,
        .gov-polaroid.is-lifted {
          transition: border-color 160ms ease, opacity 160ms ease, background 160ms ease;
          transform: rotate(var(--rest-rot)) scale(var(--rest-scale, 1));
        }
      }

      .gov-grid-bg {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px;
      }
      .gov-stripes-bg {
        background-image: repeating-linear-gradient(315deg,
          transparent 0, transparent 2px,
          rgba(108, 103, 96, 0.12) 2px, rgba(108, 103, 96, 0.12) 3px);
      }
      .gov-blueprint {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px, 8px 8px, 64px 64px, 64px 64px;
      }

      .gov-page .gov-dot {
        width: 3px; height: 3px; border-radius: 50%;
        background: var(--text-tertiary); display: inline-block; flex-shrink: 0;
      }

      .gov-btn-wrap { position: relative; display: inline-flex; align-items: center; padding: 4px; }
      .gov-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        height: 36px; padding: 0 14px; border-radius: 2px;
        font-size: 13px; font-weight: 500; letter-spacing: -0.06px;
        border: 1px solid;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.05), 0 4px 4px 0 rgba(0,0,0,0.03);
        cursor: pointer; transition: background 120ms, border-color 120ms;
        white-space: nowrap;
      }
      .gov-btn-primary { background: var(--text-primary); color: var(--surface-bg); border-color: var(--text-secondary); }
      .gov-btn-primary:hover { background: var(--text-secondary); }
      .gov-btn-secondary { background: var(--surface-bg); color: var(--text-secondary); border-color: var(--line-structure); }
      .gov-btn-secondary:hover { border-color: var(--line-cta); }
      .gov-btn-small { height: 28px; padding: 0 10px; font-size: 12px; }
      .gov-kbd {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 20px; height: 20px; padding: 0 4px; border-radius: 1px; font-size: 11px; font-weight: 500;
        border: 1px solid color-mix(in srgb, var(--text-secondary) 30%, transparent);
        background: color-mix(in srgb, var(--text-secondary) 40%, transparent);
        font-family: var(--font-mono);
      }
      .gov-btn-secondary .gov-kbd {
        border-color: color-mix(in srgb, var(--text-secondary) 20%, transparent);
        background: color-mix(in srgb, var(--text-secondary) 10%, transparent);
        color: var(--text-secondary);
      }

      .gov-highlight {
        display: inline-block;
        background: var(--surface-cta-primary);
        padding: 0 6px;
        mix-blend-mode: multiply;
        color: inherit;
      }
      :root[class~="dark"] .gov-highlight { mix-blend-mode: screen; }

      .gov-h1 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4.2vw, 56px);
        line-height: 1.08;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .gov-h2 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(26px, 3vw, 40px);
        line-height: 1.22;
        letter-spacing: -0.005em;
        margin: 0;
      }
      .gov-eyebrow {
        font-family: var(--font-mono);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--text-tertiary);
        white-space: nowrap;
      }
      .gov-body {
        font-size: 15px;
        line-height: 1.8;
        color: var(--text-secondary);
        max-width: 62ch;
        text-wrap: pretty;
        margin: 0;
      }
      .gov-body-sm {
        font-size: 13.5px;
        line-height: 1.85;
        color: var(--text-secondary);
        text-wrap: pretty;
      }

      .gov-page .font-analog {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif !important;
      }

      .gov-chip-card {
        position: relative; background: var(--surface-1);
        border: 1px solid var(--line-structure); border-radius: 2px;
        overflow: hidden; transition: border-color 120ms;
      }
      .gov-chip-card:hover { border-color: var(--line-cta); }

      .gov-link { color: var(--text-links); border-bottom: 1px solid currentColor; }
      .gov-link:hover { opacity: .8; }

      .gov-code-inline {
        font-family: var(--font-mono);
        font-size: 12.5px;
        background: var(--surface-2);
        border: 1px solid var(--line-structure);
        border-radius: 3px;
        padding: 1px 6px;
        color: var(--text-primary);
      }

      .gov-ee-pill {
        display: inline-flex; align-items: center;
        height: 20px; padding: 0 7px; border-radius: 2px;
        font-family: var(--font-mono); font-size: 10px;
        letter-spacing: .08em; text-transform: uppercase;
        color: var(--text-primary);
        background: var(--surface-cta-primary);
        border: 1px solid var(--line-cta);
      }

      .gov-step-num {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-size: 40px; font-weight: 500;
        color: var(--text-primary); line-height: 1;
        display: inline-flex; align-items: baseline;
      }
      .gov-step-num::after {
        content: ""; display: inline-block; width: 40px; height: 1px;
        background: var(--line-structure); margin-left: 8px; vertical-align: middle;
      }

      .gov-proof-grid > div {
        border-right: 1px solid var(--line-structure);
        border-top: 1px solid var(--line-structure);
      }
      .gov-proof-grid > div:nth-child(2n) { border-right: none; }
      @media (min-width: 768px) {
        .gov-proof-grid > div:nth-child(2n) { border-right: 1px solid var(--line-structure); }
        .gov-proof-grid > div:nth-child(4n) { border-right: none; }
      }
    `}</style>
  );
}
