"use client";

import { type Message } from "ai";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCopyToClipboard } from "../hooks/clipboard";
import { Check, Copy, ThumbsUp, ThumbsDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { LangfuseWeb } from "langfuse";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

const langfuse = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_LANGFUSE_PUBLIC_KEY ?? "",
});
type Feedback = "positive" | "negative";

interface ChatMessageActionsProps extends React.ComponentProps<"div"> {
  message: Message;
}

export function ChatMessageActions({
  message,
  className,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(message.content);
  };

  const [currentFeedback, setCurrentFeedback] = useState<
    Feedback | "submitting" | null
  >(null);

  const [modalState, setModalState] = useState<{
    feedback: Feedback;
    comment: string;
  } | null>(null);

  const showFeedbackButtons = message.role === "assistant";

  const handleSubmit = () => {
    if (currentFeedback === "submitting" || !modalState) return;

    setCurrentFeedback("submitting");

    // langfuse
    //   .score({
    //     traceId: `chat:${chatId}`,
    //     traceIdType: "EXTERNAL",
    //     name: "user-feedback",
    //     value: modalState.feedback === "positive" ? 1 : -1,
    //     comment: modalState.comment !== "" ? modalState.comment : undefined,
    //     observationId: message.id,
    //   })
    //   .then((res) => {
    //     setCurrentFeedback(modalState.feedback);
    //   })
    //   .catch((err) => {
    //     toast.error("Something went wrong");
    //     setCurrentFeedback(null);
    //   });

    // close modal
    setCurrentFeedback(modalState.feedback);
    setModalState(null);
  };

  return (
    <div
      className={cn(
        "flex items-center lg:flex-col justify-end lg:justify-center transition-opacity group-hover:opacity-100 lg:absolute lg:-right-10 lg:-top-8 lg:-bottom-5 lg:opacity-0",
        className
      )}
      {...props}
    >
      {showFeedbackButtons ? (
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() =>
            setModalState({
              feedback: "positive",
              comment: "",
            })
          }
        >
          <ThumbsUp className="h-3 w-3" />
          <span className="sr-only">Positive feedback</span>
        </Button>
      ) : null}

      <Button variant="ghost" size="iconXs" onClick={onCopy}>
        {isCopied ? (
          <Check className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
        <span className="sr-only">Copy message</span>
      </Button>

      {showFeedbackButtons ? (
        <Button
          variant="ghost"
          size="iconXs"
          onClick={() =>
            setModalState({
              feedback: "negative",
              comment: "",
            })
          }
        >
          <ThumbsDown className="h-3 w-3" />
          <span className="sr-only">Negative feedback</span>
        </Button>
      ) : null}
      <Dialog open={!!modalState} onOpenChange={() => handleSubmit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Do you want to add a comment?</DialogTitle>
            <DialogDescription>
              <Textarea
                className="mt-4 mb-2"
                value={modalState?.comment ?? ""}
                onChange={(e) => {
                  setModalState({ ...modalState!, comment: e.target.value });
                }}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="submit"
              onClick={() => handleSubmit()}
              variant="secondary"
            >
              No, thank you
            </Button>
            <Button type="submit" onClick={() => handleSubmit()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
