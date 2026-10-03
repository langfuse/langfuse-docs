"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Tabs as FumadocsTabs,
  TabsList as FumadocsTabsList,
  TabsTrigger as FumadocsTabsTrigger,
  TabsContent as FumadocsTabsContent,
  type TabsProps as FumadocsTabsProps,
} from "fumadocs-ui/components/ui/tabs";
import { cn } from "@/lib/utils";
import { resolveTabsPersist } from "@/lib/tabs-persist";
import { CornerBox } from "./ui";

/**
 * Match fumadocs-ui simple-mode value escaping so persist keys stay compatible
 * with stock `items` tabs.
 */
function escapeValue(v: string): string {
  return v.toLowerCase().replace(/\s/, "-");
}

function itemLabel(item: unknown, index: number): string {
  if (typeof item === "string") return item;
  if (
    item &&
    typeof item === "object" &&
    "label" in item &&
    typeof (item as { label: unknown }).label === "string"
  ) {
    return (item as { label: string }).label;
  }
  return String(index);
}

export function LangTab({
  className,
  forceMount = true,
  ...props
}: React.ComponentProps<typeof FumadocsTabsContent>) {
  return (
    <FumadocsTabsContent
      // Fumadocs 16.12+ unmounts inactive tabs by default. Keep previous
      // behavior so TOC/hash links and mermaid/code in other tabs still work.
      forceMount={forceMount}
      className={cn(
        "pt-4 text-sm bg-transparent rounded-none prose-no-margin bg-stripe-pattern",
        className,
      )}
      {...props}
    />
  );
}

type LangTabsProps = {
  items: unknown[];
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (next: number) => void;
} & Omit<FumadocsTabsProps, "children">;

export function LangTabs({
  items,
  children,
  defaultIndex = 0,
  onChange,
  groupId: groupIdProp,
  persist: persistProp,
  defaultValue: defaultValueProp,
  value: valueProp,
  onValueChange,
  className,
  ...props
}: LangTabsProps) {
  const labels = useMemo(
    () => items.map((item, i) => itemLabel(item, i)),
    [items],
  );
  const values = useMemo(
    () => labels.map((label) => escapeValue(label)),
    [labels],
  );
  const { groupId, persist } = resolveTabsPersist({
    labels,
    groupId: groupIdProp,
    persist: persistProp,
  });

  const fallbackValue = values[defaultIndex] ?? values[0];
  const defaultValue = defaultValueProp ?? fallbackValue;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = valueProp ?? uncontrolledValue;

  const containerRef = useRef<HTMLDivElement>(null);
  const pendingOffsetRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingOffsetRef.current === null || !containerRef.current) return;
    const savedOffset = pendingOffsetRef.current;
    pendingOffsetRef.current = null;
    const restoreScroll = () => {
      if (!containerRef.current) return;
      const adjustment =
        containerRef.current.getBoundingClientRect().top - savedOffset;
      if (Math.abs(adjustment) > 1) {
        window.scrollBy({ top: adjustment, behavior: "instant" });
      }
    };
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    setTimeout(restoreScroll, 0);
    setTimeout(restoreScroll, 50);
  }, [value]);

  const handleValueChange = (next: string) => {
    if (!values.includes(next)) return;
    if (containerRef.current) {
      pendingOffsetRef.current =
        containerRef.current.getBoundingClientRect().top;
    }
    if (valueProp === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
    const idx = values.indexOf(next);
    if (typeof onChange === "function" && idx !== -1) onChange(idx);
  };

  return (
    <div ref={containerRef}>
      <CornerBox>
        <FumadocsTabs
          {...props}
          groupId={groupId}
          persist={persist}
          value={value}
          onValueChange={handleValueChange}
          className={cn(
            "flex overflow-hidden flex-col my-0 rounded-none border-none",
            className,
          )}
        >
          <FumadocsTabsList
            className={
              "flex overflow-x-auto overflow-y-hidden flex-nowrap gap-2 px-4 pt-1 rounded-none border-b sm:gap-4 not-prose border-line-structure min-h-9 bg-surface-bg"
            }
          >
            {labels.map((label, i) => (
              <FumadocsTabsTrigger
                key={values[i]}
                value={values[i]}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-none border-b border-transparent pb-2 pt-1.5 text-xs text-text-tertiary transition-colors font-[430] hover:text-foreground cursor-pointer disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-line-cta data-[state=active]:text-text-primary data-[state=active]:font-medium"
              >
                {label}
              </FumadocsTabsTrigger>
            ))}
          </FumadocsTabsList>
          {React.Children.map(children, (child, i) => {
            if (!React.isValidElement(child)) return child;
            return React.cloneElement(
              child as React.ReactElement<{ value: string }>,
              {
                value: values[i] ?? String(i),
              },
            );
          })}
        </FumadocsTabs>
      </CornerBox>
    </div>
  );
}

export const LangTabsWithTab = Object.assign(LangTabs, { Tab: LangTab });
