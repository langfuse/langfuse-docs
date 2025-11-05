import { cn } from "@/lib/utils";
import Image from "next/image";
import authorsData from "../data/authors.json";

export const allAuthors = authorsData;

export const Authors = (props: { authors?: (keyof typeof allAuthors)[] }) => {
  const authors = props.authors?.filter((author) => author in allAuthors) ?? [];

  if (authors.length === 0) return null;

  // Show only overlapping avatars when there are more than 5 authors
  if (authors.length > 5) {
    return (
      <div className="flex justify-center py-7 max-w-xl mx-auto">
        <div className="flex -space-x-2">
          {authors.map((author) => (
            <AuthorAvatar author={author} key={author} />
          ))}
        </div>
      </div>
    );
  }

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

export const AuthorAvatar = (props: { author: string }) => {
  const author =
    allAuthors[props.author] ??
    Object.values(allAuthors).find(
      (author) => author.firstName === props.author
    );

  if (!author) return null;

  return (
    <a
      href={author.twitter ? `https://twitter.com/${author.twitter}` : "#"}
      className="group shrink-0 hover:z-10 relative transition-transform hover:scale-110"
      target="_blank"
      key={props.author}
      rel="noopener noreferrer"
      title={author.name}
    >
      <Image
        src={author.image}
        width={40}
        height={40}
        className="rounded-full border-2 border-background"
        alt={`Picture ${author.name}`}
      />
    </a>
  );
};
