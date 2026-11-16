"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Lock,
  Music,
  Snowflake,
  Star,
  TreePine,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AdventStyles } from "./styles";
import { DoorAnimation } from "./DoorAnimation";
import { JinglePlayer } from "./jingles";
import { WinterCanvas, type WinterCanvasHandle } from "./WinterCanvas";
import {
  ADVENT_DOORS,
  ADVENT_URL,
  ADVENT_YEAR,
  LINK_LABELS,
  type AdventDoor,
} from "./doors";

// Shuffled like a real Advent calendar, so neighbors aren't consecutive days.
const DOOR_ORDER = [
  7, 15, 1, 22, 10, 18, 3, 13, 24, 5, 20, 9, 16, 2, 11, 23, 6, 14, 19, 4, 21, 8,
  12, 17,
];
const DOOR_STYLES = ["adv-door-paper", "adv-door-red", "adv-door-forest"];
const ORNAMENTS = [Snowflake, Star, Gift, TreePine];
const OPENED_KEY = `langfuse-advent-${ADVENT_YEAR}-opened`;
const MUSIC_KEY = "langfuse-advent-music";
const DOOR_OPEN_DELAY_MS = 800;
const ALL_OPEN = 25;
const SNOWBALL_IGNORE =
  "a, button, input, textarea, select, label, summary, [role='dialog'], [data-no-snowball]";

type DoorState = "locked" | "today" | "open";

/** Highest day that can be opened: 0 before December 1, 25 after December 24. */
function getUnlockedDay(now: Date): number {
  const year = now.getFullYear();
  if (year < ADVENT_YEAR || (year === ADVENT_YEAR && now.getMonth() < 11)) {
    return 0;
  }
  if (year > ADVENT_YEAR || now.getDate() > 24) return ALL_OPEN;
  return now.getDate();
}

function getPreviewDay(): number | null {
  // Lets reviewers check any day on local and preview deployments.
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") return null;
  const param = new URLSearchParams(window.location.search).get("day");
  if (param === null) return null;
  const day = Number(param);
  return Number.isInteger(day) && day >= 0 && day <= ALL_OPEN ? day : null;
}

function getDoorState(
  day: number,
  unlocked: number | null,
  opened: Set<number>,
): DoorState {
  if (unlocked === null || day > unlocked) return "locked";
  if (day < unlocked || opened.has(day)) return "open";
  return "today";
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useJingles() {
  const playerRef = useRef<JinglePlayer | null>(null);
  const enabledRef = useRef(true);
  const [enabled, setEnabled] = useState(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const player = new JinglePlayer();
    playerRef.current = player;
    enabledRef.current = localStorage.getItem(MUSIC_KEY) !== "off";
    setEnabled(enabledRef.current);

    const events = ["pointerdown", "pointerup", "keydown", "touchend"];
    const removeListeners = () =>
      events.forEach((e) => window.removeEventListener(e, tryStart));
    // Browsers block audio until the first interaction, so retry on each
    // gesture until playback starts.
    async function tryStart() {
      if (!enabledRef.current) return;
      const started = await player.start();
      if (started) {
        removeListeners();
        setPlaying(true);
      }
    }
    events.forEach((e) => window.addEventListener(e, tryStart));
    void tryStart();

    return () => {
      removeListeners();
      player.dispose();
    };
  }, []);

  const toggle = useCallback(async () => {
    const player = playerRef.current;
    if (!player) return;
    if (playing) {
      player.stop();
      setPlaying(false);
      enabledRef.current = false;
      setEnabled(false);
      localStorage.setItem(MUSIC_KEY, "off");
      return;
    }
    enabledRef.current = true;
    setEnabled(true);
    localStorage.setItem(MUSIC_KEY, "on");
    setPlaying(await player.start());
  }, [playing]);

  return { enabled, playing, toggle };
}

function MusicToggle({
  enabled,
  playing,
  onToggle,
}: {
  enabled: boolean;
  playing: boolean;
  onToggle: () => void;
}) {
  const label = playing
    ? "Jingles on"
    : enabled
      ? "Click anywhere for jingles"
      : "Jingles off";
  return (
    <button
      type="button"
      onPointerDown={(e) => e.stopPropagation()}
      onClick={onToggle}
      aria-pressed={playing}
      aria-label={playing ? "Turn off the jingles" : "Turn on the jingles"}
      className="adv-music fixed bottom-4 left-4 z-[70] inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium shadow-lg"
    >
      {playing ? (
        <span className="adv-music-bars" aria-hidden>
          <span />
          <span />
          <span />
        </span>
      ) : enabled ? (
        <Music className="size-3.5" />
      ) : (
        <VolumeX className="size-3.5" />
      )}
      {label}
    </button>
  );
}

function DoorTile({
  door,
  index,
  state,
  wiggle,
  onSelect,
}: {
  door: AdventDoor;
  index: number;
  state: DoorState;
  wiggle: boolean;
  onSelect: (day: number, element: HTMLElement) => void;
}) {
  const Ornament = ORNAMENTS[index % ORNAMENTS.length];
  const Icon = door.icon;
  const label =
    state === "locked"
      ? `Door ${door.day}, opens on December ${door.day}`
      : state === "today"
        ? `Door ${door.day}, open today's door`
        : `Door ${door.day}: ${door.title}`;
  return (
    <button
      type="button"
      data-advent-door
      aria-label={label}
      onClick={(e) => onSelect(door.day, e.currentTarget)}
      className={cn(
        "adv-door",
        state === "today" && "is-today",
        wiggle && "is-wiggle",
      )}
    >
      <span className="adv-door-recess" aria-hidden={state !== "open"}>
        {state === "open" ? (
          <>
            <span className="adv-door-recess-icon">
              <Icon className="size-4" />
            </span>
            <span className="adv-door-recess-title">{door.title}</span>
          </>
        ) : null}
      </span>
      <span
        className={cn(
          "adv-door-leaf",
          state === "open" && "is-open",
          state === "locked" && "is-locked",
        )}
      >
        <span
          className={cn(
            "adv-door-face",
            DOOR_STYLES[index % DOOR_STYLES.length],
          )}
        >
          {state === "locked" ? (
            <Lock className="adv-door-lock size-3" aria-hidden />
          ) : null}
          <span className="adv-door-number">{door.day}</span>
          <Ornament className="adv-door-ornament size-4" aria-hidden />
        </span>
        <span className="adv-door-back" />
      </span>
    </button>
  );
}

function DoorDialog({
  door,
  openDays,
  onNavigate,
  onClose,
}: {
  door: AdventDoor | null;
  openDays: number[];
  onNavigate: (day: number) => void;
  onClose: () => void;
}) {
  const position = door ? openDays.indexOf(door.day) : -1;
  const prev = position > 0 ? openDays[position - 1] : null;
  const next =
    position >= 0 && position < openDays.length - 1
      ? openDays[position + 1]
      : null;
  const shareUrl = door
    ? `https://x.com/intent/post?${new URLSearchParams({
        text: `Day ${door.day} of the Langfuse AI Gateway Advent calendar: ${door.title}`,
        url: `${ADVENT_URL}#day-${door.day}`,
      })}`
    : "";

  return (
    <Dialog open={door !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="adv-dialog max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[10px] p-5 sm:max-w-xl sm:p-6 [&>button:last-child]:text-[var(--adv-ink)]">
        {door ? (
          <div key={door.day} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 pr-6">
              <span className="adv-eyebrow">December {door.day}</span>
              <DialogTitle className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {door.title}
              </DialogTitle>
            </div>
            <DoorAnimation spec={door.animation} />
            <DialogDescription className="text-[14px] leading-relaxed text-[var(--adv-ink-muted)]">
              {door.description}
            </DialogDescription>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="primary"
                size="default"
                href={door.link.href}
                wrapperClassName="sm:w-auto"
                className="sm:px-4"
              >
                {LINK_LABELS[door.link.type]}
              </Button>
              <Button
                variant="secondary"
                size="default"
                href={door.socialUrl ?? shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                wrapperClassName="sm:w-auto"
                className="sm:px-4"
                icon={<ArrowUpRight className="size-3.5" />}
                iconPosition="end"
              >
                {door.socialUrl ? "View the social post" : "Share on X"}
              </Button>
            </div>
            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[12px]">
              <button
                type="button"
                disabled={prev === null}
                onClick={() => prev !== null && onNavigate(prev)}
                className="inline-flex items-center gap-1 text-[var(--adv-ink-muted)] hover:text-[var(--adv-ink)] disabled:invisible"
              >
                <ChevronLeft className="size-3.5" />
                Day {prev}
              </button>
              <button
                type="button"
                disabled={next === null}
                onClick={() => next !== null && onNavigate(next)}
                className="inline-flex items-center gap-1 text-[var(--adv-ink-muted)] hover:text-[var(--adv-ink)] disabled:invisible"
              >
                Day {next}
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function StatusLine({
  unlocked,
  todayOpened,
}: {
  unlocked: number | null;
  todayOpened: boolean;
}) {
  if (unlocked === null) return <span>&nbsp;</span>;
  if (unlocked === 0) {
    const firstDoor = new Date(ADVENT_YEAR, 11, 1);
    const days = Math.ceil((firstDoor.getTime() - Date.now()) / 86_400_000);
    return (
      <span>
        The first door opens on December 1, {ADVENT_YEAR}.{" "}
        {days === 1 ? "Just one more sleep!" : `${days} days to go.`}
      </span>
    );
  }
  if (unlocked === ALL_OPEN) {
    return <span>All 24 doors are open. Merry Christmas!</span>;
  }
  if (!todayOpened) {
    return (
      <span>Door {unlocked} is ready. Find the glowing door and open it!</span>
    );
  }
  return unlocked === 24 ? (
    <span>That was the last door. Merry Christmas!</span>
  ) : (
    <span>Come back tomorrow to open door {unlocked + 1}.</span>
  );
}

export function AdventCalendar() {
  const [unlocked, setUnlocked] = useState<number | null>(null);
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [wiggleDay, setWiggleDay] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const canvasRef = useRef<WinterCanvasHandle>(null);
  const dialogOpenRef = useRef(false);
  const deepLinkHandled = useRef(false);
  const reducedMotion = usePrefersReducedMotion();
  const music = useJingles();

  dialogOpenRef.current = activeDay !== null;

  useEffect(() => {
    const update = () =>
      setUnlocked(getPreviewDay() ?? getUnlockedDay(new Date()));
    update();
    const id = setInterval(update, 60_000);

    try {
      const stored = JSON.parse(localStorage.getItem(OPENED_KEY) ?? "[]");
      if (Array.isArray(stored)) setOpened(new Set(stored.map(Number)));
    } catch {
      // Ignore malformed storage and start with every door closed.
    }
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (unlocked === null || deepLinkHandled.current) return;
    deepLinkHandled.current = true;
    const match = /^#day-(\d+)$/.exec(window.location.hash);
    const day = match ? Number(match[1]) : null;
    if (day && getDoorState(day, unlocked, opened) === "open") {
      setActiveDay(day);
    }
  }, [unlocked, opened]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || dialogOpenRef.current) return;
      const target = e.target as Element | null;
      if (target?.closest(SNOWBALL_IGNORE)) return;
      canvasRef.current?.throwSnowball(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(id);
  }, [toast]);

  const showDoor = useCallback((day: number | null) => {
    setActiveDay(day);
    const url = `${window.location.pathname}${window.location.search}${
      day === null ? "" : `#day-${day}`
    }`;
    window.history.replaceState(null, "", url);
  }, []);

  const handleSelect = (day: number, element: HTMLElement) => {
    const state = getDoorState(day, unlocked, opened);
    if (state === "locked") {
      setWiggleDay(null);
      requestAnimationFrame(() => setWiggleDay(day));
      setToast(
        unlocked === null
          ? "Loading the calendar…"
          : `Not yet! Door ${day} opens on December ${day}.`,
      );
      return;
    }
    if (state === "open") {
      showDoor(day);
      return;
    }
    const next = new Set(opened).add(day);
    setOpened(next);
    localStorage.setItem(OPENED_KEY, JSON.stringify([...next]));
    const rect = element.getBoundingClientRect();
    canvasRef.current?.burst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    );
    setTimeout(() => showDoor(day), DOOR_OPEN_DELAY_MS);
  };

  const openDays = ADVENT_DOORS.filter(
    (door) => getDoorState(door.day, unlocked, opened) === "open",
  ).map((door) => door.day);
  const activeDoor =
    ADVENT_DOORS.find((door) => door.day === activeDay) ?? null;
  const todayOpened = unlocked !== null && opened.has(unlocked);

  return (
    <div className="adv-page relative overflow-hidden">
      <AdventStyles />
      <WinterCanvas ref={canvasRef} snow={!reducedMotion} />
      <div
        aria-hidden
        className="adv-stars pointer-events-none absolute inset-0"
      />

      <section className="relative mx-auto flex max-w-[1100px] flex-col items-center gap-5 px-4 pb-10 pt-14 text-center sm:px-8 md:pt-20">
        <span className="adv-eyebrow">Langfuse AI Gateway, December 2026</span>
        <h1 className="max-w-[18ch] text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
          The AI Gateway Advent calendar
        </h1>
        <p className="max-w-[56ch] text-[16px] leading-relaxed text-[var(--adv-ink-muted)] sm:text-[17px]">
          24 doors, 24 features of the Langfuse AI Gateway. From December 1 to
          24, a new door opens every day. Behind each one: a feature, how it
          works, and where to read more.
        </p>
        <p
          className="text-[14px] font-medium text-[var(--adv-gold)]"
          aria-live="polite"
        >
          <StatusLine unlocked={unlocked} todayOpened={todayOpened} />
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="primary"
            size="default"
            href="/docs/gateway/overview"
            wrapperClassName="sm:w-auto"
            className="px-4"
          >
            Get started with the AI Gateway
          </Button>
          <Button
            variant="secondary"
            size="default"
            href="https://x.com/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            wrapperClassName="sm:w-auto"
            className="px-4"
            icon={<ArrowUpRight className="size-3.5" />}
            iconPosition="end"
          >
            Follow @langfuse on X
          </Button>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-3 pb-16 sm:px-8 md:pb-24">
        <div className="adv-board overflow-hidden">
          <div className="adv-garland" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} className="adv-bulb" />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2.5 p-3 pt-4 sm:grid-cols-4 sm:gap-4 sm:p-6 lg:grid-cols-6">
            {DOOR_ORDER.map((day, index) => {
              const door = ADVENT_DOORS[day - 1];
              return (
                <DoorTile
                  key={day}
                  door={door}
                  index={index}
                  state={getDoorState(day, unlocked, opened)}
                  wiggle={wiggleDay === day}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>
        <p className="mt-5 text-center text-[13px] text-[var(--adv-ink-muted)]">
          Psst: click anywhere outside the doors to throw a snowball.
        </p>
      </section>

      {toast ? (
        <div
          role="status"
          className="adv-toast-msg fixed bottom-16 left-1/2 z-[70] -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-medium"
        >
          {toast}
        </div>
      ) : null}

      <MusicToggle
        enabled={music.enabled}
        playing={music.playing}
        onToggle={music.toggle}
      />

      <DoorDialog
        door={activeDoor}
        openDays={openDays}
        onNavigate={showDoor}
        onClose={() => showDoor(null)}
      />
    </div>
  );
}
