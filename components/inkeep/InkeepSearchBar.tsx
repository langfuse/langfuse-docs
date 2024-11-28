import React, { useEffect, useState } from "react";
import useInkeepSettings from "./useInkeepSettings";
import type { InkeepSearchBarProps } from "@inkeep/uikit";

export default function InkeepSearchBar() {
  const [SearchBar, setSearchBar] =
    useState<(e: InkeepSearchBarProps) => JSX.Element>();

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  // load the library asynchronously
  useEffect(() => {
    const loadSearchBar = async () => {
      try {
        const { InkeepSearchBar } = await import("@inkeep/uikit");
        setSearchBar(() => InkeepSearchBar);
      } catch (error) {
        console.error("Failed to load SearchBar:", error);
      }
    };

    loadSearchBar();
  }, []);

  const searchBarProps: InkeepSearchBarProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  if (!SearchBar) return null;

  return (
    <div className="h-9 overflow-hidden">
      <SearchBar {...searchBarProps} />
    </div>
  );
}
