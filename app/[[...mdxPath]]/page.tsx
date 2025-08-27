import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXComponents as getMDXComponents } from "../../mdx-components";

// Disabled during migration: let pages render dynamically
// export const generateStaticParams = generateStaticParamsFor("mdxPath");

// Disabled during migration to avoid build-time failures on invalid front matter
// export async function generateMetadata(props: any) { /* ... */ }

const Wrapper = getMDXComponents().wrapper as any;

export default async function Page(props: any) {
  const params = await props.params;
  try {
    const { default: MDXContent, toc, metadata, sourceCode } = await importPage(
      params.mdxPath
    );
    return (
      <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
        {/* MDX content receives params to enable relative links */}
        <MDXContent {...props} params={params} />
      </Wrapper>
    );
  } catch (e: any) {
    return (
      <Wrapper toc={{}} metadata={{ title: "Invalid content" }} sourceCode={""}>
        <div className="p-4 border rounded bg-yellow-50 text-yellow-800">
          Failed to render this page due to invalid front matter or MDX.
          See Backlog.md for migration tasks.
        </div>
      </Wrapper>
    );
  }
}
