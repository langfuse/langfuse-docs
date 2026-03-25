"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OSSFriend {
  name: string;
  description: string;
  href: string;
}

/**
 * Fetches and renders OSS Friends from the Formbricks API at runtime.
 * Replaces the old Nextra getStaticProps/useData pattern.
 */
export function OSSFriendsPage() {
  const [friends, setFriends] = useState<OSSFriend[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://formbricks.com/api/oss-friends")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setFriends(data.data))
      .catch(() => setError(true));
  }, []);

  if (error) return <p>Error loading OSS Friends.</p>;
  if (!friends)
    return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {friends.map((friend, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 overflow-hidden rounded p-4 border bg-card"
        >
          <Link href={friend.href} className="text-xl font-bold">
            {friend.name}
          </Link>
          <p className="my-2">{friend.description}</p>
          <div className="mt-auto">
            <Button target="_blank" variant="secondary" asChild>
              <Link href={friend.href} rel="noopener">
                Learn more
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
