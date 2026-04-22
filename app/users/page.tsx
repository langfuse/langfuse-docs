import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { usersSource } from "@/lib/source";
import { loadPage, buildSectionMetadata } from "@/lib/mdx-page";
import { getMDXComponents } from "@/mdx-components";

export default async function UsersIndexPage() {
  const result = await loadPage(usersSource, []);
  if (!result) notFound();
  const { MDX } = result;

  return (
    <div className="mx-auto w-full px-6 py-8">
      <MDX components={getMDXComponents()} />
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const page = usersSource.getPage([]);
  if (!page) return { title: "Not Found" };
  return buildSectionMetadata(page, "users", "User stories", []);
}
