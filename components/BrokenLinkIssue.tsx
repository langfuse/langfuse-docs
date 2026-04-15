"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const REPO = "langfuse/langfuse.com";

export function BrokenLinkIssue() {
  const [href, setHref] = useState<string>(
    `https://github.com/${REPO}/issues/new`
  );

  useEffect(() => {
    const path = window.location.pathname;
    const title = encodeURIComponent(`Broken link: ${path}`);
    const body = encodeURIComponent(
      `The following page returned a 404:\n\n**URL:** \`${window.location.href}\`\n\nPlease update or redirect this link.`
    );
    setHref(
      `https://github.com/${REPO}/issues/new?title=${title}&body=${body}`
    );
  }, []);

  return (
    <Button
      variant="secondary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      Submit an issue about broken link →
    </Button>
  );
}
