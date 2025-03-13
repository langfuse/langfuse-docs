import dynamic from "next/dynamic";
import type { InkeepEmbeddedChatProps } from "@inkeep/cxkit-react";
import useInkeepSettings from "./useInkeepSettings";

const EmbeddedChat = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepEmbeddedChat),
  {
    ssr: false,
    loading: () => <div>loading...</div>, // optional: loading animation component
  }
);

const css = String.raw;

function InkeepEmbeddedChat() {
  const { baseSettings, aiChatSettings } = useInkeepSettings();

  const embeddedChatProps: InkeepEmbeddedChatProps = {
    baseSettings: {
      ...baseSettings,
      theme: {
        styles: [
          {
            key: '1',
            type: 'style',
            value: css`
              .ikp-ai-chat-wrapper {
                width: 100%;
                height: auto;
                max-height: 100%;
              }
            `,
          },
        ],
      },
    },
    aiChatSettings,
  };

  return <EmbeddedChat {...embeddedChatProps} />;
}

export default InkeepEmbeddedChat;
