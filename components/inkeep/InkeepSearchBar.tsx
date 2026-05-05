'use client';

import dynamic from "next/dynamic";
import type { InkeepSearchBarProps } from "@inkeep/cxkit-react";
import useInkeepSettings from "./useInkeepSettings";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchBar = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepSearchBar),
  { ssr: false }
);

const css = String.raw;

type InkeepSearchProps = {
  className?: string;
}

type InkeepSearchButtonProps = {
  className?: string;
}

export function InkeepSearchButton({ className }: InkeepSearchButtonProps) {
  return (
    <Button data-inkeep-modal-trigger className={className} size="small" variant="secondary" icon={<Search className="size-3.5" />} />
  )
}

export default function InkeepSearchBar({ className }: InkeepSearchProps) {
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
              .ikp-modal__content { border-radius: 0; }
              .ikp-ai-search-wrapper { background: var(--surface-bg); }
              .ikp-search-bar__button {
                border-radius: 2px;
                border-top-width: 0;
                border-left-width: 0;
                border-right-width: 0;
                border-bottom: 1px solid var(--line-structure);
                max-height: 26px;
                min-height: 26px;
                padding-inline: 2px;
              }
              .ikp-search-bar__button:hover {
                border-color: transparent !important;
                border-bottom-color: var(--line-cta) !important;
              }
              .ikp-search-bar__container {
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .ikp-search-bar__text {
                font-size: 13px;
                color: var(--text-tertiary);
                transition: color 0.2s ease-in-out;
              }
              .ikp-search-bar__kbd-wrapper {
                font-size: 13px;
                color: var(--text-disabled);
                transition: color 0.2s ease-in-out;
              }
              .ikp-search-bar__button:hover .ikp-search-bar__text {
                color: var(--text-primary);
              }
              .ikp-search-bar__button:hover .ikp-search-bar__kbd-wrapper {
                color: var(--text-secondary);
              }
              @media (min-width: 1024px) {
                .ikp-search-bar__button {
                  width: 240px;
                }
                .ikp-search-bar__icon[data-part='icon'][data-type='built-in'] {
                  display: none;
                }
              }
              @media (max-width: 1023px) {
                .ikp-search-bar__button {
                  width: 26px;
                  border: 1px solid var(--line-structure);
                  border-radius: 2px;
                  background: var(--surface-bg);
                  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.05), 0 4px 4px 0 rgba(0,0,0,0.03);
                  padding: 0;
                  justify-content: center;
                  color: var(--text-primary);
                  transition: color 0.2s ease-in-out;
                }
                .ikp-search-bar__icon {
                  color: var(--text-primary) !important;
                }
                .ikp-search-bar__button:hover {
                  border-color: var(--line-cta) !important;
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
    modalSettings: { ...modalSettings, shortcutKey: "k", triggerSelector: "[data-inkeep-modal-trigger]", },
  };

  return (
    <div className={className}>
      <div className="hidden lg:block">
        <SearchBar {...searchBarProps} />
      </div>
    </div>
  )
}
