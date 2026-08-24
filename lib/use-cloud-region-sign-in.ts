import { useEffect, useState } from "react";
import {
  getCloudRegionSignInSnapshot,
  startCloudRegionSignInProbe,
  subscribeToCloudRegionSignIn,
} from "@/lib/cloud-region-sign-in-store";

// React binding for the shared cloud-region sign-in probe: every caller gets
// the same answer from a single set of requests, however many components ask.
// See lib/cloud-region-sign-in-store.ts.
export const useCloudRegionSignIn = (
  enabled = process.env.NODE_ENV === "production",
) => {
  const [snapshot, setSnapshot] = useState(getCloudRegionSignInSnapshot);

  useEffect(() => {
    startCloudRegionSignInProbe(enabled);
    // The probe may already have answered before this component mounted.
    setSnapshot(getCloudRegionSignInSnapshot());
    return subscribeToCloudRegionSignIn(() =>
      setSnapshot(getCloudRegionSignInSnapshot()),
    );
  }, [enabled]);

  return snapshot.signedInRegions;
};
