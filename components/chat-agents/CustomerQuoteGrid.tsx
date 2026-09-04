import { CustomerQuoteCard } from "@/components/chat-agents/CustomerQuoteCard";
import { getCustomerStories } from "@/lib/getCustomerStories";

const QUOTE_ROUTES = [
  "/users/sumup",
  "/users/cresta",
  "/users/magic-patterns-ai-design-tools",
] as const;

type Story = ReturnType<typeof getCustomerStories>[number];

function getStoryMap(stories: Story[]) {
  return new Map(stories.map((story) => [story.route, story]));
}

export function CustomerQuoteGrid() {
  const stories = getCustomerStories();
  const byRoute = getStoryMap(stories);
  const selected = QUOTE_ROUTES.map((route) => byRoute.get(route)).filter(
    (story): story is Story => Boolean(story),
  );

  return (
    <div className="mt-8 grid gap-2 lg:grid-cols-3">
      {selected.map((story) => {
        const frontMatter = story.frontMatter ?? {};
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
          />
        );
      })}
    </div>
  );
}
