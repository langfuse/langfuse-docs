import React, { useEffect } from "react";

const policies = {
  "terms-of-service": "baf80a2e-dc67-46de-9ca8-2f7457179c32",
  privacy: "47905712-56e1-4ad0-9bb7-8958f3263f90",
  "cookie-policy": "f97945a3-cb02-4db7-9370-c57023d92838",
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
