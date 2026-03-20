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

export type { FileProps, FolderProps };

export function FileTree({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <Files {...props}>{children}</Files>;
}

export const FileTreeFile = File;
export const FileTreeFolder = Folder;

// Compound properties for RSC access via <FileTree.File> / <FileTree.Folder>
FileTree.File = FileTreeFile;
FileTree.Folder = FileTreeFolder;
