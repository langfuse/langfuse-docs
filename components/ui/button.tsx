"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { HoverCorners } from "./corner-box";
import NextLink from "next/link";

type ButtonVariant = "primary" | "secondary" | "text";
type ButtonSize = "default" | "small";

type ButtonVariantOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

const sizeClasses: Record<ButtonSize, { root: string }> = {
  default: {
    root: "h-[32px]",
  },
  small: {
    root: "h-[26px]",
  },
};

const variantClasses: Record<ButtonVariant, { root: string; key: string }> = {
  primary: {
    root: "border-text-secondary bg-text-primary text-surface-bg",
    key: "border border-[rgba(64,61,57,0.30)] bg-[rgba(64,61,57,0.40)]",
  },
  secondary: {
    root: "border-line-structure group-hover:border-line-cta bg-surface-bg text-text-secondary",
    key: "border border-[rgba(64,61,57,0.20)] grou bg-[rgba(64,61,57,0.10)]",
  },
  text: {
    root: "border-transparent bg-transparent text-text-secondary shadow-none [box-shadow:none] hover:bg-transparent hover:text-text-primary",
    key: "",
  },
};

const textButtonBaseClasses =
  "inline-flex w-full min-w-0 max-w-full items-center justify-center gap-[6px] overflow-hidden px-0 py-1 shadow-none border-0 rounded-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const buttonBaseClasses =
  "inline-flex w-full min-w-0 max-w-full items-center justify-center no-underline gap-[6px] overflow-hidden py-0.75 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50";

const labelTypographyClasses =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] p-0";

function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el instanceof HTMLElement && (el.isContentEditable || el.closest("[contenteditable='true']"))) return true;
  return false;
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (target instanceof HTMLElement && isEditableElement(target)) return true;

  // Traverse shadow DOM boundaries to find the deeply focused element,
  // needed for third-party components (e.g. Inkeep) that use shadow DOM.
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  if (active && isEditableElement(active)) return true;

  return false;
}

function hasRenderableChildren(children: React.ReactNode): boolean {
  return React.Children.toArray(children).some(
    (child) => child !== null && child !== undefined && child !== false && child !== ""
  );
}

function buttonVariants({ variant = "primary", size = "default", className }: ButtonVariantOptions) {
  if (variant === "text") {
    return cn(
      textButtonBaseClasses,
      variantClasses.text.root,
      size === "small" ? "min-h-[26px]" : "min-h-[32px]",
      className
    );
  }
  return cn(
    'rounded-[2px] border [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]',
    buttonBaseClasses, variantClasses[variant].root, sizeClasses[size].root, className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
  shortcutKey?: string;
  showShortcutonMobile?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
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
      showShortcutonMobile = false,
      icon,
      iconPosition = "start",
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
      variant === "secondary"
        ? "secondary"
        : variant === "text"
          ? "text"
          : "primary";
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
    const isTextVariant = resolvedVariant === "text";
    const hasChildren = hasRenderableChildren(children);
    const isIconOnly = Boolean(icon) && !hasChildren;
    const hasShortcut =
      !asChild && !isTextVariant && trimmed.length > 0 && hasChildren;
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
    const iconEl = icon ? (
      <span
        className={cn(
          "button-icon-area flex shrink-0 items-center justify-center h-full aspect-square *:max-w-full rounded-[1.5px] border-[0.5px] border-[rgba(64,61,57,0.20)] bg-[rgba(64,61,57,0.10)] dark:bg-transparent p-[2px] text-button-icon pointer-events-none",
          variant === "secondary" ? "text-text-tertiary" : "text-surface-1"
        )}
        aria-hidden
      >
        {icon}
      </span>
    ) : null;

    const content = isIconOnly ? (
      <span
        className={cn("flex h-full w-full items-center justify-center text-button-icon *:max-w-full pointer-events-none",
          variant === "primary" ? "text-surface-bg" : "text-text-tertiary",
        )}
        aria-hidden
      >
        {icon}
      </span>
    ) : hasShortcut ? (
      <>
        {iconPosition === "start" && iconEl}
        <kbd
          className={cn(
            "flex flex-1 items-center min-w-0 truncate",
            labelTypographyClasses
          )}
        >
          {children}
        </kbd>
        {iconPosition === "end" && iconEl}
        <kbd
          className={cn(
            "justify-center items-center not-italic shrink-0 w-[20px] h-[20px] rounded-px",
            showShortcutonMobile ? "flex" : "hidden lg:flex",
            labelTypographyClasses,
            variantClasses[resolvedVariant].key
          )}
          aria-hidden
        >
          {keyDisplay}
        </kbd>
      </>
    ) : (
      <>
        {iconPosition === "start" && iconEl}
        <span
          className={cn(
            "flex items-center min-w-0 truncate",
            labelTypographyClasses
          )}
          aria-hidden
        >
          {children}
        </span>
        {iconPosition === "end" && iconEl}
      </>
    );

    const hasIcon = Boolean(icon);
    const hasStartIcon = hasIcon && iconPosition === "start";
    const hasEndIcon = hasIcon && iconPosition === "end";
    const isSmallSize = resolvedSize === "small";
    const leftPaddingClass = isIconOnly
      ? "px-0"
      : hasStartIcon
        ? "pl-[3px]"
        : isSmallSize
          ? "pl-[8px]"
          : "pl-[10px]";
    const rightPaddingClass =
      isIconOnly
        ? ""
        : hasEndIcon || hasShortcut
          ? "pr-1.5 lg:pr-[3px]"
          : isSmallSize
            ? "pr-[8px]"
            : "pr-[10px]";
    const buttonPaddingClasses = `${leftPaddingClass} ${rightPaddingClass}`;
    const iconOnlySizeClass = isIconOnly ? (isSmallSize ? "w-[26px]" : "w-[32px]") : "";

    const controlClassName = buttonVariants({
      variant: resolvedVariant,
      size: resolvedSize,
      className: cn(
        className,
        isTextVariant && wrapperClassName,
        !isTextVariant && buttonPaddingClasses,
        iconOnlySizeClass
      ),
    });

    const linkControlClassName = cn(
      controlClassName,
      isIconOnly
        ? "gap-0 justify-center"
        : !hasShortcut && !hasIcon
          ? "gap-0 justify-start"
          : "gap-[6px] justify-start"
    );

    const buttonControlClassName = cn(
      controlClassName,
      isIconOnly ? "gap-0 justify-center" : hasShortcut || hasIcon ? "gap-[6px] justify-start" : "gap-3 justify-center"
    );

    const linkEl = (
      <NextLink
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
        className={linkControlClassName}
        aria-keyshortcuts={hasShortcut ? keyDisplay : undefined}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </NextLink>
    );

    const buttonEl = (
      <button
        ref={setRefs}
        disabled={disabled}
        className={buttonControlClassName}
        aria-keyshortcuts={hasShortcut ? keyDisplay : undefined}
        {...props}
      >
        {content}
      </button>
    );

    if (isTextVariant) {
      return isLink ? linkEl : buttonEl;
    }

    return (
      <div
        className={cn(
          "relative flex items-center p-1 group button-wrapper",
          wrapperClassName,
          size === "small" ? "max-h-[34px]" : "max-h-[40px]"
        )}
      >
        <HoverCorners />
        {isLink ? linkEl : buttonEl}
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
