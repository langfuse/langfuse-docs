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
    key: "border-px border-[rgba(64,61,57,0.30)] bg-[rgba(105,105,94,0.10)]",
  },
  secondary: {
    root: "border-line-structure bg-surface-bg text-text-secondary",
    key: "bg-[rgba(105,105,94,0.10)]",
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

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return Boolean(target.closest("[contenteditable='true']"));
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
    'rounded-[1px] border [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]',
    buttonBaseClasses, variantClasses[variant].root, sizeClasses[size].root, className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  asChild?: boolean;
  shortcutKey?: string;
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
    const hasShortcut =
      !asChild && !isTextVariant && trimmed.length > 0;
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
        className="button-icon-area flex shrink-0 items-center justify-center h-full aspect-square rounded-[1px] border-[0.5px] border-[rgba(64,61,57,0.20)] bg-[rgba(64,61,57,0.10)] dark:bg-transparent p-[2px] text-button-icon"
        aria-hidden
      >
        {icon}
      </span>
    ) : null;

    const content = hasShortcut ? (
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
            "hidden lg:flex justify-center items-center not-italic shrink-0 w-[20px] h-[20px] rounded-px",
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
    const leftPaddingClass = hasStartIcon ? "pl-[3px]" : isSmallSize ? "pl-[6px]" : "pl-[8px]";
    const rightPaddingClass =
      hasEndIcon || hasShortcut ? "pr-1.5 lg:pr-[3px]" : isSmallSize ? "pr-[6px]" : "pr-[8px]";
    const buttonPaddingClasses = `${leftPaddingClass} ${rightPaddingClass}`;

    const controlClassName = buttonVariants({
      variant: resolvedVariant,
      size: resolvedSize,
      className: cn(
        className,
        isTextVariant && wrapperClassName,
        !isTextVariant && buttonPaddingClasses
      ),
    });

    const linkControlClassName = cn(
      controlClassName,
      !hasShortcut && !hasIcon ? "gap-0 justify-start" : "gap-[6px] justify-center"
    );

    const buttonControlClassName = cn(
      controlClassName,
      hasShortcut || hasIcon ? "gap-[6px] justify-start" : "gap-3 justify-center"
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
      <div className={cn("relative p-1 group button-wrapper", wrapperClassName)}>
        <HoverCorners />
        {isLink ? linkEl : buttonEl}
      </div>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
