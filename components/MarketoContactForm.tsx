"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { reportTalkToUsConversion } from "@/lib/ad-conversions";
import posthog from "posthog-js";
import {
  readUseCaseAttribution,
  rememberUseCaseAttribution,
  type UseCase,
} from "@/lib/use-case-analytics";
import { cn } from "@/lib/utils";

const MARKETO_BASE_URL = "https://discover.clickhouse.com";
const MARKETO_MUNCHKIN_ID = "238-FPC-317";
const MARKETO_FORM_ID = 1645;
const MARKETO_FORM_ELEMENT_ID = `mktoForm_${MARKETO_FORM_ID}`;
const MARKETO_SCRIPT_SRC = `${MARKETO_BASE_URL}/js/forms2/js/forms2.min.js`;

/** Fields shown by default in compact mode; everything else is behind a details toggle. */
const COMPACT_VISIBLE_FIELDS = new Set([
  "FirstName",
  "LastName",
  "Email",
  "Company",
  "Event_Notes__c",
]);

type MarketoForm = {
  onSuccess: (
    callback: (values: unknown, followUpUrl: string) => boolean | void,
  ) => void;
  onValidate: (callback: (isValid: boolean) => void) => void;
  getFormElem: () => HTMLFormElement;
};

declare global {
  interface Window {
    MktoForms2?: {
      loadForm: (
        baseUrl: string,
        munchkinId: string,
        formId: number,
        callback: (form: MarketoForm) => void,
      ) => void;
    };
  }
}

function resolveFormElement(form: MarketoForm): HTMLFormElement | null {
  const elem = form.getFormElem() as
    | HTMLFormElement
    | {
        [index: number]: HTMLFormElement;
        get?: (i: number) => HTMLFormElement;
      };
  if (elem instanceof HTMLElement) return elem;
  if (elem && typeof elem === "object") {
    return elem[0] ?? elem.get?.(0) ?? null;
  }
  return document.getElementById(
    MARKETO_FORM_ELEMENT_ID,
  ) as HTMLFormElement | null;
}

function compactMarketoForm(form: MarketoForm, formElement: HTMLFormElement) {
  const rows = Array.from(
    formElement.querySelectorAll<HTMLElement>(".mktoFormRow"),
  );
  const deferredRows: HTMLElement[] = [];

  for (const row of rows) {
    const fields = Array.from(
      row.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea"),
    ).filter((field) => field.name && field.type !== "hidden");

    if (fields.length === 0) {
      if (row.querySelector(".mktoHtmlText")) {
        deferredRows.push(row);
      }
      continue;
    }

    const visible = fields.every((field) =>
      COMPACT_VISIBLE_FIELDS.has(field.name),
    );
    if (!visible) {
      deferredRows.push(row);
    }
  }

  const firstNameRow = formElement
    .querySelector<HTMLElement>('input[name="FirstName"]')
    ?.closest<HTMLElement>(".mktoFormRow");
  const lastNameRow = formElement
    .querySelector<HTMLElement>('input[name="LastName"]')
    ?.closest<HTMLElement>(".mktoFormRow");
  if (firstNameRow && lastNameRow && firstNameRow.parentElement) {
    const nameRow = document.createElement("div");
    nameRow.className = "lf-marketo-name-row";
    firstNameRow.parentElement.insertBefore(nameRow, firstNameRow);
    nameRow.appendChild(firstNameRow);
    nameRow.appendChild(lastNameRow);
  }

  if (deferredRows.length === 0) return;

  const details = document.createElement("details");
  details.className = "lf-marketo-more";
  const summary = document.createElement("summary");
  summary.textContent = "Add more context about your setup";
  details.appendChild(summary);

  const body = document.createElement("div");
  body.className = "lf-marketo-more-body";
  for (const row of deferredRows) {
    body.appendChild(row);
  }
  details.appendChild(body);

  const buttonRow = formElement.querySelector(".mktoButtonRow");
  if (buttonRow?.parentElement) {
    buttonRow.parentElement.insertBefore(details, buttonRow);
  } else {
    formElement.appendChild(details);
  }

  // Required fields stay in the collapsed section; open it when validation fails.
  form.onValidate((isValid) => {
    if (!isValid) {
      details.open = true;
    }
  });
}

function MarketoSuccessPanel() {
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

export function MarketoContactForm({
  compact = false,
  useCase,
  section = "hero",
}: {
  compact?: boolean;
  useCase?: UseCase;
  section?: string;
} = {}) {
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const formLoadedRef = useRef(false);
  const conversionReportedRef = useRef(false);

  useEffect(() => {
    if (!useCase) return;
    rememberUseCaseAttribution({
      use_case: useCase,
      section,
      action: "form_submit",
    });
  }, [useCase, section]);

  const loadMarketoForm = useCallback(() => {
    if (formLoadedRef.current || !window.MktoForms2) {
      return;
    }

    const formElement = document.getElementById(MARKETO_FORM_ELEMENT_ID);

    if (!formElement) {
      return;
    }

    formElement.replaceChildren();
    formLoadedRef.current = true;

    window.MktoForms2.loadForm(
      MARKETO_BASE_URL,
      MARKETO_MUNCHKIN_ID,
      MARKETO_FORM_ID,
      (form) => {
        setIsFormLoaded(true);
        if (compact) {
          const formElement = resolveFormElement(form);
          if (formElement) {
            compactMarketoForm(form, formElement);
          }
        }

        form.onSuccess(() => {
          if (conversionReportedRef.current) return false;
          conversionReportedRef.current = true;
          const attribution = readUseCaseAttribution();
          try {
            posthog.capture("sales:inquiry_completed", {
              form_id: MARKETO_FORM_ID,
              page_path:
                typeof window !== "undefined"
                  ? window.location.pathname
                  : undefined,
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

          return false;
        });
      },
    );
  }, [compact, section, useCase]);

  useEffect(() => {
    const handleScriptError = () => setHasError(true);

    if (window.MktoForms2) {
      loadMarketoForm();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${MARKETO_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", loadMarketoForm);
      existingScript.addEventListener("error", handleScriptError);

      return () => {
        existingScript.removeEventListener("load", loadMarketoForm);
        existingScript.removeEventListener("error", handleScriptError);
      };
    }

    const script = document.createElement("script");
    script.src = MARKETO_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", loadMarketoForm);
    script.addEventListener("error", handleScriptError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", loadMarketoForm);
      script.removeEventListener("error", handleScriptError);
    };
  }, [loadMarketoForm]);

  return (
    <div
      className={cn("lf-marketo-form", compact && "lf-marketo-form--compact")}
      aria-busy={!isFormLoaded && !hasError && !isSuccess}
    >
      {isSuccess ? (
        <MarketoSuccessPanel />
      ) : hasError ? (
        <div className="lf-marketo-form-message" role="alert">
          The form could not be loaded. Please refresh the page or contact us at
          sales@langfuse.com.
        </div>
      ) : (
        <>
          {!isFormLoaded && (
            <div className="lf-marketo-form-message">Loading form...</div>
          )}
          <form
            id={MARKETO_FORM_ELEMENT_ID}
            className={isFormLoaded ? undefined : "sr-only"}
          />
        </>
      )}
    </div>
  );
}

export function MarketoContactFormCard({
  className,
  compact = false,
  useCase,
  section = "hero",
}: {
  className?: string;
  compact?: boolean;
  useCase?: UseCase;
  section?: string;
} = {}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-md border border-line-structure bg-stripe-pattern p-4 corner-box-corners",
        compact && "p-3 sm:p-4",
        className,
      )}
    >
      <MarketoContactForm
        compact={compact}
        useCase={useCase}
        section={section}
      />
    </div>
  );
}
