export function ComponentLayoutDiagram() {
  return (
    <figure className="not-prose my-8 min-w-0 text-text-primary">
      <div className="rounded-none border border-dashed border-text-tertiary bg-surface-1 p-4 sm:p-6">
        <p className="m-0 text-sm font-medium">Parent container</p>
        <div className="my-4 flex items-center gap-2 text-xs text-text-secondary">
          <span
            aria-hidden="true"
            className="flex-1 border-t border-text-tertiary"
          />
          Parent sets the available width
          <span
            aria-hidden="true"
            className="flex-1 border-t border-text-tertiary"
          />
        </div>
        <div className="grid gap-10">
          {["First input", "Second input"].map((label, index) => (
            <div
              key={label}
              className="relative min-w-0 rounded-md border border-text-primary bg-background px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border border-dashed border-line-structure px-2 py-1">
                <span className="text-sm">{label}</span>
                <span className="text-xs text-text-secondary">Content</span>
              </div>
              {index === 0 && (
                <div className="absolute inset-x-0 top-full flex h-10 items-center justify-center gap-2 text-xs text-text-secondary">
                  <span aria-hidden="true">↕</span>
                  Parent owns the gap
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mb-0 mt-4 text-xs text-text-secondary">
          Inputs fill the available width. Neither adds an outer margin.
        </p>
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">
        The parent owns width and spacing between inputs. Each input owns its
        border, height, and padding around the dashed content box.
      </figcaption>
    </figure>
  );
}
