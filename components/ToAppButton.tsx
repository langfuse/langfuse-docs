import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const ToAppButton = () => {
  const [signedIn, setSignedIn] = useState<"EU" | "US" | false>(false);
  useEffect(async () => {
    if (process.env.NODE_ENV === "production") {
      try {
        const [eu, us] = await Promise.all([
          fetch("https://cloud.langfuse.com/api/auth/session", {
            credentials: "include",
          }),
          fetch("https://us.cloud.langfuse.com/api/auth/session", {
            credentials: "include",
          }),
        ]);
        if (isSignedIn(await us.json())) setSignedIn("US");
        else if (isSignedIn(await eu.json())) setSignedIn("EU");
        else setSignedIn(false);
      } catch (e) {}
    }
  }, []);
  return (
    <Button size="xs" asChild className="whitespace-nowrap">
      <Link
        href={
          signedIn === "US"
            ? "https://us.cloud.langfuse.com"
            : "https://cloud.langfuse.com"
        }
      >
        {signedIn ? "To App" : "Sign Up"}
      </Link>
    </Button>
  );
};

const isSignedIn = (session: Record<string, unknown>) => {
  // check if session is object and has key "user", get typing right
  return session && session.user;
};
