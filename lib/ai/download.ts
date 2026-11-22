import { createDownload } from "ai";
import { createGuardedFetch } from "guarded-fetch";

// Pin outbound connections to public DNS results when the SDK downloads files.
export const download = createDownload({ fetch: createGuardedFetch() });
