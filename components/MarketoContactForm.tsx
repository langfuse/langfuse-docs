"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { reportTalkToUsConversion } from "@/lib/ad-conversions";

const MARKETO_BASE_URL = "https://discover.clickhouse.com";
const MARKETO_MUNCHKIN_ID = "238-FPC-317";
const MARKETO_FORM_ID = 1645;
const MARKETO_FORM_ELEMENT_ID = `mktoForm_${MARKETO_FORM_ID}`;
const MARKETO_SCRIPT_SRC = `${MARKETO_BASE_URL}/js/forms2/js/forms2.min.js`;

type MarketoForm = {
  onSuccess: (
    callback: (values: unknown, followUpUrl: string) => boolean | void,
  ) => void;
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

export function MarketoContactForm() {
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const formLoadedRef = useRef(false);

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

        form.onSuccess(() => {
          reportTalkToUsConversion();
          setIsSuccess(true);

          return false;
        });
      },
    );
  }, []);

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
      className="lf-marketo-form"
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
