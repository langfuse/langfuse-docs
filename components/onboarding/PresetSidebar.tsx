import React from "react";
import { PersonaPreset, PresetId } from "./data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PresetSidebarProps {
  presets: PersonaPreset[];
  selectedPresetIds: PresetId[];
  onTogglePreset: (id: PresetId) => void;
}

export function PresetSidebar({
  presets,
  selectedPresetIds,
  onTogglePreset,
}: PresetSidebarProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Start with a preset</h3>
        <p className="text-sm text-muted-foreground">
          Choose a persona that matches your use case
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const isSelected = selectedPresetIds.includes(preset.id);

          return (
            <Card
              key={preset.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : ""
              }`}
              onClick={() => onTogglePreset(preset.id)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base mb-1">{preset.name}</CardTitle>
                <CardDescription className="text-sm">
                  {preset.summary}
                </CardDescription>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {preset.includesJtbd.length} goal
                    {preset.includesJtbd.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
