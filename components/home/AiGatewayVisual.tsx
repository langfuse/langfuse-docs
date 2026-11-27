import { ProviderMark, type ProviderMarkName } from "./AiGatewayProviderMarks";
import {
  AXO,
  AXO_COLOR,
  AxoBlock,
  AxoBracket,
  AxoChip,
  AxoDot,
  AxoGrid,
  AxoNode,
  AxoPlane,
  AxoText,
  AxoWire,
} from "./illustrations/axo";

const ORIGIN = { x: 26, y: 142 };
const ROW_H = 23.4;
const ROW_PITCH = 33.6;
const rowY = (i: number) => i * ROW_PITCH;
const rowMid = (i: number) => rowY(i) + ROW_H / 2;

const clients = { x: 0, w: 110, labels: ["Your apps", "Claude Code", "Codex"] };
const providers: {
  x: number;
  w: number;
  named: { label: string; mark: ProviderMarkName }[];
  more: ProviderMarkName[];
} = {
  x: 345,
  w: 115,
  named: [
    { label: "Anthropic", mark: "anthropic" },
    { label: "OpenAI", mark: "openai" },
  ],
  more: ["gemini", "aws", "azure", "openrouter"],
};
const MARK = 13;
const gateway = { x: 166, y: rowMid(1) - 18.25, w: 123, h: 36.5 };
const gatewayMid = gateway.y + gateway.h / 2;
const gatewayFloor = gateway.y + gateway.h;
const gatewayCentre = gateway.x + gateway.w / 2;
const TRUNK_IN = clients.x + clients.w + 20;
const TRUNK_OUT = providers.x - 20;
const trace = {
  x: gatewayCentre - 95.3,
  y: gatewayFloor + 30,
  w: 190.6,
  h: 35.5,
};
const traceMid = trace.y + trace.h / 2;
const traceText = trace.x + 18.65;
const cell = providers.w / providers.more.length;

export function AiGatewayVisual({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 409 232"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <AxoPlane origin={ORIGIN}>
        <AxoGrid x={-60} y={-50} cols={24} rows={8} />
        <AxoWire
          d={`M${TRUNK_IN} ${rowMid(0)}V${rowMid(2)}M${TRUNK_IN} ${gatewayMid}H${gateway.x}M${gateway.x + gateway.w} ${gatewayMid}H${TRUNK_OUT}M${TRUNK_OUT} ${rowMid(0)}V${rowMid(2)}`}
        />
        {[0, 1, 2].map((i) => (
          <AxoWire
            key={i}
            d={`M${clients.x + clients.w} ${rowMid(i)}H${TRUNK_IN}M${TRUNK_OUT} ${rowMid(i)}H${providers.x}`}
          />
        ))}
        <AxoWire
          d={`M${gatewayCentre} ${gatewayFloor}V${trace.y}`}
          color={AXO_COLOR.outline}
        />
        {clients.labels.map((label, i) => (
          <AxoChip
            key={label}
            x={clients.x}
            y={rowY(i)}
            w={clients.w}
            h={ROW_H}
          >
            <AxoText x={clients.x + AXO.padX} y={rowMid(i) + AXO.baseline}>
              {label}
            </AxoText>
          </AxoChip>
        ))}
        {providers.named.map(({ label, mark }, i) => (
          <AxoChip
            key={label}
            x={providers.x}
            y={rowY(i)}
            w={providers.w}
            h={ROW_H}
          >
            <ProviderMark
              name={mark}
              x={providers.x + AXO.padX}
              y={rowMid(i) - MARK / 2}
              size={MARK}
            />
            <AxoText
              x={providers.x + AXO.padX + MARK + 6}
              y={rowMid(i) + AXO.baseline}
            >
              {label}
            </AxoText>
          </AxoChip>
        ))}
        <AxoChip x={providers.x} y={rowY(2)} w={providers.w} h={ROW_H}>
          {providers.more.map((name, i) => (
            <g key={name}>
              {i > 0 && (
                <path
                  d={`M${providers.x + i * cell} ${rowY(2)}v${ROW_H}`}
                  stroke={AXO_COLOR.hairline}
                  strokeWidth={AXO.hairline}
                />
              )}
              <ProviderMark
                name={name}
                x={providers.x + i * cell + (cell - MARK) / 2}
                y={rowMid(2) - MARK / 2}
                size={MARK}
              />
            </g>
          ))}
        </AxoChip>
        <AxoText x={providers.x} y={rowY(2) + ROW_H + 15}>
          and more
        </AxoText>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <AxoNode x={clients.x + clients.w} y={rowMid(i)} />
            <AxoNode x={providers.x} y={rowMid(i)} />
          </g>
        ))}
        <AxoBracket {...trace}>
          <AxoText x={traceText} y={traceMid + AXO.baseline}>
            trace
          </AxoText>
          <AxoText
            x={traceText + 6 * AXO.charWidth}
            y={traceMid + AXO.baseline}
            tone="strong"
          >
            1.2s $0.0031
          </AxoText>
          <AxoDot
            cx={traceText + 18 * AXO.charWidth + 7.2}
            cy={traceMid}
            r={3}
          />
        </AxoBracket>
      </AxoPlane>
      <AxoBlock origin={ORIGIN} {...gateway}>
        <AxoText
          x={gatewayCentre}
          y={gatewayMid + AXO.baseline}
          tone="strong"
          anchor="middle"
        >
          AI Gateway
        </AxoText>
      </AxoBlock>
      <AxoPlane origin={ORIGIN}>
        <AxoNode x={gatewayCentre} y={gatewayFloor} color={AXO_COLOR.outline} />
      </AxoPlane>
    </svg>
  );
}
