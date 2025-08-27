import Image from "next/image";
import Link from "next/link";
import { Author } from "../Authors";
import { CloudflareVideo, Video } from "../Video";
import { useConfig } from "nextra-theme-docs";
import { Callout } from "nextra/components";

export const ChangelogHeader = () => {
  const frontMatter = (useConfig() as any)?.normalizePagesResult?.activeData
    ?.frontMatter || ({} as any);
  const {
    title,
    description,
    ogImage,
    ogCloudflareVideo,
    ogVideo,
    gif,
    date,
    author,
    showOgInHeader,
    badge,
  } = frontMatter;

  return (
    <div className="md:mt-10 flex flex-col gap-10">
      <Callout type="info">Changelog navigation header pending v4 port.</Callout>

      <div>
        <div className="text-lg text-primary/60 mb-3">
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
          {!!badge && ` | ${badge}`}
        </div>
        <div className="flex flex-col gap-5 md:gap-10 md:flex-row justify-between md:items-center">
          <div>
            <h1 className="text-2xl md:text-3xl text-pretty font-mono">
              {title}
            </h1>
          </div>
          <Author author={author} />
        </div>
      </div>

      {showOgInHeader === false ? null : ogCloudflareVideo ? (
        <CloudflareVideo
          videoId={ogCloudflareVideo}
          aspectRatio={16 / 9}
          gifStyle
        />
      ) : ogVideo ? (
        <Video src={ogVideo} gifStyle />
      ) : ogImage ? (
        <Image
          src={gif ?? ogImage}
          alt={title}
          width={1200}
          height={630}
          className="rounded border"
          unoptimized={gif !== undefined || ogImage?.endsWith(".gif")}
        />
      ) : null}

      <p className="text-[17px]">{description}</p>
    </div>
  );
};
