import { Button } from "@/components/ui/button";
import Link from "next/link";
import fallbackFriends from "@/lib/oss-friends-fallback.json";

interface OSSFriend {
  name: string;
  description: string;
  href: string;
}

async function getOSSFriends(): Promise<OSSFriend[]> {
  try {
    const res = await fetch("https://formbricks.com/api/oss-friends", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data?.data) || data.data.length === 0) {
      throw new Error("empty OSS friends payload");
    }
    return data.data as OSSFriend[];
  } catch {
    return fallbackFriends as OSSFriend[];
  }
}

export async function OSSFriendsPage() {
  const friends = await getOSSFriends();

  return (
    <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {friends.map((friend) => (
        <div
          key={friend.href}
          className="flex flex-col gap-2 overflow-hidden rounded p-4 border bg-card"
        >
          <Link href={friend.href} className="text-xl font-bold">
            {friend.name}
          </Link>
          <p className="my-2">{friend.description}</p>
          <div className="mt-auto">
            <Button target="_blank" variant="secondary" size="default" asChild>
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
