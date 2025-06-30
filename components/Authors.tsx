import { cn } from "@/lib/utils";
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
    githubEmail: "git@marcklingen.com",
  },
  clemensrawert: {
    firstName: "Clemens",
    name: "Clemens Rawert",
    image: "/images/people/clemensrawert.jpg",
    twitter: "rawert",
    githubEmail: "121163007+clemra@users.noreply.github.com",
    githubEmailAlt: ["clemens@langfuse.com"],
  },
  hassiebpakzad: {
    firstName: "Hassieb",
    name: "Hassieb Pakzad",
    image: "/images/people/hassiebpakzad.jpg",
    twitter: "hassiebpakzad",
    githubEmail: "68423100+hassiebp@users.noreply.github.com",
  },
  marliesmayerhofer: {
    firstName: "Marlies",
    name: "Marlies Mayerhofer",
    image: "/images/people/marliesmayerhofer.jpg",
    twitter: "marliessophie",
    githubEmail: "74332854+marliessophie@users.noreply.github.com",
  },
  jannikmaierhoefer: {
    firstName: "Jannik",
    name: "Jannik Maierhöfer",
    image: "/images/people/jannikmaierhoefer.jpg",
    twitter: "jmaierhoefer",
    githubEmail: "48529566+jannikmaierhoefer@users.noreply.github.com",
    githubEmailAlt: ["jannik@langfuse.com"],
  },
  steffenschmitz: {
    firstName: "Steffen",
    name: "Steffen Schmitz",
    image: "/images/people/steffenschmitz.jpg",
    githubEmail: "steffen@langfuse.com",
  },

  lydiayou: {
    firstName: "Lydia",
    name: "Lydia You",
    image: "/images/people/lydiayou.jpg",
    githubEmail: "lydia.g.you@gmail.com",
  },
  richardkruemmel: {
    firstName: "Richard",
    name: "Richard Krümmel",
    image: "/images/people/richardkruemmel.jpg",
    twitter: "RichardKrue",
  },
  felixkrauth: {
    firstName: "Felix",
    name: "Felix Krauth",
    image: "/images/people/felixkrauth.jpg",
    twitter: "felixkrrr",
    githubEmail: "57024447+felixkrrr@users.noreply.github.com",
  },
  nimarblume: {
    firstName: "Nimar",
    name: "Nimar Blume",
    image: "/images/people/nimarblume.jpg",
    twitter: "nimarblu",
    githubEmail: "l.nimar.b@gmail.com",
  },
} as const;

export const Authors = (props: { authors?: (keyof typeof allAuthors)[] }) => {
  const authors = props.authors?.filter((author) => author in allAuthors) ?? [];

  if (authors.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-10 gap-y-6 justify-center py-7 max-w-xl mx-auto">
      {authors.map((author) => (
        <Author
          author={author}
          key={author}
          hideLastName={authors.length > 2}
        />
      ))}
    </div>
  );
};

export const Author = (props: { author: string; hideLastName?: boolean }) => {
  const author =
    allAuthors[props.author] ??
    Object.values(allAuthors).find(
      (author) => author.firstName === props.author
    );

  if (!author) return null;

  return (
    <a
      href={author.twitter ? `https://twitter.com/${author.twitter}` : "#"}
      className="group shrink-0"
      target="_blank"
      key={props.author}
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
        <span
          className={cn(
            "text-primary/60 group-hover:text-primary whitespace-nowrap"
          )}
        >
          {props.hideLastName ? author.firstName : author.name}
        </span>
      </div>
    </a>
  );
};
