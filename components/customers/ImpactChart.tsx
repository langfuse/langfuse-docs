import { CornerBox, cornersFromNeighbors } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";

interface ImpactItem {
  area: string;
  impact: string;
  icon?: React.ReactNode;
  learnMore?: { title: string; href: string }[];
}

interface ImpactChartProps {
  items: ImpactItem[];
}

export const ImpactChart = ({ items }: ImpactChartProps) => {
  return (
    <div className="not-prose my-8">
      {items.map((item, index) => (
        <CornerBox
          key={index}
          hoverStripes
          corners={cornersFromNeighbors({
            top: index > 0,
            bottom: index < items.length - 1,
          })}
          className="flex items-baseline gap-3 p-4 -mt-px"
        >
          <span className="shrink-0 font-mono text-[12px] text-text-tertiary leading-[150%]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
            <Text
              size="s"
              className="text-left font-medium text-text-secondary"
            >
              {item.area}
            </Text>
            <div>
              <Text size="s" className="text-left">
                {item.impact}
              </Text>
              {item.learnMore && item.learnMore.length > 0 && (
                <div className="flex flex-col gap-1 mt-2">
                  {item.learnMore.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] text-text-tertiary hover:text-text-secondary underline underline-offset-4 decoration-line-structure transition-colors"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CornerBox>
      ))}
    </div>
  );
};
