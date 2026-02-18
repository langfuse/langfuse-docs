import { loader } from "fumadocs-core/source";
// Import from generated .source (avoids fumadocs-mdx: virtual scheme that Webpack doesn't handle)
import { docs } from "../.source/index";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
