import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

export async function generateMetadata(props: any) {
  const params = await props.params;
  const { metadata } = await importPage(params.mdxPath);
  return metadata as any;
}

const Wrapper = getMDXComponents().wrapper as any;

export default async function Page(props: any) {
  const params = await props.params;
  const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
    params.mdxPath
  );
  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      {/* MDX content receives params to enable relative links */}
      <MDXContent {...props} params={params} />
    </Wrapper>
  );
}

