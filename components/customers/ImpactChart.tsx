interface ImpactItem {
  area: string;
  impact: string;
  icon: React.ReactNode;
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
                  {String(index + 1).padStart(2, '0')}
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