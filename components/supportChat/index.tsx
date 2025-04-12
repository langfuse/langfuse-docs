import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Plain: any;
  }
}

export const PlainChat = () => {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PLAIN_APP_ID) {
      console.error("NEXT_PUBLIC_PLAIN_APP_ID is not set");
      return;
    }

    // Check if URL contains supportChat parameter
    const shouldShowChat =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("supportChat") === "1";

    // Load the script only once
    if (!scriptRef.current) {
      const script = document.createElement("script");
      script.async = false;
      script.src = "https://chat.cdn-plain.com/index.js";
      script.onload = () => {
        window.Plain.init({
          appId: process.env.NEXT_PUBLIC_PLAIN_APP_ID,
          hideLauncher: !shouldShowChat, // Show launcher if URL parameter is present
          hideBranding: true,
          requireAuthentication: true,
          style: {
            brandColor: {
              light: "#000000",
              dark: "#dddddd",
            }, // This will be used in various places in the chat widget such as the primary chat button and send message button
            brandBackgroundColor: "#0A60B5", // Used for the background of the chat widget on the intro screen
            launcherBackgroundColor: "#666666", // These can also be passed in this format { light: '#FFFFFF', dark: '#000000' }
            launcherIconColor: "#FFFFFF",
          },

          position: {
            right: "25px",
            bottom: "80px",
          },
        });

        // If URL parameter is present, open the chat immediately
        if (shouldShowChat) {
          window.Plain.open();
        }
      };

      document.head.appendChild(script);
      scriptRef.current = script;

      // Cleanup function to remove the script when the component unmounts
      return () => {
        if (scriptRef.current && document.head.contains(scriptRef.current)) {
          document.head.removeChild(scriptRef.current);
        }
      };
    }
  }, []);

  return null;
};

export const chatAvailable = !!process.env.NEXT_PUBLIC_PLAIN_APP_ID;

export const showChatLauncherIfUnreadMessages = (): void => {
  if (chatAvailable) {
    const unreadMessages = getUnreadMessageCount();
    if (unreadMessages && unreadMessages > 0) {
      showChatLauncher();
    }
  }
};

export const hideChat = (): void => {
  if (chatAvailable) {
    window.Plain.close();
  }
};

export const showChatLauncher = (): void => {
  if (chatAvailable) {
    window.Plain.update({
      hideLauncher: false,
    });
  }
};

export const hideChatLauncher = (): void => {
  if (chatAvailable) {
    window.Plain.update({
      hideLauncher: true,
    });
  }
};

export const showChat = (): void => {
  if (chatAvailable) {
    showChatLauncher();
    window.Plain.open();
  }
};

export const getUnreadMessageCount = (): number | null => {
  if (chatAvailable) {
    return window.Plain.getUnreadMessageCount();
  }
  return null;
};
