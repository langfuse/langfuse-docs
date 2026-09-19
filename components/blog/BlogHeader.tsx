import { Suspense } from "react";
import Image from "next/image";
import {
  CustomerStoryHeader,
  CustomerStoryHeaderView,
} from "@/components/customers/CustomerStoryHeader";
import { Authors } from "../Authors";

export const BlogHeader = ({
  authors = [],
  title,
  description,
  date,
  image,
  customerLogo,
  customerLogoDark,
  tag,
}: {
  authors?: string[];
  title: string;
  description?: string;
  date?: string;
  image?: string;
  customerLogo?: string;
  customerLogoDark?: string;
  tag?: string;
}) => {
  if (customerLogo) {
    return (
      <Suspense
        fallback={
          <CustomerStoryHeaderView
            title={title}
            description={description}
            date={date}
            tag={tag}
            customerLogo={customerLogo}
            customerLogoDark={customerLogoDark}
            authors={authors}
          />
        }
      >
        <CustomerStoryHeader
          title={title}
          description={description}
          date={date}
          tag={tag}
          customerLogo={customerLogo}
          customerLogoDark={customerLogoDark}
          authors={authors}
        />
      </Suspense>
    );
  }

  return (
    <div className="my-4 md:my-6 flex flex-col gap-3">
      <div className="flex flex-col gap-1 items-center text-center">
        {image && (
          <Image
            src={image}
            alt={title}
            width={1200}
            height={630}
            className="rounded mb-6 md:mb-14 my-0"
          />
        )}
        <span className="text-primary/60">{date}</span>
        <h1 className="mt-3 font-medium leading-snug text-balance text-foreground">
          {title}
        </h1>
        <p className="mt-2 text-primary/60 text-xl text-balance">
          {description}
        </p>
        {authors.length > 0 ? <Authors authors={authors} /> : null}
      </div>
    </div>
  );
};
