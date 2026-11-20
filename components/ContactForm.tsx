"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { reportTalkToUsConversion } from "@/lib/ad-conversions";
import { readAdvertisementConsent } from "@/lib/cookie-consent";
import posthog from "posthog-js";
import {
  readUseCaseAttribution,
  rememberUseCaseAttribution,
  type UseCase,
} from "@/lib/use-case-analytics";
import { cn } from "@/lib/utils";

const CONVERSION_ORIGIN = "https://forms.conversion.ai";
const CONVERSION_FORM_ID = "8fed9078-25ce-4f9e-ad32-dac3ae839148";
const CONVERSION_SCRIPT_SRC = `${CONVERSION_ORIGIN}/script.js`;
const FORM_LOAD_TIMEOUT_MS = 10_000;

/**
 * URL parameter -> hidden field id. Field ids are unique to this form
 * (Conversion form settings -> Advanced -> Form fields).
 */
const URL_TRACKING_FIELDS: Record<string, string> = {
  utm_source: "9a874dfc-ef18-4cfd-ab13-b9517e33a314",
  utm_medium: "7e3d1944-13a4-4dfa-9359-10a8c4019960",
  utm_campaign: "a041e34f-ab1d-4b19-9fbf-9fd882a05007",
  utm_content: "ae64a872-ec6d-4f76-ad20-12adcd7ab51b",
  utm_term: "555e18fc-8afa-4729-8973-6e1c4ae749c6",
  gclid: "749e8f3f-0fd5-4296-9e57-659f08ece1f5",
  fbclid: "0bff871f-522a-4530-92d9-fd1e5dc28951",
  loc: "1a65d947-04f8-461b-8aef-5751631b37fe",
};

/** Ad click ids are advertisement-category data under CookieYes consent. */
const AD_CLICK_ID_PARAMS = new Set(["gclid", "fbclid"]);

function trackingValuesFromUrl(search: string) {
  const params = new URLSearchParams(search);
  const includeAdClickIds = readAdvertisementConsent() === "granted";
  const fields: Record<string, string> = {};
  for (const [param, fieldId] of Object.entries(URL_TRACKING_FIELDS)) {
    if (AD_CLICK_ID_PARAMS.has(param) && !includeAdClickIds) continue;
    const value = params.get(param);
    if (value) fields[fieldId] = value;
  }
  return fields;
}

function SuccessPanel() {
  return (
    <div className="lf-success-panel" role="status" aria-live="polite">
      <div className="lf-success-icon">
        <Check className="h-8 w-8" strokeWidth={2.5} />
      </div>
      <div className="lf-success-title">Thank you for reaching out!</div>
      <div className="lf-success-body">
        We&apos;ve received your request. Our team will get back to you shortly.
      </div>
    </div>
  );
}

export function ContactForm({
  useCase,
  section = "hero",
}: {
  useCase?: UseCase;
  section?: string;
} = {}) {
  const [isMounted, setIsMounted] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const conversionReportedRef = useRef(false);

  useEffect(() => {
    // Only adds Conversion's visitor tracking; the form works without it.
    if (document.querySelector(`script[src="${CONVERSION_SCRIPT_SRC}"]`))
      return;
    const script = document.createElement("script");
    script.src = CONVERSION_SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== CONVERSION_ORIGIN) return;
      const iframeWindow = iframeRef.current?.contentWindow;
      if (!iframeWindow || event.source !== iframeWindow) return;

      setIsFormLoaded(true);
      const { type, data } = event.data ?? {};

      if (type === "conversion-forms-height-adjustment") {
        const height = Number(data?.height);
        if (iframeRef.current && height > 0) {
          iframeRef.current.style.height = `${height}px`;
        }
        return;
      }

      // The form pings once when it is ready; there is no follow-up ping.
      if (type === "conversion-forms-ping") {
        const fields = trackingValuesFromUrl(window.location.search);
        if (Object.keys(fields).length > 0) {
          iframeWindow.postMessage(
            {
              type: "conversion-forms",
              data: { eventName: "set-values", fields },
            },
            CONVERSION_ORIGIN,
          );
        }
        return;
      }

      if (
        type !== "conversion-forms" ||
        data?.eventName !== "submitted" ||
        data?.formId !== CONVERSION_FORM_ID ||
        conversionReportedRef.current
      ) {
        return;
      }
      conversionReportedRef.current = true;

      if (useCase) {
        rememberUseCaseAttribution({
          use_case: useCase,
          section,
          action: "form_submit",
        });
      }
      const attribution = readUseCaseAttribution();
      try {
        posthog.capture("sales:inquiry_completed", {
          form_id: CONVERSION_FORM_ID,
          page_path: window.location.pathname,
          ...(attribution ?? {}),
          ...(useCase
            ? {
                use_case: useCase,
                section: attribution?.section ?? section,
                action: attribution?.action ?? "form_submit",
              }
            : {}),
        });
      } catch {
        // Analytics must not prevent showing a successful submission.
      }
      reportTalkToUsConversion();
      setIsSuccess(true);
    };

    window.addEventListener("message", handleMessage);
    // Mount the iframe only once the listener exists, so its one-time ready
    // ping is not missed.
    setIsMounted(true);
    return () => window.removeEventListener("message", handleMessage);
  }, [section, useCase]);

  useEffect(() => {
    if (isFormLoaded) return;
    const timeout = window.setTimeout(
      () => setHasError(true),
      FORM_LOAD_TIMEOUT_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [isFormLoaded]);

  return (
    <div
      className="lf-contact-form"
      aria-busy={!isFormLoaded && !hasError && !isSuccess}
    >
      {isSuccess ? (
        <SuccessPanel />
      ) : hasError ? (
        <div className="lf-contact-form-message" role="alert">
          The form could not be loaded. Please refresh the page or contact us at
          sales@langfuse.com.
        </div>
      ) : (
        <>
          {!isFormLoaded && (
            <div className="lf-contact-form-message">Loading form...</div>
          )}
          {isMounted && (
            <iframe
              ref={iframeRef}
              id={CONVERSION_FORM_ID}
              src={`${CONVERSION_ORIGIN}/${CONVERSION_FORM_ID}`}
              title="Talk to us"
              className={cn(
                "block w-full border-0",
                !isFormLoaded && "absolute inset-0 opacity-0",
              )}
            />
          )}
        </>
      )}
    </div>
  );
}

export function ContactFormCard({
  className,
  useCase,
  section = "hero",
}: {
  className?: string;
  useCase?: UseCase;
  section?: string;
} = {}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md border border-line-structure bg-stripe-pattern p-4 corner-box-corners",
        className,
      )}
    >
      <ContactForm useCase={useCase} section={section} />
    </div>
  );
}
