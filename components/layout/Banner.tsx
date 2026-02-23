import Link from "next/link";

export function Banner() {
  return (
    <div className="max-md:_sticky top-0 z-20 flex items-center h-10 [body.nextra-banner-hidden_&amp;]:hidden text-slate-50 dark:text-white bg-neutral-900 dark:bg-[linear-gradient(1deg,#383838,#212121)] px-2 ps-10 print:hidden">
      <div className="w-full text-sm font-medium text-center truncate">
        <Link href="/blog/joining-clickhouse">
          <span className="sm:hidden">Langfuse joins ClickHouse! →</span>
          <span className="hidden sm:inline">
            Langfuse joins ClickHouse! Learn more →
          </span>
        </Link>
      </div>
      <button
        className="p-2 opacity-80 transition"
        aria-label="Dismiss banner"
        type="button"
        data-headlessui-state=""
      >
        <svg viewBox="0 0 20 20" fill="currentColor" height="16">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>
    </div>
  );
}
