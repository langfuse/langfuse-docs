import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, Link2, ArrowLeft } from "lucide-react";

interface ToolbarProps {
  mode: "selector" | "plan";
  onContinue?: () => void;
  onReset?: () => void;
  onCopyLink?: () => void;
  onBack?: () => void;
  disabledContinue?: boolean;
  selectedCount?: number;
}

export function Toolbar({
  mode,
  onContinue,
  onReset,
  onCopyLink,
  onBack,
  disabledContinue,
  selectedCount = 0,
}: ToolbarProps) {
  if (mode === "selector") {
    return (
      <div className="flex items-center justify-between gap-4 p-4 border-t bg-background sticky bottom-0">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0 ? (
            <span>
              {selectedCount} goal{selectedCount !== 1 ? "s" : ""} selected
            </span>
          ) : (
            <span>Select at least one goal to continue</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={selectedCount === 0}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={onContinue}
            disabled={disabledContinue || selectedCount === 0}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Plan mode
  return (
    <div className="flex items-center justify-between gap-4 p-4 border-t bg-background sticky bottom-0">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Selection
      </Button>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onCopyLink}>
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
