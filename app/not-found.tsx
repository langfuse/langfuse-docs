import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="mb-4">Sorry, we couldn’t find that page.</p>
      <Link href="/" className="underline">
        Go back home
      </Link>
    </div>
  );
}
