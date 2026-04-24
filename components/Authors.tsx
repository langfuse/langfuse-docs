"use client";

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
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { HoverCorners } from "@/components/ui/corner-box";

export type Author = {
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

const findAuthor = (authorName: string): Author => {
  const author =
    allAuthors[authorName as keyof typeof allAuthors] ??
    Object.values(allAuthors).find(
      (author) => author.firstName.toLowerCase() === authorName.toLowerCase()
    ) ??
    Object.values(allAuthors).find(
      (author) => author.name.toLowerCase() === authorName.toLowerCase()
    );
  if (!author) {
    throw new Error(
      `Author "${authorName}" is not present in allAuthors. Please check data/authors.json.`
    );
  }
  return author;
};

export const Authors = (props: { authors: string[] }) => {
  if (props.authors.length === 0) return null;

  // Show only overlapping avatars when there are more than 2 authors
  if (props.authors.length > 2) {
    return (
      <div className="flex justify-center py-4 max-w-xl">
        <div className="flex -space-x-2">
          {props.authors.map((author) => (
            <AuthorAvatar author={author} key={author} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-6 justify-center py-4 max-w-xl">
      {props.authors.map((author) => (
        <Author
          author={author}
          key={author}
          hideLastName={props.authors.length > 1}
        />
      ))}
    </div>
  );
};

export const Author = (props: { author: string; hideLastName?: boolean }) => {
  const author = findAuthor(props.author);

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className="flex items-center gap-4 cursor-default"
          key={props.author}
          suppressHydrationWarning
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
  const author = findAuthor(props.author);

  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div
          className="group shrink-0 relative"
          key={props.author}
          title={author.name}
          suppressHydrationWarning
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

export const AuthorHoverCardContent = ({
  author,
  side,
  align,
}: {
  author: Author;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}) => {
  return (
    <HoverCardContent className="w-56 p-0 not-prose" side={side} align={align}>
      <div className="flex flex-col text-left w-full relative z-51">
        <div className="flex items-center gap-3 justify-start py-2.5 px-3">
          <Image
            src={author.image}
            width={32}
            height={32}
            className="rounded-full border border-line-structure shrink-0 my-0"
            alt={`Picture ${author.name}`}
          />
          <div className="flex flex-col gap-0.5 min-w-0">
            <Text as="span" size="s" className="font-[540] text-left text-text-primary my-0 leading-[1.2]">{author.name}</Text>
            {author.title && (
              <Text as="span" className="text-xs text-left text-text-tertiary block my-0 leading-[1.2]">
                {author.title}
              </Text>
            )}
          </div>
        </div>
        <Separator className="bg-line-structure" />
        <div className="flex flex-col w-full py-1.5 px-2">
          {author.twitter && (
            <Link
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-box relative flex items-center gap-2 px-1 py-1 text-text-tertiary hover:text-text-primary no-underline hover:underline decoration-1 underline-offset-4 decoration-text-tertiary/40 transition-colors"
            >
              <HoverCorners />
              <Twitter className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate">@{author.twitter}</span>
            </Link>
          )}
          {author.github && (
            <Link
              href={`https://github.com/${author.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-box relative flex items-center gap-2 px-1 py-1 text-text-tertiary hover:text-text-primary no-underline hover:underline decoration-1 underline-offset-4 decoration-text-tertiary/40 transition-colors"
            >
              <HoverCorners />
              <Github className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate">{author.github}</span>
            </Link>
          )}
          {author.linkedin && (
            <Link
              href={`https://www.linkedin.com/in/${author.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-box relative flex items-center gap-2 px-1 py-1 text-text-tertiary hover:text-text-primary no-underline hover:underline decoration-1 underline-offset-4 decoration-text-tertiary/40 transition-colors"
            >
              <HoverCorners />
              <Linkedin className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs truncate">LinkedIn</span>
            </Link>
          )}
        </div>
      </div>
    </HoverCardContent>
  );
};
