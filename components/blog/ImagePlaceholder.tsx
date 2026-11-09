import { ImageIcon } from "lucide-react";

export function ImagePlaceholder({ label }: { label: string }) {
  return (
    <figure className="my-8">
      <div
        role="img"
        aria-label={`Image placeholder: ${label}`}
        className="flex aspect-video w-full flex-col items-center justify-center gap-2 border border-dashed border-line-structure bg-surface-bg px-6 text-center"
      >
        <ImageIcon aria-hidden="true" className="size-6 text-text-tertiary" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          Image placeholder
        </span>
        <span className="max-w-md text-sm text-text-secondary">{label}</span>
      </div>
    </figure>
  );
}
