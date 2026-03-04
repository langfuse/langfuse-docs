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
          className="rounded mb-14"
        />
      )}
      <span className="text-primary/60">{date}</span>
      {customerLogo && (
        <div className="bg-white rounded-lg p-3 shadow-sm border my-3">
          <Image
            src={customerLogo}
            alt={`${title} logo`}
            width={160}
            height={40}
            className="h-8 w-auto object-contain"
          />
        </div>
      )}
      <h1 className="font-bold leading-snug text-balance text-foreground">
        {title}
      </h1>
      <p className="text-primary/60 text-xl text-balance">{description}</p>
      <Authors authors={authors} />
    </div>
  );
};
