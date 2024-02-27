import Image from "next/image";

export const allAuthors = {
  maxdeichmann: {
    firstName: "Max",
    name: "Max Deichmann",
    image: "/images/people/maxdeichmann.jpg",
    twitter: "maxdeichmann",
  },
  marcklingen: {
    firstName: "Marc",
    name: "Marc Klingen",
    image: "/images/people/marcklingen.jpg",
    twitter: "marcklingen",
  },
  clemensrawert: {
    firstName: "Clemens",
    name: "Clemens Rawert",
    image: "/images/people/clemensrawert.jpg",
    twitter: "rawert",
  },
  hassiebpakzad: {
    firstName: "Hassieb",
    name: "Hassieb Pakzad",
    image: "/images/people/hassiebpakzad.jpg",
    twitter: "hassiebpakzad",
  },
  richardkruemmel: {
    firstName: "Richard",
    name: "Richard Krümmel",
    image: "/images/people/richardkruemmel.jpg",
    twitter: "RichardKrue",
  },
} as const;

export const Authors = (props: { authors: (keyof typeof allAuthors)[] }) => {
  const authors = props.authors.filter((author) => author in allAuthors);

  if (authors.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-5 sm:gap-10 justify-center py-7">
      {authors.map((author) => (
        <Author author={author} />
      ))}
    </div>
  );
};

export const Author = (props: { author: string }) => {
  const author =
    allAuthors[props.author] ??
    Object.values(allAuthors).find(
      (author) => author.firstName === props.author
    );

  if (!author) return null;

  return (
    <a
      href={`https://twitter.com/${author.twitter}`}
      className="group shrink-0"
      target="_blank"
      key={author.twitter}
      rel="noopener noreferrer"
    >
      <div className="flex items-center gap-4" key={author.name}>
        <Image
          src={author.image}
          width={40}
          height={40}
          className="rounded-full"
          alt={`Picture ${author.name}`}
        />
        <span className="text-primary/60 group-hover:text-primary whitespace-nowrap">
          {author.name}
        </span>
      </div>
    </a>
  );
};
