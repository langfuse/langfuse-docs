// Abstract line art for the /gateway hero: sheets of lines flow in from the
// left and converge on the Langfuse mark, the way traffic converges on the
// gateway. Ported from the line-art visual in the landing page design.

const XE = 1222;
const END_Y = 496;

type Curve = [number, number][];

/** Monotone-ish cubic Hermite through the control points. */
function curve(points: Curve) {
  const slope = (k: number) => {
    const a = points[Math.max(0, k - 1)];
    const b = points[Math.min(points.length - 1, k + 1)];
    return (b[1] - a[1]) / (b[0] - a[0]);
  };
  return (x: number) => {
    let i = 0;
    while (i < points.length - 2 && x > points[i + 1][0]) i++;
    const a = points[i];
    const b = points[i + 1];
    const w = b[0] - a[0];
    const t = Math.max(0, Math.min(1, (x - a[0]) / w));
    const t2 = t * t;
    const t3 = t2 * t;
    return (
      (2 * t3 - 3 * t2 + 1) * a[1] +
      (t3 - 2 * t2 + t) * w * slope(i) +
      (-2 * t3 + 3 * t2) * b[1] +
      (t3 - t2) * w * slope(i + 1)
    );
  };
}

const UA: Curve = [[0, 322], [60, 316], [200, 345], [330, 385], [430, 350], [560, 356], [700, 292], [820, 192], [940, 152], [1050, 176], [1130, 262], [1190, 400], [XE, 490]]; // prettier-ignore
const LA: Curve = [[0, 425], [150, 430], [300, 468], [480, 492], [600, 470], [720, 432], [850, 455], [940, 402], [1020, 373], [1100, 386], [1170, 432], [XE, 490]]; // prettier-ignore
const UB: Curve = [[0, 430], [150, 434], [300, 470], [480, 494], [600, 472], [720, 434], [840, 460], [950, 520], [1050, 548], [1150, 532], [XE, 494]]; // prettier-ignore
const LB: Curve = [[0, 650], [100, 660], [200, 705], [300, 662], [420, 592], [560, 606], [700, 640], [850, 620], [1000, 590], [1120, 560], [XE, 500]]; // prettier-ignore
const LC: Curve = [[0, 800], [150, 790], [300, 782], [450, 800], [600, 845], [760, 893], [880, 895], [1000, 850], [1100, 740], [1170, 610], [XE, 500]]; // prettier-ignore
const LD: Curve = [[0, 1010], [300, 985], [420, 940], [520, 892], [640, 872], [760, 893], [880, 895], [1000, 850], [1100, 740], [1170, 610], [XE, 500]]; // prettier-ignore
const RED: Curve = [[0, 546], [120, 505], [260, 472], [400, 488], [530, 515], [640, 480], [740, 458], [850, 490], [960, 545], [1060, 566], [1150, 545], [XE, 498]]; // prettier-ignore

const xs: number[] = [];
for (let x = 0; x < XE; x += 12) xs.push(x);
xs.push(XE);

const path = (fn: (x: number) => number) =>
  xs.map((x, j) => `${j ? "L" : "M"}${x} ${fn(x).toFixed(1)}`).join("");

function sheet(upper: Curve, lower: Curve, count: number, phase: number) {
  const u = curve(upper);
  const l = curve(lower);
  const lines = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const edge = i === 0 || i === count - 1;
    return {
      d: path((x) => {
        const k = Math.max(
          0,
          Math.min(
            1,
            t +
              0.07 *
                Math.sin(x * 0.011 + phase + t * 4) *
                Math.sin(Math.PI * t),
          ),
        );
        return u(x) + (l(x) - u(x)) * k;
      }),
      opacity: edge ? 0.38 : 0.3,
      width: edge ? 1.1 : 1,
    };
  });
  const fill =
    path(u) +
    xs
      .slice()
      .reverse()
      .map((x) => `L${x} ${l(x).toFixed(1)}`)
      .join("") +
    "Z";
  return { fill, lines };
}

const sheets = [
  sheet(LC, LD, 34, 2.2),
  sheet(LB, LC, 46, 0.7),
  sheet(UA, LA, 46, 1.4),
  sheet(UB, LB, 56, 3.1),
];
const redLine = path(curve(RED));

const MARK_W = 64;
const VIEW = { x: 0, y: 120, w: XE + 24 + MARK_W, h: 920 };

export function GatewayHeroArt({ className }: { className?: string }) {
  return (
    <figure
      className={className}
      aria-label="Many lines of model traffic converge on the Langfuse AI Gateway."
    >
      <svg
        viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}`}
        className="block h-auto w-full"
        aria-hidden
      >
        <defs>
          <linearGradient
            id="gateway-hero-art-fade"
            gradientUnits="userSpaceOnUse"
            x1={0}
            y1={0}
            x2={XE * 0.3}
            y2={0}
          >
            <stop offset={0} stopColor="white" stopOpacity={0} />
            <stop offset={1} stopColor="white" stopOpacity={1} />
          </linearGradient>
          <mask id="gateway-hero-art-mask" maskUnits="userSpaceOnUse">
            <rect
              x={VIEW.x}
              y={VIEW.y}
              width={VIEW.w}
              height={VIEW.h}
              fill="url(#gateway-hero-art-fade)"
            />
          </mask>
        </defs>
        <g mask="url(#gateway-hero-art-mask)">
          {sheets.map((s, i) => (
            <g key={i}>
              <path d={s.fill} fill="var(--surface-1)" fillOpacity={0.55} />
              {s.lines.map((line, j) => (
                <path
                  key={j}
                  d={line.d}
                  fill="none"
                  stroke="var(--text-tertiary)"
                  strokeOpacity={line.opacity}
                  strokeWidth={line.width}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          ))}
          <path
            d={redLine}
            fill="none"
            stroke="var(--callout-error)"
            strokeWidth={1.6}
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <image
          href="/langfuse-icon.svg"
          x={XE + 18}
          y={END_Y - MARK_W / 2}
          width={MARK_W}
          height={MARK_W}
        />
      </svg>
    </figure>
  );
}
