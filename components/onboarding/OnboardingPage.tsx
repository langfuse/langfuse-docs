import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Guides,
  JTBDs,
  Readings,
  Presets,
  buildPlan,
  Plan,
  GuideId,
  JtbdId,
  PresetId,
} from "./data";
import { PresetSidebar } from "@/components/onboarding/PresetSidebar";
import { JtbdPicker } from "@/components/onboarding/JtbdPicker";
import { Toolbar } from "@/components/onboarding/Toolbar";
import { GraphCanvas } from "@/components/onboarding/GraphCanvas";
import { Checklist } from "@/components/onboarding/Checklist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Screen = "selector" | "plan";

const PROGRESS_KEY = "langfuse.onboarding.progress";

function loadProgress(): Set<GuideId> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Failed to load progress:", e);
  }
  return new Set();
}

function saveProgress(progress: Set<GuideId>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(progress)));
  } catch (e) {
    console.error("Failed to save progress:", e);
  }
}

export function OnboardingPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("selector");
  const [selectedPresetIds, setSelectedPresetIds] = useState<PresetId[]>([]);
  const [selectedJtbdIds, setSelectedJtbdIds] = useState<JtbdId[]>([]);
  const [progress, setProgress] = useState<Set<GuideId>>(new Set<GuideId>());
  const [plan, setPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // Parse URL params and sync with state
  useEffect(() => {
    if (!router.isReady) return;

    const planParam = router.query.plan as string | undefined;
    const showPlanParam = router.query.showPlan as string | undefined;

    // Parse JTBDs from URL
    if (planParam) {
      const jtbdIds = planParam
        .split(",")
        .filter((id) => JTBDs[id as JtbdId]) as JtbdId[];
      if (jtbdIds.length > 0) {
        setSelectedJtbdIds(jtbdIds);

        // Only show plan screen if showPlan=true in URL
        if (showPlanParam === "true") {
          try {
            const generatedPlan = buildPlan(jtbdIds);
            setPlan(generatedPlan);
            setScreen("plan");
          } catch (e) {
            console.error("Failed to build plan:", e);
          }
        }
      }
    }
  }, [router.isReady, router.query]);

  // Update URL when selection changes
  const updateUrl = (jtbdIds: JtbdId[], presetIds: PresetId[]) => {
    const query: Record<string, string> = {};

    if (jtbdIds.length > 0) {
      query.plan = jtbdIds.join(",");
    }
    if (presetIds.length > 0) {
      query.preset = presetIds[0]; // Only support one preset for now
    }

    // Preserve showPlan if it exists
    if (router.query.showPlan) {
      query.showPlan = router.query.showPlan as string;
    }

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  const handleTogglePreset = (presetId: PresetId) => {
    const preset = Presets[presetId];
    if (!preset) return;

    const isSelected = selectedPresetIds.includes(presetId);
    let newPresetIds: PresetId[];
    let newJtbdIds: JtbdId[];

    if (isSelected) {
      // Deselect preset and its JTBDs
      newPresetIds = selectedPresetIds.filter((id) => id !== presetId);
      newJtbdIds = selectedJtbdIds.filter(
        (id) => !preset.includesJtbd.includes(id as JtbdId)
      ) as JtbdId[];
    } else {
      // Select preset and add its JTBDs
      newPresetIds = [...selectedPresetIds, presetId];
      const jtbdsToAdd = preset.includesJtbd.filter(
        (id) => !selectedJtbdIds.includes(id as JtbdId)
      ) as JtbdId[];
      newJtbdIds = [...selectedJtbdIds, ...jtbdsToAdd];
    }

    setSelectedPresetIds(newPresetIds);
    setSelectedJtbdIds(newJtbdIds);
    updateUrl(newJtbdIds, newPresetIds);
  };

  const handleToggleJtbd = (jtbdId: JtbdId) => {
    const isSelected = selectedJtbdIds.includes(jtbdId);
    const newJtbdIds = isSelected
      ? selectedJtbdIds.filter((id) => id !== jtbdId)
      : [...selectedJtbdIds, jtbdId];

    setSelectedJtbdIds(newJtbdIds);

    // Update preset selection based on JTBDs
    const newPresetIds = (Object.keys(Presets) as PresetId[]).filter(
      (presetId) => {
        const preset = Presets[presetId];
        return preset.includesJtbd.every((id) =>
          newJtbdIds.includes(id as JtbdId)
        );
      }
    );

    setSelectedPresetIds(newPresetIds);
    updateUrl(newJtbdIds, newPresetIds);
  };

  const handleReset = () => {
    setSelectedPresetIds([]);
    setSelectedJtbdIds([]);
    // Clear all query params
    router.replace({ pathname: router.pathname, query: {} }, undefined, {
      shallow: true,
    });
  };

  const handleCopyLink = () => {
    const query = new URLSearchParams({
      plan: selectedJtbdIds.join(","),
      showPlan: "true",
    });
    const url = `${window.location.origin}${
      router.pathname
    }?${query.toString()}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyLinkSuccess(true);
      setTimeout(() => setCopyLinkSuccess(false), 2000);
    });
  };

  const handleContinue = () => {
    try {
      const generatedPlan = buildPlan(selectedJtbdIds);
      setPlan(generatedPlan);
      setScreen("plan");

      // Add showPlan=true to URL
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, showPlan: "true" },
        },
        undefined,
        { shallow: true }
      );
    } catch (e) {
      console.error("Failed to build plan:", e);
      alert("Error building plan. Please check the console for details.");
    }
  };

  const handleBack = () => {
    setScreen("selector");

    // Remove showPlan from URL
    const { showPlan, ...queryWithoutShowPlan } = router.query;
    router.replace(
      { pathname: router.pathname, query: queryWithoutShowPlan },
      undefined,
      { shallow: true }
    );
  };

  const handleToggleDone = (guideId: GuideId) => {
    const newProgress = new Set<GuideId>(progress);
    if (newProgress.has(guideId)) {
      newProgress.delete(guideId);
    } else {
      newProgress.add(guideId);
    }
    setProgress(newProgress);
    saveProgress(newProgress);
  };

  // Memoize lists
  const presetsList = useMemo(() => Object.values(Presets), []);
  const jtbdsList = useMemo(() => Object.values(JTBDs), []);

  return (
    <div>
      {/* Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {screen === "selector" && (
          <div className="space-y-8">
            {/* Top: Presets */}
            <PresetSidebar
              presets={presetsList}
              selectedPresetIds={selectedPresetIds}
              onTogglePreset={handleTogglePreset}
            />

            {/* Bottom: JTBDs */}
            <JtbdPicker
              jtbds={jtbdsList}
              selectedJtbdIds={selectedJtbdIds}
              onToggle={handleToggleJtbd}
            />
          </div>
        )}

        {screen === "plan" && plan && (
          <div className="space-y-6">
            {/* View toggle */}
            <Tabs
              value={viewMode}
              onValueChange={(v) => setViewMode(v as "graph" | "list")}
            >
              <TabsList>
                <TabsTrigger value="graph">Graph View</TabsTrigger>
                <TabsTrigger value="list">Checklist View</TabsTrigger>
              </TabsList>

              <TabsContent value="graph" className="mt-6">
                <GraphCanvas plan={plan} />
                <div className="mt-6">
                  <Checklist
                    plan={plan}
                    progress={progress}
                    onToggleDone={handleToggleDone}
                  />
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-6">
                <Checklist
                  plan={plan}
                  progress={progress}
                  onToggleDone={handleToggleDone}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <Toolbar
        mode={screen}
        onContinue={handleContinue}
        onReset={handleReset}
        onCopyLink={handleCopyLink}
        onBack={handleBack}
        disabledContinue={selectedJtbdIds.length === 0}
        selectedCount={selectedJtbdIds.length}
      />
    </div>
  );
}
