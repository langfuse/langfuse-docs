export function LaunchWeek5Styles() {
  return (
    <style>{`
      .lw5-page {
        background: var(--surface-bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      .lw5-page,
      .lw5-page p {
        line-height: 1.7;
      }

      .lw5-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      @media (min-width: 768px) {
        .lw5-section { padding-left: 32px; padding-right: 32px; }
      }

      /* Corner-box bracket borders (same primitive as the Japan page) */
      .lw5-corners::before {
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
      .lw5-corners.no-tl::before { -webkit-mask-position: 50% 150%, bottom left, bottom right, top right; mask-position: 50% 150%, bottom left, bottom right, top right; }
      .lw5-corners.no-tr::before { -webkit-mask-position: top left, bottom left, bottom right, 50% 150%; mask-position: top left, bottom left, bottom right, 50% 150%; }
      .lw5-corners.no-bl::before { -webkit-mask-position: top left, 50% 150%, bottom right, top right; mask-position: top left, 50% 150%, bottom right, top right; }
      .lw5-corners.no-br::before { -webkit-mask-position: top left, bottom left, 50% 150%, top right; mask-position: top left, bottom left, 50% 150%, top right; }

      /* Backgrounds */
      .lw5-grid-bg {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px;
      }
      .lw5-stripes-bg {
        background-image: repeating-linear-gradient(315deg,
          transparent 0, transparent 2px,
          rgba(108, 103, 96, 0.12) 2px, rgba(108, 103, 96, 0.12) 3px);
      }
      .lw5-blueprint {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px, 8px 8px, 64px 64px, 64px 64px;
      }

      .lw5-page .lw5-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-tertiary); display: inline-block; flex-shrink: 0; }

      /* Buttons */
      .lw5-btn-wrap { position: relative; display: inline-flex; align-items: center; padding: 4px; }
      .lw5-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        height: 36px; padding: 0 14px; border-radius: 2px;
        font-size: 13px; font-weight: 500; letter-spacing: -0.06px;
        border: 1px solid;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.05), 0 4px 4px 0 rgba(0,0,0,0.03);
        cursor: pointer; transition: background 120ms, border-color 120ms;
        white-space: nowrap;
      }
      .lw5-btn-primary { background: var(--text-primary); color: var(--surface-bg); border-color: var(--text-secondary); }
      .lw5-btn-primary:hover { background: #2b2a27; }
      .lw5-btn-secondary { background: var(--surface-bg); color: var(--text-secondary); border-color: var(--line-structure); }
      .lw5-btn-secondary:hover { border-color: var(--line-cta); }
      .lw5-btn-small { height: 28px; padding: 0 10px; font-size: 12px; }
      .lw5-kbd {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 20px; height: 20px; padding: 0 4px; border-radius: 1px; font-size: 11px; font-weight: 500;
        border: 1px solid rgba(64,61,57,0.30); background: rgba(64,61,57,0.40);
        font-family: var(--font-mono);
      }
      .lw5-btn-secondary .lw5-kbd { border-color: rgba(64,61,57,0.20); background: rgba(64,61,57,0.10); color: var(--text-secondary); }

      /* Highlight (marker pen) */
      .lw5-highlight {
        display: inline-block;
        background: var(--surface-cta-primary);
        padding: 0 6px;
        mix-blend-mode: multiply;
        color: inherit;
      }
      :root[class~="dark"] .lw5-highlight { mix-blend-mode: screen; }

      /* Headings */
      .lw5-h1 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(48px, 7vw, 104px);
        line-height: 0.98;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .lw5-h2 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(28px, 3.2vw, 44px);
        line-height: 1.2;
        letter-spacing: -0.005em;
        margin: 0;
      }
      .lw5-eyebrow {
        font-family: var(--font-mono);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--text-tertiary);
        white-space: nowrap;
      }
      .lw5-body {
        font-size: 15px;
        line-height: 1.75;
        color: var(--text-secondary);
        max-width: 64ch;
        text-wrap: pretty;
        margin: 0;
      }
      .lw5-body-sm {
        font-size: 13.5px;
        line-height: 1.85;
        color: var(--text-secondary);
        text-wrap: pretty;
      }

      /* Pill */
      .lw5-page .lw5-pill {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 12px; border-radius: 999px;
        border: 1px solid var(--line-cta);
        background: var(--surface-bg);
        font-family: var(--font-mono); font-size: 11px;
        color: var(--text-primary);
        letter-spacing: .06em;
        text-transform: uppercase;
      }
      .lw5-page .lw5-pill .lw5-pulse {
        width: 7px; height: 7px; border-radius: 50%;
        background: var(--callout-success);
        box-shadow: 0 0 0 0 rgba(83,138,46,0.55);
        animation: lw5-pulse 1.8s ease-out infinite;
      }
      @keyframes lw5-pulse {
        0%   { box-shadow: 0 0 0 0 rgba(83,138,46,0.55); }
        70%  { box-shadow: 0 0 0 10px rgba(83,138,46,0); }
        100% { box-shadow: 0 0 0 0 rgba(83,138,46,0); }
      }

      /* Chip card */
      .lw5-chip-card {
        position: relative; background: var(--surface-1);
        border: 1px solid var(--line-structure); border-radius: 2px;
        overflow: hidden; transition: border-color 120ms;
      }
      .lw5-chip-card:hover { border-color: var(--line-cta); }

      /* Inline link */
      .lw5-link { color: var(--text-links); border-bottom: 1px solid currentColor; }
      .lw5-link:hover { opacity: .8; }

      /* Inline code */
      .lw5-code-inline {
        font-family: var(--font-mono);
        font-size: 12.5px;
        background: var(--surface-2);
        border: 1px solid var(--line-structure);
        border-radius: 3px;
        padding: 1px 6px;
        color: var(--text-primary);
      }

      /* Day card */
      .lw5-page .font-analog {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif !important;
      }
      .lw5-day-num {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-size: clamp(56px, 6vw, 88px);
        font-weight: 500;
        color: var(--text-primary); line-height: 0.9;
        letter-spacing: -0.02em;
      }
      .lw5-day-card {
        position: relative;
        background: var(--surface-1);
        border: 1px solid var(--line-structure);
        border-radius: 2px;
        padding: 20px;
        min-height: 240px;
        display: flex; flex-direction: column; gap: 12px;
        overflow: hidden;
        transition: border-color 150ms, transform 150ms;
      }
      .lw5-day-card:hover { border-color: var(--line-cta); }
      .lw5-day-card[data-state="locked"] .lw5-day-num { color: var(--text-disabled); }
      .lw5-day-card[data-state="locked"]::before {
        content: ""; position: absolute; inset: 0;
        background-image: repeating-linear-gradient(45deg,
          transparent 0, transparent 12px,
          rgba(108, 103, 96, 0.05) 12px, rgba(108, 103, 96, 0.05) 13px);
        pointer-events: none;
      }
      .lw5-lock {
        display: inline-flex; align-items: center; justify-content: center;
        width: 22px; height: 22px; border-radius: 2px;
        background: var(--surface-2); border: 1px solid var(--line-structure);
        color: var(--text-tertiary);
      }

      /* Past launch weeks grid */
      .lw5-past-grid > a {
        border-right: 1px solid var(--line-structure);
        border-bottom: 1px solid var(--line-structure);
      }
      .lw5-past-grid > a:nth-child(2n) { border-right: none; }
      .lw5-past-grid > a:nth-last-child(-n+2) { border-bottom: none; }
      @media (min-width: 768px) {
        .lw5-past-grid > a {
          border-right: 1px solid var(--line-structure);
          border-bottom: none;
        }
        .lw5-past-grid > a:nth-child(2n) { border-right: 1px solid var(--line-structure); }
        .lw5-past-grid > a:last-child { border-right: none; }
      }

      /* Subscribe form override (the shared ProductUpdateSignup uses shadcn input/button) */
      .lw5-subscribe input {
        background: var(--surface-bg);
        border-color: var(--line-structure);
      }

      /* Theme pillars */
      .lw5-pillar {
        position: relative;
        padding: 22px 20px;
        background: var(--surface-1);
        border: 1px solid var(--line-structure);
        border-radius: 2px;
        display: flex; flex-direction: column; gap: 8px;
        min-height: 180px;
        transition: border-color 150ms;
      }
      .lw5-pillar:hover { border-color: var(--line-cta); }
      .lw5-pillar-num {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: .08em;
        color: var(--text-tertiary);
        text-transform: uppercase;
      }
    `}</style>
  );
}
