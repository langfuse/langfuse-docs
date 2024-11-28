import type {
  InkeepAIChatSettings,
  InkeepSearchSettings,
  InkeepBaseSettings,
  InkeepModalSettings,
} from "@inkeep/uikit";
import { useTheme } from "nextra-theme-docs";
import { openChat } from "../supportChat";
import { InkeepCallbackEvent } from "@inkeep/uikit";
import { type PostHog, usePostHog } from "posthog-js/react";

const customAnalyticsCallback = (
  event: InkeepCallbackEvent,
  posthog: PostHog
): void => {
  const { interactionType } = event.commonProperties;
  posthog.capture(`inkeep:${event.eventName}`, {
    interactionType,
  });
};

type InkeepSharedSettings = {
  baseSettings: InkeepBaseSettings;
  aiChatSettings: InkeepAIChatSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: InkeepModalSettings;
};

const useInkeepSettings = (): InkeepSharedSettings => {
  const { resolvedTheme } = useTheme();
  const posthog = usePostHog();

  const baseSettings: InkeepBaseSettings = {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
    integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID!,
    organizationId: process.env.NEXT_PUBLIC_INKEEP_ORGANIZATION_ID!,
    primaryBrandColor: "#E11312", // your brand color, widget color scheme is derived from this
    organizationDisplayName: "Langfuse",
    // ...optional settings
    colorMode: {
      forcedColorMode: resolvedTheme, // to sync dark mode with the widget
    },
    logEventCallback: (event) => customAnalyticsCallback(event, posthog),
    theme: {
      components: {
        SearchBarTrigger: {
          defaultProps: {
            size: "shrink", // 'expand' 'compact' 'shrink' 'medium'
            variant: "subtle", // 'emphasized' 'subtle',
          },
        },
      },
    },
  };

  const modalSettings: InkeepModalSettings = {
    // optional settings
  };

  const searchSettings: InkeepSearchSettings = {
    placeholder: "Search...",
  };

  const aiChatSettings: InkeepAIChatSettings = {
    // optional settings
    chatSubjectName: "Langfuse",
    botAvatarSrcUrl: "/icon256.png", // use your own bot avatar
    includeAIAnnotations: {
      shouldEscalateToSupport: true,
    },
    aiAnnotationPolicies: {
      shouldEscalateToSupport: [
        {
          threshold: "STANDARD", // "STRICT" or "STANDARD"
          action: {
            type: "SHOW_SUPPORT_BUTTON",
            label: "Contact Support",
            icon: { builtIn: "LuUsers" },
            action: {
              type: "INVOKE_CALLBACK",
              callback: () => openChat(),
            },
          },
        },
      ],
    },
    getHelpCallToActions: [
      {
        name: "Chat with us",
        type: "INVOKE_CALLBACK",
        callback: () => openChat(),
        icon: {
          builtIn: "IoChatbubblesOutline",
        },
      },
      {
        name: "GitHub Support",
        url: "https://langfuse.com/gh-support",
        icon: {
          builtIn: "FaGithub",
        },
      },
      {
        name: "Community Discord",
        url: "https://langfuse.com/discord",
        icon: {
          builtIn: "FaDiscord",
        },
      },
    ],
    quickQuestions: [
      "How can Langfuse help me?",
      "How to use the Python decorator for tracing?",
      "How to set up LLM-as-a-judge evals?",
    ],
  };

  return { baseSettings, aiChatSettings, searchSettings, modalSettings };
};

export default useInkeepSettings;
