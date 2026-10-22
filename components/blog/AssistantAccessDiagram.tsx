import Image from "next/image";
import { cn } from "@/lib/utils";

const interfaces = ["API", "MCP", "CLI", "Docs", "Skill"];

// Horizontal padding and column gap are shared by the area inside the
// Langfuse boundary and the row below it, so both right columns line up.
const columns = "grid grid-cols-2 gap-4 sm:gap-16";
const inset = "px-4 sm:px-12";
// Langfuse UI and Coding agents boxes: stacked on mobile, one row from sm up.
const sideBox =
  "flex flex-col gap-3 p-3 text-xs sm:min-h-14 sm:flex-row sm:items-center sm:justify-between sm:gap-4";

function ArrowUp({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col items-center text-line-cta", className)}
    >
      <svg width="10" height="6" viewBox="0 0 10 6" className="shrink-0">
        <path
          d="M1 5 5 1l4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="-mt-px w-0 flex-1 border-l-[1.5px] border-dashed border-current" />
    </div>
  );
}

function Box({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "border border-line-structure bg-surface-bg font-medium text-text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

function HaloIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="5" rx="5" ry="1.5" />
      <path d="M8.8 18.8 5.6 22V10.8a1.6 1.6 0 0 1 1.6-1.6h9.6a1.6 1.6 0 0 1 1.6 1.6v6.4a1.6 1.6 0 0 1-1.6 1.6Z" />
      <path d="M4 14h1.6" />
      <path d="M9.6 13.2v1.6" />
      <path d="M14.4 13.2v1.6" />
      <path d="M18.4 14h1.6" />
    </svg>
  );
}

const agentIconClass = "size-6";

function CodingAgentIcons() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/images/blog/2026-10-21-building-the-langfuse-assistant/codex-icon.png"
        alt="Codex"
        title="Codex"
        width={32}
        height={32}
        className={agentIconClass}
      />
      <svg viewBox="0 0 24 24" className={agentIconClass} role="img">
        <title>Claude Code</title>
        <path
          clipRule="evenodd"
          d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
          fill="#D97757"
          fillRule="evenodd"
        />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        fillRule="evenodd"
        className={cn(agentIconClass, "text-text-primary")}
        role="img"
      >
        <title>Cursor</title>
        <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
      </svg>
    </div>
  );
}

export function AssistantAccessDiagram() {
  return (
    <figure className="not-prose my-8">
      <div
        className={cn(
          "relative border border-dashed border-line-divider-dash pb-4 pt-9",
          inset,
        )}
      >
        <Image
          src="/langfuse-icon.svg"
          alt="Langfuse"
          width={24}
          height={24}
          className="absolute left-3 top-3 size-5"
        />
        <Box className="py-3 text-center text-xs">Langfuse back-end</Box>
        <Box className="mt-2">
          <ul className="grid grid-cols-5">
            {interfaces.map((name) => (
              <li key={name} className="py-3 text-center text-xs">
                {name}
              </li>
            ))}
          </ul>
        </Box>
        <div className={columns}>
          <div>
            <ArrowUp className="h-7 pt-1" />
            <Box className={sideBox}>
              Langfuse UI
              <div className="flex w-fit items-center gap-2 bg-surface-cta-primary px-2.5 py-1.5">
                <HaloIcon />
                Halo
              </div>
            </Box>
          </div>
          <div className="relative">
            {/* Runs past the boundary down to the coding agents box below. */}
            <ArrowUp className="absolute inset-x-0 -bottom-[calc(1rem+1px+1.5rem)] top-0 pt-1" />
          </div>
        </div>
      </div>
      <div className={cn(columns, inset, "border-x border-transparent")}>
        <Box className={cn(sideBox, "col-start-2 mt-6")}>
          Coding agents
          <CodingAgentIcons />
        </Box>
      </div>
    </figure>
  );
}
