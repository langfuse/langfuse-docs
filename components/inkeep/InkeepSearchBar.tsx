import dynamic from "next/dynamic";
import type { InkeepSearchBarProps } from "@inkeep/cxkit-react";
import useInkeepSettings from "./useInkeepSettings";

const SearchBar = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepSearchBar),
  { ssr: false }
);

const css = String.raw;

export default function InkeepSearchBar() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const searchBarProps: InkeepSearchBarProps = {
    baseSettings: {
      ...baseSettings,
      theme: {
        styles: [
          {
            key: "1",
            type: "style",
            value: css`
              @media (max-width: 33em) {
                .ikp-search-bar__button {
                  padding-inline: 7px;
                }
                .ikp-search-bar__text {
                  display: none;
                }
                .ikp-search-bar__kbd-wrapper {
                  display: none;
                }
              }
            `,
          },
        ],
      },
    },
    aiChatSettings,
    searchSettings,
    modalSettings: { ...modalSettings, shortcutKey: "k" },
  };

  return (
    <div className="h-9 overflow-hidden">
      <SearchBar {...searchBarProps} />
    </div>
  );
}
