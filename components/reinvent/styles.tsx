export function ReinventStyles() {
  return (
    <style>{`
      .rei-page {
        background: var(--surface-bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      .rei-page,
      .rei-page p {
        line-height: 1.7;
      }

      .rei-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      @media (min-width: 768px) {
        .rei-section { padding-left: 32px; padding-right: 32px; }
      }

      .rei-corners::before {
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
      .rei-corners.no-bl.no-br::before { -webkit-mask-position: top left, 50% 150%, 50% 150%, top right; mask-position: top left, 50% 150%, 50% 150%, top right; }
      .rei-corners.no-tl.no-tr::before { -webkit-mask-position: 50% 150%, bottom left, bottom right, 50% 150%; mask-position: 50% 150%, bottom left, bottom right, 50% 150%; }
      .rei-corners.no-tl.no-tr.no-bl.no-br::before { -webkit-mask-position: 50% 150%, 50% 150%, 50% 150%, 50% 150%; mask-position: 50% 150%, 50% 150%, 50% 150%, 50% 150%; }

      .rei-masthead {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(26px, 3.2vw, 40px);
        line-height: 1.12;
        letter-spacing: -0.02em;
        color: var(--text-primary);
        margin: 0;
      }

      .rei-feature-list li {
        display: flex;
        gap: 8px;
      }
      .rei-feature-list li::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 1px;
        background: var(--surface-cta-primary);
        box-shadow: 0 0 0 1px var(--line-cta);
        flex-shrink: 0;
      }

      .rei-feature-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin: 0;
        padding: 0;
        list-style: none;
      }
      .rei-feature-list li {
        align-items: flex-start;
        font-size: 13.5px;
        line-height: 1.55;
        color: var(--text-secondary);
      }
      .rei-feature-list li::before { margin-top: 7px; }

      .rei-grid-bg {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px;
      }
      .rei-stripes-bg {
        background-image: repeating-linear-gradient(315deg,
          transparent 0, transparent 2px,
          rgba(108, 103, 96, 0.12) 2px, rgba(108, 103, 96, 0.12) 3px);
      }
      .rei-blueprint {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.10) 1px, transparent 1px),
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px, 8px 8px, 64px 64px, 64px 64px;
      }

      .rei-highlight {
        display: inline;
        background: var(--surface-cta-primary);
        padding: 0 6px;
        mix-blend-mode: multiply;
        color: inherit;
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;
      }
      :root[class~="dark"] .rei-highlight { mix-blend-mode: screen; }

      .rei-h1 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(32px, 4.2vw, 52px);
        line-height: 1.1;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .rei-h2 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: clamp(26px, 3vw, 40px);
        line-height: 1.22;
        letter-spacing: -0.005em;
        margin: 0;
      }
      .rei-h3 {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-weight: 500;
        font-size: 20px;
        line-height: 1.3;
        color: var(--text-primary);
        margin: 0;
        text-wrap: balance;
      }
      .rei-eyebrow {
        font-family: var(--font-mono);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .08em;
        color: var(--text-tertiary);
      }
      .rei-body {
        font-size: 15px;
        line-height: 1.8;
        color: var(--text-secondary);
        max-width: 62ch;
        text-wrap: pretty;
        margin: 0;
      }
      .rei-body-sm {
        font-size: 13.5px;
        line-height: 1.75;
        color: var(--text-secondary);
        text-wrap: pretty;
        margin: 0;
      }

      .rei-chip-card {
        position: relative; background: var(--surface-1);
        border: 1px solid var(--line-structure); border-radius: 2px;
        overflow: hidden; transition: border-color 120ms;
      }
      .rei-chip-card:hover { border-color: var(--line-cta); }

      .rei-accent-top::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: var(--surface-cta-primary);
      }

      .rei-link { color: var(--text-links); border-bottom: 1px solid currentColor; }
      .rei-link:hover { opacity: .8; }
      .rei-mono-link {
        align-self: flex-start;
        border-bottom: 1px solid var(--text-primary);
        padding-bottom: 1px;
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--text-primary);
      }

      .rei-pill {
        display: inline-flex; align-items: center;
        height: 20px; padding: 0 7px; border-radius: 2px;
        font-family: var(--font-mono); font-size: 10px;
        letter-spacing: .08em; text-transform: uppercase;
        white-space: nowrap;
        color: var(--text-secondary);
        background: var(--surface-bg);
        border: 1px solid var(--line-structure);
      }
      .rei-pill.is-accent {
        color: var(--text-primary);
        background: var(--surface-cta-primary);
        border-color: var(--line-cta);
      }

      .rei-step-num {
        font-family: var(--font-analog), "Inter", system-ui, sans-serif;
        font-size: 32px; font-weight: 500;
        color: var(--text-primary); line-height: 1;
        display: inline-flex; align-items: center;
      }
      .rei-step-num::after {
        content: ""; display: inline-block; width: 32px; height: 1px;
        background: var(--line-structure); margin-left: 10px;
      }

    `}</style>
  );
}
