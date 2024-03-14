import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function ProductUpdateSignup(props: {
  source?: string;
  className?: string;
  small?: boolean;
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

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex gap-y-2 w-full flex-row max-w-sm", props.className)}
    >
      <Input
        placeholder="Enter your email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={cn("rounded-r-none h-11 px-4 py-2", props.small && "h-9")}
      />
      <Button
        type="submit"
        variant="secondary"
        className="rounded-l-none"
        disabled={isSubmitting}
        size={props.small ? "sm" : "lg"}
      >
        {isSubmitting ? <>Submitting&nbsp;...</> : <>Get&nbsp;updates</>}
      </Button>
    </form>
  );
}
