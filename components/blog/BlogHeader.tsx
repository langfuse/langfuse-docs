import Image from "next/image";

export const BlogHeader = ({
  authors,
  title,
  description,
  date,
}: {
  authors: (keyof typeof allAuthors)[];
  title: string;
  description?: string;
  date?: string;
}) => (
  <div className="flex flex-col gap-1 items-center my-10 text-center">
    <span className="text-primary/60">{date}</span>

    <h1 className="text-3xl font-bold leading-snug">{title}</h1>
    <p className="text-primary/60 text-xl">{description}</p>
    <Authors authors={authors} />
  </div>
);
const allAuthors = {
  maxdeichmann: {
    name: "Max Deichmann",
    image: "/images/people/maxdeichmann.jpg",
    twitter: "maxdeichmann",
  },
  marcklingen: {
    name: "Marc Klingen",
    image: "/images/people/marcklingen.jpg",
    twitter: "marcklingen",
  },
  clemensrawert: {
    name: "Clemens Rawert",
    image: "/images/people/clemensrawert.jpg",
    twitter: "rawert",
  },
} as const;

export const Authors = ({
  authors,
}: {
  authors: (keyof typeof allAuthors)[];
}) => (
  <div className="flex flex-wrap gap-5 sm:gap-10 justify-center py-7">
    {authors
      .map((author) => allAuthors[author])
      .map((author) => (
        <a
          href={`https://twitter.com/${author.twitter}`}
          className="group"
          target="_blank"
          key={author.twitter}
        >
          <div className="flex items-center gap-4" key={author.name}>
            <Image
              src={author.image}
              width={40}
              height={40}
              className="rounded-full"
              alt={`Picture ${author.name}`}
            />
            <span className="text-primary/60 group-hover:text-primary">
              {author.name}
            </span>
          </div>
        </a>
      ))}
  </div>
);
