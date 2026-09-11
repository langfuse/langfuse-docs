import { CustomerQuoteCard } from "@/components/chat-agents/CustomerQuoteCard";
import { getCustomerStories } from "@/lib/getCustomerStories";
import {
  chatAgentQuoteRoutes,
  useCaseQuoteExcerpts,
} from "@/lib/use-case-quotes";

type Story = ReturnType<typeof getCustomerStories>[number];

function getStoryMap(stories: Story[]) {
  return new Map(stories.map((story) => [story.route, story]));
}

export function CustomerQuoteGrid({
  routes = chatAgentQuoteRoutes,
}: {
  routes?: readonly string[];
} = {}) {
  const stories = getCustomerStories();
  const byRoute = getStoryMap(stories);
  const selected = routes
    .map((route) => byRoute.get(route))
    .filter((story): story is Story => Boolean(story));

  return (
    <div className="mt-8 grid gap-2 lg:grid-cols-3">
      {selected.map((story) => {
        const frontMatter = {
          ...story.frontMatter,
          ...useCaseQuoteExcerpts[story.route],
        };
        const quote = frontMatter.customerQuote;
        if (!quote) return null;

        return (
          <CustomerQuoteCard
            key={story.route}
            route={story.route}
            quote={quote}
            quoteAuthor={frontMatter.quoteAuthor}
            quoteRole={frontMatter.quoteRole}
            quoteCompany={frontMatter.quoteCompany}
            customerLogo={frontMatter.customerLogo}
            customerLogoDark={frontMatter.customerLogoDark}
            quoteAuthorImage={frontMatter.quoteAuthorImage}
          />
        );
      })}
    </div>
  );
}
