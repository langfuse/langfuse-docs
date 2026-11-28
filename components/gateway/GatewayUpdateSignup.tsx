"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Input } from "@/components/ui/input";
import { FeatureSketch } from "./GatewayFeatureSketch";
import { updatesSketch } from "./content";

type SignupState = "idle" | "sending" | "done" | "failed";

const STATUS: Record<SignupState, string> = {
  idle: "Gateway updates only, no spam.",
  sending: "Gateway updates only, no spam.",
  done: "Subscribed. Thanks.",
  failed: "That did not work. Try again in a moment.",
};

/** Closing section of /gateway: the email signup in a box. */
export function GatewayUpdateSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SignupState>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/productUpdateSignup", {
        method: "POST",
        body: JSON.stringify({ email, source: "gateway", list: "gateway" }),
        headers: { "Content-Type": "application/json" },
      });
      setState(res.ok ? "done" : "failed");
      if (res.ok) setEmail("");
    } catch {
      setState("failed");
    }
  }

  return (
    <section
      data-use-case-section="updates"
      className="px-5 pb-4 pt-28 sm:px-10 sm:pt-40 xl:px-7"
    >
      <CornerBox className="grid items-center gap-x-6 px-5 py-10 sm:px-10 sm:py-12 @3xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <h2
            id="updates"
            data-toc-title="Updates"
            className="text-[34px] leading-[1.08] text-text-primary sm:text-[42px]"
          >
            Get Updates
          </h2>
          <p className="mt-4 text-[16px] leading-[1.5] text-text-secondary">
            Get an email when we ship new features and providers.
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-8 flex max-w-[440px] flex-col gap-3"
          >
            <div className="flex items-center gap-2">
              <Input
                type="email"
                required
                aria-label="Email address"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-[44px] min-w-0 flex-1 border-line-cta px-3.5 text-[16px] text-text-primary shadow-none"
              />
              <Button
                type="submit"
                disabled={state === "sending"}
                className="h-[44px] w-auto px-5 text-[15px]"
                wrapperClassName="w-auto shrink-0"
              >
                Subscribe
              </Button>
            </div>
            <p role="status" className="text-[13px] text-text-tertiary">
              {STATUS[state]}
            </p>
          </form>
        </div>
        <FeatureSketch sketch={updatesSketch} className="hidden @3xl:block" />
      </CornerBox>
    </section>
  );
}
