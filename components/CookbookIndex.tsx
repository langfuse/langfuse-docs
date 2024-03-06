import { getPagesUnderRoute } from "nextra/context";
import { type Page } from "nextra";
import { Card, Cards } from "nextra-theme-docs";
import { FileCode } from "lucide-react";

export const CookbookIndex = () => (
  <Cards num={2}>
    {(
      getPagesUnderRoute("/guides/cookbook") as Array<
        Page & { frontMatter: any }
      >
    )
      .filter((page) => page.route !== "/cookbook")
      .map((page, i) => (
        <Card
          href={page.route}
          key={page.route}
          title={page.meta?.title || page.frontMatter?.title || page.name}
          icon={<FileCode />}
          arrow
        >
          {""}
        </Card>
      ))}
  </Cards>
);
