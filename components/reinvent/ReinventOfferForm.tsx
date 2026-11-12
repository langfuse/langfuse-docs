"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import posthog from "posthog-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportTalkToUsConversion } from "@/lib/ad-conversions";
import {
  REINVENT_LEAD_SOURCE,
  REINVENT_PROMO_CODE,
  REINVENT_SIGN_UP_HREF,
} from "@/components/reinvent/promo";

const MARKETO_BASE_URL = "https://discover.clickhouse.com";
const MARKETO_MUNCHKIN_ID = "238-FPC-317";
const MARKETO_FORM_ID = 1645;
const MARKETO_FORM_ELEMENT_ID = `mktoForm_${MARKETO_FORM_ID}`;
const MARKETO_SCRIPT_SRC = `${MARKETO_BASE_URL}/js/forms2/js/forms2.min.js`;

/**
 * The shared talk-to-us form requires these qualification answers.
 * This page does not ask them. The notes field says so, and these are the
 * most neutral values the picklists allow so the lead can still be saved.
 */
const UNASKED_QUALIFICATION = {
  miscBlankField1: "Still prototyping - nothing in production yet",
  miscBlankField2: "Nothing yet",
  miscBlankField3TextArea: "0",
  miscBlankField4TextArea: "0",
  miscBlankField5TextArea: "undecided",
  miscBlankField6TextArea: "1-5",
} as const;

type MarketoForm = {
  onSuccess: (
    callback: (values: unknown, followUpUrl: string) => boolean | void,
  ) => void;
  onValidate: (callback: (isValid: boolean) => void) => void;
  setValues: (values: Record<string, string>) => void;
  submit: () => void;
};

type MarketoFormsApi = {
  loadForm: (
    baseUrl: string,
    munchkinId: string,
    formId: number,
    callback: (form: MarketoForm) => void,
  ) => void;
};

function marketoApi(): MarketoFormsApi | undefined {
  return (window as Window & { MktoForms2?: MarketoFormsApi }).MktoForms2;
}

function readUtm(name: string) {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get(name)?.trim() ?? "";
}

function leadNotes(meetTheTeam: boolean) {
  const utmSource = readUtm("utm_source");
  const utmMedium = readUtm("utm_medium");
  const utmCampaign = readUtm("utm_campaign");
  return [
    "AWS re:Invent 2026 discount code request.",
    `Source: ${REINVENT_LEAD_SOURCE}`,
    `Meet the team: ${meetTheTeam ? "yes" : "no"}`,
    utmSource ? `utm_source: ${utmSource}` : "",
    utmMedium ? `utm_medium: ${utmMedium}` : "",
    utmCampaign ? `utm_campaign: ${utmCampaign}` : "",
    "Qualification questions on the standard contact form were not asked here.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function ReinventOfferForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [company, setCompany] = useState("");
  const [meetTheTeam, setMeetTheTeam] = useState(false);
  const [ready, setReady] = useState(false);
  const [failedToLoad, setFailedToLoad] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const marketoForm = useRef<MarketoForm | null>(null);
  const loaded = useRef(false);
  const reported = useRef(false);

  const loadMarketoForm = useCallback(() => {
    const api = marketoApi();
    if (loaded.current || !api) return;
    if (!document.getElementById(MARKETO_FORM_ELEMENT_ID)) return;
    loaded.current = true;

    api.loadForm(
      MARKETO_BASE_URL,
      MARKETO_MUNCHKIN_ID,
      MARKETO_FORM_ID,
      (form) => {
        marketoForm.current = form;
        setReady(true);
        form.onValidate((isValid) => {
          if (!isValid) {
            setSubmitting(false);
            setSubmitError("Check your work email and try again.");
          }
        });
        form.onSuccess(() => {
          if (reported.current) return false;
          reported.current = true;
          try {
            posthog.capture("sales:inquiry_completed", {
              form_id: MARKETO_FORM_ID,
              source: REINVENT_LEAD_SOURCE,
              page_path: window.location.pathname,
              utm_source: readUtm("utm_source") || undefined,
              utm_medium: readUtm("utm_medium") || undefined,
              utm_campaign: readUtm("utm_campaign") || undefined,
            });
          } catch {
            // Analytics must not block the code.
          }
          reportTalkToUsConversion();
          setSubmitting(false);
          setRevealed(true);
          return false;
        });
      },
    );
  }, []);

  useEffect(() => {
    const onError = () => setFailedToLoad(true);
    if (marketoApi()) {
      loadMarketoForm();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${MARKETO_SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", loadMarketoForm);
      existing.addEventListener("error", onError);
      return () => {
        existing.removeEventListener("load", loadMarketoForm);
        existing.removeEventListener("error", onError);
      };
    }
    const script = document.createElement("script");
    script.src = MARKETO_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", loadMarketoForm);
    script.addEventListener("error", onError);
    document.head.appendChild(script);
    return () => {
      script.removeEventListener("load", loadMarketoForm);
      script.removeEventListener("error", onError);
    };
  }, [loadMarketoForm]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    const form = marketoForm.current;
    if (!form) {
      setSubmitError("The form is still loading. Try again in a moment.");
      return;
    }
    setSubmitting(true);
    const utmSource = readUtm("utm_source");
    const utmMedium = readUtm("utm_medium");
    const utmCampaign = readUtm("utm_campaign");
    form.setValues({
      FirstName: firstName.trim() || "-",
      // The shared form requires a last name. This page does not ask for one.
      LastName: "-",
      Email: email.trim(),
      Company: company.trim() || "-",
      Event_Notes__c: leadNotes(meetTheTeam),
      ...UNASKED_QUALIFICATION,
      ...(utmSource ? { utm_source__c: utmSource } : {}),
      ...(utmMedium ? { utm_medium__c: utmMedium } : {}),
      ...(utmCampaign ? { utm_campaign__c: utmCampaign } : {}),
    });
    form.submit();
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(REINVENT_PROMO_CODE);
    } catch {
      const input = document.createElement("textarea");
      input.value = REINVENT_PROMO_CODE;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      const didCopy = document.execCommand("copy");
      input.remove();
      if (!didCopy) return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  if (revealed) {
    return (
      <div
        className="flex flex-col gap-4 border border-line-structure bg-surface-bg p-4 sm:p-5"
        role="status"
        aria-live="polite"
      >
        <p className="font-mono text-[12px] text-text-tertiary">
          Langfuse Cloud
        </p>
        <p className="text-[15px] leading-[150%] text-text-secondary">
          Your discount code for the Core plan base fee. An organization owner
          pastes it under Organization Settings, then Billing.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-12 flex-1 items-center border border-line-structure px-4">
            <code className="font-mono text-[20px] tracking-[0.04em] text-text-primary">
              {REINVENT_PROMO_CODE}
            </code>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="default"
            wrapperClassName="w-full sm:w-fit"
            onClick={copyCode}
          >
            {copied ? "Copied" : "Copy code"}
          </Button>
        </div>
        <Button
          href={REINVENT_SIGN_UP_HREF}
          target="_blank"
          rel="noopener noreferrer"
          size="default"
          wrapperClassName="w-full sm:w-fit"
        >
          Sign up for Langfuse Cloud
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-line-structure bg-surface-bg p-4 sm:p-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="reinvent-email"
            className="text-[13px] text-text-secondary"
          >
            Work email
          </label>
          <Input
            id="reinvent-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 text-base md:text-base"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reinvent-first-name"
              className="text-[13px] text-text-secondary"
            >
              First name
            </label>
            <Input
              id="reinvent-first-name"
              name="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              className="h-11 text-base md:text-base"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="reinvent-company"
              className="text-[13px] text-text-secondary"
            >
              Company
            </label>
            <Input
              id="reinvent-company"
              name="company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              className="h-11 text-base md:text-base"
            />
          </div>
        </div>
        <label className="flex min-h-11 items-start gap-3 text-[14px] leading-[150%] text-text-secondary">
          <input
            type="checkbox"
            checked={meetTheTeam}
            onChange={(event) => setMeetTheTeam(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-current"
          />
          <span>I&apos;d like to meet the team at re:Invent</span>
        </label>
        {submitError ? (
          <p className="text-[13px] text-text-primary" role="alert">
            {submitError}
          </p>
        ) : null}
        {failedToLoad ? (
          <p className="text-[13px] text-text-primary" role="alert">
            The form could not be loaded. Refresh the page, or find the team at
            booth #706.
          </p>
        ) : null}
        <Button
          type="submit"
          size="default"
          disabled={!ready || submitting || failedToLoad}
          wrapperClassName="w-full sm:w-fit"
        >
          {submitting ? "Sending" : ready ? "Get the discount code" : "Loading"}
        </Button>
      </form>
      <div className="sr-only" aria-hidden="true" inert>
        <form id={MARKETO_FORM_ELEMENT_ID} />
      </div>
    </div>
  );
}
