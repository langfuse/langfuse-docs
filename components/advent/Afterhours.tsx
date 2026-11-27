"use client";

import { useEffect, useState } from "react";
import { Moon, Snowflake } from "lucide-react";
import { trackAdvent } from "./analytics";
import type { MusicFrame } from "./jingles";

export function SceneSwitch({
  techno,
  onChange,
  getFrame,
}: {
  techno: boolean;
  onChange: (value: boolean) => void;
  getFrame: () => MusicFrame;
}) {
  const [stage, setStage] = useState("The evening is young");
  useEffect(() => {
    const start = performance.now();
    let completed = false;
    const update = () => {
      const { mix } = getFrame();
      if (!completed && Math.abs(mix - Number(techno)) < 0.001) {
        completed = true;
        if (performance.now() - start > 250)
          trackAdvent("mode_arrived", {
            target_mode: techno ? "techno" : "winter",
            duration_ms: Math.round(performance.now() - start),
          });
      }
      setStage(
        techno
          ? mix < 0.2
            ? "Down the stairs…"
            : mix < 0.55
              ? "Somewhere beneath Berlin…"
              : mix < 0.95
                ? "Santa’s second shift…"
                : "Berlin, afterhours"
          : mix > 0.65
            ? "Last track, then home…"
            : mix > 0.05
              ? "Back through the snow…"
              : "The evening is young",
      );
    };
    update();
    const timer = setInterval(update, 250);
    return () => clearInterval(timer);
  }, [techno, getFrame]);
  return (
    <div className="adv-scene-control">
      <div
        className="adv-scene-switch"
        role="group"
        aria-label="Choose your atmosphere"
        data-techno={techno}
      >
        <button
          type="button"
          aria-pressed={!techno}
          onClick={() => onChange(false)}
        >
          <Snowflake size={20} />
          <span>Christmas</span>
        </button>
        <button
          type="button"
          aria-pressed={techno}
          onClick={() => onChange(true)}
        >
          <Moon size={20} />
          <span>Afterhours</span>
        </button>
      </div>
      <span className="adv-scene-status" role="status">
        {stage}
      </span>
      <span className="adv-scene-progress" aria-hidden>
        <span />
      </span>
    </div>
  );
}
