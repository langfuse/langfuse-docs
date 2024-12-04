import dynamic from "next/dynamic";
import type { InkeepSearchBarProps } from "@inkeep/uikit";
import useInkeepSettings from "./useInkeepSettings";

const SearchBar = dynamic(
  () => import("@inkeep/uikit").then((mod) => mod.InkeepSearchBar),
  { ssr: false }
);

export default function InkeepSearchBar() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const searchBarProps: InkeepSearchBarProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings: { ...modalSettings, isShortcutKeyEnabled: true },
  };

  return (
    <div className="h-9 overflow-hidden">
      <SearchBar {...searchBarProps} />
    </div>
  );
}
