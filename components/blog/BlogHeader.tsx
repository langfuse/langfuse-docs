import Image from "next/image";
import { CustomerStoryHeader } from "@/components/customers/CustomerStoryHeader";
import { getCustomerStories } from "@/lib/getCustomerStories";
import { Authors } from "../Authors";

function resolveCustomerLogoDark(
  customerLogo: string,
  explicit?: string,
): string | undefined {
  if (explicit) return explicit;
  return getCustomerStories().find(
    (story) => story.frontMatter.customerLogo === customerLogo,
  )?.frontMatter.customerLogoDark;
}

export const BlogHeader = ({
  authors = [],
  title,
  description,
  date,
  image,
  customerLogo,
  customerLogoDark,
}: {
  authors?: string[];
  title: string;
  description?: string;
  date?: string;
  image?: string;
  customerLogo?: string;
  customerLogoDark?: string;
}) => {
  if (customerLogo) {
    return (
      <CustomerStoryHeader
        title={title}
        description={description}
        image={image}
        customerLogo={customerLogo}
        customerLogoDark={resolveCustomerLogoDark(
          customerLogo,
          customerLogoDark,
        )}
        authors={authors}
      />
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
