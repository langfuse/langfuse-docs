// Langfuse Onboarding Data Model & Logic
// Single-file implementation for maintainability

// ============================================================================
// ID Registries (source of truth for available IDs)
// ============================================================================

const GUIDE_IDS = [
  "guide.setup-tracing",
  "guide.setup-sdk",
  "guide.add-scores",
  "guide.error-analysis",
] as const;

const JTBD_IDS = [
  "jtbd.act-on-negative-feedback",
  "jtbd.track-llm-costs",
  "jtbd.offline-evaluation",
] as const;

const READING_IDS = ["reading.anthropic-context-engineering"] as const;

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
  title: string;
  link: string;
  dependsOn?: GuideId[];
}

export interface JTBD {
  id: JtbdId;
  title: string;
  valueStatement: string;
  requiresGuides: GuideId[];
  recommendedReadings?: ReadingId[];
  labels?: string[];
}

export interface Reading {
  id: ReadingId;
  author: string;
  title: string;
  link: string;
  category: "blog post" | "course" | "case-study";
}

export interface PersonaPreset {
  id: PresetId;
  name: string;
  summary: string;
  includesJtbd: JtbdId[];
}

export interface PlanNode {
  id: string;
  title: string;
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
}

// ============================================================================
// Registries (Mock Data - enforced to have all registered IDs)
// ============================================================================

export const Guides: Record<GuideId, Guide> = {
  "guide.setup-tracing": {
    id: "guide.setup-tracing",
    title: "Setup Tracing",
    link: "/docs/tracing/setup",
  },
  "guide.setup-sdk": {
    id: "guide.setup-sdk",
    title: "Setup Langfuse SDK",
    link: "/docs/sdk/setup",
  },
  "guide.add-scores": {
    id: "guide.add-scores",
    title: "Add Custom Scores",
    link: "/docs/evaluation/evaluation-methods/custom-scores",
    dependsOn: ["guide.setup-tracing"],
  },
  "guide.error-analysis": {
    id: "guide.error-analysis",
    title: "Error Analysis",
    link: "/blog/2025-08-29-error-analysis-to-evaluate-llm-applications",
    dependsOn: ["guide.setup-tracing"],
  },
};

export const JTBDs: Record<JtbdId, JTBD> = {
  "jtbd.act-on-negative-feedback": {
    id: "jtbd.act-on-negative-feedback",
    title: "Act on Negative Feedback",
    valueStatement:
      "Monitor and analyze user feedback to identify problematic interactions. Use traces for error analysis to improve agent/applications based on feedback.",
    requiresGuides: ["guide.setup-tracing", "guide.add-scores"],
    recommendedReadings: ["reading.anthropic-context-engineering"],
    labels: ["observability"],
  },
  "jtbd.track-llm-costs": {
    id: "jtbd.track-llm-costs",
    title: "Track LLM costs",
    valueStatement: "Track the costs of LLM usage",
    requiresGuides: ["guide.setup-tracing"],
    recommendedReadings: ["reading.anthropic-context-engineering"],
    labels: ["costs"],
  },
  "jtbd.offline-evaluation": {
    id: "jtbd.offline-evaluation",
    title: "Offline evaluation",
    valueStatement: "Evaluate LLM applications offline",
    requiresGuides: ["guide.setup-tracing"],
    recommendedReadings: ["reading.anthropic-context-engineering"],
    labels: ["evaluation"],
  },
};

export const Readings: Record<ReadingId, Reading> = {
  "reading.anthropic-context-engineering": {
    id: "reading.anthropic-context-engineering",
    author: "Anthropic",
    title: "Context Engineering",
    link: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    category: "blog post",
  },
};

export const Presets: Record<PresetId, PersonaPreset> = {
  "preset.support-chat": {
    id: "preset.support-chat",
    name: "Support Chat Team",
    summary: "PM/Engineering teams building customer support chat applications",
    includesJtbd: ["jtbd.act-on-negative-feedback"],
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
        type: "guide",
      });
    }
  });

  // Add JTBD nodes
  selectedJtbds.forEach((jtbd) => {
    nodes.push({
      id: jtbd.id,
      title: jtbd.title,
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

  return {
    selectedJtbd: selectedJtbdIds,
    guideOrder,
    nodes,
    edges,
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

  md += `\n## Setup Checklist\n\n`;

  plan.guideOrder.forEach((guideId, index) => {
    const guide = Guides[guideId];
    if (guide) {
      md += `${index + 1}. [ ] ${guide.title}\n`;
    }
  });

  md += "\n---\n";
  md += `\nGenerated by Langfuse Onboarding | ${new Date().toLocaleDateString()}\n`;

  return md;
}
