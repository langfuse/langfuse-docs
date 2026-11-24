import { useId } from "react";
import styles from "./diagram-fit.module.css";

const TRUNK_X = 280;
const SKILL_X = 430;
const SKILL_W = 140;
const SKILL_H = 36;
const AGENT_Y = 178;

const SKILLS = [
  { label: "skill A", y: 58, state: "ok" },
  { label: "skill B", y: 118, state: "broken" },
  { label: "skill C", y: 178, state: "ok" },
  { label: "skill D", y: 238, state: "ok" },
  { label: "new skill", y: 298, state: "new" },
] as const;

export function SkillCoexistenceDiagram() {
  const arrowId = useId();
  const arrowStrongId = useId();

  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox="0 0 680 330"
          role="img"
          aria-label="An agent routes to skills A, B, C, and D. When a new skill is added, it takes over the route that used to go to skill B, breaking that expected path. Skill-level triggering evals catch this regression."
          className="block h-auto w-full text-text-primary"
        >
          <defs>
            <marker
              id={arrowId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerUnits="userSpaceOnUse"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 1 L7 4 L0 7 Z" fill="var(--text-secondary)" />
            </marker>
            <marker
              id={arrowStrongId}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerUnits="userSpaceOnUse"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M0 1 L7 4 L0 7 Z" fill="var(--text-primary)" />
            </marker>
          </defs>

          {/* Agent node */}
          <rect
            x="24"
            y={AGENT_Y - 20}
            width="116"
            height="40"
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth="1"
            shapeRendering="crispEdges"
          />
          <text
            x="82"
            y={AGENT_Y}
            fontSize="14"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            agent
          </text>

          {/* Agent -> trunk */}
          <line
            x1="140"
            y1={AGENT_Y}
            x2={TRUNK_X}
            y2={AGENT_Y}
            stroke="var(--text-secondary)"
            strokeWidth="1"
            shapeRendering="crispEdges"
          />

          {/* Vertical trunk */}
          <line
            x1={TRUNK_X}
            y1={SKILLS[0].y}
            x2={TRUNK_X}
            y2={SKILLS[SKILLS.length - 1].y}
            stroke="var(--text-secondary)"
            strokeWidth="1"
            shapeRendering="crispEdges"
          />

          {SKILLS.map((skill) => {
            const isBroken = skill.state === "broken";
            const isNew = skill.state === "new";
            return (
              <g key={skill.label}>
                {/* Branch from trunk to skill */}
                <line
                  x1={TRUNK_X}
                  y1={skill.y}
                  x2={SKILL_X - 1}
                  y2={skill.y}
                  stroke={
                    isBroken
                      ? "var(--text-tertiary)"
                      : isNew
                        ? "var(--text-primary)"
                        : "var(--text-secondary)"
                  }
                  strokeWidth="1"
                  strokeDasharray={isBroken ? "4 4" : undefined}
                  shapeRendering="crispEdges"
                  markerEnd={
                    isBroken
                      ? undefined
                      : `url(#${isNew ? arrowStrongId : arrowId})`
                  }
                />
                {isBroken && (
                  <>
                    <rect
                      x="344"
                      y={skill.y - 9}
                      width="22"
                      height="18"
                      fill="var(--surface-bg)"
                    />
                    <text
                      x="355"
                      y={skill.y}
                      fontSize="16"
                      fontWeight="500"
                      fill="var(--text-primary)"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      ×
                    </text>
                  </>
                )}

                {/* Skill node */}
                <rect
                  x={SKILL_X}
                  y={skill.y - SKILL_H / 2}
                  width={SKILL_W}
                  height={SKILL_H}
                  fill={
                    isNew ? "var(--surface-cta-primary)" : "var(--surface-bg)"
                  }
                  stroke="var(--line-structure)"
                  strokeWidth="1"
                  shapeRendering="crispEdges"
                />
                <text
                  x={SKILL_X + SKILL_W / 2}
                  y={skill.y}
                  fontSize="13.5"
                  fontWeight="500"
                  fill={
                    isBroken ? "var(--text-tertiary)" : "var(--text-primary)"
                  }
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {skill.label}
                </text>

                {isBroken && (
                  <text
                    x={SKILL_X + SKILL_W + 12}
                    y={skill.y}
                    fontSize="12.5"
                    fill="var(--text-secondary)"
                    dominantBaseline="central"
                  >
                    route broken
                  </text>
                )}
                {isNew && (
                  <text
                    x={SKILL_X + SKILL_W + 12}
                    y={skill.y}
                    fontSize="12.5"
                    fill="var(--text-secondary)"
                    dominantBaseline="central"
                  >
                    takes over
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5 text-xs">
          <div className="font-medium text-text-primary">agent routes to</div>
          <ul className="mt-2 space-y-1.5">
            <li>
              <span className="font-mono text-text-primary">skill A</span>,{" "}
              <span className="font-mono text-text-primary">skill C</span>,{" "}
              <span className="font-mono text-text-primary">skill D</span>:
              routes unchanged.
            </li>
            <li>
              <span className="font-mono text-text-tertiary line-through">
                skill B
              </span>
              : route broken.
            </li>
            <li>
              <span className="bg-surface-cta-primary px-1 font-mono text-text-primary">
                new skill
              </span>
              : takes over the prompts that used to go to skill B.
            </li>
          </ul>
        </div>
      </div>
    </figure>
  );
}
