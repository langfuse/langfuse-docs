import Link from "next/link";
import { Banner as FumadocsBanner } from 'fumadocs-ui/components/banner';

export function Banner() {
  return (
    <FumadocsBanner id="fd-top-banner">
      <Link href="/blog/joining-clickhouse">Langfuse joins ClickHouse! Learn more →
      </Link>
    </FumadocsBanner>
  );
}
