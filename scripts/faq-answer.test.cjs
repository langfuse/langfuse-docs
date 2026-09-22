const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const { transformSync } = require("esbuild");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Render the actual FAQ component with controlled chat responses. Browser-only
// effects do not run during server rendering; this tests output, not interaction.
const source = fs.readFileSync(
  path.join(__dirname, "../components/faq/FaqAsk.tsx"),
  "utf8",
);
const { code } = transformSync(source, {
  loader: "tsx",
  format: "cjs",
  jsx: "automatic",
});
let chat;
const noop = () => {};
const exportsObject = { exports: {} };
vm.runInNewContext(code, {
  URL,
  module: exportsObject,
  exports: exportsObject.exports,
  require(name) {
    if (name === "@ai-sdk/react") return { useChat: () => chat };
    if (name === "ai") return { DefaultChatTransport: class {} };
    if (name === "./FaqAsk.module.css") return { cursor: "cursor" };
    if (name === "@/components/ui/button") return { Button: "button" };
    if (name === "@/components/ui/text") return { Text: "p" };
    if (name === "@/components/ui/link") return { linkVariants: () => "link" };
    if (name === "@/lib/utils") {
      return { cn: (...values) => values.filter(Boolean).join(" ") };
    }
    return require(name);
  },
});
const { FaqAsk } = exportsObject.exports;
function renderAnswer(text, error, linked = false) {
  chat = {
    messages: [{ role: "assistant", parts: [{ type: "text", text }] }],
    error,
    sendMessage: noop,
    setMessages: noop,
    stop: noop,
    clearError: noop,
  };
  return renderToStaticMarkup(React.createElement(FaqAsk, { linked }));
}

test("FAQ answers preserve lists, headings, quotes, and code in both layouts", () => {
  const answer =
    "## Steps\n\n1. First\n2. Second\n\n- Alpha\n- Beta\n\n> Quoted text\n\n```js\nconst ready = true;\n```";
  for (const linked of [false, true]) {
    const html = renderAnswer(answer, undefined, linked);
    assert.match(html, /<p class="font-semibold">Steps<\/p>/);
    assert.match(html, /<ol>\s*<li>First<\/li>\s*<li>Second<\/li>\s*<\/ol>/);
    assert.match(html, /<ul>\s*<li>Alpha<\/li>\s*<li>Beta<\/li>\s*<\/ul>/);
    assert.match(html, /<blockquote>\s*<p>Quoted text<\/p>\s*<\/blockquote>/);
    assert.match(html, /<pre><code[^>]*>const ready = true;\n<\/code><\/pre>/);
  }
});

test("FAQ answers still restrict HTML, images, and external links", () => {
  const html = renderAnswer(
    "[Docs](https://langfuse.com/docs) [External](https://example.com) ![Image](https://example.com/a.png)\n\n<script>alert(1)</script>",
  );
  assert.match(html, /href="https:\/\/langfuse.com\/docs"/);
  assert.doesNotMatch(html, /href="https:\/\/example.com|<img|<script/);
});
