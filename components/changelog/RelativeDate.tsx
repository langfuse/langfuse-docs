"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/components/blog/utils";

/**
 * Relative date label ("Today", "1 Day Ago", ...). The server-rendered label
 * can be stale (static export, cached HTML) and uses the server's time zone,
 * so it is recomputed against the viewer's clock after hydration.
 */
export function RelativeDate({
  date,
  serverLabel,
}: {
  date?: string;
  serverLabel: string;
}) {
  const [label, setLabel] = useState(serverLabel);

  useEffect(() => {
    setLabel(formatDate(date));
  }, [date]);

  return <>{label}</>;
}
