"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { Text } from "@/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LumaEvent, LumaEventFormat } from "@/lib/luma-events";

type TimingFilter = "upcoming" | "past";
type FormatFilter = "all" | LumaEventFormat;

function formatEventDate(
  iso: string,
  timezone: string | null,
): {
  month: string;
  day: string;
  weekday: string;
  time: string;
} {
  const date = new Date(iso);
  const options: Intl.DateTimeFormatOptions = timezone
    ? { timeZone: timezone }
    : {};

  const month = new Intl.DateTimeFormat("en-US", {
    ...options,
    month: "short",
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    ...options,
    day: "numeric",
  }).format(date);
  const weekday = new Intl.DateTimeFormat("en-US", {
    ...options,
    weekday: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    ...options,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);

  return { month, day, weekday, time };
}

function EventCard({ event }: { event: LumaEvent }) {
  const { month, day, weekday, time } = formatEventDate(
    event.startAt,
    event.timezone,
  );
  const showLocation =
    event.locationLabel.toLowerCase() !==
    (event.format === "virtual" ? "virtual" : "in person");

  return (
    <a
      href={event.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex min-w-0 flex-col overflow-hidden border border-line-structure bg-surface-bg transition-colors hover:bg-surface-1"
    >
      <div className="relative aspect-square w-full overflow-hidden border-b border-line-structure bg-surface-1">
        {event.coverUrl ? (
          <Image
            src={event.coverUrl}
            alt=""
            fill
            className="object-contain"
            sizes="(max-width: 640px) 100vw, 384px"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,var(--surface-2),transparent_60%)]" />
        )}
      </div>

      <div className="flex min-h-[154px] flex-1 flex-col p-4">
        <div className="mb-3 flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-text-tertiary">
          <span>{event.format === "virtual" ? "Virtual" : "In person"}</span>
          {showLocation ? (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">{event.locationLabel}</span>
            </>
          ) : null}
        </div>
        <h3 className="text-left font-analog text-[19px] font-medium leading-[1.2] text-text-primary">
          {event.title}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div className="flex min-w-0 items-end gap-2.5">
            <div className="flex min-w-12 shrink-0 flex-col items-center border border-line-structure bg-surface-1 px-2 py-1.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                {month}
              </span>
              <span className="font-analog text-[24px] leading-none text-text-primary">
                {day}
              </span>
            </div>
            <span className="pb-1 text-[12px] text-text-tertiary">
              {weekday} · {time}
            </span>
          </div>
          <span className="shrink-0 text-[12px] font-[450] text-text-secondary underline-offset-2 group-hover:text-text-primary group-hover:underline">
            View event →
          </span>
        </div>
      </div>
    </a>
  );
}

function EmptyState({ timing }: { timing: TimingFilter }) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
      <Calendar className="size-5 text-text-disabled" aria-hidden />
      <Text size="s" className="text-[13px] text-text-tertiary">
        {timing === "upcoming"
          ? "No upcoming events match these filters."
          : "No past events match these filters."}
      </Text>
    </div>
  );
}

export function EventsCalendar({
  upcoming,
  past,
}: {
  upcoming: LumaEvent[];
  past: LumaEvent[];
}) {
  const [timing, setTiming] = useState<TimingFilter>("upcoming");
  const [format, setFormat] = useState<FormatFilter>("all");

  const filtered = useMemo(() => {
    const source = timing === "upcoming" ? upcoming : past;
    if (format === "all") return source;
    return source.filter((event) => event.format === format);
  }, [timing, format, upcoming, past]);

  const formatFilters: { id: FormatFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "in-person", label: "In person" },
    { id: "virtual", label: "Virtual" },
  ];

  return (
    <section className="w-full">
      <Tabs
        value={timing}
        onValueChange={(value) => setTiming(value as TimingFilter)}
        className="gap-0"
      >
        <div className="flex flex-col gap-3 border border-line-structure bg-surface-bg sm:flex-row sm:items-center sm:justify-between sm:gap-4 px-3 py-2.5">
          <TabsList>
            <TabsTrigger value="upcoming">
              Upcoming
              <span className="font-mono text-[10px] text-text-tertiary">
                {upcoming.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="past">
              Past
              <span className="font-mono text-[10px] text-text-tertiary">
                {past.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <div
            className="flex flex-wrap items-center gap-1"
            role="group"
            aria-label="Filter by format"
          >
            {formatFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormat(item.id)}
                className={cn(
                  "rounded-[1px] border px-2 py-1 text-[12px] font-[450] transition-colors",
                  format === item.id
                    ? "border-line-structure bg-surface-1 text-text-primary"
                    : "border-transparent text-text-secondary hover:bg-surface-1 hover:text-text-primary",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <TabsContent
          value={timing}
          className="mt-0 rounded-none bg-transparent pt-4"
        >
          {filtered.length === 0 ? (
            <EmptyState timing={timing} />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
