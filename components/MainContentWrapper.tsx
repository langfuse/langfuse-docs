import { useRouter } from "next/router";
import { useState } from "react";
import { useConfig } from "nextra-theme-docs";
import { Button } from "./ui/button";
import {
  LifeBuoy,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Background } from "./Background";
import { NotebookBanner } from "./NotebookBanner";
import { COOKBOOK_ROUTE_MAPPING } from "@/lib/cookbook_route_mapping";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent } from "./ui/dialog";
import { CustomerStoryCTA } from "./customers/CustomerStoryCTA";
import { DocsBreadcrumbs } from "./DocsBreadcrumbs";
import { CopyMarkdownButton } from "./CopyMarkdownButton";

const pathsWithoutFooterWidgets = [
  "/imprint",
  "/blog",
  "/customers",
  "/careers",
];
const pathsWithCopyAsMarkdownButton = [
  "/docs",
  "/self-hosting",
  "/guide",
  "/faq",
  "/integrations",
];
const isCustomerStory = (pathname: string) =>
  pathname.startsWith("/customers/");



export const MainContentWrapper = (props) => {
  const router = useRouter();
  const { frontMatter } = useConfig();
  const cookbook = COOKBOOK_ROUTE_MAPPING.find(
    (cookbook) => cookbook.path === router.pathname
  );

  const versionLabel = frontMatter.label;

  const shouldShowCopyButton = pathsWithCopyAsMarkdownButton.some((prefix) =>
    router.pathname.startsWith(prefix)
  );

  const shouldShowBreadcrumbs = pathsWithCopyAsMarkdownButton.some((prefix) =>
    router.pathname.startsWith(prefix)
  );

  return (
    <>
      {(versionLabel || shouldShowCopyButton || shouldShowBreadcrumbs) && (
        <div className="flex items-center justify-between gap-4 flex-wrap mt-5">
          <div className="flex items-center gap-2 flex-wrap">
            {shouldShowBreadcrumbs && <DocsBreadcrumbs />}
            {versionLabel && (
              <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                {versionLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {shouldShowCopyButton && <CopyMarkdownButton key={router.pathname} />}
          </div>
        </div>
      )}

      {cookbook ? (
        <NotebookBanner src={cookbook.ipynbPath} className="mb-4 mt-4" />
      ) : null}

      {props.children}
      {isCustomerStory(router.pathname) && <CustomerStoryCTA />}
      {!pathsWithoutFooterWidgets.some(
        (path) =>
          router.pathname === path || router.pathname.startsWith(path + "/")
      ) ? (
        <div
          className="flex flex-wrap items-center justify-between gap-6 pt-8 border-t dark:border-neutral-800"
          id="docs-feedback"
        >
          <DocsFeedback key={router.pathname} />
          <DocsSupport />
        </div>
      ) : null}
      <Background />
    </>
  );
};

export const DocsSupport = () => {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" asChild>
        <a href="/support">
          <span>Support</span>
          <LifeBuoy className="h-4 w-4 ml-2" />
        </a>
      </Button>
    </div>
  );
};

export const DocsFeedback = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<
    "positive" | "negative" | "submitted" | null
  >(null);
  const [feedbackComment, setFeedbackComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [commentSubmitting, setCommentSubmitting] = useState<boolean>(false);

  // Controls the prominent follow-up dialog shown after any rating
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleFeedbackSelection = (newSelection: "positive" | "negative") => {
    // For both positive and negative feedback, open dialog immediately
    setSelected(newSelection);
    setDialogOpen(true);
    setFeedbackComment("");
    setSubmitting(true);

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: router.pathname,
        feedback: newSelection,
      }),
    })
      .then(() => {
        setSubmitting(false);
      })
      .catch(() => {
        setSelected(null);
        setDialogOpen(false);
        setSubmitting(false);
      });
  };

  const handleFeedbackCommentSubmit = () => {
    setCommentSubmitting(true);

    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: router.pathname,
        feedback: selected,
        comment: feedbackComment,
      }),
    })
      .then(() => {
        setSelected("submitted");
        setFeedbackComment("");
        setCommentSubmitting(false);
      })
      .catch(() => {
        setSelected(null);
        setDialogOpen(false);
        setCommentSubmitting(false);
      });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">Was this page helpful?</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedbackSelection("positive")}
          disabled={submitting}
        >
          <ThumbsUp className="h-4 w-4 text-green-600" />
          <span className="sr-only">Yes</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedbackSelection("negative")}
          disabled={submitting}
        >
          <ThumbsDown className="h-4 w-4 text-red-600" />
          <span className="sr-only">No</span>
        </Button>
      </div>

      {/* Dialog for feedback follow-up */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelected(null);
            setFeedbackComment("");
          }
        }}
      >
        <DialogContent className="max-w-lg">
          {selected === "submitted" ? (
            // Thank you view
            <div className="flex flex-col gap-4 text-center items-center py-4">
              <ThumbsUp className="h-12 w-12 text-green-500" />
              <h4 className="text-lg font-semibold">
                Thank you for your feedback!
              </h4>
              <p className="text-sm text-muted-foreground">
                We appreciate you taking the time to help us improve.
              </p>
              <Button
                variant="outline"
                size="lg"
                className="mt-4"
                onClick={() => {
                  setDialogOpen(false);
                  setSelected(null);
                }}
              >
                Done
              </Button>
            </div>
          ) : selected === "positive" ? (
            // Positive feedback follow-up
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <ThumbsUp className="h-8 w-8 text-green-500 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    What was most helpful?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Let us know what you found most useful (optional).
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="What was most helpful about this page?"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={commentSubmitting}
                  onClick={handleFeedbackCommentSubmit}
                >
                  {commentSubmitting ? "Submitting…" : "Send feedback"}
                </Button>
              </div>
            </div>
          ) : (
            // Negative feedback follow-up
            <div className="flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <Image
                  src="/images/people/marcklingen.jpg"
                  alt="Marc Klingen"
                  width={48}
                  height={48}
                  className="rounded-full aspect-square shrink-0"
                />
                <p className="text-sm leading-relaxed">
                  Documentation is super important to us and we genuinely want
                  to make it better. Could you share what was unclear or missing
                  on this page? Thank you for any hints! <br />
                  <span className="inline-block mt-2">
                    –{" "}
                    <Link
                      href="https://www.linkedin.com/in/marcklingen"
                      className="font-medium underline-offset-4 hover:underline"
                      target="_blank"
                    >
                      Marc Klingen
                    </Link>
                    , Co-founder &amp; Docs Lead
                  </span>
                </p>
              </div>

              <Textarea
                placeholder="Let us know how we can improve. Include your email if you'd like a reply."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
              />

              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="lg"
                  disabled={
                    commentSubmitting || feedbackComment.trim().length === 0
                  }
                  onClick={handleFeedbackCommentSubmit}
                >
                  {commentSubmitting ? "Submitting…" : "Send feedback"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
