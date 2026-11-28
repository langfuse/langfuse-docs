"use client";

import { useRouter } from "next/navigation";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

export function CookieSettingsButton({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window.revisitCkyConsent === "function") {
      window.revisitCkyConsent();
    } else {
      router.push("/cookie-policy");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "cursor-pointer border-0 bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        className,
      )}
    >
      <Text size="s" as="span" className={textClassName}>
        Cookie settings
      </Text>
    </button>
  );
}
