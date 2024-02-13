import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const AssistMeIcon = ({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/assistme.svg"
    width={40}
    height={20}
    alt="AssistMe Icon"
    className={className}
  />
);

export const SidebarChecker = () => {
  useEffect(() => {
    let element = document.querySelector('.nextra-sidebar-container');
    element.className = 'hidden';
  }, [])
  return (<></>);
}

export const AssistMeLogo = ({
  className,
  size = "sm",
}: {
  size?: "sm" | "xl";
  className?: string;
}) => {

  return (
    <div className={cn("flex items-center", className)}>
      <AssistMeIcon size={size === "sm" ? 16 : 32} />
      <span
        className={cn(
          "font-semibold",
          size === "sm" ? "ml-2 text-sm" : "ml-3 text-xl",
        )}
      >
        AssistMe
      </span>
    </div>
  )
};
