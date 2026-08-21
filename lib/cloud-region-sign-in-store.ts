import {
  cloudRegions,
  type CloudRegionKey,
  createInitialCloudRegionSignInState,
  isSignedInSession,
} from "@/lib/cloud-regions";

// Shared "is this browser signed in to a cloud region?" state.
//
// The probe asks every region's `/api/auth/session` endpoint whether the
// browser holds a session there. Every region is a `*.langfuse.com` subdomain,
// so these credentialed requests are same-site and are not affected by the
// third-party cookie blocking in Safari/Firefox.
//
// This lives in a module-level store rather than a React context for two
// reasons: the probe then runs once per page load no matter how many
// components need the answer (the header button and the /cloud region picker
// both do), and non-React callers can read the latest answer imperatively —
// see `reportLaunchAppConversionIfSignedOut` in lib/ad-conversions.ts.

export type CloudRegionSignInSnapshot = {
  signedInRegions: Record<CloudRegionKey, boolean>;
  // False until every region has answered. `signedInRegions` starts out all
  // `false`, which is indistinguishable from "signed out everywhere", so any
  // caller that treats signed-out as meaningful must wait for this.
  resolved: boolean;
};

const regionKeys = Object.keys(cloudRegions) as CloudRegionKey[];

let snapshot: CloudRegionSignInSnapshot = {
  signedInRegions: createInitialCloudRegionSignInState(),
  resolved: false,
};

const listeners = new Set<() => void>();
let probeStarted = false;
let awaitingRegions = 0;

export function getCloudRegionSignInSnapshot(): CloudRegionSignInSnapshot {
  return snapshot;
}

export function subscribeToCloudRegionSignIn(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function publish(next: CloudRegionSignInSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function recordRegionAnswer(key: CloudRegionKey, signedIn: boolean) {
  awaitingRegions -= 1;
  publish({
    signedInRegions: { ...snapshot.signedInRegions, [key]: signedIn },
    resolved: awaitingRegions === 0,
  });
}

// Starts the probe on first call and is a no-op afterwards, so every consumer
// can call it unconditionally. When disabled (outside production, where the
// cross-origin session endpoints are not reachable from localhost) the
// snapshot resolves immediately with no region signed in.
export function startCloudRegionSignInProbe(enabled: boolean) {
  if (probeStarted) return;
  probeStarted = true;

  if (!enabled) {
    publish({ ...snapshot, resolved: true });
    return;
  }

  awaitingRegions = regionKeys.length;

  regionKeys.forEach((key) => {
    fetch(`${cloudRegions[key].url}/api/auth/session`, {
      credentials: "include",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => recordRegionAnswer(key, isSignedInSession(data)))
      // An unreachable or blocked region counts as answered-and-signed-out:
      // waiting forever would suppress every downstream decision.
      .catch(() => recordRegionAnswer(key, false));
  });
}

export function isSignedInToAnyCloudRegion(
  snapshotToCheck: CloudRegionSignInSnapshot = snapshot,
): boolean {
  return Object.values(snapshotToCheck.signedInRegions).some(Boolean);
}
