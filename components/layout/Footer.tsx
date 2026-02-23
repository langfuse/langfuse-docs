import FooterMenu from "@/components/FooterMenu";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto flex max-w-360 justify-center py-12 text-gray-600 dark:text-gray-400 md:justify-start pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]">
        <FooterMenu />
      </div>
    </footer>
  );
}
