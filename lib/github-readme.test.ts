import assert from "node:assert/strict";
import test from "node:test";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import {
  htmlImagesToMarkdown,
  parseGitHubRawReadmeUrl,
  remarkRewriteGitHubReadmeUrls,
  resolveReadmeUrl,
  shouldRewriteReadmeUrl,
} from "./github-readme";

const K8S_RAW =
  "https://raw.githubusercontent.com/langfuse/langfuse-k8s/refs/heads/main/README.md";

test("parseGitHubRawReadmeUrl handles refs/heads URLs", () => {
  const parsed = parseGitHubRawReadmeUrl(K8S_RAW);
  assert.ok(parsed);
  assert.equal(parsed.owner, "langfuse");
  assert.equal(parsed.repo, "langfuse-k8s");
  assert.equal(parsed.ref, "main");
  assert.equal(parsed.filePath, "README.md");
  assert.equal(
    parsed.blobFileUrl,
    "https://github.com/langfuse/langfuse-k8s/blob/main/README.md",
  );
});

test("parseGitHubRawReadmeUrl handles short branch URLs", () => {
  const parsed = parseGitHubRawReadmeUrl(
    "https://raw.githubusercontent.com/langfuse/langfuse-terraform-gcp/main/README.md",
  );
  assert.ok(parsed);
  assert.equal(parsed.ref, "main");
  assert.equal(
    parsed.blobFileUrl,
    "https://github.com/langfuse/langfuse-terraform-gcp/blob/main/README.md",
  );
});

test("shouldRewriteReadmeUrl leaves absolute and special URLs alone", () => {
  assert.equal(shouldRewriteReadmeUrl("https://langfuse.com/docs"), false);
  assert.equal(shouldRewriteReadmeUrl("mailto:hi@example.com"), false);
  assert.equal(shouldRewriteReadmeUrl("#section"), false);
  assert.equal(shouldRewriteReadmeUrl("//cdn.example.com/x"), false);
  assert.equal(
    shouldRewriteReadmeUrl("./examples/minimal-installation/"),
    true,
  );
});

test("resolveReadmeUrl maps relative links onto the GitHub blob file", () => {
  const parsed = parseGitHubRawReadmeUrl(K8S_RAW);
  assert.ok(parsed);
  assert.equal(
    resolveReadmeUrl("./examples/minimal-installation/", parsed.blobFileUrl),
    "https://github.com/langfuse/langfuse-k8s/blob/main/examples/minimal-installation/",
  );
  assert.equal(
    resolveReadmeUrl(
      "./examples/external-components/external-clickhouse.yaml",
      parsed.blobFileUrl,
    ),
    "https://github.com/langfuse/langfuse-k8s/blob/main/examples/external-components/external-clickhouse.yaml",
  );
  assert.equal(
    resolveReadmeUrl("https://langfuse.com/self-hosting", parsed.blobFileUrl),
    "https://langfuse.com/self-hosting",
  );
});

test("resolveReadmeUrl maps relative images onto raw.githubusercontent.com", () => {
  const parsed = parseGitHubRawReadmeUrl(
    "https://raw.githubusercontent.com/langfuse/langfuse-terraform-aws/refs/heads/main/README.md",
  );
  assert.ok(parsed);
  assert.equal(
    resolveReadmeUrl("./images/langfuse-v3-on-aws.svg", parsed.rawFileUrl),
    "https://raw.githubusercontent.com/langfuse/langfuse-terraform-aws/refs/heads/main/images/langfuse-v3-on-aws.svg",
  );
});

test("htmlImagesToMarkdown converts HTML img tags and skips code", () => {
  const src =
    "https://github.com/user-attachments/assets/1bf9cde0-e09f-4055-a230-17c5c009af01";
  const converted = htmlImagesToMarkdown(
    `<img width="2400" height="600" alt="hero-b" src="${src}" />\n\n# Title\n\n\`<img src="not-me.png" />\`\n`,
  );
  assert.equal(
    converted,
    `![hero-b](${src})\n\n# Title\n\n\`<img src="not-me.png" />\`\n`,
  );
});

test("remark plugin rewrites relative markdown links in a README", async () => {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRewriteGitHubReadmeUrls(K8S_RAW))
    .process(
      "Please follow the [minimal installation](./examples/minimal-installation/).",
    );

  const md = String(file);
  assert.match(
    md,
    /https:\/\/github.com\/langfuse\/langfuse-k8s\/blob\/main\/examples\/minimal-installation\//,
  );
  assert.doesNotMatch(md, /\]\(\.\/examples\//);
});
