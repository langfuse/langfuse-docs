import Image from "next/image";
import { useRouter } from "next/router";
import { Page } from "nextra";
import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import { Author } from "../Authors";

export const ChangelogHeader = () => {
  const router = useRouter();
  const changelogPages = getPagesUnderRoute("/changelog");
  const page = changelogPages.find(
    (page) => page.route === router.pathname
  ) as Page & { frontMatter: any };

  const { title, description, ogImage, date, author, tag } = page.frontMatter;

  return (
    <div className="mt-10 flex flex-col gap-10">
      <Link
        href={`/changelog${page.route ? "#" + page.route : ""}`}
        className="mb-10"
      >
        ← Back to changelog
      </Link>

      <div className="flex flex-col gap-5 md:gap-2 md:flex-row justify-between md:items-end">
        <div>
          <div className="text-lg text-primary/60 mb-3">
            {new Date(date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="text-4xl">{title}</h1>
        </div>
        <Author author={author} />
      </div>

      {ogImage ? (
        <Image
          src={ogImage}
          alt={title}
          width={1200}
          height={630}
          className="rounded-lg"
        />
      ) : null}

      <p className="text-[17px]">{description}</p>
    </div>
  );
};
