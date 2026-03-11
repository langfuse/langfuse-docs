import { getPagesUnderRoute } from "@/lib/nextra-shim/context";
import { Video, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const VideoIndex = () => {
  const pages = (
    getPagesUnderRoute("/guides/videos") as Array<{ route?: string; name?: string; frontMatter?: Record<string, any> }>
  ).filter(
    (page) =>
      page.route !== "/guides/videos" &&
      page.route !== "/guides/videos/index" &&
      !!page.frontMatter?.ogImage
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose my-4">
      {pages.map((page) => {
        const title =
          page.frontMatter?.title ||
          page.name
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        return (
          <Link
            href={page.route}
            key={page.route}
            className="flex flex-col rounded-lg border overflow-hidden hover:border-primary transition-colors"
          >
            <div className="relative aspect-video w-full shrink-0">
              <Image
                src={page.frontMatter.ogImage}
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
