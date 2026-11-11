"use client";

import { useEffect, useState } from "react";
import { formatDate, formatShortRelativeDate } from "@/components/blog/utils";

const formatters = {
  default: formatDate,
  short: formatShortRelativeDate,
};

/**
 * Relative date label ("Today", "1 Day Ago", ...). The server-rendered label
 * can be stale (static export, cached HTML) and uses the server's time zone,
 * so it is recomputed against the viewer's clock after hydration.
 */
export function RelativeDate({
  date,
  serverLabel,
  variant = "default",
}: {
  date?: string;
  serverLabel: string;
  variant?: keyof typeof formatters;
}) {
  const [label, setLabel] = useState(serverLabel);

  useEffect(() => {
    setLabel(formatters[variant](date));
  }, [date, variant]);

  return <>{label}</>;
}
