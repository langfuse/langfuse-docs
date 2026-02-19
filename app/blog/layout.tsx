import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { blogSource } from "@/lib/source";
import { DocsNavbar } from "@/components/docs/DocsNavbar";
import FooterMenu from "@/components/FooterMenu";
import { DocsLayoutWrapper } from "@/app/docs/DocsLayoutWrapper";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayoutWrapper>
      <DocsLayout
        tree={blogSource.getPageTree()}
        nav={{
          component: <DocsNavbar />,
          enabled: true,
          title: "Langfuse",
          url: "/",
          githubUrl: "https://github.com/langfuse/langfuse-docs",
        }}
      >
        {children}
        <footer className="mt-12 border-t border-border/50 bg-muted/30">
          <div className="container py-10">
            <FooterMenu />
          </div>
        </footer>
      </DocsLayout>
    </DocsLayoutWrapper>
  );
}
