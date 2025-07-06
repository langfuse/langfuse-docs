interface ImpactItem {
  area: string;
  impact: string;
  icon: React.ReactNode;
  learnMore?: { title: string; href: string }[];
}

interface ImpactChartProps {
  items: ImpactItem[];
}

export const ImpactChart = ({ items }: ImpactChartProps) => {
  return (
    <div className="bg-card rounded-lg border border-gray-200 dark:border-gray-700 p-6 my-8">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex">
              <div className="flex-shrink-0 mr-4">
                <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {item.area}
                  </h3>
                </div>
                <div className="md:col-span-1">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {item.impact}
                  </p>
                  {item.learnMore && item.learnMore.length > 0 && (
                    <div className="mt-3">
                      <div className="w-12 border-t border-gray-200 dark:border-gray-700 mb-2"></div>
                      <div className="flex flex-col gap-1">
                        {item.learnMore.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.href}
                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline transition-colors"
                          >
                            {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {index < items.length - 1 && (
              <hr className="mt-4 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
