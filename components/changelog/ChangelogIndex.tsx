import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";

export const ChangelogIndex = ({ maxItems }: { maxItems?: number }) => (
  <div className="mt-12 max-w-6xl mx-auto divide-y divide-primary/10">
    {(getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>)
      .slice(0, maxItems)
      .map((page, i) => (
        <div
          className="md:grid md:grid-cols-4 md:gap-5 py-16 transition-all"
          id={page.route}
        >
          <div className="hidden md:block opacity-80 text-lg group-hover:opacity-100 sticky top-24 self-start">
            {page.frontMatter?.date
              ? new Date(page.frontMatter.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : null}
          </div>
          <div className="md:col-span-3">
            <Link key={page.route} href={page.route} className="block group">
              {page.frontMatter?.ogImage ? (
                <div className="mb-14 rounded-lg relative aspect-video overflow-hidden shadow-md group-hover:shadow-lg">
                  <Image
                    src={page.frontMatter.ogImage}
                    className="object-cover"
                    alt={page.frontMatter?.title ?? "Blog post image"}
                    fill={true}
                    priority={i < 3}
                  />
                </div>
              ) : null}
              <div className="md:hidden opacity-80 text-sm mb-4 group-hover:opacity-100">
                {page.frontMatter?.date
                  ? new Date(page.frontMatter.date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : null}
              </div>
              <h2 className="block font-semibold text-3xl opacity-90 group-hover:opacity-100">
                {page.meta?.title || page.frontMatter?.title || page.name}
              </h2>
              <div className="opacity-80 mt-4 text-lg group-hover:opacity-100">
                {page.frontMatter?.description}
              </div>
            </Link>
          </div>
        </div>
      ))}
  </div>
);
