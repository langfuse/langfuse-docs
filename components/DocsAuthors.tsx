import React from 'react';
import { useRouter } from 'next/router';
import { Authors, allAuthors } from './Authors';
import docsAuthorsData from '../lib/docs-authors.json';

type DocsAuthorsData = Record<string, string[]>;

const DocsAuthors: React.FC = () => {
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0].split('#')[0]; // Remove query params and hash
  
  const authorsData: DocsAuthorsData = docsAuthorsData;
  const authors = authorsData[currentPath] || [];
  
  // Only show if we have authors and we're on a docs page
  if (!authors.length || !currentPath.startsWith('/docs')) {
    return null;
  }
  
  // Filter authors to only include those that exist in allAuthors
  const validAuthors = authors.filter(author => author in allAuthors) as (keyof typeof allAuthors)[];
  
  if (validAuthors.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {validAuthors.length === 1 ? 'Author' : 'Authors'}
        </h4>
        <div className="space-y-3">
          {validAuthors.map((authorKey) => {
            const author = allAuthors[authorKey];
            return (
                             <a
                 key={authorKey}
                 href={'twitter' in author ? `https://twitter.com/${author.twitter}` : "#"}
                 className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                 <img
                   src={author.image}
                   width={32}
                   height={32}
                   className="rounded-full flex-shrink-0"
                   alt={`Picture of ${author.name}`}
                 />
                 <div className="min-w-0 flex-1">
                   <span className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary block truncate">
                     {author.firstName}
                   </span>
                   {'twitter' in author && (
                     <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary/80 block truncate">
                       @{author.twitter}
                     </span>
                   )}
                 </div>
               </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocsAuthors;