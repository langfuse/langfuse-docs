import dynamic from "next/dynamic";
import type { InkeepChatButtonProps } from "@inkeep/uikit";
import useInkeepSettings from "./useInkeepSettings";

const ChatButton = dynamic(
  () => import("@inkeep/uikit").then((mod) => mod.InkeepChatButton),
  {
    ssr: false,
  }
);

export default function InkeepChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return (
    <div className="w-20">
      <ChatButton {...chatButtonProps} />
    </div>
  );
}
