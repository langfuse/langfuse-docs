"use client";

import { useCallback, useEffect, useState } from "react";
import { CornerBox } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import {
  budgetRows,
  connections,
  sessionSpans,
  spanDetails,
  spendBars,
  spendStats,
  topModels,
  valueProps,
  type ValueProp,
} from "./content";

const ROTATE_MS = 5000;

const panelLabel = "font-mono text-[10px] text-text-tertiary";
const panelBox = "rounded-[2px] border border-line-structure";
const panelRow = "font-mono text-[12px] text-text-primary";

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex h-3.5 w-[26px] shrink-0 items-center rounded-full p-0.5",
        on ? "justify-end bg-text-primary" : "justify-start bg-line-structure",
      )}
    >
      <span className="size-2.5 rounded-full bg-surface-bg" />
    </span>
  );
}

function SpendPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div className={cn(panelBox, "grid grid-cols-3")}>
        {spendStats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              "min-w-0 p-3.5",
              i < spendStats.length - 1 &&
                "border-r border-dashed border-line-divider-dash",
            )}
          >
            <div className={panelLabel}>{stat.label}</div>
            <div className="mt-1.5 truncate font-mono text-[15px] text-text-primary @md/panel:text-[24px]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      <div className={cn(panelBox, "p-3.5")}>
        <div className={cn(panelLabel, "mb-3")}>
          Cost over time, last 30 days
        </div>
        <div className="flex h-[110px] items-end gap-[3px]">
          {spendBars.map((bar, i) => (
            <div key={i} className="flex h-full flex-1 flex-col justify-end">
              <div
                className="bg-text-links/35"
                style={{ height: `${bar.a}%` }}
              />
              <div
                className="bg-text-primary"
                style={{ height: `${bar.b}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className={cn(panelBox, "flex flex-col gap-2.5 p-3.5")}>
        <div className={panelLabel}>Top models by cost</div>
        {topModels.map((model) => (
          <div
            key={model.name}
            className={cn(
              panelRow,
              "grid grid-cols-[minmax(0,150px)_minmax(0,1fr)_64px] items-center gap-3",
            )}
          >
            <span className="truncate">{model.name}</span>
            <div className="h-1.5 bg-surface-2">
              <div
                className="h-full bg-text-primary"
                style={{ width: `${model.pct}%` }}
              />
            </div>
            <span className="text-right">{model.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetsPanel() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="font-analog text-[22px] text-text-primary">Budgets</div>
      <div className={panelBox}>
        {budgetRows.map((row, i) => (
          <div
            key={row.team}
            className={cn(
              "flex flex-col gap-2 p-3.5",
              i > 0 && "border-t border-dashed border-line-divider-dash",
            )}
          >
            <div className={cn(panelRow, "flex justify-between gap-3")}>
              <span className="min-w-0 truncate">
                team: {row.team}{" "}
                <span className="text-text-tertiary">cc {row.cc}</span>
              </span>
              <span className="shrink-0 whitespace-nowrap">{row.label}</span>
            </div>
            <div className="h-1.5 bg-surface-2">
              <div
                className={cn(
                  "h-full",
                  row.pct > 90 ? "bg-text-code-orange" : "bg-text-primary",
                )}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-[1.5] text-text-tertiary">
        Requests stop once a budget is reached. Email warnings go out before
        that.
      </p>
    </div>
  );
}

function ModelsPanel() {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="font-analog text-[22px] text-text-primary">
        Connections &amp; Models
      </div>
      {connections.map((connection) => (
        <div key={connection.name} className={panelBox}>
          <div
            className={cn(
              panelRow,
              "flex justify-between gap-3 bg-surface-1 px-3.5 py-2.5",
            )}
          >
            <span>{connection.name}</span>
            <span className="text-text-tertiary">{connection.provider}</span>
          </div>
          {connection.models.map((model) => (
            <div
              key={model.name}
              className={cn(
                panelRow,
                "flex items-center justify-between gap-3 border-t border-dashed border-line-divider-dash px-3.5 py-2.5",
                !model.on && "text-text-tertiary",
              )}
            >
              <span>{model.name}</span>
              <span className="flex items-center gap-2.5">
                <span className="text-[10px] text-text-tertiary">
                  {model.on ? "approved" : "off"}
                </span>
                <Toggle on={model.on} />
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2 text-[13px] text-text-tertiary">
        <span>Restrict models per key:</span>
        <code className="rounded-[2px] border border-line-structure bg-surface-1 px-1.5 py-0.5 font-mono text-[12px] text-text-primary">
          openai-prod:*
        </code>
      </div>
    </div>
  );
}

function TracePanel() {
  return (
    <div className="flex flex-col gap-3">
      <div className={cn(panelBox, "flex flex-col gap-0.5 p-3")}>
        <div className={cn(panelLabel, "mb-2")}>Session: Claude Code</div>
        {sessionSpans.map((span, i) => (
          <div
            key={i}
            className={cn(
              panelRow,
              "flex items-center gap-2 rounded-[2px] px-2 py-1.5",
              span.child && "ml-3.5",
              span.selected && "bg-surface-1",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-2 shrink-0",
                span.child ? "bg-text-links/40" : "bg-text-primary",
              )}
            />
            <span className="min-w-0 flex-1 truncate">{span.name}</span>
            <span className="shrink-0 text-text-tertiary">{span.cost}</span>
          </div>
        ))}
      </div>
      <div className={cn(panelBox, "grid grid-cols-4 overflow-hidden")}>
        {spanDetails.map((detail) => (
          <div
            key={detail.k}
            className="-mb-px -mr-px flex min-w-0 flex-col gap-1 border-b border-r border-dashed border-line-divider-dash px-3 py-2.5"
          >
            <span className={panelLabel}>{detail.k}</span>
            <span className={cn(panelRow, "truncate")}>{detail.v}</span>
          </div>
        ))}
      </div>
    </div>
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
        <div className="flex h-9 items-center gap-2 border-b border-line-structure bg-surface-1 px-3.5 font-mono text-[11px] text-text-tertiary">
          <span aria-hidden className="size-2 rounded-full bg-line-structure" />
          <span aria-hidden className="size-2 rounded-full bg-line-structure" />
          <span
            aria-hidden
            className="mr-2 size-2 rounded-full bg-line-structure"
          />
          <span className="truncate">{valueProps[active].crumb}</span>
        </div>
        {/* All panels share one grid cell, so the box keeps the height of the
            tallest panel and does not jump when the active item changes. */}
        <div className="grid min-h-[400px] p-4 sm:p-5">
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
      </CornerBox>
    </div>
  );
}
