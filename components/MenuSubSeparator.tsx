export function MenuSubSeparator({ children }: { children: React.ReactNode }) {
  return (
    // Subseparator css class used to remove styling from the nextra menu separator (parent) via overrides.css
    <span className="subseparator _text-gray-500 dark:_text-neutral-400 font-medium text-xs uppercase -mb-10 border-b border-l border-muted bg-muted-background rounded-bl-md inline-block px-2 w-full tracking-tight">
      {children}
    </span>
  );
}
