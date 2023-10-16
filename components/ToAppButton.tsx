import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export const ToAppButton = () => {
  const [signedIn, setSignedIn] = useState<"EU" | "US" | false>(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Promise.all([
        fetch("https://us.cloud.langfuse.com/api/auth/session", {
          credentials: "include",
          mode: "cors",
        }),
        fetch("https://cloud.langfuse.com/api/auth/session", {
          credentials: "include",
          mode: "cors",
        }),
      ])
        .then(async ([us, eu]) => {
          return Promise.all([us.json(), eu.json()]).then(([us, eu]) => {
            if (isSignedIn(us)) setSignedIn("US");
            else if (isSignedIn(eu)) setSignedIn("EU");
            else setSignedIn(false);
          });
        })
        .catch(() => setSignedIn(false));
    }
  }, []);
  return (
    <Button size="xs" asChild className="whitespace-nowrap w-[70px]">
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
  return session && "user" in session;
};
