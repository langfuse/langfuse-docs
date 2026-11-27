import localFont from "next/font/local";
import type { ReactNode } from "react";
import {
  AXO,
  AXO_COLOR,
  AxoChip,
  AxoGrid,
  AxoPlane,
  planeMatrix,
  project,
} from "@/components/home/illustrations/axo";

const labelFont = localFont({
  src: "../../../../public/fonts/GeistMono-Regular.woff2",
  weight: "400",
  display: "block",
});

const O = { x: 0.25, y: 0.25 };
// This export sits at 2/3 scale; the kit bakes in 3/4.
const K = 8 / 9;
const PANEL = "#f4f4f1";

// Tilted backing panel; the grid is clipped to it.
const A = { x: -114.59, y: 90.81, w: 345.62, h: 240 };

// Glyphs are larger than their advance: tracking is about -4%.
const TEXT = { size: 12.1, advance: 6.773 };
const LABEL = { size: 9.68, advance: 5.415 };

function Txt({
  x,
  y,
  font = TEXT,
  fill = AXO_COLOR.subtle,
  children,
}: {
  x: number;
  y: number;
  font?: { size: number; advance: number };
  fill?: string;
  children: ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      className={labelFont.className}
      fontSize={font.size}
      fill={fill}
      style={{ letterSpacing: font.advance - font.size * 0.6 }}
    >
      {children}
    </text>
  );
}

/** Raised block; `inset` moves the top face's left edge in from the silhouette. */
function Block({
  x,
  y,
  w,
  h,
  raise,
  inset,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  raise: number;
  inset: number;
  children?: ReactNode;
}) {
  const p = (px: number, py: number, z = 0) => project(O, px, py, z);
  const x1 = x + w;
  const y1 = y + h;
  const xi = x + inset;
  const silhouette = [
    p(x, y, raise),
    p(x1, y, raise),
    p(x1, y1, raise),
    p(x1, y1),
    p(x, y1),
    p(x, y),
  ].join(" ");
  return (
    <g>
      <filter id="hu-shadow" x="-30%" y="-60%" width="160%" height="240%">
        <feGaussianBlur stdDeviation={2.9} />
      </filter>
      <polygon
        points={silhouette}
        transform="translate(0.225 3.9)"
        fill="#000"
        opacity={0.087}
        filter="url(#hu-shadow)"
      />
      <polygon points={silhouette} fill={PANEL} />
      <polygon
        points={[
          p(xi, y, raise),
          p(x1, y, raise),
          p(x1, y1, raise),
          p(xi, y1, raise),
        ].join(" ")}
        fill="#fcfcfc"
      />
      <path
        d={`M${p(xi, y, raise)}L${p(xi, y1, raise)}L${p(x1, y1, raise)}M${p(xi, y1, raise)}L${p(xi, y1)}`}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeWidth={0.46}
      />
      <polygon
        points={silhouette}
        fill="none"
        stroke={AXO_COLOR.outline}
        strokeWidth={0.87}
        strokeLinejoin="round"
      />
      <g transform={planeMatrix(O, raise)}>{children}</g>
    </g>
  );
}

// Slider box; the fill stops at `split` and the rest is hatched and see-through.
const S = { x0: -26.055, y0: 256.5, x1: 142, y1: 280.5, split: 105.5 };
// Hatch lines run along constant x + y.
const HATCH = { pitch: 2.75, at: 379.84 };
const TICK = { x: -1.83, pitch: 23.9625, top: 275.85 };

function Slider() {
  const hatch: string[] = [];
  for (let s = HATCH.at - 7 * HATCH.pitch; s < S.x1 + S.y1; s += HATCH.pitch)
    hatch.push(`M${s - S.y1} ${S.y1}L${s - S.y0} ${S.y0}`);
  const ticks = [0, 1, 2, 3, 4, 5].map(
    (i) => `M${TICK.x + i * TICK.pitch} ${TICK.top}V${S.y1}`,
  );
  const half = AXO.hairline / 2;
  return (
    <g>
      <clipPath id="hu-hatch">
        <rect
          x={S.split}
          y={S.y0}
          width={S.x1 - S.split}
          height={S.y1 - S.y0}
        />
      </clipPath>
      <rect
        x={S.x0}
        y={S.y0}
        width={S.split - S.x0}
        height={S.y1 - S.y0}
        fill={PANEL}
      />
      <path
        d={hatch.join("")}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeOpacity={0.62}
        strokeWidth={0.5}
        clipPath="url(#hu-hatch)"
      />
      <path
        d={ticks.join("")}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeWidth={AXO.hairline}
      />
      <rect
        x={S.x0 + half}
        y={S.y0 + half}
        width={S.x1 - S.x0 - 2 * half}
        height={S.y1 - S.y0 - 2 * half}
        fill="none"
        stroke={AXO_COLOR.hairline}
        strokeWidth={AXO.hairline}
      />
      <Txt x={43.64} y={273.13}>
        8/10
      </Txt>
    </g>
  );
}

export function HumanRedraw() {
  return (
    <svg
      width={214}
      height={195}
      viewBox="0 0 214 195"
      style={{ "--surface-beige-accent": "#efede5" } as React.CSSProperties}
    >
      <rect x={16} y={55} width={182} height={140} rx={2} fill={PANEL} />
      <g
        transform={`translate(${O.x} ${O.y}) scale(${K}) translate(${-O.x} ${-O.y})`}
      >
        <AxoPlane origin={O}>
          <clipPath id="hu-panel">
            <rect x={A.x} y={A.y} width={A.w} height={A.h} />
          </clipPath>
          <rect x={A.x} y={A.y} width={A.w} height={A.h} fill={PANEL} />
          <g clipPath="url(#hu-panel)">
            <AxoGrid x={-133.755} y={90.825} cols={16} rows={10} />
          </g>

          <AxoChip x={-26.37} y={138.81} w={168.585} h={24.6}>
            <Txt x={-2.2} y={155.6}>
              technical issue
            </Txt>
            <path
              d="M108.45 149.67L112.05 153.42L115.65 149.67"
              fill="none"
              stroke={AXO_COLOR.subtle}
              strokeWidth={0.94}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </AxoChip>
          <Txt x={-26.06} y={177.86} font={LABEL} fill={AXO_COLOR.muted}>
            Question type
          </Txt>

          <AxoChip x={63.645} y={193.995} w={78.585} h={36.6}>
            <Txt x={85.66} y={216.81}>
              False
            </Txt>
          </AxoChip>
        </AxoPlane>

        <Block
          x={-25.81}
          y={194.256}
          w={79.086}
          h={36.024}
          raise={7.48}
          inset={0.37}
        >
          <Txt x={-0.62} y={216.825} fill={AXO_COLOR.strong}>
            True
          </Txt>
        </Block>

        <AxoPlane origin={O}>
          <Txt x={-26.06} y={245.07} font={LABEL} fill={AXO_COLOR.muted}>
            Is JSON output?
          </Txt>
          <Slider />
          <Txt x={-26.06} y={294.685} font={LABEL} fill={AXO_COLOR.muted}>
            Answer Quality
          </Txt>
        </AxoPlane>
      </g>
    </svg>
  );
}
