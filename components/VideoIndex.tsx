import { guidesSource } from "@/lib/source";
import { Video, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { Card, Cards } from "@/components/docs";

export const VideoIndex = () => {
  const pages = guidesSource
    .getPages()
    .filter(
      (page) =>
        page.url.startsWith("/guides/videos/") &&
        !!(page.data.ogImage as string | undefined)
    );

  return (
    <Cards num={3}>
      {pages.map((page) => {
        const title = page.data.title ?? page.slugs[page.slugs.length - 1]
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const ogImage = page.data.ogImage as string;

        return (
          <Card
            href={page.url}
            key={page.url}
            className="flex flex-col overflow-hidden items-start justify-start"
            contentClassName="p-1 sm:p-1.5"
            contentWrapperClassName="h-full gap-0 w-full"
          >
            <div className="relative aspect-video w-full shrink-0">
              <Image
                src={ogImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute top-1 right-1 w-6 h-6 bg-surface-bg z-1 flex items-center justify-center border border-line-structure">
                <Video className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
              </div>
            </div>
            <div className="flex items-start py-2 gap-2 not-prose p-2">
              <Text size="s" className="flex-1 text-left inline-flex py-0 text-text-secondary font-[480] group-hover:text-text-primary transition-colors duration-220">
                {title}
              </Text>
              <ArrowRight className="size-3 shrink-0 text-text-tertiary" />
            </div>
          </Card>
        );
      })}
    </Cards>
  );
};
