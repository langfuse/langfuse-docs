import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";

export const ChangelogIndex = ({ maxItems }: { maxItems?: number }) => (
  <div className="mt-32">
    {(getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>)
      .slice(0, maxItems)
      .map((page) => (
        <div className="grid grid-cols-3">
          <div>
            {page.frontMatter?.date ? (
              <span className="opacity-80 text-lg group-hover:opacity-100">
                {new Date(page.frontMatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            ) : null}
          </div>
          <div className="col-span-2 pb-20">
            <Link
              key={page.route}
              href={page.route}
              className="block mb-8 group"
            >
              {page.frontMatter?.ogImage ? (
                <div className="mt-4 rounded-lg relative aspect-video overflow-hidden">
                  <Image
                    src={page.frontMatter.ogImage}
                    className="object-cover"
                    alt={page.frontMatter?.title ?? "Blog post image"}
                    fill={true}
                  />
                </div>
              ) : null}
              <h2 className="block font-semibold mt-8 text-3xl opacity-90 group-hover:opacity-100">
                {page.meta?.title || page.frontMatter?.title || page.name}
              </h2>
              <div className="opacity-80 mt-2 text-lg group-hover:opacity-100">
                {page.frontMatter?.description}
              </div>
              <div className="flex gap-2 flex-wrap mt-3 items-baseline">
                {page.frontMatter?.tag ? (
                  <span className="opacity-80 text-xs py-1 px-2 ring-1 ring-gray-300 rounded-sm group-hover:opacity-100">
                    {page.frontMatter.tag}
                  </span>
                ) : null}
              </div>
            </Link>
          </div>
        </div>
      ))}
  </div>
);
