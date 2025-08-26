"use client";
import React from "react";
import { useMDXComponents as getDocsMDXComponents } from "nextra-theme-docs";
import { Tabs, Callout, Cards } from "nextra/components";

// Project-specific MDX components
import { Frame } from "./components/Frame";
import { CloudflareVideo, Video } from "./components/Video";
import { LangTabs } from "./components/LangTabs";
import { MainContentWrapper } from "./components/MainContentWrapper";

export function useMDXComponents(components?: Record<string, any>) {
  const docs = getDocsMDXComponents();
  const DefaultWrapper = (docs as any).wrapper as React.ComponentType<any>;

  return {
    ...docs,
    ...components,
    // Provide/override commonly used MDX components
    Frame,
    Tabs,
    Callout,
    Cards,
    LangTabs,
    CloudflareVideo,
    Video,
    // Wrap the default theme wrapper to inject our content header/footer widgets
    wrapper: (props: any) => (
      <DefaultWrapper {...props}>
        <MainContentWrapper>{props.children}</MainContentWrapper>
      </DefaultWrapper>
    ),
  } as any;
}

