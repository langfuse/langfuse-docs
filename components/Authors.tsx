import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import authorsData from "../data/authors.json";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Github, Linkedin, Twitter } from "lucide-react";

type Author = {
  firstName: string;
  name: string;
  title: string;
  image: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
};

export const allAuthors: {
  [key: string]: Author;
} = authorsData;

export const Authors = (props: { authors?: string[] }) => {
  const authors =
    props.authors?.filter((author) =>
      Object.keys(allAuthors).includes(author)
    ) ?? [];

  if (authors.length === 0) return null;

  // Show only overlapping avatars when there are more than 2 authors
  if (authors.length > 2) {
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
    allAuthors[props.author as keyof typeof allAuthors] ??
    Object.values(allAuthors).find(
      (author) => author.firstName === props.author
    );

  if (!author) return null;

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center gap-4 cursor-default"
          key={props.author}
        >
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
      </HoverCardTrigger>
      <AuthorHoverCardContent author={author} />
    </HoverCard>
  );
};

export const AuthorAvatar = (props: { author: string }) => {
  const author =
    allAuthors[props.author as keyof typeof allAuthors] ??
    Object.values(allAuthors).find(
      (author) => author.firstName === props.author
    );

  if (!author) return null;

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className="group shrink-0 relative"
          key={props.author}
          title={author.name}
        >
          <Image
            src={author.image}
            width={40}
            height={40}
            className="rounded-full border-2 border-background"
            alt={`Picture ${author.name}`}
          />
        </div>
      </HoverCardTrigger>
      <AuthorHoverCardContent author={author} />
    </HoverCard>
  );
};

import { Separator } from "@/components/ui/separator";

// ... imports

const AuthorHoverCardContent = ({ author }: { author: Author }) => {
  return (
    <HoverCardContent className="w-56 p-0">
      <div className="flex flex-col gap-2 text-left w-full">
        <div className="flex items-center gap-3 justify-start p-3 pb-1">
          <Image
            src={author.image}
            width={40}
            height={40}
            className="rounded-full border border-border"
            alt={`Picture ${author.name}`}
          />
          <div className="space-y-0.5 text-left">
            <h4 className="text-sm font-semibold">{author.name}</h4>
            {author.title && (
              <span className="text-xs text-muted-foreground block">
                {author.title}
              </span>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-1 w-full p-3 pt-1">
          {author.twitter && (
            <Link
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
            >
              <Twitter className="h-4 w-4" />
              <span className="text-xs">@{author.twitter}</span>
            </Link>
          )}
          {author.github && (
            <Link
              href={`https://github.com/${author.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
            >
              <Github className="h-4 w-4" />
              <span className="text-xs">{author.github}</span>
            </Link>
          )}
          {author.linkedin && (
            <Link
              href={`https://www.linkedin.com/in/${author.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-1 -ml-1"
            >
              <Linkedin className="h-4 w-4" />
              <span className="text-xs">LinkedIn</span>
            </Link>
          )}
        </div>
      </div>
    </HoverCardContent>
  );
};
