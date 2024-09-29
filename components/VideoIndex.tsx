import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Cards } from "nextra/components";
import { Video } from "lucide-react";
import Image from "next/image";

export const VideoIndex = () => (
  <Cards num={3}>
    {(
      getPagesUnderRoute("/guides/videos") as Array<Page & { frontMatter: any }>
    ).map((page, i) => (
      <Cards.Card
        href={page.route}
        key={page.route}
        title={page.meta?.title || page.frontMatter?.title || page.name}
        // image={Boolean(page.frontMatter.ogImage)}
        icon={<Video />}
        arrow
      >
        {page.frontMatter.ogImage ? (
          <div className="relative aspect-video">
            <Image
              src={page.frontMatter.ogImage}
              alt={page.meta?.title || page.frontMatter?.title || page.name}
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
