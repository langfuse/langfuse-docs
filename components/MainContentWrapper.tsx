import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  Mail,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { RxDiscordLogo } from "react-icons/rx";
import { Textarea } from "./ui/textarea";
import { openChat } from "./supportChat";
import { Background } from "./Background";
import { ProductUpdateSignup } from "./productUpdateSignup";
import { useSearchParams } from "next/navigation";

const pathsWithoutFooterWidgets = ["/imprint", "/blog"];

export const SidebarChecker = () => {
  useEffect(() => {
    let element = document.querySelector('.nextra-sidebar-container');
    element.className = 'hidden';
    let carousel = document.querySelectorAll('.nx-mb-8.nx-flex.nx-items-center.nx-border-t');
    carousel[0].className = 'hidden';
  }, [])
  return (<></>);
}

export const MainContentWrapper = (props) => {
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const params = useSearchParams();
  const sidebarVisible = params.get('sidebarVisible');
  const feedbackVisible = params.get('feedbackVisible');

  return (
    <>
      {sidebarVisible === 'false' ? <SidebarChecker /> : ''}
      {props.children}
      {!pathsWithoutFooterWidgets.includes(router.pathname) ? (
        <div
          className="flex flex-col justify-center gap-10 pt-14 mb-20"
          id="docs-feedback"
        >
        </div>
      ) : null}
      <Background />
    </>
  );
};

export const DocsSubscribeToUpdates = () => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h3 className="text-xl font-semibold">Subscribe to updates</h3>
      <div className="flex gap-3 flex-wrap">
        <ProductUpdateSignup source="docs-footer" small />
      </div>
    </div>
  );
};

export const DocsSupport = () => {
  return (
    <div className="flex flex-col items-start gap-3">
      <h3 className="text-xl font-semibold" id="contact">
        Questions? We're here to help
      </h3>
      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" size="sm" asChild>
          <a href="/discord" target="_blank">
            <span>Discord</span>
            <RxDiscordLogo className="h-4 w-4 ml-3" />
          </a>
        </Button>
        {/* <Button variant="outline" size="sm" onClick={() => openChat()}>
          <span>Chat</span> <MessageSquare className="h-4 w-4 ml-3" />
        </Button> */}
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:support@assistme.chat" target="_blank">
            <span>Email</span>
            <Mail className="h-4 w-4 ml-3" />
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="https://cal.com/ihor-k" target="_blank">
            <span>Talk to founder</span>
            <Calendar className="h-4 w-4 ml-3" />
          </a>
        </Button>
      </div>
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

  const handleFeedbackSelection = (newSelection: "positive" | "negative") => {
    setSubmitting(true);
    fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({
        page: router.pathname,
        feedback: newSelection,
      }),
    })
      .then(() => {
        setFeedbackComment("");
        setSelected(newSelection);
        setSubmitting(false);
      })
      .catch(() => setSelected(null));
  };

  const handleFeedbackCommentSubmit = () => {
    setSubmitting(true);
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
        setSubmitting(false);
      })
      .catch(() => setSelected(null));
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold">
        {selected === null
          ? "Was this page useful?"
          : selected === "positive"
            ? "What was most useful?"
            : selected === "negative"
              ? "What can we improve?"
              : "Thanks for your feedback!"}
      </h3>
      {selected === null ? (
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="xl"
            onClick={() => handleFeedbackSelection("positive")}
            disabled={submitting}
          >
            <span>Yes</span>
            <ThumbsUp className="h-5 w-5 ml-4 text-green-800" />
          </Button>
          <Button
            variant="outline"
            size="xl"
            onClick={() => handleFeedbackSelection("negative")}
            disabled={submitting}
          >
            <span>Could be better</span>
            <ThumbsDown className="h-5 w-5 ml-4 text-red-800" />
          </Button>
        </div>
      ) : selected === "positive" || selected === "negative" ? (
        <div className="flex flex-col gap-3">
          <Textarea
            placeholder={
              selected === "positive"
                ? "Let us know what you found most useful"
                : "Let us know what we can improve"
            }
            value={feedbackComment}
            onChange={(e) => setFeedbackComment(e.target.value)}
          />
          <Button
            variant="secondary"
            className="self-start"
            size="lg"
            disabled={submitting}
            onClick={handleFeedbackCommentSubmit}
          >
            {submitting ? "Submitting ..." : "Send feedback"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setSelected(null)}
            className="self-start"
          >
            Send more feedback
          </Button>
        </div>
      )}
    </div>
  );
};
