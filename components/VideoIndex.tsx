import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import { Video } from "lucide-react";
import Image from "next/image";

export const VideoIndex = () => (
  <Cards num={3}>
    {(
      getPagesUnderRoute("/guides/videos") as Array<Page & { frontMatter: any }>
    )
      .filter((page) => page.route !== "/guides/videos")
      .map((page, i) => (
        <Cards.Card
          href={page.route}
          key={page.route}
          title={
            page.frontMatter?.title ||
            page.name
              .split("_")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")
          }
          icon={<Video />}
          arrow
        >
          {page.frontMatter.ogImage ? (
            <div className="relative aspect-video">
              <Image
                src={page.frontMatter.ogImage}
                alt={
                  page.frontMatter?.title ||
                  page.name
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                }
                objectFit="cover"
                fill
                sizes="(max-width: 560px) 100vw, (max-width: 1350px) 50vw, 33vw"
              />
            </div>
          ) : (
            ""
          )}
        </Cards.Card>
      ))}
  </Cards>
);
