export interface RefResource {
  id: string;
  title: string;
  url: string;
}

/**
 * Inline reference marker, book-style: a superscript number linking to the
 * numbered <FurtherReading numbered /> list at the end of the page.
 *
 * Markers reference sources by stable id, and the displayed number is derived
 * from the source's position in the shared list, so reordering the list
 * renumbers everything consistently.
 */
export function Ref({ id, refs }: { id: string; refs: RefResource[] }) {
  const index = refs.findIndex((resource) => resource.id === id);
  return (
    <sup className="ref-marker">
      <a
        href={`#ref-${id}`}
        aria-label={
          index === -1 ? "Unknown reference" : `Reference ${index + 1}`
        }
      >
        {index === -1 ? "?" : index + 1}
      </a>
    </sup>
  );
}
