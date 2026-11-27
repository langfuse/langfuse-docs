"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GatewayMoire } from "./GatewayMoire";
import styles from "./GatewayUpdateSignup.module.css";

type SignupState = "idle" | "sending" | "done" | "failed";

const STATUS: Record<SignupState, string> = {
  idle: "Gateway updates only, no spam.",
  sending: "Gateway updates only, no spam.",
  done: "Subscribed. Thanks.",
  failed: "That did not work. Try again in a moment.",
};

/** Closing section of /gateway: the email signup on the left, the hero's line field on the right. */
export function GatewayUpdateSignup() {
  const sectionRef = useRef<HTMLElement>(null);
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
      ref={sectionRef}
      data-use-case-section="updates"
      className="relative overflow-hidden border-t border-line-structure px-5 py-16 sm:px-10 sm:py-28"
    >
      {/* The field would sit behind the copy on a phone, so it starts at sm. */}
      <GatewayMoire
        pointerScopeRef={sectionRef}
        className={cn(styles.field, "hidden sm:block")}
      />
      <div className="relative max-w-[720px]">
        <p className="text-[13px] text-text-tertiary">Updates</p>
        <h2
          id="updates"
          data-toc-title="Updates"
          className="mt-2 text-[40px] leading-[1.02] tracking-[-0.02em] text-text-primary sm:text-[60px]"
        >
          Langfuse AI Gateway updates
        </h2>
        <p className="mt-5 max-w-[46ch] text-[18px] leading-[1.4] text-text-secondary">
          Get an email when we ship new gateway features and providers.
        </p>
        <form
          onSubmit={onSubmit}
          className="mt-9 flex max-w-[520px] flex-col gap-3"
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
    </section>
  );
}
