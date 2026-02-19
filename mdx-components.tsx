import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import NextImage from "next/image";
import { Frame } from "@/components/Frame";
import { Video } from "@/components/Video";
import { LangTabs } from "@/components/LangTabs";
import { FetchReadme } from "@/components/FetchReadme";
import { Callout, Tabs, Tab, Cards, Steps, FileTree } from "@/lib/nextra-shim/components";

function MdxImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, width, height, ...rest } = props;
  if (!src) return null;
  if (width && height) {
    return (
      <NextImage
        src={src}
        alt={alt ?? ""}
        width={Number(width)}
        height={Number(height)}
        {...(rest as object)}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ""} {...rest} />;
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    img: MdxImage,
    Frame,
    Video,
    LangTabs,
    Callout,
    Tabs,
    Tab,
    Cards,
    Card: Cards.Card,
    Steps,
    FileTree,
    FetchReadme,
    ...components,
  };
}

export function useMDXComponents(components?: MDXComponents): MDXComponents {
  return getMDXComponents(components);
}
