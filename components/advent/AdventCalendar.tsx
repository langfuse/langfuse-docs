"use client";

import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Gift,
  Lock,
  MousePointer2,
  Play,
  Volume2,
  Snowflake,
  Star,
  TreePine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PageFold, type PageFoldHandle } from "./PageFold";
import { WelcomeFlight } from "./WelcomeFlight";
import { LogoKnot, SantaHat } from "./LogoKnot";
import { SlopSlider, SlopDecorations, slopPhrase } from "./Slop";
import { CalendarShatter, type CalendarShatterHandle } from "./CalendarShatter";
import { useCalendarPhysics } from "./useCalendarPhysics";
import { SceneSwitch } from "./Afterhours";
import { AdventStyles } from "./styles";
import { DoorAnimation } from "./DoorAnimation";
import { JinglePlayer, type MusicFrame } from "./jingles";
import { ShaderAtmosphere } from "./ShaderAtmosphere";
import {
  SNOWBALL_DURATION,
  WinterCanvas,
  type WinterCanvasHandle,
} from "./WinterCanvas";
import {
  SNOWMAN_HAND,
  SNOWMAN_MAX_BALLS,
  SNOWMAN_RELEASE_MS,
  SNOWMAN_THROW_MS,
  Santa,
  Snowman,
} from "./HeroFigures";
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
const VOLUME_KEY = "langfuse-advent-volume";

const ALL_OPEN = 25;
const CRUMBLE_MS = 750;
const HIT_WOBBLE_MS = 350;

/** Two visible hits per level make the snowman a learnable little game. */
const SNOWMAN_HITS_PER_LEVEL = 2;
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

/**
 * In preview and dev builds, `?day=N` simulates any day, and before December door 1
 * is openable so the calendar can be reviewed.
 */
function getPreviewDay(now: Date): number | null {
  if (
    process.env.NEXT_PUBLIC_VERCEL_ENV !== "preview" &&
    process.env.NODE_ENV !== "development"
  ) {
    return null;
  }
  const param = new URLSearchParams(window.location.search).get("day");
  if (param === null) return getUnlockedDay(now) === 0 ? 1 : null;
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

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be full or blocked; state then lives in memory only.
  }
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
  const enabledRef = useRef(false);
  const [volume, setVolume] = useState(1);
  const starting = useRef<Promise<boolean> | null>(null);

  useEffect(() => {
    const player = new JinglePlayer();
    playerRef.current = player;
    const storedVolume = Number(readStorage(VOLUME_KEY) ?? "1");
    const initialVolume = Number.isFinite(storedVolume)
      ? Math.max(0, Math.min(1, storedVolume))
      : 1;
    player.setVolume(initialVolume);
    setVolume(initialVolume);
    return () => player.dispose();
  }, []);

  const start = useCallback(() => {
    const player = playerRef.current;
    if (!player) return Promise.resolve(false);
    if (enabledRef.current && player.state === "running")
      return Promise.resolve(true);
    if (starting.current) return starting.current;
    starting.current = player
      .start()
      .then((didStart) => {
        enabledRef.current = didStart;
        return didStart;
      })
      .finally(() => {
        starting.current = null;
      });
    return starting.current;
  }, []);

  useEffect(() => {
    const gesture = () => {
      void start();
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") gesture();
    };
    window.addEventListener("pointerdown", gesture, { capture: true });
    window.addEventListener("keydown", keyboard);
    return () => {
      window.removeEventListener("pointerdown", gesture, { capture: true });
      window.removeEventListener("keydown", keyboard);
    };
  }, [start]);
  const welcome = useCallback(() => playerRef.current?.welcome(), []);
  const setSlop = useCallback(
    (value: number) => playerRef.current?.setSlop(value),
    [],
  );
  const shatter = useCallback(
    (pan: number, power: number) => playerRef.current?.shatter(pan, power),
    [],
  );
  const hover = useCallback(
    (day: number, pan: number) => playerRef.current?.hover(day, pan),
    [],
  );

  const getFrame = useCallback(
    (): MusicFrame =>
      playerRef.current?.getFrame() ?? {
        mix: 0,
        pulse: 0,
        bpm: 168,
        build: 0,
        beat: 0,
      },
    [],
  );
  const setTechno = useCallback((value: boolean) => {
    playerRef.current?.setTechno(value);
  }, []);
  const fold = useCallback((day: number, berlin: boolean, closing = false) => {
    if (enabledRef.current)
      return playerRef.current?.fold(day, berlin, closing);
  }, []);
  const changeVolume = useCallback((value: number) => {
    setVolume(value);
    playerRef.current?.setVolume(value);
    writeStorage(VOLUME_KEY, String(value));
  }, []);
  return {
    start,
    welcome,
    shatter,
    setSlop,
    hover,
    volume,
    changeVolume,
    fold,
    getFrame,
    setTechno,
  };
}

function SnowballHint() {
  return (
    <p className="adv-hint-row flex items-center gap-2 text-[13px] text-text-secondary">
      <span className="adv-hint" aria-hidden>
        <span className="adv-hint-ring" />
        <span className="adv-hint-ball" />
        <span className="adv-hint-splat" />
        <MousePointer2 className="adv-hint-cursor size-4 fill-current" />
      </span>
      Click anywhere to throw a snowball
    </p>
  );
}

function MusicVolume({
  volume,
  onVolume,
}: {
  volume: number;
  onVolume: (value: number) => void;
}) {
  return (
    <label className="adv-volume" data-no-snowball>
      <Volume2 size={16} aria-hidden />
      <span className="sr-only">Music volume</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(event) => onVolume(Number(event.target.value))}
      />
    </label>
  );
}

const DoorTile = memo(function DoorTile({
  door,
  index,
  state,
  wiggle,
  onSelect,
  onHover,
}: {
  door: AdventDoor;
  index: number;
  state: DoorState;
  wiggle: boolean;
  onHover: (day: number, x: number) => void;
  onSelect: (
    day: number,
    element: HTMLElement,
    point: { x: number; y: number } | null,
  ) => void;
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
      data-day={door.day}
      style={
        {
          "--adv-enter-delay": `${((index * 7) % 24) * 32}ms`,
          "--adv-enter-x": `${((index % 6) - 2.5) * 110}px`,
          "--adv-enter-y": `${(Math.floor(index / 6) - 1.5) * 100}px`,
          "--adv-enter-turn": `${index % 2 ? 24 : -24}deg`,
        } as CSSProperties
      }
      aria-label={label}
      onPointerEnter={(event) => onHover(door.day, event.clientX)}
      onClick={(e) =>
        onSelect(
          door.day,
          e.currentTarget,
          // detail is 0 for keyboard activation, which has no click point.
          e.detail > 0 ? { x: e.clientX, y: e.clientY } : null,
        )
      }
      className={cn(
        "adv-door",
        state === "today" && "is-today",
        state === "locked" && "is-locked",
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
});

function DoorDialog({
  techno,
  sceneMix,
  door: activeDoor,
  openDays,
  onNavigate,
  onClose,
  onSkipEffect,
}: {
  techno: boolean;
  sceneMix: number;
  door: AdventDoor | null;
  openDays: number[];
  onNavigate: (day: number) => void;
  onClose: () => void;
  onSkipEffect?: () => void;
}) {
  // Keep showing the last door while the dialog animates out.
  const [lastDoor, setLastDoor] = useState(activeDoor);
  if (activeDoor && activeDoor !== lastDoor) setLastDoor(activeDoor);
  const door = activeDoor ?? lastDoor;
  const position = door ? openDays.indexOf(door.day) : -1;
  const prev = position > 0 ? openDays[position - 1] : null;
  const next =
    position >= 0 && position < openDays.length - 1
      ? openDays[position + 1]
      : null;
  const shareUrl = door
    ? `https://x.com/intent/post?${new URLSearchParams({
        text: `Day ${door.day} of Gateway to Christmas, the Langfuse AI Gateway Advent calendar: ${door.title}`,
        url: `${ADVENT_URL}#day-${door.day}`,
      })}`
    : "";

  return (
    <Dialog
      open={activeDoor !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent
        onInteractOutside={(event) => {
          const target = event.detail.originalEvent.target;
          if (
            document.querySelector("[data-page-fold]") ||
            (target instanceof Element && target.closest(".adv-fold-skip"))
          )
            event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClose();
        }}
        style={
          {
            "--adv-scene": sceneMix,
            "--adv-ink": sceneMix > 0.5 ? 1 : 0,
          } as CSSProperties
        }
        data-mode={techno ? "techno" : "winter"}
        className="adv-dialog max-h-[90vh] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[10px] p-5 sm:max-w-xl sm:p-6"
      >
        {onSkipEffect ? (
          <button
            type="button"
            className="adv-dialog-skip"
            onClick={onSkipEffect}
          >
            Skip effect
          </button>
        ) : null}
        {door ? (
          <div key={door.day} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 pr-6">
              <span className="adv-eyebrow">December {door.day}</span>
              <DialogTitle className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
                {door.title}
              </DialogTitle>
            </div>
            <DoorAnimation spec={door.animation} />
            <DialogDescription className="text-[14px] leading-relaxed text-text-secondary">
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
            {prev !== null || next !== null ? (
              <div className="flex items-center justify-between border-t border-line-structure pt-3 text-[12px]">
                <button
                  type="button"
                  disabled={prev === null}
                  onClick={() => prev !== null && onNavigate(prev)}
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary disabled:invisible"
                >
                  <ChevronLeft className="size-3.5" />
                  Day {prev}
                </button>
                <button
                  type="button"
                  disabled={next === null}
                  onClick={() => next !== null && onNavigate(next)}
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-text-primary disabled:invisible"
                >
                  Day {next}
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            ) : null}
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
  const sceneRef = useRef<HTMLDivElement>(null);
  const shatterRef = useRef<CalendarShatterHandle>(null);
  const [experience, setExperience] = useState<
    "intro" | "flying" | "arriving" | "ready"
  >("intro");
  const experienceRef = useRef(false);
  const [unlocked, setUnlocked] = useState<number | null>(null);
  const [opened, setOpened] = useState<Set<number>>(new Set());
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [wiggleDay, setWiggleDay] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const canvasRef = useRef<WinterCanvasHandle>(null);
  const foldRef = useRef<PageFoldHandle>(null);
  const openingRef = useRef(false);
  const openingTaskRef = useRef<Promise<boolean> | null>(null);
  const closingRef = useRef(false);
  const [entering, setEntering] = useState(false);
  const dialogOpenRef = useRef(false);
  const deepLinkHandled = useRef(false);
  const snowmanRef = useRef<HTMLDivElement>(null);
  const [snowmanBalls, setSnowmanBalls] = useState(0);
  const [crumbling, setCrumbling] = useState(false);
  const crumblingRef = useRef(false);
  const snowmanBallsRef = useRef(0);
  const snowmanHitsRef = useRef(0);
  const [snowmanHits, setSnowmanHits] = useState(0);
  const hitResetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(hitResetTimer.current), []);
  const wobbleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [snowmanHit, setSnowmanHit] = useState(false);
  const [annoyed, setAnnoyed] = useState(false);
  const annoyedRef = useRef(false);
  const [throwing, setThrowing] = useState(false);
  const throwEndTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reducedMotion = usePrefersReducedMotion();
  const music = useJingles();
  const begin = useCallback(() => {
    void music.start();
    if (experienceRef.current) return;
    experienceRef.current = true;
    void music.start().then(() => setExperience("flying"));
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [music.start]);
  const revealCalendar = useCallback(() => setExperience("arriving"), []);
  const finishFlight = useCallback(() => setExperience("ready"), []);
  const [techno, setTechno] = useState(false);
  const [slop, setSlop] = useState(0);
  const slopRef = useRef(0);
  slopRef.current = slop / 100;
  const changeSlop = (value: number) => {
    setSlop(value);
    music.setSlop(value / 100);
  };
  const impulse = useCalendarPhysics(
    sceneRef,
    experience === "ready" && activeDay === null,
    reducedMotion,
  );
  const impact = useCallback(
    (x: number, y: number) => {
      if (experience !== "ready" || dialogOpenRef.current || openingRef.current)
        return;
      const power = slopRef.current;
      impulse(x, y, power, music.getFrame().mix);
      if (power > 0.5) shatterRef.current?.hit(x, y, (power - 0.5) * 2);
      music.shatter((x / innerWidth) * 2 - 1, power);
    },
    [experience, impulse, music.shatter, music.getFrame],
  );
  const hoverDoor = useCallback(
    (day: number, x: number) => {
      if (experience === "ready") music.hover(day, (x / innerWidth) * 2 - 1);
    },
    [experience, music.hover],
  );
  useEffect(() => {
    // Capture only after the slider settles, and reuse it across throws.
    shatterRef.current?.cancel();
    if (experience !== "ready" || activeDay !== null || slop <= 50) return;
    const timer = setTimeout(() => shatterRef.current?.prepare(), 450);
    return () => clearTimeout(timer);
  }, [experience, activeDay, slop, techno, opened]);
  const changeScene = useCallback(
    (value: boolean) => {
      setTechno(value);
      music.setTechno(value);
    },
    [music.setTechno],
  );
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("afterhours") === "1") {
      changeScene(true);
    }
  }, [changeScene]);

  dialogOpenRef.current = activeDay !== null;
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setUnlocked(getPreviewDay(now) ?? getUnlockedDay(now));
    };
    update();
    const id = setInterval(update, 60_000);

    try {
      const stored = JSON.parse(readStorage(OPENED_KEY) ?? "[]");
      if (Array.isArray(stored)) setOpened(new Set(stored.map(Number)));
    } catch {
      // Ignore malformed storage and start with every door closed.
    }
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (unlocked === null || experience !== "ready" || deepLinkHandled.current)
      return;
    deepLinkHandled.current = true;
    const match = /^#day-(\d+)$/.exec(window.location.hash);
    const day = match ? Number(match[1]) : null;
    if (!day || day > ADVENT_DOORS.length) return;
    const state = getDoorState(day, unlocked, opened);
    if (state === "today") {
      const next = new Set(opened).add(day);
      setOpened(next);
      writeStorage(OPENED_KEY, JSON.stringify([...next]));
    }
    if (state !== "locked") setActiveDay(day);
  }, [unlocked, opened, experience]);

  /**
   * Throws a snowball at a point and returns the ms until it lands. Throws run
   * even with reduced motion: each one is the visitor's own click, not ambient
   * motion.
   */
  const throwAt = useCallback((x: number, y: number) => {
    if (slopRef.current > 0.5) shatterRef.current?.prepare();
    canvasRef.current?.throwSnowball(x, y);
    return SNOWBALL_DURATION;
  }, []);

  /** The snowman winds up and throws a snowball at the viewer. */
  const throwBack = useCallback(() => {
    setThrowing(false);
    requestAnimationFrame(() => setThrowing(true));
    clearTimeout(throwEndTimer.current);
    throwEndTimer.current = setTimeout(
      () => setThrowing(false),
      SNOWMAN_THROW_MS,
    );
    setTimeout(() => {
      const svg = snowmanRef.current?.querySelector("svg");
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const fromX =
        rect.left + (SNOWMAN_HAND.x / SNOWMAN_HAND.width) * rect.width;
      const fromY =
        rect.top + (SNOWMAN_HAND.y / SNOWMAN_HAND.height) * rect.height;
      // Not at the pointer: that is usually on the snowman himself.
      const toX = window.innerWidth * (0.3 + Math.random() * 0.4);
      const toY = window.innerHeight * (0.3 + Math.random() * 0.3);
      if (slopRef.current > 0.5) shatterRef.current?.prepare();
      canvasRef.current?.throwBack(fromX, fromY, toX, toY);
    }, SNOWMAN_RELEASE_MS);
  }, []);

  const hitSnowman = useCallback(() => {
    if (crumblingRef.current) return;
    clearTimeout(wobbleTimer.current);
    setSnowmanHit(false);
    requestAnimationFrame(() => setSnowmanHit(true));
    wobbleTimer.current = setTimeout(() => setSnowmanHit(false), HIT_WOBBLE_MS);
    clearTimeout(hitResetTimer.current);
    snowmanHitsRef.current += 1;
    setSnowmanHits(snowmanHitsRef.current);
    if (snowmanHitsRef.current < SNOWMAN_HITS_PER_LEVEL) {
      if (annoyedRef.current) setTimeout(throwBack, HIT_WOBBLE_MS);
      return;
    }
    snowmanHitsRef.current = 0;
    hitResetTimer.current = setTimeout(() => setSnowmanHits(0), 300);
    if (snowmanBallsRef.current < SNOWMAN_MAX_BALLS) {
      snowmanBallsRef.current += 1;
      setSnowmanBalls(snowmanBallsRef.current);
      return;
    }
    // A full snowman fights back for one more round before crumbling.
    if (!annoyedRef.current) {
      annoyedRef.current = true;
      setAnnoyed(true);
      setTimeout(throwBack, HIT_WOBBLE_MS);
      return;
    }
    annoyedRef.current = false;
    setAnnoyed(false);
    crumblingRef.current = true;
    setCrumbling(true);
    setTimeout(() => {
      crumblingRef.current = false;
      snowmanBallsRef.current = 0;
      setCrumbling(false);
      setSnowmanBalls(0);
    }, CRUMBLE_MS);
  }, [throwBack]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || dialogOpenRef.current) return;
      const target = e.target as Element | null;
      // Only the page itself is a target, not site chrome or overlays.
      if (!target?.closest(".adv-page") || target.closest(SNOWBALL_IGNORE)) {
        return;
      }
      const landsIn = throwAt(e.clientX, e.clientY);
      const rect = snowmanRef.current?.getBoundingClientRect();
      if (
        !target.closest("[data-snowman]") &&
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        setTimeout(hitSnowman, landsIn);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [throwAt, hitSnowman]);

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

  const handleSelect = useCallback(
    async (
      day: number,
      element: HTMLElement,
      point: { x: number; y: number } | null,
    ) => {
      if (openingRef.current) return;
      if (experience !== "ready") {
        begin();
        return;
      }
      const state = getDoorState(day, unlocked, opened);
      if (state === "locked") {
        const landsIn = point ? throwAt(point.x, point.y) : 0;
        setTimeout(() => {
          setWiggleDay(null);
          requestAnimationFrame(() => setWiggleDay(day));
          setToast(
            unlocked === null
              ? "Loading the calendar…"
              : `Not yet! Door ${day} opens on December ${day}.`,
          );
        }, landsIn);
        return;
      }
      shatterRef.current?.cancel();
      openingRef.current = true;
      try {
        const rect = element.getBoundingClientRect();
        const center = point ?? {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        let revealed = false;
        const reveal = () => {
          if (revealed) return;
          revealed = true;
          if (state !== "open") {
            const next = new Set(opened).add(day);
            setOpened(next);
            writeStorage(OPENED_KEY, JSON.stringify([...next]));
          }
          showDoor(day);
        };
        const task = foldRef.current?.play(
          center,
          music.getFrame().mix > 0.5,
          () => {
            setEntering(true);
            return music.fold(day, music.getFrame().mix > 0.5);
          },
          reveal,
          day,
        );
        openingTaskRef.current = task ?? null;
        const finished = await task;
        if (finished !== false) reveal();
      } finally {
        openingTaskRef.current = null;
        openingRef.current = false;
        setEntering(false);
      }
    },
    [
      experience,
      begin,
      unlocked,
      opened,
      throwAt,
      showDoor,
      music.getFrame,
      music.fold,
    ],
  );

  const closeDoor = async () => {
    if (closingRef.current) {
      foldRef.current?.skip();
      return;
    }
    if (activeDay === null) return;
    closingRef.current = true;
    try {
      // A revealed window can close while its arrival is still finishing.
      // Let that journey release its canvas/audio before starting the pullback.
      if (openingRef.current) {
        foldRef.current?.skip();
        const finished = await openingTaskRef.current;
        if (finished === false || !sceneRef.current) return;
      }
      openingRef.current = true;
      const day = activeDay;
      const element = document.querySelector<HTMLElement>(
        `[data-advent-door][data-day="${day}"]`,
      );
      const rect = element?.getBoundingClientRect();
      const point = rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: innerWidth / 2, y: innerHeight / 2 };
      let closed = false;
      const close = () => {
        if (!closed) {
          closed = true;
          showDoor(null);
        }
      };
      const berlin = music.getFrame().mix > 0.5;
      const finished = await foldRef.current?.play(
        point,
        berlin,
        () => {
          setEntering(true);
          return music.fold(day, berlin, true);
        },
        close,
        day,
        true,
      );
      if (finished !== false) close();
    } finally {
      closingRef.current = false;
      openingRef.current = false;
      setEntering(false);
    }
  };

  const openDays = ADVENT_DOORS.filter(
    (door) => getDoorState(door.day, unlocked, opened) === "open",
  ).map((door) => door.day);
  const activeDoor =
    ADVENT_DOORS.find((door) => door.day === activeDay) ?? null;
  const todayOpened = unlocked !== null && opened.has(unlocked);

  return (
    <div
      ref={sceneRef}
      className="adv-page relative overflow-hidden"
      onDragStart={(event) => {
        if (!(event.target as HTMLElement).closest('[role="dialog"]'))
          event.preventDefault();
      }}
      data-mode={techno ? "techno" : "winter"}
      data-experience={experience}
      data-slop-level={Math.floor(slop / 25)}
      style={{ "--adv-slop": slop / 100 } as CSSProperties}
      onClickCapture={begin}
    >
      <ShaderAtmosphere
        techno={techno}
        reducedMotion={reducedMotion}
        getFrame={music.getFrame}
        slop={slop / 100}
      />
      <AdventStyles />
      <PageFold ref={foldRef} />
      <WelcomeFlight
        active={experience === "flying" || experience === "arriving"}
        onReveal={revealCalendar}
        onComplete={finishFlight}
        onSound={music.welcome}
      />
      <CalendarShatter ref={shatterRef} />
      <WinterCanvas
        ref={canvasRef}
        active={activeDay === null}
        onImpact={impact}
        slop={slop / 100}
      />

      <nav className="adv-nav" aria-label="Main navigation" data-no-snowball>
        <a className="adv-brand" href="/" aria-label="Langfuse home">
          <SantaHat />
          <img
            src="/brand-assets/wordmark/light/langfuse-by-clickhouse.svg"
            width="150"
            height="40"
            alt="Langfuse by ClickHouse"
          />
          <img
            className="adv-brand-night"
            src="/brand-assets/wordmark/dark/langfuse-by-clickhouse-white.svg"
            width="150"
            height="40"
            alt=""
            aria-hidden
          />
        </a>
        <div className="adv-nav-links">
          <a href="/docs">Docs</a>
          <a href="/docs/gateway/overview">
            AI Gateway <ArrowUpRight size={13} />
          </a>
          <a href="https://cloud.langfuse.com">
            Launch app <ArrowUpRight size={13} />
          </a>
        </div>
      </nav>
      <header className="adv-experience-header">
        <div className="adv-knot-stage">
          <LogoKnot />
        </div>
        <div className="adv-heading">
          <h1>
            {slop >= 75
              ? "Unlock your"
              : slop >= 50
                ? "Delve into"
                : "Gateway to"}{" "}
            <span className="adv-title-swap">
              <span className="adv-title-day adv-title-accent">Christmas</span>
              <span className="adv-title-night" aria-hidden>
                afterhours
              </span>
            </span>
          </h1>
          <p className="adv-intro-copy">
            The Langfuse AI Gateway Advent Calendar.
            <br />
            24 doors, 24 features. {slopPhrase(slop)}
          </p>
        </div>
        <div className="adv-start-action">
          <Button
            variant="primary"
            size="default"
            onClick={begin}
            aria-label="Start"
          >
            <Play size={16} fill="currentColor" /> Start
          </Button>
          <span>Turn the sound up. Step inside.</span>
        </div>
        <div className="adv-header-controls" data-no-snowball>
          <SceneSwitch
            techno={techno}
            onChange={changeScene}
            getFrame={music.getFrame}
          />
        </div>
      </header>
      <div className="adv-figures">
        <div className="adv-santa-figure" aria-hidden>
          <Santa />
        </div>
        <Snowman
          ref={snowmanRef}
          hits={snowmanHits}
          onThrow={() => {
            const rect = snowmanRef.current?.getBoundingClientRect();
            if (rect) {
              const delay = throwAt(
                rect.left + rect.width / 2,
                rect.top + rect.height * 0.65,
              );
              setTimeout(hitSnowman, delay);
            }
          }}
          balls={snowmanBalls}
          crumbling={crumbling}
          hit={snowmanHit}
          annoyed={annoyed}
          throwing={throwing}
          className="adv-snowman-figure"
        />
      </div>

      <section className="adv-calendar" aria-label="Advent calendar">
        <p className="adv-calendar-status" aria-live="polite">
          <StatusLine unlocked={unlocked} todayOpened={todayOpened} />
        </p>
        <div className="adv-board overflow-hidden">
          <div className="adv-garland" aria-hidden>
            {Array.from({ length: 14 }, (_, i) => (
              <span key={i} className="adv-bulb" />
            ))}
          </div>
          <div className="adv-door-grid">
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
                  onHover={hoverDoor}
                />
              );
            })}
          </div>
        </div>
        <footer className="adv-calendar-footer">
          <SnowballHint />
          <a href="/docs/gateway/overview">
            Get started with the AI Gateway <ArrowUpRight size={13} />
          </a>
        </footer>
      </section>

      <div className="adv-mixer" data-no-snowball>
        <MusicVolume volume={music.volume} onVolume={music.changeVolume} />
        {experience === "ready" ? (
          <SlopSlider power={slop} onChange={changeSlop} />
        ) : null}
      </div>
      <SlopDecorations power={slop} />

      {toast ? (
        <div
          role="status"
          className="adv-toast-msg fixed bottom-16 left-1/2 z-[70] -translate-x-1/2 rounded-full px-4 py-2 text-[13px] font-medium"
        >
          {toast}
        </div>
      ) : null}

      <DoorDialog
        sceneMix={reducedMotion ? Number(techno) : music.getFrame().mix}
        techno={techno}
        door={activeDoor}
        openDays={openDays}
        onNavigate={showDoor}
        onClose={() => void closeDoor()}
        onSkipEffect={entering ? () => foldRef.current?.skip() : undefined}
      />
    </div>
  );
}
