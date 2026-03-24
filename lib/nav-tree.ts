export interface NavTreeItem {
  type: "page" | "separator" | "folder";
  name: string;
  url?: string;
  children?: NavTreeItem[];
}

export interface SectionNavData {
  name: string;
  href: string;
  children: NavTreeItem[];
}

interface TreeNode {
  type: string;
  name?: unknown;
  url?: string;
  index?: { url: string };
  children?: TreeNode[];
}

/** Find the first navigable page URL in a list of tree nodes. */
function findFirstPageUrl(nodes: TreeNode[]): string | undefined {
  for (const node of nodes) {
    if (node.type === "page" && node.url) return node.url;
    if (node.type === "folder") {
      if (node.index?.url) return node.index.url;
      if (node.children) {
        const url = findFirstPageUrl(node.children);
        if (url) return url;
      }
    }
  }
  return undefined;
}

/**
 * Recursively serialize fumadocs page tree nodes into plain objects
 * suitable for passing from server components to client components.
 */
export function serializePageTree(root: {
  children: TreeNode[];
}): NavTreeItem[] {
  return serializeNodes(root.children);
}

function serializeNodes(nodes: TreeNode[]): NavTreeItem[] {
  return nodes
    .map((node): NavTreeItem | null => {
      const name = typeof node.name === "string" ? node.name : "";

      switch (node.type) {
        case "separator":
          return { type: "separator", name };
        case "page":
          return name && node.url
            ? { type: "page", name, url: node.url }
            : null;
        case "folder": {
          if (!name) return null;
          const url =
            node.index?.url ??
            (node.children ? findFirstPageUrl(node.children) : undefined);
          const children = node.children
            ? serializeNodes(node.children)
            : [];
          return { type: "folder", name, url, children };
        }
        default:
          return null;
      }
    })
    .filter((item): item is NavTreeItem => item !== null);
}
