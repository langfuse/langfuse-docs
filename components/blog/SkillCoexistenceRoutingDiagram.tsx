"use client";

import { useState } from "react";
import styles from "./diagram-fit.module.css";

interface RouteItem {
  id: number;
  skill: string;
  isNew?: boolean;
}

const COUNTS: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 1,
  E: 1,
  F: 2,
  G: 1,
  H: 1,
};

const NEW_SKILL = "I";
const LETTERS = [...Object.keys(COUNTS), NEW_SKILL];

const ROUTES: RouteItem[] = [];
Object.entries(COUNTS).forEach(([skill, count]) => {
  for (let i = 0; i < count; i++) {
    ROUTES.push({ id: ROUTES.length + 1, skill });
  }
});
ROUTES.push({ id: ROUTES.length + 1, skill: NEW_SKILL, isNew: true });

const STOLEN_ROUTE_ID = 5;

const W = 680;
const H = 336;
const AX = 8;
const AW = 104;
const SX = 540;

const rowY = (index: number) => 24 + index * 36;
const exitY = (index: number) => 120 + index * 8;

function routeTarget(route: RouteItem): string {
  return route.id === STOLEN_ROUTE_ID ? NEW_SKILL : route.skill;
}

export function SkillCoexistenceRoutingDiagram() {
  const [hoveredRoute, setHoveredRoute] = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const into: Record<string, number[]> = {};
  for (const route of ROUTES) {
    const target = routeTarget(route);
    (into[target] = into[target] ?? []).push(route.id);
  }

  const entryY = (route: RouteItem) => {
    const target = routeTarget(route);
    const list = into[target];
    return (
      rowY(LETTERS.indexOf(target)) +
      (list.indexOf(route.id) - (list.length - 1) / 2) * 5
    );
  };

  const mx = (AX + AW + SX) / 2;
  const curve = (y1: number, y2: number) =>
    `M${AX + AW},${y1} C${mx},${y1} ${mx},${y2} ${SX},${y2}`;

  const anyHover = hoveredRoute !== null || hoveredSkill !== null;
  const isRouteHot = (route: RouteItem) =>
    hoveredRoute === route.id || hoveredSkill === routeTarget(route);

  const ay = exitY(0) - 16;
  const ah = exitY(ROUTES.length - 1) - exitY(0) + 32;
  const stolenRoute = ROUTES[STOLEN_ROUTE_ID - 1];

  return (
    <figure className={`not-prose my-8 ${styles.figure}`}>
      {/* Desktop / tablet layout */}
      <div className={styles.desktop}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Skill routing coexistence diagram: an agent routes prompts across Skill A through Skill H. When Skill I (new) is added, a route that previously went to Skill C is pulled away to Skill I, shown as a dashed red broken route to Skill C and a solid red hijacked route to Skill I."
          className="block h-auto w-full text-text-primary"
        >
          {/* Agent node */}
          <rect
            x={AX}
            y={ay}
            width={AW}
            height={ah}
            fill="var(--surface-bg)"
            stroke="var(--line-structure)"
            strokeWidth={1}
            shapeRendering="crispEdges"
          />
          <text
            x={AX + AW / 2}
            y={ay + ah / 2}
            fontSize="14"
            fontWeight="500"
            fill="var(--text-primary)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            Agent
          </text>

          {/* Ghost dashed path: broken original route to Skill C */}
          <path
            d={curve(exitY(STOLEN_ROUTE_ID - 1), rowY(LETTERS.indexOf("C")))}
            fill="none"
            stroke="var(--callout-error)"
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={
              anyHover && !isRouteHot(stolenRoute) && hoveredSkill !== "C"
                ? 0.2
                : 0.85
            }
            style={{ transition: "opacity 150ms ease-out" }}
          />

          {/* Active routes */}
          {ROUTES.map((route) => {
            const d = curve(exitY(route.id - 1), entryY(route));
            const stolen = route.id === STOLEN_ROUTE_ID;
            const hot = isRouteHot(route);
            const stroke = stolen
              ? "var(--callout-error)"
              : route.isNew
                ? "var(--callout-info)"
                : hot
                  ? "var(--text-primary)"
                  : "var(--text-disabled)";
            const strokeWidth = stolen || route.isNew || hot ? 1.25 : 1;
            const opacity = anyHover && !hot ? 0.2 : 1;

            return (
              <g key={route.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  opacity={opacity}
                  style={{
                    transition: "opacity 150ms ease-out, stroke 150ms ease-out",
                  }}
                />
                <circle
                  cx={AX + AW}
                  cy={exitY(route.id - 1)}
                  r={1.5}
                  fill={stroke}
                  opacity={opacity}
                  style={{ transition: "opacity 150ms ease-out" }}
                />
                <path
                  d={d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={10}
                  style={{ cursor: "pointer", pointerEvents: "stroke" }}
                  onMouseEnter={() => {
                    setHoveredRoute(route.id);
                    setHoveredSkill(null);
                  }}
                  onMouseLeave={() => setHoveredRoute(null)}
                />
              </g>
            );
          })}

          {/* Skill labels (no boxes) */}
          {LETTERS.map((skill, index) => {
            const y = rowY(index);
            const hot =
              hoveredSkill === skill ||
              (hoveredRoute !== null &&
                routeTarget(ROUTES[hoveredRoute - 1]) === skill);
            const isNewSkill = skill === NEW_SKILL;

            return (
              <g
                key={skill}
                style={{ cursor: "default" }}
                onMouseEnter={() => {
                  setHoveredSkill(skill);
                  setHoveredRoute(null);
                }}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <rect
                  x={SX}
                  y={y - 15}
                  width={W - SX}
                  height={30}
                  fill="transparent"
                />
                <text
                  x={SX + 12}
                  y={y}
                  fontSize="13.5"
                  fontWeight={hot ? 500 : 400}
                  fill={hot ? "var(--text-primary)" : "var(--text-secondary)"}
                  dominantBaseline="central"
                  style={{ transition: "fill 150ms ease-out" }}
                >
                  Skill {skill}
                  {isNewSkill ? " (new)" : ""}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile stacked layout */}
      <div className={`${styles.mobile} space-y-3 text-sm text-text-secondary`}>
        <div className="border border-line-structure bg-surface-bg p-3.5 text-xs">
          <div className="font-medium text-text-primary">
            Agent routing across Skill A through Skill I
          </div>
          <ul className="mt-2 space-y-1.5">
            <li>
              <span className="font-medium text-text-primary">
                Skill A through Skill H:
              </span>{" "}
              existing skills with established routing paths from the agent.
            </li>
            <li>
              <span className="font-medium text-text-primary">
                Skill I (new):
              </span>{" "}
              added alongside the existing library with its own intended route.
            </li>
            <li>
              <span className="font-medium text-[var(--callout-error)]">
                Skill C → Skill I:
              </span>{" "}
              a prompt that previously routed to Skill C is silently pulled away
              to Skill I.
            </li>
          </ul>
        </div>
      </div>
    </figure>
  );
}
