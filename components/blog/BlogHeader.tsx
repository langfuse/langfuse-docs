import Image from "next/image";
import { Authors, allAuthors } from "../Authors";

export const BlogHeader = ({
  authors,
  title,
  description,
  date,
  image,
  customerLogo,
}: {
  authors: string[];
  title: string;
  description?: string;
  date?: string;
  image?: string;
  customerLogo?: string;
}) => {
  return (
    <div className="flex flex-col gap-1 items-center my-10 text-center">
      {image && (
        <Image
          src={image}
          alt={title}
          width={1200}
          height={630}
          className="rounded mb-14 my-0"
        />
      )}
      <span className="text-primary/60">{date}</span>
      {customerLogo && (
        <div className="not-prose bg-white rounded-lg p-4 shadow-sm border my-0">
          <Image
            src={customerLogo}
            alt={`${title} logo`}
            width={160}
            height={40}
            className="h-10 w-auto object-contain my-0"
          />
        </div>
      )}
      <h1 className="mt-8 font-bold leading-snug text-balance text-foreground">
        {title}
      </h1>
      <p className="text-primary/60 text-xl text-balance">{description}</p>
      <Authors authors={authors} />
    </div>
  );
};
