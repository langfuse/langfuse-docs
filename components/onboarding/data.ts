// Langfuse Onboarding Data Model & Logic
// Single-file implementation for maintainability

// ============================================================================
// ID Registries (source of truth for available IDs)
// ============================================================================

const GUIDE_IDS = [
  "guide.setup-tracing",
  "guide.setup-sdk",
  "guide.add-scores",
] as const;

const JTBD_IDS = ["jtbd.trace-negative-feedback"] as const;

const READING_IDS = ["reading.observability-concepts"] as const;

const PRESET_IDS = ["preset.support-chat"] as const;

// ============================================================================
// Inferred ID Types
// ============================================================================

export type GuideId = (typeof GUIDE_IDS)[number];
export type JtbdId = (typeof JTBD_IDS)[number];
export type ReadingId = (typeof READING_IDS)[number];
export type PresetId = (typeof PRESET_IDS)[number];

// ============================================================================
// Type Definitions (simplified)
// ============================================================================

export interface Guide {
  id: GuideId;
  slug: string;
  owner: string;
  title: string;
  kind: "setup" | "howto";
  dependsOn?: GuideId[];
  estimatedTimeMinutes?: number;
}

export interface JTBD {
  id: JtbdId;
  slug: string;
  owner: string;
  title: string;
  valueStatement: string;
  requiresGuides: GuideId[];
  recommendedReadings?: ReadingId[];
  labels?: string[];
  estimatedEffort?: {
    minutes?: number;
    bucket?: "S" | "M" | "L";
  };
  tags?: string[];
}

export interface Reading {
  id: ReadingId;
  slug: string;
  owner: string;
  title: string;
  link: string;
  category: "concept" | "case-study" | "reference";
  level: "intro" | "intermediate" | "deep";
}

export interface PersonaPreset {
  id: PresetId;
  slug: string;
  owner: string;
  name: string;
  summary: string;
  includesJtbd: JtbdId[];
}

export interface PlanNode {
  id: string;
  title: string;
  minutes?: number;
  kind?: Guide["kind"];
  type: "guide" | "reading" | "jtbd";
}

export interface PlanEdge {
  from: string;
  to: string;
  kind: "depends_on" | "supports" | "informs";
}

export interface Plan {
  selectedJtbd: JtbdId[];
  guideOrder: GuideId[];
  nodes: PlanNode[];
  edges: PlanEdge[];
  minutesTotal: number;
}

// ============================================================================
// Registries (Mock Data - enforced to have all registered IDs)
// ============================================================================

export const Guides: Record<GuideId, Guide> = {
  "guide.setup-tracing": {
    id: "guide.setup-tracing",
    slug: "setup-tracing",
    owner: "engineering",
    title: "Setup Tracing",
    kind: "setup",
    estimatedTimeMinutes: 15,
  },
  "guide.setup-sdk": {
    id: "guide.setup-sdk",
    slug: "setup-sdk",
    owner: "engineering",
    title: "Setup Langfuse SDK",
    kind: "setup",
    estimatedTimeMinutes: 10,
  },
  "guide.add-scores": {
    id: "guide.add-scores",
    slug: "add-scores",
    owner: "engineering",
    title: "Add Custom Scores",
    kind: "howto",
    dependsOn: ["guide.setup-tracing"],
    estimatedTimeMinutes: 20,
  },
};

export const JTBDs: Record<JtbdId, JTBD> = {
  "jtbd.trace-negative-feedback": {
    id: "jtbd.trace-negative-feedback",
    slug: "trace-negative-feedback",
    owner: "product",
    title: "Track traces with negative feedback",
    valueStatement:
      "Monitor and analyze user feedback to identify problematic interactions",
    requiresGuides: ["guide.setup-tracing", "guide.add-scores"],
    recommendedReadings: ["reading.observability-concepts"],
    labels: ["observability"],
    estimatedEffort: {
      minutes: 35,
      bucket: "M",
    },
    tags: ["feedback", "monitoring"],
  },
};

export const Readings: Record<ReadingId, Reading> = {
  "reading.observability-concepts": {
    id: "reading.observability-concepts",
    slug: "observability-concepts",
    owner: "docs",
    title: "Observability Concepts",
    link: "/docs/observability/overview",
    category: "concept",
    level: "intro",
  },
};

export const Presets: Record<PresetId, PersonaPreset> = {
  "preset.support-chat": {
    id: "preset.support-chat",
    slug: "support-chat",
    owner: "product",
    name: "Support Chat Team",
    summary: "PM/Engineering teams building customer support chat applications",
    includesJtbd: ["jtbd.trace-negative-feedback"],
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Topological sort of guides based on dependencies
 * Returns ordered array of guide IDs, or throws on cycle
 */
export function topoSort(guideIds: GuideId[]): GuideId[] {
  const visited = new Set<GuideId>();
  const visiting = new Set<GuideId>();
  const order: GuideId[] = [];

  function visit(id: GuideId, path: GuideId[] = []): void {
    if (visiting.has(id)) {
      throw new Error(`Cycle detected: ${[...path, id].join(" -> ")}`);
    }
    if (visited.has(id)) {
      return;
    }

    visiting.add(id);
    const guide = Guides[id];
    if (guide?.dependsOn) {
      guide.dependsOn.forEach((depId) => {
        if (guideIds.includes(depId)) {
          visit(depId, [...path, id]);
        }
      });
    }
    visiting.delete(id);
    visited.add(id);
    order.push(id);
  }

  guideIds.forEach((id) => visit(id));
  return order;
}

/**
 * Calculate critical path minutes (longest dependency chain)
 */
export function criticalPathMinutes(guideIds: GuideId[]): number {
  const memo = new Map<GuideId, number>();

  function calculatePath(id: GuideId): number {
    if (memo.has(id)) {
      return memo.get(id)!;
    }

    const guide = Guides[id];
    if (!guide) return 0;

    const ownMinutes = guide.estimatedTimeMinutes || 0;
    let maxDepPath = 0;

    if (guide.dependsOn) {
      guide.dependsOn.forEach((depId) => {
        if (guideIds.includes(depId)) {
          maxDepPath = Math.max(maxDepPath, calculatePath(depId));
        }
      });
    }

    const total = ownMinutes + maxDepPath;
    memo.set(id, total);
    return total;
  }

  let maxPath = 0;
  guideIds.forEach((id) => {
    maxPath = Math.max(maxPath, calculatePath(id));
  });

  return maxPath;
}

/**
 * Build a plan from selected JTBD IDs
 * Generates nodes, edges, and topological order
 */
export function buildPlan(selectedJtbdIds: JtbdId[]): Plan {
  // Collect all required guides
  const guideSet = new Set<GuideId>();
  const selectedJtbds = selectedJtbdIds.map((id) => JTBDs[id]).filter(Boolean);

  selectedJtbds.forEach((jtbd) => {
    jtbd.requiresGuides.forEach((guideId) => {
      guideSet.add(guideId);
      // Add transitive dependencies
      const guide = Guides[guideId];
      if (guide?.dependsOn) {
        guide.dependsOn.forEach((depId) => guideSet.add(depId));
      }
    });
  });

  const guideIds = Array.from(guideSet);

  // Collect all recommended readings
  const readingSet = new Set<ReadingId>();
  selectedJtbds.forEach((jtbd) => {
    jtbd.recommendedReadings?.forEach((readingId) => {
      readingSet.add(readingId);
    });
  });

  // Create nodes
  const nodes: PlanNode[] = [];

  // Add reading nodes
  readingSet.forEach((readingId) => {
    const reading = Readings[readingId];
    if (reading) {
      nodes.push({
        id: reading.id,
        title: reading.title,
        type: "reading",
      });
    }
  });

  // Add guide nodes
  guideIds.forEach((guideId) => {
    const guide = Guides[guideId];
    if (guide) {
      nodes.push({
        id: guide.id,
        title: guide.title,
        minutes: guide.estimatedTimeMinutes,
        kind: guide.kind,
        type: "guide",
      });
    }
  });

  // Add JTBD nodes
  selectedJtbds.forEach((jtbd) => {
    nodes.push({
      id: jtbd.id,
      title: jtbd.title,
      minutes: jtbd.estimatedEffort?.minutes,
      type: "jtbd",
    });
  });

  // Create edges
  const edges: PlanEdge[] = [];

  // depends_on edges (Guide -> Guide)
  guideIds.forEach((guideId) => {
    const guide = Guides[guideId];
    guide?.dependsOn?.forEach((depId) => {
      if (guideIds.includes(depId)) {
        edges.push({
          from: depId,
          to: guideId,
          kind: "depends_on",
        });
      }
    });
  });

  // supports edges (Guide -> JTBD) - only from requiresGuides, not full closure
  selectedJtbds.forEach((jtbd) => {
    jtbd.requiresGuides.forEach((guideId) => {
      if (guideIds.includes(guideId)) {
        edges.push({
          from: guideId,
          to: jtbd.id,
          kind: "supports",
        });
      }
    });
  });

  // informs edges (Reading -> JTBD)
  selectedJtbds.forEach((jtbd) => {
    jtbd.recommendedReadings?.forEach((readingId) => {
      if (readingSet.has(readingId)) {
        edges.push({
          from: readingId,
          to: jtbd.id,
          kind: "informs",
        });
      }
    });
  });

  // Topological order
  const guideOrder = topoSort(guideIds);

  // Calculate critical path
  const minutesTotal = criticalPathMinutes(guideIds);

  return {
    selectedJtbd: selectedJtbdIds,
    guideOrder,
    nodes,
    edges,
    minutesTotal,
  };
}

/**
 * Export plan to Markdown checklist
 */
export function planToMarkdown(plan: Plan): string {
  let md = "# Langfuse Onboarding Plan\n\n";

  md += "## Selected Goals\n\n";
  plan.selectedJtbd.forEach((jtbdId) => {
    const jtbd = JTBDs[jtbdId];
    if (jtbd) {
      md += `- **${jtbd.title}**: ${jtbd.valueStatement}\n`;
    }
  });

  md += `\n## Setup Checklist (${plan.minutesTotal} min estimated)\n\n`;

  plan.guideOrder.forEach((guideId, index) => {
    const guide = Guides[guideId];
    if (guide) {
      const minutes = guide.estimatedTimeMinutes
        ? ` (${guide.estimatedTimeMinutes} min)`
        : "";
      md += `${index + 1}. [ ] ${guide.title}${minutes}\n`;
    }
  });

  md += "\n---\n";
  md += `\nGenerated by Langfuse Onboarding | ${new Date().toLocaleDateString()}\n`;

  return md;
}
