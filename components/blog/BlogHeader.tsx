import Image from "next/image";
import { Authors, allAuthors } from "../Authors";
import { Frame } from "../Frame";

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
}) => (
  <div className="flex flex-col gap-1 items-center my-10 text-center">
    {image && (
      <Image
        src={image}
        alt={title}
        width={1200}
        height={630}
        className="rounded mb-4"
      />
    )}
    <span className="text-primary/60">{date}</span>
    <h1 className="font-bold leading-snug text-balance">{title}</h1>
    <p className="text-primary/60 text-xl text-balance">{description}</p>
    <Authors authors={authors} />
  </div>
);
