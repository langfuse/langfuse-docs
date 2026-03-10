import { useEffect, useState } from "react";
import {
  cloudRegions,
  type CloudRegionKey,
  createInitialCloudRegionSignInState,
  isSignedInSession,
} from "@/lib/cloud-regions";

export const useCloudRegionSignIn = (
  enabled = process.env.NODE_ENV === "production"
) => {
  const [signedInRegions, setSignedInRegions] = useState<
    Record<CloudRegionKey, boolean>
  >(() => createInitialCloudRegionSignInState());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const abortController = new AbortController();

    Object.entries(cloudRegions).forEach(([key, region]) => {
      fetch(`${region.url}/api/auth/session`, {
        credentials: "include",
        mode: "cors",
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          setSignedInRegions((prev) => ({
            ...prev,
            [key]: isSignedInSession(data),
          }));
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setSignedInRegions((prev) => ({
              ...prev,
              [key]: false,
            }));
          }
        });
    });

    return () => {
      abortController.abort();
    };
  }, [enabled]);

  return signedInRegions;
};
