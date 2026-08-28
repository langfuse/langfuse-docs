"use client";

import { useId, useLayoutEffect, useRef } from "react";

// Faithful port of the source diagram: a fixed 920px-wide canvas whose height
// follows its content, scaled down to fit the 680px blog column.
const INNER_W = 920;
const COLUMN_W = 680;

function initialScale(): number {
  if (typeof window === "undefined") return COLUMN_W / INNER_W;
  const vw = document.documentElement.clientWidth;
  return Math.min(1, Math.max(0.1, Math.min(vw - 32, COLUMN_W) / INNER_W));
}

export function AgentLlmsTxtFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = initialScale();
  const arrowId = `allf-a5-${useId().replace(/:/g, "")}`;

  // `zoom` (rather than `transform: scale`) shrinks the canvas's layout box, so
  // the wrapper's height follows the content automatically — no measuring, and
  // no stale height leaving whitespace under the diagram.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const fit = () => {
      inner.style.zoom = String(Math.min(1, wrap.clientWidth / INNER_W));
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
    <figure
      className="allf not-prose"
      aria-label='An agent working out how to instrument a Python Vercel AI SDK application calls its webfetch tool for langfuse.com/llms.txt with the query "langfuse instrumentation for Vercel AI SDK Python". The tool matches the page content against that query and returns only the matching integration line, langfuse.com/integrations/frameworks/vercel-ai-sdk.md. The line in llms.txt recommending the Langfuse skill never reaches the agent.'
    >
      <div ref={wrapRef} className="allf__wrap">
        <div
          ref={innerRef}
          suppressHydrationWarning
          className="allf__canvas"
          style={{ zoom: estScale }}
        >
          <div className="allf__stack">
            <div className="allf__ask">
              <svg
                width="58"
                height="58"
                viewBox="0 0 34 34"
                fill="none"
                stroke="var(--text-primary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: "none" }}
                aria-hidden="true"
              >
                <path d="M17 3 L17 8" />
                <circle cx="17" cy="2.5" r="1.6" />
                <rect x="5" y="8" width="24" height="18" rx="2" />
                <circle cx="12" cy="15.5" r="2.2" />
                <circle cx="22" cy="15.5" r="2.2" />
                <path d="M12 21.5 L22 21.5" />
                <path d="M1.5 14 L1.5 20" />
                <path d="M32.5 14 L32.5 20" />
                <path d="M11 26 L11 30" />
                <path d="M23 26 L23 30" />
              </svg>
              <div className="allf__reasoning">
                In order to instrument this application, I should look up how to
                instrument a python Vercel AI SDK application with Langfuse
              </div>
            </div>

            <div className="allf__link allf__link--tall">
              <svg
                viewBox="0 0 840 192"
                width="840"
                height="192"
                style={{ position: "absolute", left: 0, top: 0 }}
                aria-hidden="true"
              >
                <defs>
                  <marker
                    id={arrowId}
                    viewBox="0 0 10 10"
                    refX="8.5"
                    refY="5"
                    markerWidth="7"
                    markerHeight="7"
                    orient="auto-start-reverse"
                  >
                    <path
                      d="M0,0.8 L9.5,5 L0,9.2 z"
                      fill="var(--text-secondary)"
                    />
                  </marker>
                </defs>
                <g fill="none" stroke="var(--text-secondary)" strokeWidth="1.6">
                  <path d="M 400 24 L 400 176" markerEnd={`url(#${arrowId})`} />
                  <path d="M 440 176 L 440 24" markerEnd={`url(#${arrowId})`} />
                </g>
              </svg>

              <div className="allf__answer">
                you&rsquo;re looking for
                <br />
                langfuse.com/integrations/frameworks/vercel-ai-sdk.md
              </div>

              <div className="allf__request">
                <span className="allf__dim">URL:</span> langfuse.com/llms.txt
                <br />
                <span className="allf__dim">Query:</span> &ldquo;langfuse
                instrumentation for Vercel AI SDK Python&rdquo;
              </div>
            </div>

            <div className="allf__webfetch">
              <div className="allf__brackets" />
              <div className="allf__webfetch-title">webfetch</div>
            </div>

            <div className="allf__link allf__link--short">
              <svg
                viewBox="0 0 840 120"
                width="840"
                height="120"
                style={{ position: "absolute", left: 0, top: 0 }}
                aria-hidden="true"
              >
                <g fill="none" stroke="var(--text-secondary)" strokeWidth="1.6">
                  <path d="M 400 8 L 400 112" markerEnd={`url(#${arrowId})`} />
                  <path d="M 440 112 L 440 8" markerEnd={`url(#${arrowId})`} />
                </g>
              </svg>

              <div className="allf__matched">
                matches page content against the query
              </div>
            </div>

            <div className="allf__panel">
              <div className="allf__brackets" />
              <div className="allf__panel-head">langfuse.com/llms.txt</div>
              <div className="allf__panel-body">
                <div className="allf__pink"># Langfuse</div>
                <div className="allf__faint">....</div>
                <div>
                  For the best results, install the [Langfuse skill](
                  <span className="allf__blue">
                    https://github.com/langfuse/skills/tree/main/skills/langfuse
                  </span>
                  ) before using these docs.
                </div>
                <div className="allf__faint">...</div>
                <div className="allf__pink" style={{ marginTop: 8 }}>
                  ## Integrations
                </div>
                <div>
                  - OpenAI python:{" "}
                  <span className="allf__blue">
                    /integrations/model-providers/openai-py.md
                  </span>
                  <br />
                  <span className="allf__highlight">
                    - Vercel AI SDK: /integrations/frameworks/vercel-ai-sdk.md
                  </span>
                  <br />
                  <span className="allf__faint">..</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .allf { margin: 32px 0; width: 100%; }

        .allf__wrap { position: relative; width: 100%; overflow: hidden; }

        .allf__canvas {
          width: ${INNER_W}px;
          background: var(--surface-bg);
          font-family: var(--font-sans);
          padding: 48px 40px;
          box-sizing: border-box;
        }

        .allf__stack {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* Corner brackets, as in the source diagram. */
        .allf__brackets {
          position: absolute;
          inset: -1px;
          border: 1px solid var(--text-primary);
          pointer-events: none;
          -webkit-mask:
            linear-gradient(#000, #000) 0 0 / 10px 10px no-repeat,
            linear-gradient(#000, #000) 100% 0 / 10px 10px no-repeat,
            linear-gradient(#000, #000) 0 100% / 10px 10px no-repeat,
            linear-gradient(#000, #000) 100% 100% / 10px 10px no-repeat;
          mask:
            linear-gradient(#000, #000) 0 0 / 10px 10px no-repeat,
            linear-gradient(#000, #000) 100% 0 / 10px 10px no-repeat,
            linear-gradient(#000, #000) 0 100% / 10px 10px no-repeat,
            linear-gradient(#000, #000) 100% 100% / 10px 10px no-repeat;
        }

        .allf__ask {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
        }

        .allf__reasoning {
          width: 480px;
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 15px;
          line-height: 150%;
          color: var(--text-primary);
          text-wrap: pretty;
        }

        .allf__link { position: relative; }
        .allf__link--tall { height: 192px; }
        .allf__link--short { height: 120px; }

        .allf__answer {
          position: absolute;
          left: 468px;
          top: 56px;
          width: 400px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 175%;
          color: var(--text-secondary);
          word-break: keep-all;
        }

        .allf__request {
          position: absolute;
          left: 0;
          top: 56px;
          width: 372px;
          text-align: right;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 175%;
          color: var(--text-secondary);
        }

        .allf__dim { color: var(--text-tertiary); }

        .allf__matched {
          position: absolute;
          left: 50%;
          top: 32px;
          transform: translateX(-50%);
          padding: 6px 14px;
          background: var(--surface-bg);
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 150%;
          color: var(--text-primary);
          white-space: nowrap;
        }

        .allf__webfetch {
          position: relative;
          width: 280px;
          margin: 0 auto;
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          padding: 26px 30px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        .allf__webfetch-title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 22px;
          color: var(--text-primary);
          flex: none;
        }

        .allf__panel {
          position: relative;
          border: 1px solid var(--line-structure);
          background: var(--surface-1);
        }

        .allf__panel-head {
          display: flex;
          align-items: center;
          height: 48px;
          padding: 0 30px;
          border-bottom: 1px solid var(--line-structure);
          background: var(--surface-2);
          font-family: var(--font-mono);
          font-size: 15px;
          color: var(--text-primary);
        }

        .allf__panel-body {
          padding: 26px 30px 28px;
          display: flex;
          flex-direction: column;
          gap: 18px;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.75;
          color: var(--text-secondary);
          word-break: break-word;
        }

        .allf__highlight {
          background: var(--highlight-yellow, #fbff7a);
          box-shadow: 0 0 0 2px var(--highlight-yellow, #fbff7a);
          mix-blend-mode: multiply;
          color: var(--text-primary);
        }

        .allf__pink { color: var(--text-code-pink); }
        .allf__orange { color: var(--text-code-orange); }
        .allf__blue { color: var(--text-code-blue); }
        .allf__faint { color: var(--text-disabled); }
      `}</style>
    </figure>
  );
}
