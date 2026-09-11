"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import {
  actionForDestination,
  attributionFromParams,
  destinationGroup,
  isUseCase,
  rememberUseCaseAttribution,
  withUseCaseAttribution,
  type UseCaseActionProperties,
  type UseCasePageProperties,
} from "@/lib/use-case-analytics";

/** One observer for links, including navigation, footer, and portaled menus. */
export function UseCaseAnalytics({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const posthog = usePostHog();
  const lastPage = useRef<{
    path: string;
    id: string;
    viewed: Set<string>;
  } | null>(null);

  useEffect(() => {
    if (!ready || !pathname) return;
    const inbound = attributionFromParams(
      new URLSearchParams(window.location.search),
    );
    if (inbound) rememberUseCaseAttribution(inbound);
    // A path change starts a visit. Query-only coding path switches do not.
    if (lastPage.current?.path !== pathname) lastPage.current = null;

    const timers = new Map<HTMLAnchorElement, ReturnType<typeof setTimeout>>();
    const ratios = new Map<HTMLAnchorElement, number>();
    const originalHrefs = new Map<HTMLAnchorElement, string>();
    const decoratedHrefs = new Map<HTMLAnchorElement, string>();
    let root: HTMLElement | null = null;

    function pageProperties(): UseCasePageProperties | null {
      root = document.querySelector<HTMLElement>("[data-use-case]");
      const useCase = root?.dataset.useCase;
      if (!root || !isUseCase(useCase) || root.dataset.useCasePage !== pathname)
        return null;
      const path = root.querySelector<HTMLElement>("[data-use-case-path]")
        ?.dataset.useCasePath;
      const fromUrl = new URLSearchParams(window.location.search).get("path");
      const setupPath = fromUrl === "hooks" ? "hooks" : path;
      if (!lastPage.current) {
        lastPage.current = {
          path: pathname!,
          id: crypto.randomUUID(),
          viewed: new Set(),
        };
        posthog.capture("use_case:page_viewed", {
          use_case: useCase,
          page_path: pathname,
          page_view_id: lastPage.current.id,
          page_version: "v1",
          ...(setupPath ? { setup_path: setupPath } : {}),
        });
      }
      return {
        use_case: useCase,
        page_path: pathname!,
        page_view_id: lastPage.current.id,
        page_version: "v1",
        ...(setupPath === "hooks" || setupPath === "gateway"
          ? { setup_path: setupPath }
          : {}),
      };
    }

    function properties(
      link: HTMLAnchorElement,
    ): UseCaseActionProperties | null {
      const page = pageProperties();
      if (!page || !link.getAttribute("href")) return null;
      let url: URL;
      try {
        url = new URL(link.href);
      } catch {
        return null;
      }
      if (!["http:", "https:"].includes(url.protocol)) return null;
      const section =
        link.closest<HTMLElement>("[data-use-case-section]")?.dataset
          .useCaseSection ??
        (link.closest("footer")
          ? "footer"
          : root?.contains(link)
            ? "content"
            : "navigation");
      const group = destinationGroup(url, window.location.origin);
      const action = link.dataset.useCaseAction ?? actionForDestination(group);
      const destination = `${url.origin === window.location.origin ? "" : url.origin}${url.pathname}${url.hash}`;
      const item =
        link.closest<HTMLElement>("[data-use-case-item]")?.dataset
          .useCaseItem ?? destination;
      return {
        ...page,
        section,
        action,
        item,
        destination,
        destination_group: group,
        placement_id: [
          page.use_case,
          section,
          action,
          item,
          page.setup_path ?? "default",
        ].join(":"),
      };
    }

    function visible(link: HTMLAnchorElement) {
      if (document.visibilityState !== "visible" || !link.isConnected)
        return false;
      if (link.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
      const style = getComputedStyle(link);
      return (
        style.visibility === "visible" &&
        style.display !== "none" &&
        Number(style.opacity) > 0
      );
    }

    function stopTimer(link: HTMLAnchorElement) {
      clearTimeout(timers.get(link));
      timers.delete(link);
    }

    function scheduleView(link: HTMLAnchorElement) {
      stopTimer(link);
      const props = properties(link);
      if (!props || !visible(link) || (ratios.get(link) ?? 0) < 0.5) return;
      if (lastPage.current?.viewed.has(props.placement_id)) return;
      timers.set(
        link,
        setTimeout(() => {
          timers.delete(link);
          const current = properties(link);
          if (
            !current ||
            current.placement_id !== props.placement_id ||
            !visible(link) ||
            (ratios.get(link) ?? 0) < 0.5
          )
            return;
          if (lastPage.current?.viewed.has(current.placement_id)) return;
          lastPage.current?.viewed.add(current.placement_id);
          posthog.capture("use_case:action_viewed", {
            ...current,
            visibility_threshold: 0.5,
            visible_ms: 1000,
          });
        }, 1000),
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = entry.target as HTMLAnchorElement;
          ratios.set(link, entry.intersectionRatio);
          scheduleView(link);
        }
      },
      { threshold: [0, 0.5] },
    );

    function scan() {
      if (!pageProperties()) return;
      document
        .querySelectorAll<HTMLAnchorElement>("a[href]")
        .forEach((link) => {
          if (!originalHrefs.has(link)) {
            originalHrefs.set(link, link.getAttribute("href")!);
            observer.observe(link);
          }
          const props = properties(link);
          if (
            props &&
            (props.destination_group === "signup" ||
              props.destination_group === "sales")
          ) {
            const href = withUseCaseAttribution(
              originalHrefs.get(link)!,
              window.location.origin,
              props,
            );
            if (link.getAttribute("href") !== href) {
              link.setAttribute("href", href);
            }
            decoratedHrefs.set(link, href);
          }
        });
      originalHrefs.forEach((_, link) => {
        if (!link.isConnected) {
          observer.unobserve(link);
          stopTimer(link);
          originalHrefs.delete(link);
          decoratedHrefs.delete(link);
          ratios.delete(link);
        }
      });
    }

    function onClick(event: MouseEvent) {
      if (
        (event.type === "click" && event.button !== 0) ||
        (event.type === "auxclick" && event.button !== 1)
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || !visible(link)) return;
      const props = properties(link);
      if (!props) return;
      rememberUseCaseAttribution(props);
      posthog.capture(
        "use_case:action_clicked",
        {
          ...props,
          was_exposed:
            lastPage.current?.viewed.has(props.placement_id) ?? false,
        },
        { transport: "sendBeacon", send_instantly: true },
      );
      if (
        props.destination_group === "signup" ||
        props.destination_group === "sales"
      ) {
        if (!originalHrefs.has(link)) {
          originalHrefs.set(link, link.getAttribute("href")!);
        }
        link.href = withUseCaseAttribution(
          link.href,
          window.location.origin,
          props,
        );
        decoratedHrefs.set(link, link.getAttribute("href")!);
        // Own this navigation: Next Link and custom button handlers can still
        // navigate to their original props after preventDefault(), losing tags.
        if (
          !event.defaultPrevented &&
          event.button === 0 &&
          !event.metaKey &&
          !event.ctrlKey &&
          !event.shiftKey &&
          !event.altKey &&
          (!link.target || link.target === "_self")
        ) {
          event.preventDefault();
          event.stopPropagation();
          window.location.assign(link.href);
        }
      }
    }

    function onInteraction(event: Event) {
      const page = pageProperties();
      const { kind, item } = (event as CustomEvent).detail;
      if (!page || !["benefit_opened", "path_selected"].includes(kind)) return;
      posthog.capture(`use_case:${kind}`, {
        ...page,
        item,
        ...(kind === "path_selected" ? { setup_path: item } : {}),
      });
      // Re-evaluate impressions when a panel changes without scrolling.
      scan();
      ratios.forEach((_, link) => scheduleView(link));
    }

    const onVisibilityChange = () =>
      ratios.forEach((_, link) => scheduleView(link));
    const mutations = new MutationObserver(scan);
    scan();
    mutations.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["hidden", "data-use-case-path"],
    });
    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onClick, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("lf:use-case-interaction", onInteraction);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      timers.forEach(clearTimeout);
      originalHrefs.forEach((href, link) => {
        // React may already have reused this node for the next route.
        // Restore only hrefs that still contain this tracker's decoration.
        if (link.getAttribute("href") === decoratedHrefs.get(link)) {
          link.setAttribute("href", href);
        }
      });
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onClick, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("lf:use-case-interaction", onInteraction);
    };
  }, [pathname, posthog, ready]);

  return null;
}
