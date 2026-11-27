import { useId } from "react";
import { AXO, AXO_COLOR, AxoText } from "@/components/home/illustrations/axo";

// visual-security.svg is the card design at 0.910451 of its drawn size: a
// 1 unit line there is S wide here.
const S = 0.910451;
// The file's own tilt: unit axes at -19.96deg and +59.94deg.
const TILT = "0.939942 -0.341333 0.500853 0.865532";

const COLOR = {
  line: AXO_COLOR.hairline,
  outline: AXO_COLOR.outline,
  top: "#fbfbf9",
  left: "var(--surface-bg)",
  front: "var(--surface-1)",
  good: AXO_COLOR.good,
};

// Labels. The design's Geist Mono cut has wider capitals and a plain zero, so
// the kit's font is sized to the design's cap height, widened 4% and tracked
// back to the design's character pitch.
const LABEL = {
  capHeight: 6.3735,
  widen: 1.04,
  pitch: 5.3275,
  /** Centre of the first character, and the two baselines. */
  firstCentre: 16.778,
  baselines: [23.478, 32.478],
};
/** Geist Mono capitals are 0.71 em tall. */
const EM = LABEL.capHeight / 0.71;
const TEXT_SX = (EM * LABEL.widen) / AXO.fontSize;
const TEXT_SY = EM / AXO.fontSize;

const TILE = {
  radius: 2 * S,
  dots: [100.166, 95.014],
  dotY: 23.908,
  dotR: 2 * S,
  /** The ring's line sits inside this radius. */
  ringR: 2.63533,
  ringLine: S / 2,
};

type Tile = {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: [string, string];
  /** Side faces, drawn by hand in screen space. */
  left: string;
  front: string;
};

const iso: Tile = {
  x: 211.495,
  y: 85.0547,
  w: 108.786,
  h: 61.9854,
  lines: ["ISO", "27001"],
  left: "M211.37 103.407V86.3145L241.595 138.396L241.595 157.031C229.874 136.823 223.091 123.615 211.37 103.407Z",
  front: "M342.95 119.29V100.988L241.612 138.248V157.006L342.95 119.29Z",
};
const gdpr: Tile = {
  x: 139.643,
  y: 175.137,
  w: 109.461,
  h: 61.8033,
  lines: ["GDPR", "compliant"],
  left: "M140.463 193.354V176.262L170.689 228.344L170.689 246.978C158.968 226.77 152.185 213.562 140.463 193.354Z",
  front:
    "M272.044 210.238V190.936L170.705 228.195V245.794C170.705 246.84 171.749 247.564 172.729 247.2L272.044 210.238Z",
};
const soc: Tile = {
  x: 109.377,
  y: 122.174,
  w: 109.474,
  h: 61.9854,
  lines: ["SOC 2", "TYPE II"],
  left: "M110.127 140.291V123.199L140.353 175.281L140.353 193.916C128.632 173.708 121.849 160.499 110.127 140.291Z",
  front: "M241.716 156.175V137.873L140.377 175.133V193.89L241.716 156.175Z",
};
const hipaa: Tile = {
  x: 241.76,
  y: 138.023,
  w: 108.938,
  h: 61.144,
  lines: ["HIPAA", "eligible"],
  left: "M242.338 155.805V138.713L272.564 190.795L272.564 209.43C260.843 189.222 254.06 176.013 242.338 155.805Z",
  front: "M373.913 172.452V153.098L272.018 190.484V210.256L373.913 172.452Z",
};

const OUTLINE =
  "M110.144 139.715L109.933 123.618C109.923 122.845 110.403 122.149 111.13 121.884L311.546 48.7107C312.375 48.408 313.302 48.7435 313.745 49.5067L373.714 152.769C373.876 153.047 373.961 153.362 373.961 153.683V171.172C373.961 171.933 373.487 172.614 372.773 172.879L172.492 247.179C171.654 247.49 170.715 247.146 170.274 246.369L110.381 140.588C110.23 140.321 110.148 140.021 110.144 139.715Z";

// Ground lines are full strength at (cx, cy) and gone r away from it.
const GROUND = [
  {
    d: "M173.836 37.2242L310.797 278.113",
    cx: 260.367,
    cy: 183.865,
    r: 164.06,
  },
  {
    d: "M275.836 0.224144L395.105 209.905",
    cx: 351.498,
    cy: 127.69,
    r: 142.82,
  },
  { d: "M81.8902 90.402L181.105 264.906", cx: 145.232, cy: 196.256, r: 118.85 },
  {
    d: "M0.158569 180.902L339.65 54.7013",
    cx: 141.171,
    cy: 128.424,
    r: 142.37,
  },
  { d: "M36.0859 232.192L375.578 105.991", cx: 177.1, cy: 179.714, r: 142.37 },
  { d: "M126.086 264.21L465.578 138.009", cx: 267.1, cy: 211.731, r: 142.37 },
];

function Sides({ tile }: { tile: Tile }) {
  return (
    <g stroke={COLOR.line} strokeWidth={S} strokeLinejoin="round">
      <path d={tile.left} fill={COLOR.left} />
      <path d={tile.front} fill={COLOR.front} />
    </g>
  );
}

function Top({ tile }: { tile: Tile }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const { w, h } = tile;
  const plane = `matrix(${TILT} ${tile.x} ${tile.y})`;
  return (
    <>
      <clipPath id={`${id}-clip`}>
        <rect width={w} height={h} rx={TILE.radius} transform={plane} />
      </clipPath>
      <g clipPath={`url(#${id}-clip)`}>
        <g transform={plane}>
          <rect width={w} height={h} rx={TILE.radius} fill={COLOR.top} />
          <g
            transform={`scale(${TEXT_SX} ${TEXT_SY})`}
            style={{
              letterSpacing: LABEL.pitch / TEXT_SX - AXO.charWidth,
              fontFeatureSettings: '"ss09"',
            }}
          >
            {tile.lines.map((line, i) => (
              <AxoText
                key={line}
                x={LABEL.firstCentre / TEXT_SX - AXO.charWidth / 2}
                y={LABEL.baselines[i] / TEXT_SY}
                tone="strong"
              >
                {line}
              </AxoText>
            ))}
          </g>
          {TILE.dots.map((x) => (
            <circle
              key={x}
              cx={x}
              cy={TILE.dotY}
              r={TILE.dotR}
              fill={COLOR.good}
            />
          ))}
          {[...TILE.dots].reverse().map((x) => (
            <circle
              key={x}
              cx={x}
              cy={TILE.dotY}
              r={TILE.ringR - TILE.ringLine / 2}
              stroke={COLOR.line}
              strokeWidth={TILE.ringLine}
            />
          ))}
        </g>
      </g>
      <rect
        x={S / 2}
        y={S / 2}
        width={w - S}
        height={h - S}
        rx={TILE.radius - S / 2}
        transform={plane}
        stroke={COLOR.line}
        strokeWidth={S}
      />
    </>
  );
}

export function SecurityRedraw() {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <svg width={406} height={266} viewBox="0 0 406 266" fill="none">
      <defs>
        {GROUND.map((line, i) => (
          <radialGradient
            key={line.d}
            id={`${id}-fade${i}`}
            gradientUnits="userSpaceOnUse"
            cx={line.cx}
            cy={line.cy}
            r={line.r}
          >
            <stop stopColor={COLOR.line} />
            <stop offset={1} stopColor={COLOR.line} stopOpacity={0} />
          </radialGradient>
        ))}
      </defs>
      {GROUND.map((line, i) => (
        <path
          key={line.d}
          d={line.d}
          stroke={`url(#${id}-fade${i})`}
          strokeWidth={S}
        />
      ))}
      <Sides tile={iso} />
      <Top tile={iso} />
      <Sides tile={hipaa} />
      <Sides tile={soc} />
      <Sides tile={gdpr} />
      <Top tile={gdpr} />
      <Top tile={soc} />
      <Top tile={hipaa} />
      <path d={OUTLINE} stroke={COLOR.outline} strokeWidth={S} />
    </svg>
  );
}
