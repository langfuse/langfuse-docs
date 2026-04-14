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
import { CornerBox } from "./ui";

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
    <HoverCardContent className="w-56 p-0 box-corners" side={side} align={align}>
      <div className="flex flex-col text-left w-full relative z-51">
        <div className="flex items-center gap-3 justify-start pt-3 pb-4 px-4">
          <Image
            src={author.image}
            width={36}
            height={36}
            className="rounded-full border border-line-structure"
            alt={`Picture ${author.name}`}
          />
          <div className="space-y-0.5">
            <Text as="h4" size="s" className="font-[540] text-left text-text-primary">{author.name}</Text>
            {author.title && (
              <Text className="text-xs text-left text-text-tertiary block">
                {author.title}
              </Text>
            )}
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-0.5 w-full py-3 px-4">
          {author.twitter && (
            <Link
              href={`https://twitter.com/${author.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors p-1 -ml-1"
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
              className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors p-1 -ml-1"
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
              className="flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors p-1 -ml-1"
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
