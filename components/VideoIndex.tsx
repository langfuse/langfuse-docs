import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Card, Cards } from "nextra-theme-docs";
import { Video } from "lucide-react";
import Image from "next/image";

export const VideoIndex = () => (
  <Cards num={3}>
    {(
      getPagesUnderRoute("/guides/videos") as Array<Page & { frontMatter: any }>
    ).map((page, i) => (
      <Card
        href={page.route}
        key={page.route}
        title={page.meta?.title || page.frontMatter?.title || page.name}
        image={Boolean(page.frontMatter.ogImage)}
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
      </Card>
    ))}
  </Cards>
);
