import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OSSFriend {
  name: string;
  description: string;
  href: string;
}

async function getOSSFriends(): Promise<OSSFriend[]> {
  const res = await fetch("https://formbricks.com/api/oss-friends", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.data as OSSFriend[];
}

export async function OSSFriendsPage() {
  let friends: OSSFriend[];
  try {
    friends = await getOSSFriends();
  } catch {
    return <p>Error loading OSS Friends.</p>;
  }

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
