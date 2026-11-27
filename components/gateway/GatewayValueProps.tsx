"use client";

import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import {
  budgetChart,
  budgetRows,
  gatewayKeys,
  keyStats,
  session,
  spendBarLabels,
  spendBars,
  spendStats,
  topModels,
  valueProps,
  type ValueProp,
} from "./content";

const ROTATE_MS = 5000;

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

const CALL_MAX = 0.8;
const callPoints = toPoints(session.calls, CALL_MAX);

function TracePanel() {
  return (
    <>
      <ScreenHeader prefix="Session" title={session.name}>
        <Chip>{session.user}</Chip>
      </ScreenHeader>
      <div className={styles.appBody}>
        <Section title="Cost per call" note={`Total ${session.total}`}>
          <Chart
            height={150}
            yTicks={["$0.80", "$0.60", "$0.40", "$0.20", "$0.00"]}
            xLabels={[0, 3, 6, 9].map((call) => ({
              text: `#${call + 1}`,
              at: call / (session.calls.length - 1),
            }))}
            marks={
              <polyline
                className={styles.appLine}
                points={toPolyline(callPoints)}
              />
            }
          >
            {callPoints.map((point, i) => (
              <span
                key={i}
                className={styles.appDot}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
              />
            ))}
          </Chart>
        </Section>
        <div className={styles.appSection}>
          <div className={cn(styles.appTable, styles.appFade)}>
            <div className={cn(styles.appRow, styles.appRowHead)}>
              <span>Name</span>
              <span>Model</span>
              <span className={styles.appCellEnd}>Cost</span>
            </div>
            {session.rows.map((row) => (
              <div key={row.name} className={styles.appRow}>
                <span>{row.name}</span>
                <span>
                  <Chip>{row.model}</Chip>
                </span>
                <span className={styles.appCellEnd}>{row.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const panels: Record<ValueProp["panel"], () => React.ReactElement> = {
  spend: SpendPanel,
  budgets: BudgetsPanel,
  models: ModelsPanel,
  trace: TracePanel,
};

export function GatewayValueProps() {
  const [active, setActive] = useState(0);
  // Bumped on every change so the progress bar animation restarts.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setActive((a) => (a + 1) % valueProps.length);
      setTick((t) => t + 1);
    }, ROTATE_MS);
    return () => clearTimeout(timer);
  }, [tick]);

  const select = useCallback((index: number) => {
    setActive(index);
    setTick((t) => t + 1);
  }, []);

  return (
    <div className="grid items-start gap-10 @3xl:grid-cols-2">
      <div
        className="flex flex-col border-t border-line-structure"
        role="tablist"
        aria-orientation="vertical"
      >
        {valueProps.map((prop, i) => {
          const isActive = i === active;
          return (
            <button
              key={prop.title}
              type="button"
              role="tab"
              id={`gateway-value-tab-${i}`}
              aria-selected={isActive}
              aria-controls="gateway-value-panel"
              onClick={() => select(i)}
              className="relative flex cursor-pointer flex-col gap-2 border-b border-line-structure py-5 pr-4 text-left"
            >
              <span className="flex items-baseline gap-3.5">
                <span className="font-mono text-[11px] text-text-tertiary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-analog text-[22px] leading-[1.2] transition-colors",
                    isActive ? "text-text-primary" : "text-text-tertiary",
                  )}
                >
                  {prop.title}
                </span>
              </span>
              {isActive && (
                <span className="ml-[30px] flex max-w-[440px] flex-col">
                  <span className="text-[15px] leading-[1.5] text-text-secondary">
                    {prop.body}
                  </span>
                  <span className="mt-1.5 flex flex-col @3xl:min-h-[200px]">
                    {prop.features.map((feature) => (
                      <span
                        key={feature.label}
                        className="border-t border-dashed border-line-divider-dash py-3 text-[14px] leading-[1.5] text-text-secondary"
                      >
                        <strong className="font-semibold text-text-primary">
                          {feature.label}
                        </strong>{" "}
                        {feature.text}
                      </span>
                    ))}
                  </span>
                </span>
              )}
              {isActive && (
                <span
                  key={tick}
                  aria-hidden
                  className={cn(
                    "absolute bottom-[-1px] left-0 h-0.5 bg-text-primary",
                    styles.progress,
                  )}
                  style={{ animationDuration: `${ROTATE_MS}ms` }}
                />
              )}
            </button>
          );
        })}
      </div>

      <CornerBox
        id="gateway-value-panel"
        role="tabpanel"
        aria-labelledby={`gateway-value-tab-${active}`}
        className="@container/panel min-w-0 rounded-[2px] shadow-[-8px_18px_12px_rgba(0,0,0,0.02),-4px_8px_9px_rgba(0,0,0,0.03),-1px_2px_5px_rgba(0,0,0,0.04)]"
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
