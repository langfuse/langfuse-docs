import "server-only";

import { createOpenAPI } from "fumadocs-openapi/server";
import { loadOpenAPIDocument, OPENAPI_SCHEMA_URL } from "./openapi-schema.js";

export const openapi = createOpenAPI({
  input: {
    [OPENAPI_SCHEMA_URL]: loadOpenAPIDocument,
  },
});
