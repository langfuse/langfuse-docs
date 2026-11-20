"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const SNOWMAN_MAX_BALLS = 3;

export function Santa({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 190"
      aria-hidden
      className={cn("adv-santa overflow-visible", className)}
    >
      <ellipse cx="70" cy="184" rx="46" ry="5" className="adv-shadow" />
      {/* boots */}
      <rect x="44" y="166" width="22" height="16" rx="5" fill="#1d1d1b" />
      <rect x="74" y="166" width="22" height="16" rx="5" fill="#1d1d1b" />
      {/* sweater */}
      <path d="M30 172 Q26 104 70 94 Q114 104 110 172 Z" fill="#b3262e" />
      <rect x="28" y="162" width="84" height="11" rx="5.5" fill="#fbf7ef" />
      <rect x="31" y="146" width="78" height="10" fill="#1d1d1b" />
      <rect
        x="61"
        y="143"
        width="18"
        height="16"
        rx="2"
        fill="none"
        stroke="#f2c14e"
        strokeWidth="3.5"
      />
      {/* Langfuse badge on the sweater */}
      <circle
        cx="70"
        cy="121"
        r="17"
        fill="#fbf7ef"
        stroke="#e5ddd0"
        strokeWidth="1"
      />
      <image href="/langfuse-icon.svg" x="54" y="105" width="32" height="32" />
      {/* resting arm */}
      <path
        d="M36 108 Q20 126 26 146"
        stroke="#b3262e"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="26" cy="149" r="8" fill="#1f5c3f" />
      {/* waving arm */}
      <g className="adv-santa-wave">
        <path
          d="M104 108 Q122 96 126 76"
          stroke="#b3262e"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="126" cy="72" r="8" fill="#1f5c3f" />
      </g>
      {/* face */}
      <circle cx="70" cy="60" r="26" fill="#f6c9a4" />
      <circle cx="56" cy="66" r="5" fill="#f19a8f" opacity="0.6" />
      <circle cx="84" cy="66" r="5" fill="#f19a8f" opacity="0.6" />
      <g className="adv-santa-eyes">
        <circle cx="61" cy="56" r="2.6" fill="#1d1d1b" />
        <circle cx="79" cy="56" r="2.6" fill="#1d1d1b" />
      </g>
      <path
        d="M56 49 Q61 46 66 49 M74 49 Q79 46 84 49"
        stroke="#fbf7ef"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      {/* beard and mustache */}
      <path
        d="M44 62 Q42 98 70 106 Q98 98 96 62 Q90 78 70 74 Q50 78 44 62 Z"
        fill="#fbf7ef"
        stroke="#e5ddd0"
        strokeWidth="1"
      />
      <ellipse cx="62" cy="71" rx="9" ry="5" fill="#fbf7ef" />
      <ellipse cx="78" cy="71" rx="9" ry="5" fill="#fbf7ef" />
      <circle cx="70" cy="65" r="4.5" fill="#e58a7c" />
      {/* hat */}
      <path d="M44 40 Q56 0 110 14 Q94 22 98 40 Z" fill="#b3262e" />
      <circle cx="112" cy="16" r="8" fill="#fbf7ef" />
      <rect x="40" y="33" width="60" height="12" rx="6" fill="#fbf7ef" />
    </svg>
  );
}

/** Snowball in the throwing hand, in the snowman's SVG viewBox coordinates. */
export const SNOWMAN_HAND = { x: 103, y: 68, width: 120, height: 160 };
export const SNOWMAN_THROW_MS = 500;
/** Point in the arm swing where the snowball leaves the hand. */
export const SNOWMAN_RELEASE_MS = 280;

type SnowmanProps = {
  balls: number;
  crumbling: boolean;
  hit: boolean;
  annoyed: boolean;
  throwing: boolean;
  className?: string;
};

export const Snowman = forwardRef<HTMLDivElement, SnowmanProps>(
  function Snowman(
    { balls, crumbling, hit, annoyed, throwing, className },
    ref,
  ) {
    const label = crumbling
      ? "Oops!"
      : annoyed
        ? "Hey! Take that!"
        : balls === 0
          ? "Hit me with snowballs"
          : balls < SNOWMAN_MAX_BALLS
            ? `${balls} of ${SNOWMAN_MAX_BALLS}, keep going!`
            : "Done! Dare to hit me again?";
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-1", className)}
      >
        <svg
          viewBox="0 0 120 160"
          role="img"
          aria-label={`Snowman with ${balls} of ${SNOWMAN_MAX_BALLS} snowballs`}
          className={cn(
            "adv-snowman w-full overflow-visible",
            crumbling && "is-crumbling",
            hit && "is-hit",
            annoyed && "is-annoyed",
            throwing && "is-throwing",
          )}
        >
          <ellipse cx="60" cy="154" rx="44" ry="5" className="adv-shadow" />
          <path
            d="M18 154 Q30 138 46 146 Q58 134 74 146 Q90 138 102 154 Z"
            fill="#fff"
            stroke="#c9d4e2"
            strokeWidth="1.5"
          />
          {balls >= 1 ? (
            <g className="adv-snowman-ball">
              <circle
                cx="60"
                cy="124"
                r="28"
                fill="#fff"
                stroke="#c9d4e2"
                strokeWidth="1.5"
              />
              <circle cx="60" cy="116" r="2.5" fill="#1d1d1b" />
              <circle cx="60" cy="128" r="2.5" fill="#1d1d1b" />
            </g>
          ) : null}
          {balls >= 2 ? (
            <g className="adv-snowman-ball">
              <path
                d="M42 84 L18 70 M24 74 L16 78"
                stroke="#6b4a2b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <g className="adv-snowman-arm">
                <path
                  d="M78 84 L102 70 M96 74 L104 78"
                  stroke="#6b4a2b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {annoyed ? (
                  <circle
                    cx="103"
                    cy="68"
                    r="5"
                    fill="#fff"
                    stroke="#c9d4e2"
                    strokeWidth="1.2"
                    className="adv-snowman-ammo"
                  />
                ) : null}
              </g>
              <circle
                cx="60"
                cy="84"
                r="20"
                fill="#fff"
                stroke="#c9d4e2"
                strokeWidth="1.5"
              />
              <circle cx="60" cy="80" r="2.2" fill="#1d1d1b" />
              <circle cx="60" cy="90" r="2.2" fill="#1d1d1b" />
            </g>
          ) : null}
          {balls >= 3 ? (
            <g className="adv-snowman-ball">
              <g className="adv-snowman-head">
                <circle
                  cx="60"
                  cy="52"
                  r="15"
                  fill="#fff"
                  stroke="#c9d4e2"
                  strokeWidth="1.5"
                />
                {annoyed ? (
                  <>
                    <circle
                      cx="51"
                      cy="56"
                      r="3"
                      fill="#ff8a7a"
                      opacity=".55"
                    />
                    <circle
                      cx="69"
                      cy="56"
                      r="3"
                      fill="#ff8a7a"
                      opacity=".55"
                    />
                    <path
                      d="M51 44 L58 47 M69 44 L62 47"
                      stroke="#1d1d1b"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </>
                ) : null}
                <circle cx="55" cy="49" r="1.8" fill="#1d1d1b" />
                <circle cx="65" cy="49" r="1.8" fill="#1d1d1b" />
                <path d="M60 53 L74 56 L60 57 Z" fill="#f08a24" />
                <path
                  d={annoyed ? "M54 61 Q60 57 66 61" : "M54 59 Q60 63 66 59"}
                  stroke="#1d1d1b"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M44 66 Q60 74 76 66 L76 71 Q60 79 44 71 Z"
                  fill="#b3262e"
                />
                <rect
                  x="66"
                  y="68"
                  width="7"
                  height="16"
                  rx="2"
                  fill="#b3262e"
                />
                <rect
                  x="46"
                  y="36"
                  width="28"
                  height="4"
                  rx="2"
                  fill="#1d1d1b"
                />
                <rect
                  x="50"
                  y="20"
                  width="20"
                  height="18"
                  rx="2"
                  fill="#1d1d1b"
                />
                <rect x="50" y="32" width="20" height="3" fill="#1f5c3f" />
              </g>
            </g>
          ) : null}
        </svg>
        <span className="text-center text-[11px] leading-tight text-text-tertiary sm:text-[12px]">
          {label}
        </span>
      </div>
    );
  },
);
