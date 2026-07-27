"use client";

import dynamic from "next/dynamic";
import type { InkeepSearchBarProps } from "@inkeep/cxkit-react";
import useInkeepSettings from "./useInkeepSettings";
import { withInkeepSearchTheme } from "./inkeep-search-theme";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepSearchBar),
  { ssr: false },
);

type InkeepSearchProps = {
  className?: string;
};

type InkeepSearchButtonProps = {
  className?: string;
};

export function InkeepSearchButton({ className }: InkeepSearchButtonProps) {
  const settings = useInkeepSettings();

  if (!settings) {
    return null;
  }

  return (
    <Button
      data-inkeep-modal-trigger
      className={className}
      size="small"
      variant="secondary"
      icon={<Search className="size-3.5" />}
    />
  );
}

export default function InkeepSearchBar({ className }: InkeepSearchProps) {
  const settings = useInkeepSettings();

  if (!settings) {
    return null;
  }

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    settings;

  const searchBarProps: InkeepSearchBarProps = {
    baseSettings: withInkeepSearchTheme(baseSettings),
    aiChatSettings,
    searchSettings,
    modalSettings: {
      ...modalSettings,
      shortcutKey: "k",
      triggerSelector: "[data-inkeep-modal-trigger]",
    },
  };

  return (
    <div className={className}>
      <div className="hidden lg:block">
        <SearchBar {...searchBarProps} />
      </div>
    </div>
  );
}
