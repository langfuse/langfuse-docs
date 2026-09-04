import { Details, Summary } from "@/components/Details";
import { JsonLd } from "@/components/JsonLd";
import { faqPageJsonLd } from "@/lib/json-ld";
import type { ProductFaqItem } from "@/lib/product-faqs";

export function ProductFaq({ items }: { items: ProductFaqItem[] }) {
  return (
    <>
      <JsonLd data={faqPageJsonLd(items)} />
      {items.map((item) => (
        <Details key={item.question}>
          <Summary>{item.question}</Summary>
          <p>{item.answer}</p>
        </Details>
      ))}
    </>
  );
}
