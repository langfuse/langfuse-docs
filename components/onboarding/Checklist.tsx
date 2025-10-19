import React, { useState } from "react";
import { Guide, Plan, Guides, planToMarkdown, GuideId } from "./data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Clock, Check } from "lucide-react";

interface ChecklistProps {
  plan: Plan;
  progress: Set<GuideId>;
  onToggleDone: (id: GuideId) => void;
}

export function Checklist({ plan, progress, onToggleDone }: ChecklistProps) {
  const [copied, setCopied] = useState(false);

  const handleExport = () => {
    const markdown = planToMarkdown(plan);
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const completedCount = plan.guideOrder.filter((id) =>
    progress.has(id)
  ).length;
  const totalCount = plan.guideOrder.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Setup Checklist</CardTitle>
            <div className="text-sm text-muted-foreground mt-1">
              {completedCount} of {totalCount} completed
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Copy as Markdown
              </>
            )}
          </Button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-muted rounded-full h-2 mt-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Summary */}
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {plan.minutesTotal} min total
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {plan.guideOrder.map((guideId, index) => {
            const guide = Guides[guideId];
            if (!guide) return null;

            const isDone = progress.has(guideId);

            return (
              <div
                key={guideId}
                className={`flex items-start gap-3 p-3 rounded-md border transition-all ${
                  isDone ? "bg-muted/50 opacity-75" : "bg-card"
                }`}
              >
                <Checkbox
                  checked={isDone}
                  onCheckedChange={() => onToggleDone(guideId)}
                  className="mt-1"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div
                        className={`font-medium text-sm ${
                          isDone ? "line-through" : ""
                        }`}
                      >
                        {index + 1}. {guide.title}
                      </div>
                      {guide.dependsOn && guide.dependsOn.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Depends on: {guide.dependsOn.length} guide
                          {guide.dependsOn.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {guide.kind && (
                        <Badge variant="outline" className="text-xs">
                          {guide.kind}
                        </Badge>
                      )}
                      {guide.estimatedTimeMinutes && (
                        <Badge variant="secondary" className="text-xs">
                          {guide.estimatedTimeMinutes}m
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
