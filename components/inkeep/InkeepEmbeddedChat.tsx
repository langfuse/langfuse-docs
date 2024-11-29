import dynamic from "next/dynamic";
import { InkeepEmbeddedChatProps } from "@inkeep/uikit";
import useInkeepSettings from "./useInkeepSettings";

const EmbeddedChat = dynamic(
  () => import("@inkeep/uikit").then((mod) => mod.InkeepEmbeddedChat),
  {
    ssr: false,
    loading: () => <div>loading...</div>, // optional: loading animation component
  }
);

function InkeepEmbeddedChat() {
  const { baseSettings, aiChatSettings } = useInkeepSettings();

  const embeddedChatProps: InkeepEmbeddedChatProps = {
    baseSettings,
    aiChatSettings,
  };

  return <EmbeddedChat {...embeddedChatProps} />;
}

export default InkeepEmbeddedChat;
