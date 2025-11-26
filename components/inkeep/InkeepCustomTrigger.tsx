import { useEffect, useState } from "react";
import useInkeepSettings from "./useInkeepSettings";
import type { InkeepModalSearchAndChatProps } from "@inkeep/cxkit-react";
import { Search } from "lucide-react";

export default function InkeepCustomTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [CustomTrigger, setCustomTrigger] =
    useState<(e: InkeepModalSearchAndChatProps) => JSX.Element>();

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // load the library asynchronously
  useEffect(() => {
    const loadCustomTrigger = async () => {
      try {
        const { InkeepModalSearchAndChat } = await import(
          "@inkeep/cxkit-react"
        );
        setCustomTrigger(() => InkeepModalSearchAndChat);
      } catch (error) {
        console.error("Failed to load CustomTrigger:", error);
      }
    };

    loadCustomTrigger();
  }, []);

  const customTriggerProps: InkeepModalSearchAndChatProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings: {
      ...modalSettings,
      isOpen,
      onOpenChange: setIsOpen,
    },
  };

  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className="relative flex items-center text-gray-900 dark:text-gray-300 contrast-more:text-gray-800 contrast-more:dark:text-gray-300 max-md:hidden hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-700 rounded-lg"
      >
        <div className="rounded-lg px-3 py-2 transition-colors w-full md:w-64 text-base leading-tight md:text-sm bg-black/[.05] dark:bg-gray-50/10 contrast-more:border contrast-more:border-current">
          Search or ask...
        </div>
        <kbd className="absolute my-1.5 select-none ltr:right-1.5 rtl:left-1.5 h-5 rounded bg-white px-1.5 font-mono text-[11px] font-medium text-gray-500 border dark:border-gray-100/20 dark:bg-black/50 contrast-more:border-current contrast-more:text-current contrast-more:dark:border-current items-center gap-1 flex max-sm:hidden">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>
      {CustomTrigger && <CustomTrigger {...customTriggerProps} />}
    </div>
  );
}
