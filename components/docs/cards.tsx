/**
 * Thin wrappers around fumadocs-ui Card/Cards.
 * Adds backward-compatible `num` prop to Cards for column control,
 * and makes `title` optional on Card (defaults to empty string).
 */
import * as React from "react";
import {
  Cards as FumadocsCards,
  Card as FumadocsCard,
  type CardProps as FumadocsCardProps,
} from "fumadocs-ui/components/card";
import { cn } from "@/lib/utils";

interface CardsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (1 | 2 | 3). Defaults to 2. */
  num?: number;
}

export type CardProps = Omit<FumadocsCardProps, "title"> & {
  title?: React.ReactNode;
  /** Legacy prop — ignored, fumadocs renders its own arrow. */
  arrow?: boolean;
};

export function Card({ title = "", arrow: _arrow, ...props }: CardProps) {
  return <FumadocsCard title={title} {...props} />;
}

function CardsBase({ num, className, ...props }: CardsProps) {
  const colsClass =
    num === 1
      ? "[&>*]:col-span-full"
      : num === 3
        ? "sm:grid-cols-3"
        : undefined;
  return <FumadocsCards className={cn(colsClass, className)} {...props} />;
}

// Attach Card as a static property so <Cards.Card> works in TSX and MDX
export const Cards = Object.assign(CardsBase, { Card });
