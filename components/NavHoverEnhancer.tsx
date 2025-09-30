"use client";

import { useEffect } from "react";

export function NavHoverEnhancer() {
  useEffect(() => {
    // Function to add hover behavior to menu items
    const addHoverBehavior = () => {
      // Find all menu buttons (Product and Resources)
      const menuButtons = document.querySelectorAll(
        '.nextra-nav-container button[aria-haspopup="menu"]'
      );

      menuButtons.forEach((button) => {
        const htmlButton = button as HTMLButtonElement;
        let hoverTimeout: NodeJS.Timeout | null = null;
        let isMenuOpen = false;

        // Function to open menu
        const openMenu = () => {
          if (htmlButton.getAttribute("aria-expanded") === "false") {
            htmlButton.click();
            isMenuOpen = true;
          }
        };

        // Function to close menu
        const closeMenu = () => {
          if (htmlButton.getAttribute("aria-expanded") === "true") {
            htmlButton.click();
            isMenuOpen = false;
          }
        };

        // Add hover listener to button
        button.addEventListener("mouseenter", () => {
          if (hoverTimeout) clearTimeout(hoverTimeout);
          openMenu();
        });

        // Add mouseleave listener to button
        button.addEventListener("mouseleave", (e) => {
          const relatedTarget = e.relatedTarget as HTMLElement;
          
          // Check if mouse is moving to the dropdown content
          const isMovingToDropdown = relatedTarget?.closest('[role="menu"]');
          
          if (!isMovingToDropdown) {
            // Add a small delay before closing
            hoverTimeout = setTimeout(() => {
              closeMenu();
            }, 100);
          }
        });

        // Find the associated dropdown menu
        const findDropdown = () => {
          // Headless UI renders the dropdown in a portal, so we need to find it
          const buttonId = htmlButton.getAttribute("id");
          if (buttonId) {
            return document.querySelector(`[aria-labelledby="${buttonId}"]`);
          }
          return null;
        };

        // Add listeners to the dropdown content
        const addDropdownListeners = () => {
          setTimeout(() => {
            const dropdown = findDropdown();
            if (dropdown) {
              dropdown.addEventListener("mouseenter", () => {
                if (hoverTimeout) clearTimeout(hoverTimeout);
              });

              dropdown.addEventListener("mouseleave", (e) => {
                const relatedTarget = e.relatedTarget as HTMLElement;
                
                // Check if mouse is moving back to the button
                const isMovingToButton = relatedTarget === htmlButton || htmlButton.contains(relatedTarget);
                
                if (!isMovingToButton) {
                  hoverTimeout = setTimeout(() => {
                    closeMenu();
                  }, 100);
                }
              });
            }
          }, 50); // Small delay to ensure dropdown is rendered
        };

        // Watch for dropdown opening to add listeners
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (
              mutation.type === "attributes" &&
              mutation.attributeName === "aria-expanded" &&
              htmlButton.getAttribute("aria-expanded") === "true"
            ) {
              addDropdownListeners();
            }
          });
        });

        observer.observe(htmlButton, { attributes: true });
      });
    };

    // Wait for the navigation to be fully rendered
    const timeoutId = setTimeout(addHoverBehavior, 500);

    // Also try to add behavior when navigation updates
    const observer = new MutationObserver(() => {
      addHoverBehavior();
    });

    const navContainer = document.querySelector(".nextra-nav-container");
    if (navContainer) {
      observer.observe(navContainer, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
}