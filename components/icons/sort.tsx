// icon:sort-descending | Tabler Icons https://tablericons.com/ | Csaba Kissi
import * as React from "react";

function IconSort(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" />
      <path d="M4 6h9M4 12h7M4 18h7M15 15l3 3 3-3M18 6v12" />
    </svg>
  );
}

export default IconSort;
