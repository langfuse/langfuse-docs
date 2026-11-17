import React from "react";

/**
 * Flatten a single wrapping paragraph so MDX children can sit inline after
 * a blockquote title like `> **What is Pi?** …`.
 */
export function InlineParagraphChildren({
  children,
}: {
  children: React.ReactNode;
}) {
  const items = React.Children.toArray(children);
  if (items.length === 1 && React.isValidElement(items[0])) {
    const el = items[0] as React.ReactElement<{ children?: React.ReactNode }>;
    if (isParagraphElement(el.type)) {
      return <>{el.props.children}</>;
    }
  }
  return <>{children}</>;
}

function isParagraphElement(
  type: string | React.JSXElementConstructor<any>,
): boolean {
  if (type === "p") return true;
  if (typeof type === "string") return type === "p";
  const name =
    (type as { displayName?: string; name?: string }).displayName ??
    (type as { name?: string }).name ??
    "";
  return name === "p" || name === "MdxParagraph";
}
