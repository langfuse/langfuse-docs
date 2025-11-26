import { useEffect, useState } from "react";
import { useTheme } from "nextra-theme-docs";
import { cn } from "@/lib/utils";
import { Loader } from "./ai-elements/loader";

interface MetabaseDashboardProps {
  dashboardId: number;
  title: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function MetabaseDashboard({
  dashboardId,
  title,
  width = "100%",
  height = "1500px",
  className,
}: MetabaseDashboardProps) {
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        // Determine the theme to pass to Metabase (day for light, night for dark)
        const metabaseTheme = resolvedTheme === "light" ? "day" : "night";

        const response = await fetch(
          `/api/metabase-embed?dashboardId=${dashboardId}&theme=${metabaseTheme}`,
        ).catch((fetchError) => {
          // Handle network errors gracefully - don't re-throw, set error state
          console.error("Network error:", fetchError);
          setError("Network connection failed");
          return null;
        });

        if (!response) {
          return; // Network error already handled
        }

        if (!response.ok) {
          // Handle different HTTP error statuses gracefully - don't throw, set error state
          const errorMessage =
            response.status === 404
              ? "Dashboard not found"
              : response.status === 403
                ? "Access denied"
                : response.status >= 500
                  ? "Server error - please try again later"
                  : `Request failed with status ${response.status}`;
          setError(errorMessage);
          return;
        }

        const data = await response.json().catch((jsonError) => {
          // Handle JSON parsing errors gracefully - don't re-throw, set error state
          console.error("JSON parsing error:", jsonError);
          setError("Invalid response format");
          return null;
        });

        if (!data) {
          return; // JSON parsing error already handled
        }

        if (!data?.iframeUrl) {
          setError("No embed URL received");
          return;
        }

        setIframeUrl(data.iframeUrl);
        setError(null); // Clear any previous errors on success
      } catch (err) {
        // Final fallback - ensure all errors are handled gracefully without throwing
        console.error("Error fetching Metabase embed URL:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    };

    // Wrap the async call to prevent unhandled promise rejections
    const safelyFetchEmbedUrl = () => {
      fetchEmbedUrl().catch((error) => {
        console.error("Unhandled error in fetchEmbedUrl:", error);
        setError("Failed to load dashboard");
        setLoading(false);
      });
    };

    safelyFetchEmbedUrl();

    // Refresh the token every 8 minutes (before the 10-minute expiration)
    const interval = setInterval(safelyFetchEmbedUrl, 8 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dashboardId, resolvedTheme]);

  if (loading) {
    return (
      <div
        className={cn(
          "w-full mt-5 rounded overflow-hidden border bg-card min-h-[200px]",
          "flex items-center justify-center",
          className,
        )}
      >
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "w-full mt-5 rounded overflow-hidden border bg-card min-h-[200px]",
          "flex items-center justify-center",
          className,
        )}
      >
        <div className="text-red-500 text-center">
          <div className="font-semibold">Failed to load dashboard</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      </div>
    );
  }

  if (!iframeUrl) {
    return (
      <div
        className={cn(
          "w-full mt-5 rounded overflow-hidden border bg-card min-h-[200px]",
          "flex items-center justify-center",
          className,
        )}
      >
        <div>Dashboard not available</div>
      </div>
    );
  }

  return (
    <iframe
      src={iframeUrl}
      frameBorder={0}
      width={width}
      height={height}
      allowTransparency
      className={cn(
        "w-full mt-5 rounded overflow-hidden border bg-card",
        className,
      )}
      title={title}
    />
  );
}
