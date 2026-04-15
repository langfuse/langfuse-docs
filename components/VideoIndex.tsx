import { guidesSource } from "@/lib/source";
import { Video, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";

export const VideoIndex = () => {
  const pages = guidesSource
    .getPages()
    .filter(
      (page) =>
        page.url.startsWith("/guides/videos/") &&
        !!(page.data.ogImage as string | undefined)
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose my-4">
      {pages.map((page) => {
        const title = page.data.title ?? page.slugs[page.slugs.length - 1]
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        const ogImage = page.data.ogImage as string;

        return (
          <Link
            href={page.url}
            key={page.url}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface-bg transition-colors hover:border-primary"
          >
            <div className="relative aspect-video w-full shrink-0">
              <Image
                src={ogImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="flex items-start gap-2 p-4">
              <Video className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
              <span className="flex-1 text-sm font-semibold leading-snug text-text-primary">
                {title}
              </span>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
