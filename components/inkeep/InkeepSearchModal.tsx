"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  InkeepModalSearchAndChatProps,
  InkeepModalSearchAndChat as InkeepModalSearchAndChatType,
} from "@inkeep/cxkit-react";
import useInkeepSettings from "./useInkeepSettings";
import { withInkeepSearchTheme } from "./inkeep-search-theme";

const TRIGGER_SELECTOR = "[data-inkeep-modal-trigger]";

type CxKitModule = typeof import("@inkeep/cxkit-react");
type ModalComponent = typeof InkeepModalSearchAndChatType;

let cxKitPromise: Promise<CxKitModule> | undefined;

function loadCxKit(): Promise<CxKitModule> {
  if (!cxKitPromise) {
    cxKitPromise = import("@inkeep/cxkit-react").catch((error) => {
      cxKitPromise = undefined;
      throw error;
    });
  }

  return cxKitPromise;
}

export function preloadInkeepSearchModal(): void {
  void loadCxKit().catch(() => undefined);
}

function isModalTrigger(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest(TRIGGER_SELECTOR));
}

export function InkeepSearchModal() {
  const settings = useInkeepSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [Modal, setModal] = useState<ModalComponent | null>(null);

  const loadModal = useCallback(() => {
    void loadCxKit()
      .then((module) => {
        setModal(() => module.InkeepModalSearchAndChat);
      })
      .catch(() => {
        setModal(null);
      });
  }, []);

  const openModal = useCallback(() => {
    setIsOpen(true);
    loadModal();
  }, [loadModal]);

  useEffect(() => {
    if (!settings) return;

    const handlePointerIntent = (event: PointerEvent | FocusEvent) => {
      if (isModalTrigger(event.target)) {
        loadModal();
      }
    };
    const handleClick = (event: MouseEvent) => {
      if (!isModalTrigger(event.target)) return;
      event.preventDefault();
      openModal();
    };
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() !== "k" ||
        (!event.metaKey && !event.ctrlKey) ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      openModal();
    };

    document.addEventListener("pointerover", handlePointerIntent, true);
    document.addEventListener("pointerdown", handlePointerIntent, true);
    document.addEventListener("focusin", handlePointerIntent, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("pointerover", handlePointerIntent, true);
      document.removeEventListener("pointerdown", handlePointerIntent, true);
      document.removeEventListener("focusin", handlePointerIntent, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("keydown", handleShortcut);
    };
  }, [loadModal, openModal, settings]);

  if (!settings || !Modal) {
    return null;
  }

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    settings;
  const modalProps: InkeepModalSearchAndChatProps = {
    baseSettings: withInkeepSearchTheme(baseSettings),
    aiChatSettings,
    searchSettings,
    modalSettings: {
      ...modalSettings,
      isOpen,
      onOpenChange: setIsOpen,
      shortcutKey: null,
    },
  };

  return <Modal {...modalProps} />;
}
