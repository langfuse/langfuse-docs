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
import { Alert, AlertDescription } from "@/components/ui/alert";

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

  // Parse URL params on mount
  useEffect(() => {
    if (!router.isReady) return;

    const planParam = router.query.plan as string | undefined;
    const presetParam = router.query.preset as string | undefined;

    if (planParam) {
      const jtbdIds = planParam
        .split(",")
        .filter((id) => JTBDs[id as JtbdId]) as JtbdId[];
      if (jtbdIds.length > 0) {
        setSelectedJtbdIds(jtbdIds);
        // Auto-advance to plan screen
        try {
          const generatedPlan = buildPlan(jtbdIds);
          setPlan(generatedPlan);
          setScreen("plan");
        } catch (e) {
          console.error("Failed to build plan:", e);
        }
      }
    }

    if (presetParam && Presets[presetParam]) {
      setSelectedPresetIds([presetParam]);
      const preset = Presets[presetParam];
      setSelectedJtbdIds(preset.includesJtbd);
    }
  }, [router.isReady, router.query]);

  // Update URL when selection changes
  const updateUrl = (jtbdIds: JtbdId[], presetIds: PresetId[]) => {
    const params = new URLSearchParams();
    if (jtbdIds.length > 0) {
      params.set("plan", jtbdIds.join(","));
    }
    if (presetIds.length > 0) {
      params.set("preset", presetIds[0]); // Only support one preset for now
    }

    const newUrl = params.toString()
      ? `${router.pathname}?${params.toString()}`
      : router.pathname;

    router.replace(newUrl, undefined, { shallow: true });
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
    updateUrl([], []);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}${
      window.location.pathname
    }?plan=${selectedJtbdIds.join(",")}`;
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
    } catch (e) {
      console.error("Failed to build plan:", e);
      alert("Error building plan. Please check the console for details.");
    }
  };

  const handleBack = () => {
    setScreen("selector");
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2">Langfuse Onboarding</h1>
          <p className="text-muted-foreground">
            Choose your goals and get a personalized path to success
          </p>
        </div>
      </div>

      {/* Success message */}
      {copyLinkSuccess && (
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <Alert>
            <AlertDescription>Link copied to clipboard!</AlertDescription>
          </Alert>
        </div>
      )}

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
