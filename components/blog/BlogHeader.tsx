import Image from "next/image";
import {
  CustomerStoryBackNav,
  companyLabelFromLogo,
} from "@/components/customers/CustomerStoryBackNav";
import { Authors } from "../Authors";

export const BlogHeader = ({
  authors = [],
  title,
  description,
  date,
  image,
  customerLogo,
}: {
  authors?: string[];
  title: string;
  description?: string;
  date?: string;
  image?: string;
  customerLogo?: string;
}) => {
  return (
    <div className="my-4 md:my-6 flex flex-col gap-3">
      {customerLogo ? (
        <CustomerStoryBackNav current={companyLabelFromLogo(customerLogo)} />
      ) : null}
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
        {customerLogo && (
          <div className="not-prose my-0">
            <Image
              src={customerLogo}
              alt={`${title} logo`}
              width={220}
              height={56}
              className="h-12 w-auto object-contain my-0"
            />
          </div>
        )}
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
