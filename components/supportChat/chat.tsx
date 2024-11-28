"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { usePostHog } from "posthog-js/react";

const CrispChat = () => {
  const posthog = usePostHog();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
      Crisp.configure(process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID, {
        autoload: false,
      });
      Crisp.chat.onChatInitiated(() => {
        posthog.capture("support_chat:initiated");
      });
      Crisp.chat.onChatOpened(() => {
        posthog.capture("support_chat:opened");
      });
      Crisp.message.onMessageSent(() => {
        posthog.capture("support_chat:message_sent");
      });
      return () => {
        Crisp.chat.offChatInitiated();
        Crisp.chat.offChatOpened();
        Crisp.message.offMessageSent();
      };
    }
  }, [posthog]);

  return null;
};

export default CrispChat;

export const openChat = () => {
  if (process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
    Crisp.chat.open();
  }
};

export const isChatOpen = () => {
  if (process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID) {
    return Crisp.chat.isChatOpened();
  }
  return false;
};
