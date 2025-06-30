import { useRouter } from "next/router";
import { allAuthors, Author } from "./Authors";
import contributorsData from "../data/contributors.json";

export const DocsContributors = () => {
  const router = useRouter();
  
  // Get the current page path
  const currentPath = router.asPath.split('#')[0].split('?')[0];
  
  // Get contributors for this page
  const contributors = contributorsData[currentPath] || [];
  
  // Filter to only include known authors
  const validContributors = contributors.filter(
    (contributor: string) => contributor in allAuthors
  );

  if (validContributors.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
        Contributors
      </div>
      <div className="space-y-2">
        {validContributors.map((contributor: string) => (
          <div key={contributor} className="flex items-center">
            <Author author={contributor} hideLastName={validContributors.length > 3} />
          </div>
        ))}
      </div>
    </div>
  );
};