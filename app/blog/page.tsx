import { getBlogIndexPages } from "@/lib/blog-index";
import { ContentColumns } from "@/components/layout";
import { BlogPageClient } from "@/components/blog/BlogPageClient";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogAside } from "@/components/blog/BlogAside";
import { BlogHatchBackground } from "@/components/blog/BlogHatchBackground";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { TextHighlight } from "@/components/ui/text-highlight";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export default function BlogIndexPage() {
  const pages = getBlogIndexPages();

  return (
    <BlogPageClient pages={pages}>
      <ContentColumns
        leftSidebar={<BlogSidebar />}
        rightSidebar={<BlogAside />}
        className="min-h-screen"
        footerClassName="md:max-w-none xl:max-w-none px-6 sm:px-6 md:px-6"
      >
        <BlogHatchBackground />
        <div className="relative z-1 mx-auto w-full px-6 py-8">
          <div className="flex flex-col gap-4 mb-8">
            <Heading as="h1" size="large">
              <TextHighlight>Langfuse Blog</TextHighlight>
            </Heading>
            <Text className="text-left">
              The latest updates from Langfuse. See{" "}
              <Link href="/changelog" variant="text">
                Changelog
              </Link>{" "}
              for more product updates.
            </Text>
          </div>
          <BlogIndex />
        </div>
      </ContentColumns>
    </BlogPageClient>
  );
}
