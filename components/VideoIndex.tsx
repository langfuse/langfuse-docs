import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Card, Cards } from "nextra-theme-docs";
import { Video } from "lucide-react";

export const VideoIndex = () => (
  <Cards num={2}>
    {(
      getPagesUnderRoute("/guides/videos") as Array<Page & { frontMatter: any }>
    ).map((page, i) => (
      <Card
        href={page.route}
        key={page.route}
        title={page.meta?.title || page.frontMatter?.title || page.name}
        icon={<Video />}
        arrow
      >
        {""}
      </Card>
    ))}
  </Cards>
);
