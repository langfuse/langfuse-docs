"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "default" | "small";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const sizeClasses: Record<ButtonSize, { root: string; label: string; key: string }> = {
  default: {
    root: "h-[32px]",
    label: "px-3",
    key: "min-w-[32px] px-3",
  },
  small: {
    root: "h-[26px]",
    label: "px-2.5",
    key: "min-w-[26px] px-2.5",
  },
};

const variantClasses: Record<
  ButtonVariant,
  { root: string; label: string; key: string }
> = {
  primary: {
    root: "rounded-[1px] border border-text-secondary bg-text-primary text-primary-foreground [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
    label: "text-surface-bg",
    key: "border-l border-primary-foreground/20 bg-primary-foreground/15 text-primary-foreground",
  },
  secondary: {
    root: "rounded-[1px] border border-line-structure bg-surface-bg text-secondary-foreground [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
    label: "text-text-secondary",
    key: "border-l border-border bg-muted text-muted-foreground",
  },
};

const buttonBaseClasses =
  "inline-flex w-full min-w-0 max-w-full items-center justify-center gap-[6px] overflow-hidden p-[3px_3px_3px_8px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const labelTypographyClasses =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal]";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
}

function buttonVariants({ variant = "primary", size = "default", className }: ButtonVariantOptions) {
  return cn(buttonBaseClasses, variantClasses[variant].root, sizeClasses[size].root, className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
  shortcutKey?: string;
  wrapperClassName?: string;
  href?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      shortcutKey,
      wrapperClassName,
      href,
      target,
      rel,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const resolvedVariant: ButtonVariant =
      variant === "secondary" ? "secondary" : "primary";
    const resolvedSize: ButtonSize = size === "small" ? "small" : "default";

    const innerRef = React.useRef<HTMLElement | null>(null);
    const isLink = !asChild && Boolean(href);
    const setRefs = React.useCallback(
      (node: HTMLButtonElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    const setAnchorRef = React.useCallback((node: HTMLAnchorElement | null) => {
      innerRef.current = node;
    }, []);

    const trimmed = shortcutKey?.trim() ?? "";
    const hasShortcut = !asChild && trimmed.length > 0;
    const keyDisplay = hasShortcut ? trimmed.slice(0, 1).toUpperCase() : "";
    const keyLetter = trimmed.slice(0, 1).toLowerCase();

    React.useEffect(() => {
      if (!hasShortcut || disabled || !keyLetter) return;
      const handler = (e: KeyboardEvent) => {
        if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
        if (e.key.toLowerCase() !== keyLetter) return;
        if (isEditableTarget(e.target)) return;
        e.preventDefault();
        innerRef.current?.click();
      };

      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [hasShortcut, disabled, keyLetter]);

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={buttonVariants({
            variant: resolvedVariant,
            size: resolvedSize,
            className,
          })}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    const selectedSize = sizeClasses[resolvedSize];
    const selectedVariant = variantClasses[resolvedVariant];
    const content = hasShortcut ? (
      <>
        <span
          className={cn(
            "flex min-w-0 flex-1 items-center truncate",
            labelTypographyClasses,
            selectedVariant.label,
            selectedSize.label
          )}
        >
          {children}
        </span>
        <kbd
          className={cn(
            "flex shrink-0 items-center justify-center not-italic",
            labelTypographyClasses,
            selectedVariant.key,
            selectedSize.key
          )}
          aria-hidden
        >
          {keyDisplay}
        </kbd>
      </>
    ) : (
      <span
        className={cn(
          "flex min-w-0 items-center truncate",
          labelTypographyClasses,
          selectedVariant.label
        )}
      >
        {children}
      </span>
    );

    return (
      <div className={cn("p-2 button-wrapper", wrapperClassName)}>
        {isLink ? (
          <a
            ref={setAnchorRef}
            href={href}
            target={target}
            rel={rel}
            aria-disabled={disabled || undefined}
            tabIndex={disabled ? -1 : undefined}
            onClick={
              disabled
                ? (e) => {
                  e.preventDefault();
                }
                : undefined
            }
            className={cn(
              buttonVariants({
                variant: resolvedVariant,
                size: resolvedSize,
                className,
              }),
              hasShortcut ? "gap-0 justify-start px-0 py-0" : "justify-center px-3"
            )}
            aria-keyshortcuts={hasShortcut ? keyDisplay : undefined}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {content}
          </a>
        ) : (
          <button
            ref={setRefs}
            disabled={disabled}
            className={cn(
              buttonVariants({
                variant: resolvedVariant,
                size: resolvedSize,
                className,
              }),
              hasShortcut ? "gap-0 justify-start px-0 py-0" : "justify-center px-3"
            )}
            aria-keyshortcuts={hasShortcut ? keyDisplay : undefined}
            {...props}
          >
            {content}
          </button>
        )}
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
