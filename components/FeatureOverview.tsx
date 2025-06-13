import { TextQuote, GitPullRequestArrow, ThumbsUp, Database } from "lucide-react";

const features = [
  {
    icon: TextQuote,
    title: "Traces",
    items: [
      "Log traces",
      "Lowest level transparency",
      "Understand cost and latency"
    ]
  },
  {
    icon: GitPullRequestArrow,
    title: "Prompts", 
    items: [
      "Version control",
      "Test prompts and models",
      "Collaborate on prompts"
    ]
  },
  {
    icon: ThumbsUp,
    title: "Evals",
    items: [
      "Measure output quality",
      "Monitor production health", 
      "Test changes in development"
    ]
  }
];

const platformFeature = {
  icon: Database,
  title: "Platform",
  items: [
    "API-first architecture",
    "Data exports to blob storage",
    "Enterprise Security / administration"
  ]
};

export const FeatureOverview = () => {
  return (
    <div className="not-prose my-8 p-4 border rounded bg-white">
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="border rounded p-6 bg-card"
          >
            <div className="flex items-center gap-3 mb-4">
              <feature.icon className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
            </div>
            <ul className="space-y-2">
              {feature.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {/* Platform card - full width */}
      <div className="border rounded p-6 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <platformFeature.icon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-card-foreground">
            {platformFeature.title}
          </h3>
        </div>
        <ul className="space-y-2">
          {platformFeature.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
              <span className="text-muted-foreground text-sm">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 