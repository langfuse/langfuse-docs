import React from "react";
import { JTBD, JtbdId } from "./data";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface JtbdPickerProps {
  jtbds: JTBD[];
  selectedJtbdIds: JtbdId[];
  onToggle: (id: JtbdId) => void;
  filters?: {
    labels?: string[];
  };
}

export function JtbdPicker({
  jtbds,
  selectedJtbdIds,
  onToggle,
  filters,
}: JtbdPickerProps) {
  // Apply filters
  let filteredJtbds = jtbds;
  if (filters?.labels && filters.labels.length > 0) {
    filteredJtbds = jtbds.filter((jtbd) =>
      jtbd.labels?.some((label) => filters.labels?.includes(label))
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose your goals</h3>
        <p className="text-sm text-muted-foreground">
          Select one or more goals to build your personalized onboarding plan
        </p>
      </div>

      <div className="grid gap-3">
        {filteredJtbds.map((jtbd) => {
          const isSelected = selectedJtbdIds.includes(jtbd.id);

          return (
            <Card
              key={jtbd.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? "border-primary ring-2 ring-primary ring-opacity-50"
                  : ""
              }`}
              onClick={() => onToggle(jtbd.id)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(jtbd.id)}
                    className="mt-1"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">
                      {jtbd.title}
                    </CardTitle>
                    <CardDescription className="text-sm mb-3">
                      {jtbd.valueStatement}
                    </CardDescription>

                    <div className="flex flex-wrap items-center gap-2">
                      {jtbd.labels?.map((label) => (
                        <Badge
                          key={label}
                          variant="outline"
                          className="text-xs"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {filteredJtbds.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No goals match the current filters
        </div>
      )}
    </div>
  );
}
