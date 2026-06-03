/**
 * FileTree — maps to fumadocs-ui Files/File/Folder.
 * Keeps the legacy FileTree/FileTreeFile/FileTreeFolder names so MDX
 * content using <FileTree> doesn't need to be updated.
 */
import * as React from "react";
import {
  Files,
  File,
  Folder,
  type FileProps,
  type FolderProps,
} from "fumadocs-ui/components/files";
import { cn } from "@/lib/utils";

export type { FileProps, FolderProps };

const fileTreeThemeVars = {
  "--color-fd-card": "var(--surface-1)",
  "--color-fd-card-foreground": "var(--text-secondary)",
  "--color-fd-border": "var(--line-structure)",
  "--color-fd-accent": "var(--surface-1)",
  "--color-fd-accent-foreground": "var(--text-primary)",
} as React.CSSProperties;

export function FileTree({
  children,
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Files
      className={cn(
        "border-line-structure text-text-secondary rounded-none relative",
        className,
      )}
      style={{ ...fileTreeThemeVars, ...style }}
      {...props}
    >
      {children}
    </Files>
  );
}

export function FileTreeFile(props: FileProps) {
  return (
    <File
      className="text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary rounded-none"
      {...props}
    />
  );
}

export function FileTreeFolder(props: FolderProps) {
  return (
    <Folder
      className="text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary rounded-none"
      {...props}
    />
  );
}

// Compound properties for RSC access via <FileTree.File> / <FileTree.Folder>
FileTree.File = FileTreeFile;
FileTree.Folder = FileTreeFolder;
