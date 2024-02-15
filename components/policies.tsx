import React, { useEffect } from "react";

const policies = {
  "terms-of-service": "3ed45618-f1d0-427f-af46-07b1212db572",
  privacy: "3ed45618-f1d0-427f-af46-07b1212db572",
  "cookie-policy": "3ed45618-f1d0-427f-af46-07b1212db572",
};

export function TermlyEmbed(props: { policy: keyof typeof policies }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.termly.io/embed-policy.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
  return (
    <div
      // @ts-ignore
      name="termly-embed"
      data-id={policies[props.policy]}
      data-type="iframe"
    ></div>
  );
}
