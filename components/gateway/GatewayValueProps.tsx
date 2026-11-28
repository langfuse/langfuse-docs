"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  FileText,
  History,
  Info,
  Maximize2,
  Minus,
  Plus,
  Send,
} from "lucide-react";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import {
  budgetChart,
  budgetRows,
  gatewayKeys,
  halo,
  keyStats,
  spendBarLabels,
  spendBars,
  spendStats,
  topModels,
  valueProps,
  type ValueProp,
} from "./content";

const ROTATE_MS = 10000;

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function ScreenHeader({
  title,
  prefix,
  children,
}: {
  title: string;
  prefix?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.appHeader}>
      <div className={styles.appTitle}>
        {prefix && <span className={styles.appTitlePrefix}>{prefix} </span>}
        {title}
      </div>
      {children}
    </div>
  );
}

function Select({ value }: { value: string }) {
  return (
    <span className={styles.appSelect}>
      {value}
      <ChevronsUpDown aria-hidden />
    </span>
  );
}

function Chip({
  children,
  revoked,
}: {
  children: ReactNode;
  revoked?: boolean;
}) {
  return (
    <span className={cn(styles.appChip, revoked && styles.appChipRevoked)}>
      {children}
    </span>
  );
}

function Stats({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <div className={styles.appStats}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.appStat}>
          <span className={styles.appStatLabel}>{stat.label}</span>
          <span className={styles.appStatValue}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.appSection}>
      <div className={styles.appSectionHead}>
        <span className={styles.appSectionTitle}>{title}</span>
        <span className={styles.appSectionNote}>{note}</span>
      </div>
      {children}
    </div>
  );
}

// `value` is the bar length, from 0 to 1.
function BarRow({
  name,
  value,
  label,
  strong,
}: {
  name: string;
  value: number;
  label: string;
  strong?: boolean;
}) {
  return (
    <>
      <span>{name}</span>
      <span className={styles.appBarTrack}>
        <span
          className={cn(styles.appBar, strong && styles.appBarStrong)}
          style={{ width: `calc((100% - var(--bar-reserve)) * ${value})` }}
        />
        <span className={styles.appBarValue}>{label}</span>
      </span>
    </>
  );
}

// `at` runs from 0 at the left edge of the plot to 1 at the right edge.
type AxisLabel = { text: string; at: number };

// The first and last labels stay inside the plot instead of centering.
function axisLabelStyle(index: number, labels: AxisLabel[]): CSSProperties {
  if (index === 0) return { left: 0 };
  if (index === labels.length - 1) return { right: 0 };
  return { left: `${labels[index].at * 100}%`, transform: "translateX(-50%)" };
}

function Chart({
  height,
  yTicks,
  xLabels,
  marks,
  children,
}: {
  height: number;
  /** One per gridline, top to bottom. */
  yTicks: string[];
  xLabels: AxisLabel[];
  /** SVG marks in a 100 by 100 box that stretches to fill the plot. */
  marks: ReactNode;
  /** HTML drawn over the plot. */
  children?: ReactNode;
}) {
  return (
    <div className={styles.appChart}>
      <div className={styles.appChartY}>
        {yTicks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className={styles.appChartPlot} style={{ height }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
          {yTicks.map((tick, i) => {
            const y = (i / (yTicks.length - 1)) * 100;
            return (
              <line
                key={tick}
                className={styles.appGridLine}
                x1={0}
                x2={100}
                y1={y}
                y2={y}
              />
            );
          })}
          {marks}
        </svg>
        {children}
      </div>
      <div className={styles.appChartX}>
        {xLabels.map((label, i) => (
          <span key={label.text} style={axisLabelStyle(i, xLabels)}>
            {label.text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Percent from the top of the plot for a value on a 0 to `max` axis.
const yPercent = (value: number, max: number) => (1 - value / max) * 100;

const toPoints = (values: number[], max: number) =>
  values.map((value, i) => ({
    x: (i / (values.length - 1)) * 100,
    y: yPercent(value, max),
  }));

const toPolyline = (points: { x: number; y: number }[]) =>
  points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

const SPEND_MAX = 100;
const spendSlot = 100 / spendBars.length;
const topModelMax = Math.max(...topModels.map((model) => model.cost));

function SpendPanel() {
  return (
    <>
      <ScreenHeader title="Gateway analytics">
        <Select value="User" />
      </ScreenHeader>
      <div className={styles.appBody}>
        <Stats stats={spendStats} />
        <Section title="Cost over time" note="Last 30 days">
          <Chart
            height={136}
            yTicks={["$100", "$75", "$50", "$25", "$0"]}
            xLabels={spendBarLabels.map((label) => ({
              text: label.text,
              at: ((label.index + 0.5) * spendSlot) / 100,
            }))}
            marks={spendBars.map((cost, i) => (
              <rect
                key={i}
                className={styles.appBarMark}
                x={(i + 0.15) * spendSlot}
                y={yPercent(cost, SPEND_MAX)}
                width={spendSlot * 0.7}
                height={(cost / SPEND_MAX) * 100}
              />
            ))}
          />
        </Section>
        <Section title="Cost by model" note="Top models">
          <div className={cn(styles.appBars, styles.appFade)}>
            {topModels.map((model) => (
              <BarRow
                key={model.name}
                name={model.name}
                value={model.cost / topModelMax}
                label={usd.format(model.cost)}
              />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

const BUDGET_MAX = 3000;
const budgetDailyTotal = budgetChart.daily.reduce((sum, day) => sum + day, 0);
// Running total per day, scaled so the last day lands on the amount spent.
const budgetSpend = budgetChart.daily.reduce<number[]>((totals, day) => {
  const before = totals.length ? totals[totals.length - 1] : 0;
  totals.push(before + (day * budgetChart.spent) / budgetDailyTotal);
  return totals;
}, []);
const budgetPoints = toPoints(budgetSpend, BUDGET_MAX);
const budgetY = yPercent(budgetChart.budget, BUDGET_MAX);
const warnAmount = budgetChart.budget * budgetChart.warnAt;
const warnY = yPercent(warnAmount, BUDGET_MAX);
// First day the running total reaches the warning threshold.
const warnDay = budgetSpend.findIndex((total) => total >= warnAmount);
// Where the line crosses the threshold, between that day and the one before.
const warnX =
  budgetPoints[warnDay - 1].x +
  ((warnAmount - budgetSpend[warnDay - 1]) /
    (budgetSpend[warnDay] - budgetSpend[warnDay - 1])) *
    (budgetPoints[warnDay].x - budgetPoints[warnDay - 1].x);

function BudgetsPanel() {
  return (
    <>
      <ScreenHeader title="Budgets">
        <Select value="This month" />
      </ScreenHeader>
      <div className={styles.appBody}>
        <Section title="Spend vs budget" note={`team: ${budgetChart.team}`}>
          <Chart
            height={258}
            yTicks={["$3,000", "$2,250", "$1,500", "$750", "$0"]}
            xLabels={[
              { text: "Nov 1", at: 0 },
              { text: "Nov 14", at: 0.5 },
              { text: `Nov ${budgetSpend.length}`, at: 1 },
            ]}
            marks={
              <>
                <line
                  className={styles.appLimitLine}
                  x1={0}
                  x2={100}
                  y1={budgetY}
                  y2={budgetY}
                />
                <line
                  className={styles.appWarnLine}
                  x1={0}
                  x2={100}
                  y1={warnY}
                  y2={warnY}
                />
                <polyline
                  className={styles.appLine}
                  points={toPolyline(budgetPoints)}
                />
              </>
            }
          >
            <span
              className={styles.appChartNote}
              style={{ right: 0, bottom: `calc(${100 - budgetY}% + 4px)` }}
            >
              Budget
            </span>
            <span
              className={styles.appChartNote}
              style={{ right: 0, top: `calc(${warnY}% + 5px)` }}
            >
              {Math.round(budgetChart.warnAt * 100)}%
            </span>
            <span
              className={cn(styles.appDot, styles.appDotFilled)}
              style={{ left: `${warnX}%`, top: `${warnY}%` }}
            />
            <span
              className={styles.appChartNote}
              style={{
                right: `calc(${100 - warnX}% + 10px)`,
                bottom: `calc(${100 - warnY}% + 6px)`,
              }}
            >
              Nov {warnDay + 1}: warning sent
            </span>
          </Chart>
        </Section>
        <Section title="Budget by team" note="Spent / budget">
          <div
            className={cn(styles.appBars, styles.appBarsWide, styles.appFade)}
          >
            {budgetRows.map((row) => (
              <BarRow
                key={row.team}
                name={row.team}
                value={row.spent / row.budget}
                label={`${usdWhole.format(row.spent)} / ${usdWhole.format(row.budget)}`}
                strong={row.highlight}
              />
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

function ModelsPanel() {
  return (
    <>
      <ScreenHeader title="Gateway keys">
        <span className={styles.appButton}>
          <Plus aria-hidden />
          Create key
        </span>
      </ScreenHeader>
      <div className={styles.appBody}>
        <Stats stats={keyStats} />
        <Section title="Keys" note="Allowed models per key">
          <div
            className={cn(styles.appTable, styles.appTableKeys, styles.appFade)}
          >
            <div className={cn(styles.appRow, styles.appRowHead)}>
              <span>Name</span>
              <span>Allowed models</span>
              <span>Status</span>
            </div>
            {gatewayKeys.map((key) => (
              <div key={key.name} className={styles.appRow}>
                <span>{key.name}</span>
                <span>
                  <Chip>{key.models}</Chip>
                </span>
                <span>
                  <Chip revoked={key.revoked}>
                    {key.revoked ? "Revoked" : "Active"}
                  </Chip>
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

const haloMax = Math.max(...halo.workflows.map((w) => w.sessions));
const count = new Intl.NumberFormat("en-US");

function HaloPanel() {
  return (
    <>
      <ScreenHeader title="Halo">
        <span className={styles.haloTools}>
          <Plus aria-hidden />
          <History aria-hidden />
          <Maximize2 aria-hidden />
          <Minus aria-hidden />
        </span>
      </ScreenHeader>
      <div className={styles.haloBody}>
        <div className={styles.haloThread}>
          <p className={styles.haloQuestion}>{halo.question}</p>
          <ul className={styles.haloSteps}>
            {halo.steps.map((step) => (
              <li key={step}>
                <Check aria-hidden />
                {step}
              </li>
            ))}
          </ul>
          <p>{halo.intro}</p>
          <div className={styles.haloList}>
            {halo.workflows.map((workflow) => (
              <div key={workflow.name} className={styles.haloRow}>
                <span className={styles.haloName}>{workflow.name}</span>
                <span className={styles.haloTrack}>
                  <span
                    className={cn(
                      styles.haloFill,
                      workflow.highlight && styles.haloFillStrong,
                    )}
                    style={{ width: `${(workflow.sessions / haloMax) * 100}%` }}
                  />
                </span>
                <span className={styles.haloCount}>
                  {count.format(workflow.sessions)}
                </span>
              </div>
            ))}
          </div>
          <p>{halo.answer}</p>
          <div className={styles.haloAction}>
            <span className={styles.haloActionIcon}>
              <FileText aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className={styles.haloActionTitle}>
                {halo.action.title}
              </span>
              <span className={styles.haloActionDetail}>
                {halo.action.detail}
              </span>
            </span>
            <ArrowRight aria-hidden className={styles.haloActionArrow} />
          </div>
        </div>
        <div className={styles.haloComposer}>
          <span className={styles.haloPlaceholder}>Ask a follow-up</span>
          <span className={styles.haloComposerBar}>
            <span className={styles.haloContext}>
              <Info aria-hidden />
              Current trace view in context
            </span>
            <span className={styles.haloSend}>
              <Send aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

const panels: Record<ValueProp["panel"], () => React.ReactElement> = {
  spend: SpendPanel,
  budgets: BudgetsPanel,
  models: ModelsPanel,
  halo: HaloPanel,
};

export function GatewayValueProps() {
  const [active, setActive] = useState(0);
  // Clicking the open prop folds it; rotation pauses until another is picked.
  const [open, setOpen] = useState(true);
  // Bumped on every change so the progress bar animation restarts.
  const [tick, setTick] = useState(0);
  // Rotation waits while keyboard focus is inside the list, so a focused link stays.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!open || paused) return;
    const timer = setTimeout(() => {
      setActive((a) => (a + 1) % valueProps.length);
      setTick((t) => t + 1);
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [tick, open, paused]);

  const select = useCallback(
    (index: number) => {
      if (index === active && open) {
        setOpen(false);
        return;
      }
      setActive(index);
      setOpen(true);
      setTick((t) => t + 1);
    },
    [active, open],
  );

  return (
    <div className="grid items-start gap-10 @3xl:grid-cols-5">
      <div
        className="flex flex-col border-t border-line-structure @3xl:col-span-2"
        role="tablist"
        aria-orientation="vertical"
        onFocus={(event) => {
          if (event.target.matches(":focus-visible")) setPaused(true);
        }}
        onBlur={(event) => {
          if (!paused || event.currentTarget.contains(event.relatedTarget)) {
            return;
          }
          setPaused(false);
          setTick((t) => t + 1);
        }}
      >
        {valueProps.map((prop, i) => {
          const isActive = i === active;
          const isOpen = isActive && open;
          return (
            <div
              key={prop.title}
              className="relative border-b border-line-structure"
            >
              <button
                type="button"
                role="tab"
                id={`gateway-value-tab-${i}`}
                aria-selected={isActive}
                aria-expanded={isOpen}
                aria-controls="gateway-value-panel"
                onClick={() => select(i)}
                className={cn(
                  "block w-full cursor-pointer py-5 pr-4 text-left font-analog text-[22px] leading-[1.2] transition-colors",
                  isOpen
                    ? "pb-2 text-text-primary"
                    : "text-text-tertiary hover:text-text-secondary",
                )}
              >
                {prop.title}
              </button>
              {isOpen && (
                // Every prop's details share one grid cell, so the open row is as
                // tall as the longest one and the page doesn't jump on rotation.
                <div className="grid max-w-[440px] pb-5">
                  {valueProps.map((detail, j) => (
                    <div
                      key={detail.title}
                      aria-hidden={j !== i || undefined}
                      className={cn(
                        "col-start-1 row-start-1 flex flex-col",
                        j !== i && "invisible",
                      )}
                    >
                      <p className="text-[15px] leading-[1.5] text-text-secondary">
                        {detail.body.map((part) =>
                          typeof part === "string" ? (
                            part
                          ) : (
                            <Link
                              key={part.href}
                              href={part.href}
                              className="text-text-primary underline decoration-line-structure underline-offset-4 hover:decoration-text-primary"
                            >
                              {part.text}
                            </Link>
                          ),
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {isOpen && (
                <span
                  key={tick}
                  aria-hidden
                  className={cn(
                    "absolute bottom-[-1px] left-0 h-0.5 bg-text-primary",
                    styles.progress,
                  )}
                  style={{
                    animationDuration: `${ROTATE_MS}ms`,
                    animationPlayState: paused ? "paused" : "running",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      <CornerBox
        id="gateway-value-panel"
        role="tabpanel"
        aria-labelledby={`gateway-value-tab-${active}`}
        className="@container/panel min-w-0 rounded-[2px] @3xl:col-span-3 shadow-[-8px_18px_12px_rgba(0,0,0,0.02),-4px_8px_9px_rgba(0,0,0,0.03),-1px_2px_5px_rgba(0,0,0,0.04)]"
      >
        <div className={styles.screen}>
          {/* Panels share one grid cell, so the window keeps its size. */}
          <div className={styles.appWindow}>
            {valueProps.map((prop, i) => {
              const Panel = panels[prop.panel];
              return (
                <div
                  key={prop.panel}
                  className={cn(
                    "min-w-0 [grid-area:1/1]",
                    i === active ? "visible" : "invisible",
                  )}
                  aria-hidden={i !== active}
                >
                  <Panel />
                </div>
              );
            })}
          </div>
        </div>
      </CornerBox>
    </div>
  );
}
