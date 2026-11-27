import {
  AXO,
  AXO_COLOR,
  AxoBlock,
  AxoBracket,
  AxoChip,
  AxoDot,
  AxoGrid,
  AxoNode,
  AxoPill,
  AxoPlane,
  AxoText,
  AxoWire,
} from "@/components/home/illustrations/axo";

const O = { x: 0.25, y: 0.25 };
const CX = -1.66;
const CHIP = { x: -25.93, w: 48.55, h: 36.56 };
const versions = [
  { label: "v1", y: 124.33 },
  { label: "v2", y: 172.35 },
  { label: "v3", y: 220.35, active: true },
];
const block = { x: 44.43, y: 220.28, w: 84.23, h: 36.33 };
const bracket = { x: 44.55, y: 280.95, w: 128.16, h: 35.52 };
const DROP = 86;
const floor = block.y + block.h;

export function PromptRedraw() {
  return (
    <svg width={288} height={233} viewBox="0 0 288 233">
      <AxoPlane origin={O}>
        <AxoGrid x={-82.04} y={101.83} cols={14} rows={10} />
        <AxoWire d={`M${CX} 104.5V${versions[2].y}`} />
        <AxoWire d={`M${CHIP.x + CHIP.w} 190.44H${DROP}V${block.y}`} dashed />
        <AxoWire
          d={`M${CX} ${floor}V268.64H${DROP}M${DROP} ${floor}V${bracket.y}`}
          color={AXO_COLOR.outline}
        />
        {versions.map((v) => (
          <AxoChip key={v.label} x={CHIP.x} y={v.y} w={CHIP.w} h={CHIP.h}>
            <AxoText
              x={CX}
              y={v.y + CHIP.h / 2 + AXO.baseline}
              anchor="middle"
              tone={v.active ? "strong" : "muted"}
            >
              {v.label}
            </AxoText>
          </AxoChip>
        ))}
        {versions.map((v) => (
          <AxoNode key={v.label} x={CX} y={v.y} />
        ))}
        <AxoNode x={CX} y={floor} color={AXO_COLOR.outline} />
        <AxoPill x={139.47} y={244.53} w={70.27} h={11.93} kind="tag">
          Marc Jannick
        </AxoPill>
        <AxoBracket {...bracket}>
          <AxoText
            x={bracket.x + 18.65}
            y={bracket.y + bracket.h / 2 + AXO.baseline}
            tone="strong"
          >
            Production
          </AxoText>
          <AxoDot cx={148.4} cy={bracket.y + bracket.h / 2 + 0.35} r={3} />
        </AxoBracket>
      </AxoPlane>
      <AxoBlock origin={O} {...block} raise={7.22} shadow={false}>
        <AxoText
          x={block.x + 14.66}
          y={block.y + block.h / 2 + AXO.baseline}
          tone="strong"
        >
          v2
        </AxoText>
        <AxoPill x={85.79} y={230.88} w={28.27} h={16.13} kind="badge">
          Exp
        </AxoPill>
      </AxoBlock>
      <AxoPlane origin={O}>
        <AxoNode x={DROP} y={floor} color={AXO_COLOR.outline} />
      </AxoPlane>
    </svg>
  );
}
