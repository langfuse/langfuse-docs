import { RootDocument } from "@/components/RootDocument";
import { NotFoundContent } from "@/components/NotFoundContent";

/**
 * 404 for URLs that match no route in either root layout group. Next.js renders
 * this one outside every layout, so it has to supply the document shell itself.
 */
export default function NotFound() {
  return (
    <RootDocument lang="en">
      <NotFoundContent />
    </RootDocument>
  );
}
