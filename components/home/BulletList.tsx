import { Text } from "@/components/ui/text";

export interface BulletItem {
  label: string;
  href?: string;
}

export function BulletList({ items }: { items: BulletItem[] }) {
  return (
    <ul className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.label} className="flex gap-2 items-center">
          <span className="w-0.75 h-0.75 shrink-0 bg-text-tertiary" aria-hidden />
          {item.href ? (
            <a
              href={item.href}
              className="text-[13px] leading-snug text-text-secondary underline decoration-line-structure underline-offset-2 hover:text-text-primary transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <Text size="s" className="text-left">{item.label}</Text>
          )}
        </li>
      ))}
    </ul>
  );
}
