"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ProductUpdateSignup(props: {
  source?: string;
  className?: string;
  small?: boolean;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const res = await fetch("/api/productUpdateSignup", {
      method: "POST",
      body: JSON.stringify({
        email,
        source: props.source ?? "Website signup",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setIsSubmitting(false);

    if (!res.ok) {
      alert("Something went wrong. Please try again later.");
    } else {
      alert("Thanks for signing up!");
      setEmail("");
    }
  }

  const sizeH = props.small ? "h-[26px]" : "h-[32px]";

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex gap-y-2 w-full flex-row items-center max-w-sm", props.className)}
    >
      <Input
        placeholder="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn("flex-1 min-w-0 rounded-r-none z-10", sizeH)}
      />
      <Button
        type="submit"
        variant="secondary"
        disabled={isSubmitting}
        size={props.small ? "small" : undefined}
        wrapperClassName={cn("w-auto shrink-0", props.compact && "-ml-1")}
        className="w-auto"
      >
        {isSubmitting ? <>Submitting...</> : <>Subscribe</>}
      </Button>
    </form>
  );
}
