import { Callout } from "nextra/components";

const PREVIEW_PAGES_PER_TAG = 5;

const wordCasing = {
  api: "API",
  openai: "OpenAI",
  langchain: "LangChain",
};

export const formatTag = (tag: string) =>
  tag
    .replaceAll("-", " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .map((word) => wordCasing[word.toLowerCase()] || word)
    .join(" ");

export const FaqIndex = () => (
  <Callout type="warning">
    FAQ index temporarily disabled during Nextra v4 migration. See Backlog.md.
  </Callout>
);
