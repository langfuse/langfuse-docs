import React, { useEffect, useState } from "react";
import useInkeepSettings from "./useInkeepSettings";
import type { InkeepChatButtonProps } from "@inkeep/uikit";
import { isChatOpen } from "../supportChat/chat";

export default function InkeepChatButton() {
  const [ChatButton, setChatButton] =
    useState<(e: InkeepChatButtonProps) => JSX.Element>();

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  // load the library asynchronously
  useEffect(() => {
    const loadChatButton = async () => {
      try {
        const { InkeepChatButton } = await import("@inkeep/uikit");
        setChatButton(() => InkeepChatButton);
      } catch (error) {
        console.error("Failed to load ChatButton:", error);
      }
    };

    loadChatButton();
  }, []);

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return (
    ChatButton && (
      <div className="w-20">
        <ChatButton {...chatButtonProps} />
      </div>
    )
  );
}
