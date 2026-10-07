import * as React from "react";

function IconHalo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      height="1em"
      width="1em"
      aria-hidden="true"
      {...props}
    >
      <ellipse
        cx="12.5"
        cy="4.5"
        rx="5.2"
        ry="1.25"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <rect
        x="5.55"
        y="8.4"
        width="12.15"
        height="10.15"
        rx="2.05"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M6.1 18.7v3.2"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <path
        d="M3.2 13.5h2.2"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M18.6 13.5h2.2"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        d="M9.55 12.2v2.85"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M13.7 12.2v2.85"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default IconHalo;
