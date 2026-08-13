"use client";

import { useState } from "react";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { Action } from "@/components/ai-elements/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";

interface FeedbackDialogProps {
  messageId: string;
  feedbackType: "positive" | "negative";
  currentFeedback: "positive" | "negative" | null;
  onFeedback: (
    messageId: string,
    feedbackType: "positive" | "negative",
    comment?: string,
  ) => void;
}

export const FeedbackDialog = ({
  messageId,
  feedbackType,
  currentFeedback,
  onFeedback,
}: FeedbackDialogProps) => {
  const [comment, setComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const isActive = currentFeedback === feedbackType;

  const handleSubmit = () => {
    onFeedback(messageId, feedbackType, comment.trim() || undefined);
    setComment("");
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (open && !isActive) {
      // Submit feedback when popover opens (only if not already active)
      onFeedback(messageId, feedbackType);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Action
          label={feedbackType === "positive" ? "Thumbs Up" : "Thumbs Down"}
          tooltip={feedbackType === "positive" ? "Thumbs Up" : "Thumbs Down"}
          className={
            isActive &&
            (feedbackType === "positive"
              ? "text-green-700 dark:text-green-400"
              : "text-red-700 dark:text-red-400")
          }
        >
          {feedbackType === "positive" ? (
            <ThumbsUpIcon className="size-3" />
          ) : (
            <ThumbsDownIcon className="size-3" />
          )}
        </Action>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {feedbackType === "positive" ? "Positive" : "Negative"} Feedback
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-comment" className="text-sm font-medium">
              Add a comment to your feedback (optional)
            </Label>
            <Textarea
              id="feedback-comment"
              placeholder="Tell us more about your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setComment("");
              setIsOpen(false);
            }}
          >
            Skip
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
