export function JapanStyles() {
  return (
    <style>{`
      .japan-page {
        background: var(--surface-bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
        font-feature-settings: "palt" 1, "pkna" 1;
      }
      .japan-page,
      .japan-page p {
        line-height: 1.7;
      }

      .japan-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      @media (min-width: 768px) {
        .japan-section { padding-left: 32px; padding-right: 32px; }
      }

      /* Corner-box bracket borders */
      .japan-corners::before {
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
      .japan-corners.no-tl::before { -webkit-mask-position: 50% 150%, bottom left, bottom right, top right; mask-position: 50% 150%, bottom left, bottom right, top right; }
      .japan-corners.no-tr::before { -webkit-mask-position: top left, bottom left, bottom right, 50% 150%; mask-position: top left, bottom left, bottom right, 50% 150%; }
      .japan-corners.no-bl::before { -webkit-mask-position: top left, 50% 150%, bottom right, top right; mask-position: top left, 50% 150%, bottom right, top right; }
      .japan-corners.no-br::before { -webkit-mask-position: top left, bottom left, 50% 150%, top right; mask-position: top left, bottom left, 50% 150%, top right; }

      .japan-card-shadow {
        box-shadow:
          -23px 51px 16px 0 rgba(0,0,0,0),
          -15px 33px 14px 0 rgba(0,0,0,0.01),
          -8px 18px 12px 0 rgba(0,0,0,0.02),
          -4px 8px 9px 0 rgba(0,0,0,0.03),
          -1px 2px 5px 0 rgba(0,0,0,0.04),
          0 8px 24px rgba(0,0,0,0.08);
      }

      .japan-grid-bg {
        background-image:
          linear-gradient(to right,  rgba(108,103,96,0.18) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108,103,96,0.18) 1px, transparent 1px);
        background-size: 8px 8px;
      }
      .japan-stripes-bg {
        background-image: repeating-linear-gradient(315deg,
          transparent 0, transparent 2px,
          rgba(108, 103, 96, 0.12) 2px, rgba(108, 103, 96, 0.12) 3px);
      }

      .japan-page .japan-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--text-tertiary); display: inline-block; flex-shrink: 0; }

      /* Buttons */
      .japan-btn-wrap { position: relative; display: inline-flex; align-items: center; padding: 4px; }
      .japan-btn {
        display: inline-flex; align-items: center; justify-content: center; gap: 6px;
        height: 36px; padding: 0 14px; border-radius: 2px;
        font-size: 13px; font-weight: 500; letter-spacing: -0.06px;
        border: 1px solid;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.05), 0 4px 4px 0 rgba(0,0,0,0.03);
        cursor: pointer; transition: background 120ms, border-color 120ms;
        white-space: nowrap;
      }
      .japan-btn-primary { background: var(--text-primary); color: var(--surface-bg); border-color: var(--text-secondary); }
      .japan-btn-primary:hover { background: #2b2a27; }
      .japan-btn-secondary { background: var(--surface-bg); color: var(--text-secondary); border-color: var(--line-structure); }
      .japan-btn-secondary:hover { border-color: var(--line-cta); }
      .japan-btn-small { height: 28px; padding: 0 10px; font-size: 12px; }
      .japan-kbd {
        display: inline-flex; align-items: center; justify-content: center;
        min-width: 20px; height: 20px; padding: 0 4px; border-radius: 1px; font-size: 11px; font-weight: 500;
        border: 1px solid rgba(64,61,57,0.30); background: rgba(64,61,57,0.40);
        font-family: var(--font-mono);
      }
      .japan-btn-secondary .japan-kbd { border-color: rgba(64,61,57,0.20); background: rgba(64,61,57,0.10); color: var(--text-secondary); }

      /* Highlight (marker pen) */
      .japan-highlight {
        display: inline-block;
        background: var(--surface-cta-primary);
        padding: 0 6px;
        mix-blend-mode: multiply;
        color: inherit;
      }

      /* Headings */
      .japan-h1 {
        font-family: var(--font-analog), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", "Noto Sans JP", sans-serif;
        font-weight: 500;
        font-size: clamp(40px, 5.6vw, 80px);
        line-height: 1.15;
        letter-spacing: -0.01em;
        margin: 0;
      }
      .japan-h2 {
        font-family: var(--font-analog), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", "Noto Sans JP", sans-serif;
        font-weight: 500;
        font-size: clamp(26px, 2.8vw, 38px);
        line-height: 1.3;
        letter-spacing: -0.005em;
        margin: 0;
      }
      .japan-eyebrow {
        font-family: var(--font-mono);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .04em;
        color: var(--text-tertiary);
        white-space: nowrap;
      }
      .japan-body {
        font-size: 15px;
        line-height: 1.8;
        color: var(--text-secondary);
        max-width: 60ch;
        text-wrap: pretty;
        margin: 0;
      }
      .japan-body-sm {
        font-size: 13.5px;
        line-height: 1.85;
        color: var(--text-secondary);
        text-wrap: pretty;
      }

      /* Pill */
      .japan-page .jp-pill {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px; border-radius: 999px;
        border: 1px solid var(--line-structure);
        background: var(--surface-bg);
        font-family: var(--font-mono); font-size: 11px;
        color: var(--text-secondary);
        letter-spacing: .04em;
      }
      .japan-page .jp-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--callout-success); box-shadow: 0 0 0 3px rgba(83,138,46,0.12); }

      /* Chip card */
      .japan-chip-card {
        position: relative; background: var(--surface-1);
        border: 1px solid var(--line-structure); border-radius: 2px;
        overflow: hidden; transition: border-color 120ms;
      }
      .japan-chip-card:hover { border-color: var(--line-cta); }

      /* Inline link */
      .japan-link { color: var(--text-links); border-bottom: 1px solid currentColor; }
      .japan-link:hover { opacity: .8; }

      /* Inline code */
      .japan-code-inline {
        font-family: var(--font-mono);
        font-size: 12.5px;
        background: var(--surface-2);
        border: 1px solid var(--line-structure);
        border-radius: 3px;
        padding: 1px 6px;
        color: var(--text-primary);
      }

      /* Step number */
      .japan-page .font-analog {
        font-family: var(--font-analog), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", "Noto Sans JP", sans-serif !important;
      }
      .japan-step-num {
        font-family: var(--font-analog), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic UI", "Yu Gothic", "Noto Sans JP", sans-serif;
        font-size: 40px; font-weight: 500;
        color: var(--text-primary); line-height: 1;
        display: inline-flex; align-items: baseline; gap: 6px;
      }
      .japan-step-num::after {
        content: ""; display: inline-block; width: 40px; height: 1px;
        background: var(--line-structure); margin-left: 8px; vertical-align: middle;
      }

      /* Table */
      .japan-table { width: 100%; border-collapse: collapse; font-size: 13px; }
      .japan-table th, .japan-table td {
        text-align: left; padding: 12px 16px;
        border-bottom: 1px solid var(--line-structure);
        color: var(--text-secondary);
      }
      .japan-table thead th {
        font-family: var(--font-mono); font-size: 11px; text-transform: uppercase;
        letter-spacing: .08em; color: var(--text-tertiary); font-weight: 500;
        background: var(--surface-1);
      }
      .japan-table tbody tr:last-child td { border-bottom: none; }
      .japan-table td:first-child { color: var(--text-primary); font-weight: 500; }

      /* FAQ accordion */
      .japan-faq-item { border-bottom: 1px solid var(--line-structure); }
      .japan-faq-item:first-child { border-top: 1px solid var(--line-structure); }
      .japan-faq-item summary {
        list-style: none; cursor: pointer;
        padding: 20px 4px; display: flex; gap: 16px; align-items: baseline;
        font-family: var(--font-analog), serif;
        font-size: 18px;
        line-height: 1.5;
        color: var(--text-primary);
        font-weight: 500;
      }
      .japan-faq-item summary::-webkit-details-marker { display: none; }
      .japan-faq-item summary::before {
        content: "+"; font-family: var(--font-mono); font-size: 20px;
        color: var(--text-tertiary); width: 18px; flex-shrink: 0;
        transition: transform 150ms;
      }
      .japan-faq-item[open] summary::before { content: "−"; color: var(--text-primary); }
      .japan-faq-item .japan-faq-body {
        padding: 0 4px 24px 38px; max-width: 75ch;
        color: var(--text-secondary); font-size: 14px; line-height: 1.85;
      }
      .japan-faq-item .japan-faq-body > * + * { margin-top: 12px; }
    `}</style>
  );
}
