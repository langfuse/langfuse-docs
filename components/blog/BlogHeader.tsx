import Image from "next/image";
import { Authors, allAuthors } from "../Authors";
import { useConfig } from "nextra-theme-docs";

export const BlogHeader = ({
  authors,
  title,
  description,
  date,
  image,
}: {
  authors: (keyof typeof allAuthors)[];
  title: string;
  description?: string;
  date?: string;
  image?: string;
}) => {
  const { frontMatter } = useConfig();

  return (
    <div className="flex flex-col gap-1 items-center my-10 text-center">
      {image && (
        <Image
          src={image}
          alt={title}
          width={1200}
          height={630}
          className="rounded mb-14"
        />
      )}
      <span className="text-primary/60">{date ?? frontMatter.date}</span>
      <h1 className="font-bold leading-snug text-balance text-foreground">
        {title}
      </h1>
      <p className="text-primary/60 text-xl text-balance">{description}</p>
      <Authors authors={authors} />
    </div>
  );
};
