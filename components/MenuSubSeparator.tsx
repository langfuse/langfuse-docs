export function MenuSubSeparator({ children }: { children: React.ReactNode }) {
  return (
    // Subseparator css class used to remove styling from the nextra menu separator (parent) via overrides.css
    <span className="subseparator font-mono _text-gray-400 dark:_text-neutral-400 font-semibold text-xs border-b border-muted bg-muted-background inline-block px-2 py-1 mb-1 w-full">
      {children}
    </span>
  );
}
