"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const SNOWMAN_MAX_BALLS = 3;

export function Santa({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      aria-hidden
      className={cn("adv-santa overflow-visible", className)}
    >
      <ellipse cx="60" cy="154" rx="40" ry="5" className="adv-shadow" />
      {/* boots */}
      <rect x="38" y="138" width="18" height="14" rx="4" fill="#1d1d1b" />
      <rect x="64" y="138" width="18" height="14" rx="4" fill="#1d1d1b" />
      {/* body */}
      <path d="M32 140 Q30 96 60 88 Q90 96 88 140 Z" fill="#b3262e" />
      <rect x="31" y="134" width="58" height="8" rx="4" fill="#fbf7ef" />
      <rect x="34" y="114" width="52" height="8" fill="#1d1d1b" />
      <rect
        x="53"
        y="112"
        width="14"
        height="12"
        rx="2"
        fill="none"
        stroke="#f2c14e"
        strokeWidth="3"
      />
      {/* resting arm */}
      <path
        d="M36 98 Q24 112 28 126"
        stroke="#b3262e"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="128" r="6" fill="#1f5c3f" />
      {/* waving arm */}
      <g className="adv-santa-wave">
        <path
          d="M84 98 Q98 88 102 72"
          stroke="#b3262e"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="102" cy="68" r="6" fill="#1f5c3f" />
      </g>
      {/* beard */}
      <path
        d="M34 62 Q36 100 60 104 Q84 100 86 62 Q60 74 34 62 Z"
        fill="#fbf7ef"
        stroke="#e5ddd0"
        strokeWidth="1"
      />
      {/* Langfuse head */}
      <circle
        cx="60"
        cy="56"
        r="25"
        fill="#fbf7ef"
        stroke="#e5ddd0"
        strokeWidth="1"
      />
      <image href="/langfuse-icon.svg" x="38" y="34" width="44" height="44" />
      {/* hat */}
      <path d="M34 40 Q48 4 92 14 Q78 22 86 40 Z" fill="#b3262e" />
      <circle cx="94" cy="16" r="7" fill="#fbf7ef" />
      <rect x="31" y="34" width="58" height="10" rx="5" fill="#fbf7ef" />
    </svg>
  );
}

type SnowmanProps = {
  balls: number;
  crumbling: boolean;
  className?: string;
};

export const Snowman = forwardRef<HTMLDivElement, SnowmanProps>(
  function Snowman({ balls, crumbling, className }, ref) {
    const label = crumbling
      ? "Oops!"
      : balls === 0
        ? "Hit me with a snowball"
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
                d="M42 84 L18 70 M24 74 L16 78 M78 84 L102 70 M96 74 L104 78"
                stroke="#6b4a2b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
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
              <circle
                cx="60"
                cy="52"
                r="15"
                fill="#fff"
                stroke="#c9d4e2"
                strokeWidth="1.5"
              />
              <circle cx="55" cy="49" r="1.8" fill="#1d1d1b" />
              <circle cx="65" cy="49" r="1.8" fill="#1d1d1b" />
              <path d="M60 53 L74 56 L60 57 Z" fill="#f08a24" />
              <path
                d="M54 59 Q60 63 66 59"
                stroke="#1d1d1b"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M44 66 Q60 74 76 66 L76 71 Q60 79 44 71 Z"
                fill="#b3262e"
              />
              <rect x="66" y="68" width="7" height="16" rx="2" fill="#b3262e" />
              <rect x="46" y="36" width="28" height="4" rx="2" fill="#1d1d1b" />
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
          ) : null}
        </svg>
        <span className="text-center text-[10px] leading-tight text-text-tertiary sm:text-[11px]">
          {label}
        </span>
      </div>
    );
  },
);
