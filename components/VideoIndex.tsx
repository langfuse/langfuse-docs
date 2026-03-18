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
            className="flex flex-col rounded-lg border overflow-hidden hover:border-primary transition-colors"
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
              <Video className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 font-semibold text-sm leading-snug">{title}</span>
              <ArrowRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
