"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import data from "./skill-unique-cloners.json";

const Y_MAX = 3000;
const Y_TICKS = [3000, 2000, 1000, 0];

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function formatTick(value: number) {
  return value === 0 ? "0" : `${value / 1000}k`;
}

export function SkillUniqueClonersChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <figure className="not-prose my-8">
      <p className="text-sm font-medium text-text-secondary">{data.title}</p>

      <div className="mt-5 flex items-stretch gap-3">
        {/* Y-axis labels */}
        <div
          aria-hidden="true"
          className="flex h-44 flex-col justify-between text-right text-xs tabular-nums text-text-tertiary"
        >
          {Y_TICKS.map((tick) => (
            <span key={tick} className="leading-none">
              {formatTick(tick)}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="min-w-0 flex-1">
          <div className="relative h-44 border-b border-line-structure">
            {/* Horizontal dashed gridlines */}
            {Y_TICKS.slice(0, -1).map((tick) => {
              const bottom = `${(tick / Y_MAX) * 100}%`;
              return (
                <div
                  key={tick}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 border-t border-dashed border-line-divider-dash"
                  style={{ bottom }}
                />
              );
            })}

            {/* Bars */}
            <ol
              className="relative z-10 grid h-full grid-cols-[repeat(14,minmax(0,1fr))] items-end gap-1.5 sm:gap-2"
              onMouseLeave={() => setActiveIndex(null)}
            >
              {data.days.map((day, index) => {
                const height = `${(day.unique / Y_MAX) * 100}%`;
                const isActive = activeIndex === index;
                const isDimmed = activeIndex !== null && !isActive;

                return (
                  <li
                    key={day.date}
                    className="flex h-full items-end justify-center"
                  >
                    <button
                      type="button"
                      aria-label={`${day.label}: ${formatNumber(day.unique)} unique cloners`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onFocus={() => setActiveIndex(index)}
                      onBlur={() => setActiveIndex(null)}
                      className="group relative flex h-full w-full items-end justify-center focus:outline-none"
                    >
                      <span
                        className={cn(
                          "pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-surface-bg px-1 py-0.5 text-xs font-medium tabular-nums text-text-primary transition-opacity",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-focus-visible:opacity-100",
                        )}
                        style={{ bottom: `calc(${height} + 10px)` }}
                      >
                        {formatNumber(day.unique)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          "w-px bg-line-cta transition-opacity",
                          isDimmed ? "opacity-35" : "opacity-100",
                        )}
                        style={{ height }}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute left-1/2 h-[9px] w-[9px] -translate-x-1/2 translate-y-1/2 rounded-full border border-line-cta bg-surface-cta-primary transition-opacity",
                          isDimmed ? "opacity-35" : "opacity-100",
                        )}
                        style={{ bottom: height }}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* X-axis date labels */}
          <div
            aria-hidden="true"
            className="mt-2 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5 sm:gap-2"
          >
            {data.days.map((day, index) => (
              <span
                key={day.date}
                className={cn(
                  "text-center text-xs tabular-nums text-text-tertiary",
                  index % 2 === 1 && index !== data.days.length - 1
                    ? "hidden sm:block"
                    : "block",
                )}
              >
                {day.date}
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}
