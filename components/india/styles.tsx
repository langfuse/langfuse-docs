export function IndiaStyles() {
  return (
    <style>{`
      .india-page {
        background: var(--surface-bg);
        color: var(--text-primary);
        font-family: var(--font-sans);
        font-size: 15px;
        line-height: 1.65;
        -webkit-font-smoothing: antialiased;
      }
      .india-page p {
        line-height: 1.7;
      }

      .india-section {
        padding-left: 16px;
        padding-right: 16px;
      }
      @media (min-width: 768px) {
        .india-section {
          padding-left: 32px;
          padding-right: 32px;
        }
      }

      .india-card-shadow {
        box-shadow:
          -23px 51px 16px 0 rgba(0, 0, 0, 0),
          -15px 33px 14px 0 rgba(0, 0, 0, 0.01),
          -8px 18px 12px 0 rgba(0, 0, 0, 0.02),
          -4px 8px 9px 0 rgba(0, 0, 0, 0.03),
          -1px 2px 5px 0 rgba(0, 0, 0, 0.04),
          0 8px 24px rgba(0, 0, 0, 0.08);
      }
      :root[class~="dark"] .india-card-shadow {
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
      }

      .india-grid-bg {
        background-image:
          linear-gradient(to right, rgba(108, 103, 96, 0.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(108, 103, 96, 0.16) 1px, transparent 1px);
        background-size: 8px 8px;
      }

      .india-page .india-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: var(--text-tertiary);
        display: inline-block;
        flex-shrink: 0;
      }

      /* Marker pen highlight */
      .india-highlight {
        display: inline-block;
        background: var(--surface-cta-primary);
        padding: 0 6px;
        color: var(--text-primary);
      }

      /* Headings */
      .india-h1 {
        font-family: var(--font-analog), var(--font-sans);
        font-weight: 500;
        font-size: clamp(40px, 5.6vw, 80px);
        line-height: 1.06;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .india-h2 {
        font-family: var(--font-analog), var(--font-sans);
        font-weight: 500;
        font-size: clamp(26px, 2.8vw, 40px);
        line-height: 1.22;
        letter-spacing: -0.01em;
        margin: 0;
      }
      .india-eyebrow {
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.01em;
        color: var(--text-tertiary);
        white-space: nowrap;
      }
      .india-body {
        font-size: 15px;
        line-height: 1.75;
        color: var(--text-secondary);
        max-width: 60ch;
        text-wrap: pretty;
        margin: 0;
      }
      .india-body-sm {
        font-size: 13.5px;
        line-height: 1.75;
        color: var(--text-secondary);
        text-wrap: pretty;
      }

      /* Hero fact strip borders (2-col mobile, 4-col desktop) */
      .india-fact-grid > div {
        border-right: 1px solid var(--line-structure);
        border-bottom: 1px solid var(--line-structure);
      }
      .india-fact-grid > div:nth-child(2n) {
        border-right: none;
      }
      .india-fact-grid > div:nth-last-child(-n + 2) {
        border-bottom: none;
      }
      @media (min-width: 768px) {
        .india-fact-grid > div {
          border-bottom: none;
          border-right: 1px solid var(--line-structure);
        }
        .india-fact-grid > div:nth-child(2n) {
          border-right: 1px solid var(--line-structure);
        }
        .india-fact-grid > div:last-child {
          border-right: none;
        }
      }

      /* Logo grid borders (3-col mobile, 6-col desktop) */
      .india-logo-grid > div {
        border-right: 1px solid var(--line-structure);
        border-bottom: 1px solid var(--line-structure);
      }
      .india-logo-grid > div:nth-child(3n) {
        border-right: none;
      }
      .india-logo-grid > div:nth-last-child(-n + 3) {
        border-bottom: none;
      }
      @media (min-width: 768px) {
        .india-logo-grid > div {
          border-bottom: none;
          border-right: 1px solid var(--line-structure);
        }
        .india-logo-grid > div:nth-child(3n) {
          border-right: 1px solid var(--line-structure);
        }
        .india-logo-grid > div:nth-child(6n) {
          border-right: none;
        }
        .india-logo-grid > div:last-child {
          border-right: none;
        }
      }

      /* Chip card */
      .india-chip-card {
        position: relative;
        background: var(--surface-1);
        border: 1px solid var(--line-structure);
        border-radius: 2px;
        overflow: hidden;
        transition: border-color 120ms;
      }
      .india-chip-card:hover {
        border-color: var(--line-cta);
      }

      /* Inline link */
      .india-link {
        color: var(--text-links);
        border-bottom: 1px solid currentColor;
      }
      .india-link:hover {
        opacity: 0.8;
      }

      /* Inline code */
      .india-code-inline {
        font-family: var(--font-mono);
        font-size: 12.5px;
        background: var(--surface-2);
        border: 1px solid var(--line-structure);
        border-radius: 3px;
        padding: 1px 6px;
        color: var(--text-primary);
      }

      /* Terminal code block syntax palette (high contrast on --surface-code in light & dark mode) */
      .india-code-box {
        background: var(--surface-code);
        border: 1px solid var(--line-code-border);
        color: #f6f6f3;
      }
      .india-code-header {
        background: var(--surface-code-grey);
        border-bottom: 1px solid var(--line-code-border);
      }
      .india-code-key {
        color: #9ac6ff;
      }
      .india-code-val {
        color: #c7e6b0;
      }
      .india-code-url {
        color: #f2cc60;
      }
      .india-code-link {
        color: #d2b8ff;
      }
      .india-code-comment {
        color: #a7a7a0;
      }

      /* Step number */
      .india-step-num {
        font-family: var(--font-analog), var(--font-sans);
        font-size: 40px;
        font-weight: 500;
        color: var(--text-primary);
        line-height: 1;
        display: inline-flex;
        align-items: baseline;
        gap: 6px;
      }
      .india-step-num::after {
        content: "";
        display: inline-block;
        width: 40px;
        height: 1px;
        background: var(--line-structure);
        margin-left: 8px;
        vertical-align: middle;
      }

      /* Table */
      .india-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
      }
      .india-table th,
      .india-table td {
        text-align: left;
        padding: 12px 16px;
        border-bottom: 1px solid var(--line-structure);
        color: var(--text-secondary);
      }
      .india-table thead th {
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.01em;
        color: var(--text-tertiary);
        font-weight: 500;
        background: var(--surface-1);
      }
      .india-table tbody tr:last-child td {
        border-bottom: none;
      }
      .india-table td:first-child {
        color: var(--text-primary);
        font-weight: 500;
      }

      /* FAQ accordion */
      .india-faq-item {
        border-bottom: 1px solid var(--line-structure);
      }
      .india-faq-item:first-child {
        border-top: 1px solid var(--line-structure);
      }
      .india-faq-item summary {
        list-style: none;
        cursor: pointer;
        padding: 20px 4px;
        display: flex;
        gap: 16px;
        align-items: baseline;
        font-family: var(--font-analog), var(--font-sans);
        font-size: 18px;
        line-height: 1.5;
        color: var(--text-primary);
        font-weight: 500;
      }
      .india-faq-item summary::-webkit-details-marker {
        display: none;
      }
      .india-faq-item summary::before {
        content: "+";
        font-family: var(--font-mono);
        font-size: 20px;
        color: var(--text-tertiary);
        width: 18px;
        flex-shrink: 0;
        transition: transform 150ms;
      }
      .india-faq-item[open] summary::before {
        content: "−";
        color: var(--text-primary);
      }
      .india-faq-item .india-faq-body {
        padding: 0 4px 24px 38px;
        max-width: 75ch;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.8;
      }
      .india-faq-item .india-faq-body > * + * {
        margin-top: 12px;
      }
    `}</style>
  );
}
