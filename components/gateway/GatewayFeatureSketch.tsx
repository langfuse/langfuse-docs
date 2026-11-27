import { Fragment, useId, type ReactNode } from "react";
import { Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import styles from "./Gateway.module.css";
import type { FeatureSketch as FeatureSketchData, SketchTone } from "./content";

// The homepage drawings are set in the regular weight; the site otherwise loads Medium only.
const regularMono = Geist_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// Projection of the homepage card drawings: plane x runs 20° up-right, plane y
// 60° down-right, neither squashed. Plane units are shown at SCALE.
const EX = { x: 0.94, y: -0.342 };
const EY = { x: 0.5, y: 0.866 };
const PLANE = `matrix(${EX.x} ${EX.y} ${EY.x} ${EY.y} 0 0)`;
const sx = (x: number, y: number) => EX.x * x + EY.x * y;
const sy = (x: number, y: number, z = 0) => EX.y * x + EY.y * y - z;
const P = (x: number, y: number, z = 0) =>
  `${sx(x, y).toFixed(2)},${sy(x, y, z).toFixed(2)}`;

// Positions sit on the 36-unit floor grid or its half.
const SCALE = 0.6;
const RAISE = 16;
const FS = 19.5;
const PADL = 17;
const PADR = 14;
const BPAD = 20;
const BLOCK_H = 54;
const ROW_H = 36;
const PITCH = 54;
const IND = 54;
const TX = 18;
const FIRST_ROW = 72;

const C = {
  line: "var(--line-structure)",
  cta: "var(--line-cta)",
  ink: "var(--text-secondary)",
  dark: "var(--text-primary)",
  mid: "var(--text-tertiary)",
  dim: "var(--text-disabled)",
  floor: "var(--surface-bg)",
  side: "var(--surface-1)",
  top: "hsl(var(--card))",
  warn: "var(--text-code-orange)",
};

type Tone = SketchTone | "none";
const TONE: Record<Tone, string> = {
  ok: "var(--color-green-600)",
  warn: C.warn,
  error: "var(--text-code-pink)",
  none: C.dim,
};

type Seg =
  | { t: string; fill?: string }
  | { dot: Tone; end?: boolean }
  | { toggle: boolean; hero?: boolean }
  | { sp: number };

type BoxOptions = {
  fs?: number;
  opacity?: number;
  w?: number;
  h?: number;
  center?: boolean;
  solid?: boolean;
};

type View = { px?: number; rx?: number; ry?: number };

/** One line of content on the plane, packed from the left. */
function inner(x: number, yc: number, segs: Seg[], fs = FS) {
  const adv = fs * 0.6;
  const by = (yc + fs * 0.34).toFixed(1);
  const nodes: ReactNode[] = [];
  let cx = x;
  segs.forEach((seg, i) => {
    if ("t" in seg) {
      nodes.push(
        <text
          key={i}
          x={cx.toFixed(1)}
          y={by}
          fontSize={fs}
          fill={seg.fill || C.dim}
        >
          {seg.t}
        </text>,
      );
      cx += seg.t.length * adv;
    } else if ("dot" in seg) {
      nodes.push(
        <Fragment key={i}>
          <circle
            cx={cx + 16}
            cy={yc}
            r={6.5}
            fill={TONE[seg.dot]}
            opacity={0.16}
          />
          <circle cx={cx + 16} cy={yc} r={4} fill={TONE[seg.dot]} />
        </Fragment>,
      );
      cx += seg.end ? 20 : 31;
    } else if ("toggle" in seg) {
      nodes.push(
        seg.toggle ? (
          <Fragment key={i}>
            <rect
              x={cx}
              y={yc - 9}
              width={34}
              height={18}
              rx={9}
              fill={seg.hero ? C.dark : C.mid}
            />
            <circle cx={cx + 25} cy={yc} r={5.5} fill={C.floor} />
          </Fragment>
        ) : (
          <Fragment key={i}>
            <rect
              x={cx}
              y={yc - 9}
              width={34}
              height={18}
              rx={9}
              fill="none"
              stroke={C.line}
              strokeWidth={1.5}
            />
            <circle cx={cx + 9} cy={yc} r={4.5} fill={C.dim} />
          </Fragment>
        ),
      );
      cx += 34;
    } else {
      cx += seg.sp * adv;
    }
  });
  return { nodes, w: cx - x };
}

/** Closed path through screen points with the corners rounded off by r. */
function rounded(pts: number[][], r: number) {
  const n = pts.length;
  const f = (v: number) => v.toFixed(2);
  return (
    pts
      .map(([px, py], i) => {
        const [ax, ay] = pts[(i + n - 1) % n];
        const [bx, by] = pts[(i + 1) % n];
        const la = Math.hypot(ax - px, ay - py);
        const lb = Math.hypot(bx - px, by - py);
        return `${i ? "L" : "M"}${f(px + ((ax - px) * r) / la)} ${f(py + ((ay - py) * r) / la)}Q${f(px)} ${f(py)} ${f(px + ((bx - px) * r) / lb)} ${f(py + ((by - py) * r) / lb)}`;
      })
      .join("") + "Z"
  );
}

const faded = (o: BoxOptions, node: ReactNode) =>
  o.opacity !== undefined ? <g opacity={o.opacity}>{node}</g> : node;

/** Collects one drawing in layers: floor shadows, the plane, squares on top of it, raised parts. */
class Scene {
  readonly defs: ReactNode[] = [];
  readonly under: ReactNode[] = [];
  readonly plane: ReactNode[] = [];
  readonly nodes: ReactNode[] = [];
  readonly over: ReactNode[] = [];
  /** Screen-space box of the content; the view is centred on it. */
  readonly box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };

  constructor(readonly id: string) {}

  add(layer: ReactNode[], node: ReactNode) {
    layer.push(<Fragment key={layer.length}>{node}</Fragment>);
  }

  mark(x: number, y: number, z = 0) {
    const X = sx(x, y);
    const Y = sy(x, y, z);
    this.box.x0 = Math.min(this.box.x0, X);
    this.box.y0 = Math.min(this.box.y0, Y);
    this.box.x1 = Math.max(this.box.x1, X);
    this.box.y1 = Math.max(this.box.y1, Y);
  }

  /** Loose content on the floor. */
  put(x: number, yc: number, segs: Seg[], o: BoxOptions = {}) {
    const r = inner(x, yc, segs, o.fs);
    const half = (o.fs || FS) / 2;
    this.add(this.plane, faded(o, r.nodes));
    this.mark(x, yc - half);
    this.mark(x + r.w, yc - half);
    this.mark(x, yc + half);
    this.mark(x + r.w, yc + half);
    return r.w;
  }

  /** Outlined row that hugs its content unless o.w is set. */
  row(x: number, y: number, segs: Seg[], o: BoxOptions = {}) {
    const h = o.h || ROW_H;
    const cw = inner(0, 0, segs, o.fs).w;
    const w = o.w || PADL + cw + PADR;
    this.add(
      this.plane,
      faded(
        o,
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={1}
          fill={C.floor}
          fillOpacity={o.solid ? 1 : 0.6}
          stroke={C.line}
        />,
      ),
    );
    this.put(o.center ? x + (w - cw) / 2 : x + PADL, y + h / 2, segs, o);
    this.mark(x, y);
    this.mark(x + w, y);
    this.mark(x, y + h);
    this.mark(x + w, y + h);
    return w;
  }

  /** Raised button: dark stroke on the silhouette only, faint inner edges, a soft shadow straight below. */
  block(x: number, y: number, segs: Seg[], o: BoxOptions = {}) {
    const h = o.h || BLOCK_H;
    const cw = inner(0, 0, segs, o.fs).w;
    const w = o.w || cw + 2 * BPAD;
    const x1 = x + w;
    const y1 = y + h;
    const R = RAISE;
    const r = inner(
      o.center ? x + (w - cw) / 2 : x + BPAD,
      y + h / 2,
      segs,
      o.fs,
    );
    const sil = [
      P(x, y, R),
      P(x1, y, R),
      P(x1, y1, R),
      P(x1, y1),
      P(x, y1),
      P(x, y),
    ].join(" ");
    const sides = [
      P(x, y, R),
      P(x, y1, R),
      P(x1, y1, R),
      P(x1, y1),
      P(x, y1),
      P(x, y),
    ].join(" ");
    this.add(
      this.under,
      <polygon
        points={sil}
        transform="translate(0 8)"
        filter={`url(#${this.id}b)`}
        className="fill-black opacity-[0.08] dark:opacity-[0.28]"
      />,
    );
    this.add(
      this.over,
      <>
        <polygon points={sil} fill={C.top} />
        <polygon points={sides} fill={C.floor} fillOpacity={0.5} />
        <path
          d={`M${P(x, y, R)}L${P(x, y1, R)}L${P(x1, y1, R)}M${P(x, y1, R)}L${P(x, y1)}`}
          fill="none"
          stroke={C.line}
          strokeOpacity={0.75}
        />
        <polygon
          points={sil}
          fill="none"
          stroke={C.cta}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        <g transform={`translate(0 ${-R}) ${PLANE}`}>{r.nodes}</g>
      </>,
    );
    this.mark(x, y, R);
    this.mark(x1, y, R);
    this.mark(x1, y1);
    this.mark(x, y1);
    this.mark(x, y);
    return w;
  }

  /** One raised slab split into equal cells along x: a two-line label and two status dots per cell. */
  slab(
    x: number,
    y: number,
    cells: string[][],
    cw: number,
    ch: number,
    R = 36,
  ) {
    const x1 = x + cw * cells.length;
    const y1 = y + ch;
    const by = y + ch * 0.36;
    const hair = { fill: "none", stroke: C.line, strokeWidth: 1.5 };
    const sil = rounded(
      [
        [x, y, R],
        [x1, y, R],
        [x1, y1, R],
        [x1, y1, 0],
        [x, y1, 0],
        [x, y, 0],
      ].map(([a, b, z]) => [sx(a, b), sy(a, b, z)]),
      4,
    );
    let seams = "";
    const top = cells.map((lines, i) => {
      const cx = x + i * cw;
      if (i) seams += `M${P(cx, y1, R)}L${P(cx, y1)}`;
      return (
        <Fragment key={i}>
          {i > 0 && <path d={`M${cx} ${y}V${y1}`} {...hair} />}
          {[27.8, 17.5].map((d) => (
            <Fragment key={d}>
              <circle
                cx={cx + cw - d}
                cy={by + 2}
                r={4.8}
                fill="none"
                stroke={C.line}
                strokeWidth={0.9}
              />
              <circle cx={cx + cw - d} cy={by + 2} r={3.6} fill={TONE.ok} />
            </Fragment>
          ))}
          {lines.map((t, j) => (
            <text
              key={j}
              x={cx + 28}
              y={by + j * 21}
              fontSize={18}
              fill={C.ink}
            >
              {t}
            </text>
          ))}
        </Fragment>
      );
    });
    this.add(
      this.defs,
      <clipPath id={`${this.id}c`}>
        <path d={sil} />
      </clipPath>,
    );
    this.add(
      this.over,
      <>
        <g clipPath={`url(#${this.id}c)`}>
          <polygon
            points={[P(x, y, R), P(x, y1, R), P(x, y1), P(x, y)].join(" ")}
            fill={C.floor}
          />
          <polygon
            points={[P(x, y1, R), P(x1, y1, R), P(x1, y1), P(x, y1)].join(" ")}
            fill={C.side}
          />
          <g transform={`translate(0 ${-R}) ${PLANE}`}>
            <rect x={x} y={y} width={x1 - x} height={ch} fill={C.floor} />
            <rect
              x={x}
              y={y}
              width={x1 - x}
              height={ch}
              fill={C.top}
              fillOpacity={0.55}
            />
            {top}
            <path d={`M${x} ${y}V${y1}H${x1}`} {...hair} />
          </g>
          <path d={`M${P(x, y1, R)}L${P(x, y1)}${seams}`} {...hair} />
        </g>
        <path d={sil} fill="none" stroke={C.cta} strokeWidth={1.5} />
      </>,
    );
    this.mark(x, y, R);
    this.mark(x1, y, R);
    this.mark(x1, y1);
    this.mark(x, y1);
    this.mark(x, y);
  }

  /** Long floor line that fades out at both ends. */
  rule(x0: number, y0: number, x1: number, y1: number) {
    const id = `${this.id}l${this.defs.length}`;
    this.add(
      this.defs,
      <linearGradient
        id={id}
        gradientUnits="userSpaceOnUse"
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y1}
      >
        <stop offset="0" stopColor={C.line} stopOpacity="0" />
        <stop offset="0.35" stopColor={C.line} />
        <stop offset="0.65" stopColor={C.line} />
        <stop offset="1" stopColor={C.line} stopOpacity="0" />
      </linearGradient>,
    );
    this.add(
      this.plane,
      <path
        d={`M${x0} ${y0}L${x1} ${y1}`}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={1.5}
      />,
    );
  }

  line(d: string, stroke = C.line, dash?: string) {
    this.add(
      this.plane,
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeDasharray={dash}
      />,
    );
  }

  /** Small square where a line meets a box, drawn over the box edge. */
  node(x: number, y: number, fill = C.line) {
    this.add(
      this.nodes,
      <rect x={x - 3} y={y - 3} width={6} height={6} fill={fill} />,
    );
  }

  /** Branch off a trunk: grey at the trunk, the tone at the square. */
  branch(x0: number, y: number, x1: number, tone: Tone = "none") {
    let stroke = C.line;
    if (tone !== "none") {
      const id = `${this.id}l${this.defs.length}`;
      stroke = `url(#${id})`;
      this.add(
        this.defs,
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1={x0}
          y1="0"
          x2={x1}
          y2="0"
        >
          <stop offset="0" stopColor={C.line} />
          <stop offset="0.8" stopColor={TONE[tone]} />
        </linearGradient>,
      );
    }
    this.add(
      this.plane,
      <path
        d={`M${x0} ${y}H${x1}`}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
      />,
    );
    this.node(x1, y, tone === "none" ? C.line : TONE[tone]);
  }

  /** Callout box with bracket corners. */
  bracket(x: number, y: number, w: number, h: number) {
    const l = 9;
    const a = x - 3;
    const b = y - 3;
    const c = x + w + 3;
    const d = y + h + 3;
    this.add(
      this.plane,
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={C.floor}
          fillOpacity={0.6}
          stroke={C.line}
        />
        <path
          d={`M${a} ${b + l}V${b}H${a + l}M${c - l} ${b}H${c}V${b + l}M${c} ${d - l}V${d}H${c - l}M${a + l} ${d}H${a}V${d - l}`}
          fill="none"
          stroke={C.cta}
          strokeWidth={2}
        />
      </>,
    );
    this.mark(a, b);
    this.mark(c, b);
    this.mark(a, d);
    this.mark(c, d);
  }

  /** Dark two-line tag on the plane, hanging off a cursor line through a point at (x, ny). */
  tag(x: number, y0: number, y1: number, ny: number, lines: string[]) {
    const fs = 16.5;
    const lh = 20;
    const th = lines.length * lh + 8;
    const longest = Math.max(...lines.map((l) => l.length));
    const tw = Math.ceil((longest * fs * 0.6 + 20) / 18) * 18;
    this.add(
      this.plane,
      <>
        <path
          d={`M${x} ${y0}V${y1}`}
          fill="none"
          stroke={C.cta}
          strokeWidth={1.5}
        />
        <circle
          cx={x}
          cy={ny}
          r={4.5}
          fill={C.floor}
          stroke={C.cta}
          strokeWidth={1.5}
        />
        <rect x={x} y={y0} width={tw} height={th} fill={C.dark} />
        {lines.map((l, i) => (
          <text
            key={i}
            x={x + 10}
            y={y0 + lh * (i + 1) - 1}
            fontSize={fs}
            fill={i ? C.floor : C.dim}
          >
            {l}
          </text>
        ))}
      </>,
    );
    this.mark(x, y0);
    this.mark(x + tw, y0);
    this.mark(x + tw, y0 + th);
  }
}

type Draw<K extends FeatureSketchData["kind"]> = (
  s: Scene,
  d: Extract<FeatureSketchData, { kind: K }>,
) => View;

/** Button on top, the rows hanging off one trunk, a fainter parent behind. */
const drawKeys: Draw<"keys"> = (s, d) => {
  const y = (i: number) => FIRST_ROW + i * PITCH;
  s.row(0, -90, [{ t: d.group }], {
    w: 180,
    h: BLOCK_H,
    center: true,
    opacity: 0.7,
  });
  s.line(`M${TX} -36V0`);
  s.node(TX, -36);
  s.line(`M${TX} ${BLOCK_H}V${y(d.rows.length - 1) + 18}`);
  d.rows.forEach((r, i) => {
    const tone = r.tone || "none";
    s.branch(TX, y(i) + 18, IND, tone);
    s.row(IND, y(i), [
      { t: r.label },
      { dot: tone },
      { t: r.value, fill: C.ink },
    ]);
  });
  s.block(0, 0, [{ t: d.heading, fill: C.ink }], { w: 180, center: true });
  return {};
};

/** Budget button, a hatched meter with the two warning marks, then the warning row. */
const drawBudget: Draw<"budget"> = (s, d) => {
  const my = FIRST_ROW;
  const mw = 234;
  const at = (percent: number) => IND + mw * (percent / 100);
  const wy = my + PITCH;
  const [first, second] = d.warnAtPercent;
  s.line(`M${TX} ${BLOCK_H}V${wy + 18}`);
  s.branch(TX, my + 18, IND);
  s.add(
    s.plane,
    <>
      <rect
        x={IND}
        y={my}
        width={mw}
        height={ROW_H}
        rx={1}
        fill={C.floor}
        fillOpacity={0.6}
        stroke={C.line}
      />
      <rect
        x={IND}
        y={my}
        width={mw * (d.usedPercent / 100)}
        height={ROW_H}
        fill={`url(#${s.id}h)`}
      />
    </>,
  );
  s.line(
    `M${at(first)} ${my - 6}V${my + ROW_H + 6}M${at(second)} ${my - 6}V${my + ROW_H + 6}`,
    C.warn,
  );
  s.mark(IND + mw, my);
  s.mark(IND + mw, my + ROW_H);
  s.branch(TX, wy + 18, IND, "warn");
  s.row(IND, wy, [
    { t: d.warning },
    { dot: "warn" },
    { t: `at ${first}%`, fill: C.ink },
  ]);
  s.block(
    0,
    0,
    [
      { t: d.label, fill: C.ink },
      { sp: 1.5 },
      { t: `${d.usedPercent}%`, fill: C.warn },
    ],
    { w: 180 },
  );
  return {};
};

/** Chart lying on the floor: hatch under the line, dashed guides, the total in a dark tag. It eases off away from the tagged point. */
const drawSpend: Draw<"spend"> = (s, d) => {
  const W = 324;
  const D = 144;
  const px = (i: number) => +((i * W) / (d.points.length - 1)).toFixed(1);
  const py = (v: number) => +(D - v * 1.25).toFixed(1);
  const pts = d.points.map((v, i) => `${px(i)} ${py(v)}`).join("L");
  const hx = px(d.highlight);
  const hy = py(d.points[d.highlight]);
  s.add(
    s.defs,
    <>
      <radialGradient
        id={`${s.id}cf`}
        gradientUnits="userSpaceOnUse"
        cx={hx}
        cy={hy}
        r="300"
      >
        <stop offset="0.3" stopColor="#fff" />
        <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
      </radialGradient>
      <mask
        id={`${s.id}cm`}
        maskUnits="userSpaceOnUse"
        x="-60"
        y="-120"
        width={W + 120}
        height={D + 240}
      >
        <rect
          x="-60"
          y="-120"
          width={W + 120}
          height={D + 240}
          fill={`url(#${s.id}cf)`}
        />
      </mask>
    </>,
  );
  s.add(
    s.plane,
    <g mask={`url(#${s.id}cm)`}>
      <path d={`M0 ${D}L${pts}L${W} ${D}Z`} fill={`url(#${s.id}h)`} />
      <path
        d={`M0 36H${W}M0 108H${W}`}
        fill="none"
        stroke={C.line}
        strokeWidth="1"
        strokeDasharray="7 6"
      />
      <path
        d={`M0 0H${W}M0 72H${W}`}
        fill="none"
        stroke={C.line}
        strokeWidth="1"
      />
      <path d={`M0 ${D}H${W}`} fill="none" stroke={C.dim} strokeWidth="1.2" />
      <path
        d={`M${pts}`}
        fill="none"
        stroke={C.cta}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </g>,
  );
  s.tag(hx, -62, D, hy, d.tag);
  s.mark(0, 0);
  s.mark(W, 0);
  s.mark(0, D);
  s.mark(W, D);
  return {};
};

/** List of model switches; the first one is the button. */
const drawModels: Draw<"models"> = (s, d) => {
  const segs = (r: { label: string; on: boolean }, hero = false): Seg[] => [
    { t: r.label, fill: hero ? C.ink : C.mid },
    { sp: 1.4 },
    { toggle: r.on, hero },
  ];
  d.rows
    .slice(1)
    .forEach((r, i) =>
      s.row(0, FIRST_ROW + i * PITCH, segs(r), i ? { opacity: 0.7 } : {}),
    );
  s.block(0, 0, segs(d.rows[0], true), { w: 180 });
  return { rx: 420 };
};

/** The agents wired into one bracketed result. */
const drawAgents: Draw<"agents"> = (s, d) => {
  const W = 180;
  const jx = 198;
  const bx = 234;
  const m = [27, 90, 144];
  const res: Seg[] = [
    { t: d.result, fill: C.ink },
    { dot: "ok", end: true },
  ];
  s.line(`M${W} ${m[2]}H${jx}V${m[1]}M${W} ${m[1]}H${jx}`);
  s.node(W, m[1]);
  s.node(W, m[2]);
  s.line(`M${W} ${m[0]}H${jx}V${m[1]}H${bx}`, C.cta);
  s.bracket(bx, FIRST_ROW, PADL + inner(0, 0, res).w + 10, ROW_H);
  s.node(bx, m[1], C.cta);
  s.put(bx + PADL, m[1], res);
  s.row(0, FIRST_ROW, [{ t: d.agents[1], fill: C.mid }], {
    w: W,
    center: true,
  });
  s.row(0, FIRST_ROW + PITCH, [{ t: d.agents[2], fill: C.mid }], {
    w: W,
    center: true,
    opacity: 0.7,
  });
  s.block(0, 0, [{ t: d.agents[0], fill: C.ink }], { w: W, center: true });
  return { rx: 420 };
};

/** Spans stepping along a dashed time axis, fading with distance. */
const drawTracing: Draw<"tracing"> = (s, d) => {
  const segs = (i: number, fill: string): Seg[] => [
    { t: d.spans[i].label, fill },
    { sp: 1 },
    { t: d.spans[i].cost, fill: C.warn },
  ];
  [0, 108, 216, 324].forEach((x, i) => {
    s.line(`M${x} -36V198`, C.line, "5 5");
    s.put(x + 6, -46, [{ t: `${i}s` }], { fs: 15 });
  });
  s.row(72, FIRST_ROW, segs(1, C.mid), { solid: true });
  s.row(180, FIRST_ROW + PITCH, segs(2, C.mid), { solid: true, opacity: 0.6 });
  s.block(0, 0, segs(0, C.ink), { w: 252 });
  return { rx: 420 };
};

/** One slab with an equal cell per option; its edges and seams run on across the floor. */
const drawHosting: Draw<"hosting"> = (s, d) => {
  const cw = 216;
  const ch = 108;
  const W = cw * d.options.length;
  d.options.forEach((_, i) => s.rule(i * cw, -190, i * cw, ch + 190));
  s.rule(W, -190, W, ch + 190);
  [0, ch].forEach((y) => s.rule(-200, y, W + 200, y));
  s.slab(
    0,
    0,
    d.options.map((o) => [o.label, o.detail]),
    cw,
    ch,
  );
  return { rx: 420 };
};

function draw(s: Scene, sketch: FeatureSketchData): View {
  switch (sketch.kind) {
    case "keys":
      return drawKeys(s, sketch);
    case "budget":
      return drawBudget(s, sketch);
    case "spend":
      return drawSpend(s, sketch);
    case "models":
      return drawModels(s, sketch);
    case "agents":
      return drawAgents(s, sketch);
    case "tracing":
      return drawTracing(s, sketch);
    case "hosting":
      return drawHosting(s, sketch);
  }
}

// Providers per row under the gateway button.
const PROVIDER_ROWS = [3, 2, 2, 2];

/** Gateway button with the providers hanging off its trunk, wrapped into rows. */
function drawProviders(s: Scene, hub: string, providers: string[]): View {
  s.line(
    `M${TX} ${BLOCK_H}V${FIRST_ROW + (PROVIDER_ROWS.length - 1) * PITCH + 18}`,
  );
  let next = 0;
  PROVIDER_ROWS.forEach((count, i) => {
    const y = FIRST_ROW + i * PITCH;
    let x = IND;
    s.branch(TX, y + 18, x);
    providers.slice(next, next + count).forEach((name, j) => {
      if (j) s.line(`M${x - 18} ${y + 18}H${x}`);
      x += s.row(x, y, [{ t: name, fill: C.mid }]) + 18;
    });
    next += count;
  });
  s.block(0, 0, [{ t: hub, fill: C.ink }], { w: 180, center: true });
  return { px: 280, rx: 440, ry: 300 };
}

const DEFAULT_PX = 232;

/** The view is centred on the content at SCALE, and shrinks only when the card is narrower than the drawing. */
function Drawing({ scene: s, view }: { scene: Scene; view: View }) {
  const id = s.id;
  const H = (view.px || DEFAULT_PX) / SCALE;
  const { x0, y0, x1, y1 } = s.box;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  const W = x1 - x0 + 40;
  const rx = view.rx || 300;
  const ry = view.ry || 250;
  return (
    <svg
      viewBox={`${(cx - W / 2).toFixed(1)} ${(cy - H / 2).toFixed(1)} ${W.toFixed(1)} ${H.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={`${id}grid`}
          width="36"
          height="36"
          patternUnits="userSpaceOnUse"
        >
          <path d="M36 0H0V36" fill="none" stroke={C.line} />
        </pattern>
        <pattern
          id={`${id}h`}
          width="3.6"
          height="3.6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path
            d="M0.5 0V3.6"
            stroke={C.dim}
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
        </pattern>
        <radialGradient
          id={`${id}f`}
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={cy}
          r={rx}
          gradientTransform={`translate(${cx} ${cy}) scale(1 ${(ry / rx).toFixed(3)}) translate(${-cx} ${-cy})`}
        >
          <stop offset="0.66" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask
          id={`${id}m`}
          maskUnits="userSpaceOnUse"
          x={cx - 900}
          y={cy - 700}
          width="1800"
          height="1400"
        >
          <rect
            x={cx - 900}
            y={cy - 700}
            width="1800"
            height="1400"
            fill={`url(#${id}f)`}
          />
        </mask>
        <filter id={`${id}b`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {s.defs}
      </defs>
      <g mask={`url(#${id}m)`}>
        <g transform={PLANE}>
          <rect
            x="-1500"
            y="-1500"
            width="3200"
            height="3200"
            fill={`url(#${id}grid)`}
          />
        </g>
      </g>
      {s.under}
      <g transform={PLANE}>
        {s.plane}
        {s.nodes}
      </g>
      {s.over}
    </svg>
  );
}

const useSceneId = () => useId().replace(/[^a-zA-Z0-9_-]/g, "");

export function FeatureSketch({
  sketch,
  className,
}: {
  sketch: FeatureSketchData;
  className?: string;
}) {
  const scene = new Scene(useSceneId());
  const view = draw(scene, sketch);
  return (
    <div
      className={cn(styles.sketch, regularMono.className, className)}
      style={{ height: view.px || DEFAULT_PX }}
      aria-hidden
    >
      <Drawing scene={scene} view={view} />
    </div>
  );
}

export function ProviderSketch({
  hub,
  providers,
  className,
}: {
  hub: string;
  providers: string[];
  className?: string;
}) {
  const scene = new Scene(useSceneId());
  const view = drawProviders(scene, hub, providers);
  return (
    <div
      className={cn(styles.wideSketch, regularMono.className, className)}
      style={{ height: view.px }}
      aria-hidden
    >
      <Drawing scene={scene} view={view} />
    </div>
  );
}
