/** Renders markdown/code source in a scrollable code block. */
export function Playground({ source }: { source: string }) {
  return (
    <pre className="p-4 overflow-auto rounded-lg border bg-muted/50 text-sm max-h-[70vh]">
      <code>{source}</code>
    </pre>
  );
}
