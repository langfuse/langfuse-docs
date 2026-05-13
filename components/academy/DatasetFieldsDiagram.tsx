"use client";

import { useLayoutEffect, useRef } from "react";

const INNER_W = 980;
const INNER_H = 386;

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.69;
  return Math.min(1, Math.max(0.25, (document.documentElement.clientWidth - 32) / INNER_W));
}

function StageLabel({
  y,
  num,
  name,
}: {
  y: number;
  num: string;
  name: string;
}) {
  return (
    <div className="dataset-fields__stage-label" style={{ top: y }}>
      <span className="dataset-fields__stage-num">{num}</span>
      <span className="dataset-fields__stage-name">{name}</span>
    </div>
  );
}

function Node({
  x,
  y,
  width,
  children,
  variant,
}: {
  x: number;
  y: number;
  width: number;
  children: React.ReactNode;
  variant?: "live" | "stripe" | "terminal";
}) {
  return (
    <div
      className={`dataset-fields__node ${variant ? `dataset-fields__node--${variant}` : ""}`}
      style={{ left: x, top: y, width }}
    >
      <span>{children}</span>
    </div>
  );
}

export function DatasetFieldsDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / INNER_W);
      inner.style.transform = `scale(${scale})`;
      wrap.style.height = `${INNER_H * scale}px`;
    };

    fit();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fit);
    });
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <figure className="dataset-fields not-prose" aria-label="Dataset fields and when they are used">
      <div
        ref={wrapRef}
        suppressHydrationWarning
        className="dataset-fields__wrap"
        style={{ height: INNER_H * estScale }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="dataset-fields__canvas"
          style={{ transform: `scale(${estScale})` }}
        >
          <div className="dataset-fields__frame" />
          <div className="dataset-fields__label-divider" />
          <div className="dataset-fields__row-divider" style={{ top: 128 }} />
          <div className="dataset-fields__row-divider" style={{ top: 257 }} />

          <StageLabel y={0} num="01" name="Run experiment" />
          <StageLabel y={128} num="02" name="Add context" />
          <StageLabel y={257} num="03" name="Score" />

          <svg className="dataset-fields__arrows" viewBox={`0 0 ${INNER_W} ${INNER_H}`} aria-hidden="true">
            <defs>
              <marker id="dataset-fields-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill="var(--text-secondary)" />
              </marker>
              <marker id="dataset-fields-arrow-dashed" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 Z" fill="var(--text-tertiary)" />
              </marker>
            </defs>
            <path className="dataset-fields__arrow" d="M 340 64 H 400" markerEnd="url(#dataset-fields-arrow)" />
            <path className="dataset-fields__arrow" d="M 620 64 H 680" markerEnd="url(#dataset-fields-arrow)" />
            <path className="dataset-fields__arrow" d="M 340 192 H 400" markerEnd="url(#dataset-fields-arrow)" />
            <path className="dataset-fields__arrow" d="M 340 321 H 680" markerEnd="url(#dataset-fields-arrow)" />
            <path className="dataset-fields__arrow dataset-fields__arrow--dashed" d="M 770 94 V 286" markerEnd="url(#dataset-fields-arrow-dashed)" />
            <path className="dataset-fields__arrow dataset-fields__arrow--dashed" d="M 510 222 V 250 H 770 V 286" markerEnd="url(#dataset-fields-arrow-dashed)" />
          </svg>

          <Node x={160} y={36} width={180} variant="live">Input</Node>
          <Node x={400} y={36} width={220} variant="live">Task execution</Node>
          <Node x={680} y={36} width={180} variant="live">Actual output</Node>

          <Node x={160} y={164} width={180} variant="stripe">Metadata</Node>
          <Node x={400} y={164} width={220} variant="stripe">Extra context for review</Node>

          <Node x={160} y={293} width={180}>Expected output</Node>
          <Node x={680} y={293} width={180} variant="terminal">Score / compare</Node>
        </div>
      </div>

      <style>{`
        .dataset-fields {
          margin: 32px 0;
          width: 100%;
        }

        .dataset-fields__wrap {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .dataset-fields__canvas {
          position: relative;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          transform-origin: top left;
        }

        .dataset-fields__frame,
        .dataset-fields__label-divider,
        .dataset-fields__row-divider,
        .dataset-fields__stage-label,
        .dataset-fields__arrows,
        .dataset-fields__node {
          position: absolute;
        }

        .dataset-fields__frame {
          inset: 0;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
        }

        .dataset-fields__label-divider {
          top: 0;
          bottom: 0;
          left: 120px;
          border-left: 1px dashed var(--line-divider-dash);
        }

        .dataset-fields__row-divider {
          right: 0;
          left: 0;
          border-top: 1px solid var(--line-structure);
        }

        .dataset-fields__stage-label {
          left: 0;
          width: 120px;
          height: 128px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 14px;
          padding-right: 20px;
        }

        .dataset-fields__stage-num,
        .dataset-fields__stage-name {
          display: block;
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dataset-fields__stage-num {
          margin-bottom: 4px;
          color: var(--text-disabled);
          font-size: 10px;
          letter-spacing: 0.06em;
        }

        .dataset-fields__stage-name {
          font-size: 11px;
          letter-spacing: 0.04em;
          line-height: 1.4;
        }

        .dataset-fields__arrows {
          inset: 0;
          width: ${INNER_W}px;
          height: ${INNER_H}px;
          overflow: visible;
          pointer-events: none;
          z-index: 1;
        }

        .dataset-fields__arrow {
          fill: none;
          stroke: var(--text-secondary);
          stroke-width: 1.5;
        }

        .dataset-fields__arrow--dashed {
          stroke: var(--text-tertiary);
          stroke-width: 1.25;
          stroke-dasharray: 4 4;
        }

        .dataset-fields__node {
          z-index: 2;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          background: var(--surface-bg);
          padding: 0 18px;
          text-align: center;
          transition: border-color 0.18s ease;
        }

        .dataset-fields__node::before {
          content: "";
          position: absolute;
          inset: -1px;
          z-index: 2;
          pointer-events: none;
          background-color: var(--line-cta);
          --tl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z' fill='black'/%3E%3C/svg%3E");
          --bl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 8V7H3C1.89543 7 1 6.10457 1 5V0H0V8H8Z' fill='black'/%3E%3C/svg%3E");
          --br: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 8V7H5C6.10457 7 7 6.10457 7 5V0H8V8H0Z' fill='black'/%3E%3C/svg%3E");
          --tr: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 0V1H5C6.10457 1 7 1.89543 7 3V8H8V0H0Z' fill='black'/%3E%3C/svg%3E");
          -webkit-mask-image: var(--tl), var(--bl), var(--br), var(--tr);
          mask-image: var(--tl), var(--bl), var(--br), var(--tr);
          -webkit-mask-position: top left, bottom left, bottom right, top right;
          mask-position: top left, bottom left, bottom right, top right;
          -webkit-mask-size: 8px 8px;
          mask-size: 8px 8px;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
        }

        .dataset-fields__node span {
          color: var(--text-primary);
          font-family: var(--font-analog);
          font-size: 18px;
          font-weight: 500;
          line-height: 1.1;
        }

        .dataset-fields__node--live {
          border-color: var(--line-structure);
          background: color-mix(in oklab, var(--callout-info) 10%, var(--surface-bg));
        }

        .dataset-fields__node--stripe {
          background: repeating-linear-gradient(
            315deg,
            var(--surface-bg),
            var(--surface-bg) 2px,
            color-mix(in oklab, var(--text-tertiary) 12%, transparent) 4px,
            var(--surface-bg) 4px
          );
        }

        .dataset-fields__node--terminal {
          border-color: var(--line-structure);
          background: var(--surface-cta-primary);
        }

        .dataset-fields__node:hover {
          border-color: var(--line-cta);
        }

        .dark .dataset-fields__node--live,
        [data-theme="dark"] .dataset-fields__node--live,
        .dark .dataset-fields__node--terminal,
        [data-theme="dark"] .dataset-fields__node--terminal {
          background: transparent;
        }
      `}</style>
    </figure>
  );
}
