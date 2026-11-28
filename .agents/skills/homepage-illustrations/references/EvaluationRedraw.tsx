import {
  AXO,
  AXO_COLOR,
  AxoBlock,
  AxoChip,
  AxoDot,
  AxoGrid,
  AxoNode,
  AxoPlane,
  AxoText,
  AxoWire,
} from "@/components/home/illustrations/axo";

const O = { x: 0.25, y: 0.25 };
const TRUNK = 16.73;
const rows = [
  {
    label: "Accuracy",
    value: "87%",
    y: 222.81,
    w: 131.68,
    color: AXO_COLOR.good,
  },
  {
    label: "is JSON",
    value: "True",
    y: 256.41,
    w: 131.68,
    color: AXO_COLOR.good,
  },
  {
    label: "Conciseness",
    value: "0.2",
    y: 290.01,
    w: 155.71,
    color: AXO_COLOR.bad,
  },
];
const ROW_X = 36.51;
const ROW_H = 23.41;

export function EvaluationRedraw() {
  return (
    <svg
      width={288}
      height={218}
      viewBox="0 0 288 218"
      style={
        {
          "--axo-face": "#f4f4f1",
          "--axo-top": "#fcfcfc",
        } as React.CSSProperties
      }
    >
      <rect x={16} y={26} width={256} height={192} fill="#f4f4f1" />
      <AxoPlane origin={O}>
        <AxoGrid x={-91.07} y={98.27} cols={14} rows={10} />
        <AxoWire d={`M${TRUNK} 156.13V${rows[2].y + ROW_H / 2}`} />
        <AxoChip x={2.6} y={119.52} w={125.96} h={36.61}>
          <AxoText x={2.6 + AXO.padX + 0.25} y={137.83 + AXO.baseline}>
            LLM Execution
          </AxoText>
        </AxoChip>
        <AxoNode x={TRUNK} y={156.13} />
        {rows.map((row, i) => {
          const cy = row.y + ROW_H / 2;
          const tx = ROW_X + AXO.padX - 0.27;
          const dot = tx + row.label.length * AXO.charWidth + 10.8;
          return (
            <g key={row.label}>
              <defs>
                <linearGradient
                  id={`ev-w${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={TRUNK}
                  x2={ROW_X}
                  y1={cy}
                  y2={cy}
                >
                  <stop offset="0" stopColor="#cfcfc9" />
                  <stop offset="1" stopColor={row.color} />
                </linearGradient>
              </defs>
              <path
                d={`M${TRUNK} ${cy}H${ROW_X}`}
                fill="none"
                stroke={`url(#ev-w${i})`}
                strokeWidth={1.3}
              />
              <AxoChip x={ROW_X} y={row.y} w={row.w} h={ROW_H}>
                <AxoText x={tx} y={cy + AXO.baseline}>
                  {row.label}
                </AxoText>
                <AxoDot cx={dot} cy={cy} color={row.color} />
                <AxoText x={dot + 10.6} y={cy + AXO.baseline} tone="strong">
                  {row.value}
                </AxoText>
              </AxoChip>
              <AxoNode x={ROW_X} y={cy} color={row.color} />
            </g>
          );
        })}
      </AxoPlane>
      <AxoBlock
        origin={O}
        x={2.37}
        y={174.76}
        w={122.79}
        h={36.03}
        raise={7.5}
        shadow
      >
        <AxoText
          x={2.37 + 122.79 / 2 - 0.23}
          y={174.76 + 36.03 / 2 + AXO.baseline}
          tone="strong"
          anchor="middle"
        >
          Evaluators
        </AxoText>
      </AxoBlock>
    </svg>
  );
}
