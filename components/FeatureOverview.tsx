import {
  TextQuote,
  GitPullRequestArrow,
  ThumbsUp,
  Database,
} from "lucide-react";
import { CornerBox } from "./ui/corner-box";
import { Text } from "./ui/text";

const features = [
  {
    icon: TextQuote,
    title: "Observability",
    items: [
      "Log traces",
      "Lowest level transparency",
      "Understand cost and latency",
    ],
  },
  {
    icon: GitPullRequestArrow,
    title: "Prompts",
    items: [
      "Version control and deploy",
      "Collaborate on prompts",
      "Test prompts and models",
    ],
  },
  {
    icon: ThumbsUp,
    title: "Evaluation",
    items: [
      "Measure output quality",
      "Monitor production health",
      "Test changes in development",
    ],
  },
];

const platformFeature = {
  icon: Database,
  title: "Platform",
  items: [
    "API-first architecture",
    "Data exports to blob storage",
    "Enterprise security and administration",
  ],
};

export const FeatureOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 items-stretch px-px not-prose">

      {features.map((feature) => (
        <div key={feature.title} className="-ml-px -mr-px">
          <CornerBox className="flex relative z-1 flex-col p-0 min-h-0 h-full p-4">
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="h-3.5 w-3.5" />
              <Text as="h3" size="m" className="mt-1 text-text-secondary">
                {feature.title}
              </Text>
            </div>
            <ul className="list-none flex flex-col gap-1.5">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-2 items-start">
                  <span className="w-0.75 h-0.75 shrink-0 bg-text-tertiary mt-2 lg:mt-1.5" aria-hidden />
                  <Text size="s" className="text-left">{item}</Text>
                </li>
              ))}
            </ul>
          </CornerBox>
        </div>
      ))}

      <div className="md:col-span-3 -mt-px -ml-px -mr-px">
        <CornerBox className="flex relative z-0 flex-col p-0 min-h-0 h-full p-4">
          <div className="flex items-center gap-3 mb-4">
            <platformFeature.icon className="h-3.5 w-3.5 text-muted-foreground" />
            <Text as="h3" size="m" className="mt-1 text-text-primary">
              {platformFeature.title}
            </Text>
          </div>
          <ul className="list-none flex flex-col gap-1.5">
            {platformFeature.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex items-start gap-2">
                <span className="w-0.75 h-0.75 shrink-0 bg-text-tertiary" aria-hidden />
                <Text size="s">{item}</Text>
              </li>
            ))}
          </ul>
        </CornerBox>
      </div>
    </div>
  );
};
