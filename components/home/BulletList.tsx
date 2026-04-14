import { Link } from "@/components/ui/link";
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
          <span
            className="w-0.75 h-0.75 rounded-full shrink-0 bg-text-tertiary transition-colors group-hover:bg-text-secondary"
            aria-hidden
          />
          {item.href ? (
            <Link
              href={item.href}
              variant="text"
            >
              {item.label}
            </Link>
          ) : (
            <Text
              size="s"
              className="text-left transition-colors text-text-tertiary group-hover:text-text-secondary"
            >
              {item.label}
            </Text>
          )}
        </li>
      ))}
    </ul>
  );
}
