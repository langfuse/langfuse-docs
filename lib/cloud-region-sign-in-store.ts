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
// reasons: several components need the same answer (the header button and the
// /cloud region picker), and non-React callers can read the latest answer
// imperatively — see `reportLaunchAppConversionIfSignedOut` in
// lib/ad-conversions.ts.

export type CloudRegionSignInSnapshot = {
  signedInRegions: Record<CloudRegionKey, boolean>;
  // False until every region has answered. `signedInRegions` starts out all
  // `false`, which is indistinguishable from "signed out everywhere", so any
  // caller that treats signed-out as meaningful must wait for this. Once true
  // it stays true: a later refresh updates the region values in place rather
  // than reopening a window where nothing can be decided.
  resolved: boolean;
};

// A region that accepts the connection but never responds would otherwise keep
// the first probe unresolved until the browser's own network timeout (minutes),
// suppressing every conversion in the meantime. On a first probe an aborted
// request counts as signed-out, like any other failure below, so this is
// deliberately generous: too short a deadline would start reporting
// slow-but-signed-in visitors as sign ups, which is the miscount this store
// exists to prevent.
const PROBE_TIMEOUT_MS = 8_000;

// Sessions are created in the app, in another tab or window, so the answer goes
// stale while a page sits open. Re-probing is cheap, but it should not run once
// per component mount, so calls within this window reuse the last probe.
const PROBE_REUSE_MS = 30_000;

// Returning to the tab is the one moment we know a session may just have been
// created, so it gets a much shorter window. Signing in through an already
// authenticated SSO prompt can take only a few seconds, and a refresh skipped
// here leaves the stale snapshot to report the visitor's next CTA click as a
// sign up. Short enough to catch that, long enough that flicking between tabs
// cannot turn into a stream of requests.
const VISIBILITY_PROBE_REUSE_MS = 5_000;

const regionKeys = Object.keys(cloudRegions) as CloudRegionKey[];

let snapshot: CloudRegionSignInSnapshot = {
  signedInRegions: createInitialCloudRegionSignInState(),
  resolved: false,
};

const listeners = new Set<() => void>();
// Answers from a superseded probe are ignored, so a refresh cannot corrupt the
// in-flight count of the probe that replaced it.
let probeGeneration = 0;
let lastProbeStartedAt = 0;
let watchingVisibility = false;

export function getCloudRegionSignInSnapshot(): CloudRegionSignInSnapshot {
  return snapshot;
}

export function subscribeToCloudRegionSignIn(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isSignedInToAnyCloudRegion(
  snapshotToCheck: CloudRegionSignInSnapshot = snapshot,
): boolean {
  return Object.values(snapshotToCheck.signedInRegions).some(Boolean);
}

function publish(next: CloudRegionSignInSnapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function fetchRegionSignIn(key: CloudRegionKey): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

  return fetch(`${cloudRegions[key].url}/api/auth/session`, {
    credentials: "include",
    mode: "cors",
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then((data) => isSignedInSession(data))
    .finally(() => clearTimeout(timeout));
}

function runProbe() {
  const generation = ++probeGeneration;
  // A visibility refresh can start while a slow first probe is still waiting on
  // a region, so answers are tagged with their probe and stale ones dropped.
  let awaitingRegions = regionKeys.length;
  // Whether this probe is re-checking regions that have already answered once.
  const isRefresh = snapshot.resolved;
  lastProbeStartedAt = Date.now();

  const recordAnswer = (key: CloudRegionKey, signedIn: boolean) => {
    // A newer probe is now authoritative.
    if (generation !== probeGeneration) return;

    awaitingRegions -= 1;
    const resolved = snapshot.resolved || awaitingRegions === 0;
    if (
      snapshot.signedInRegions[key] === signedIn &&
      snapshot.resolved === resolved
    ) {
      // A refresh that confirms what we already knew: no need to wake
      // subscribers.
      return;
    }

    publish({
      signedInRegions: { ...snapshot.signedInRegions, [key]: signedIn },
      resolved,
    });
  };

  regionKeys.forEach((key) => {
    fetchRegionSignIn(key)
      .then((signedIn) => recordAnswer(key, signedIn))
      // A region that is unreachable, blocked, slow enough to hit the deadline
      // above, or answering with something unparseable has to count as
      // answered, or waiting would suppress every decision that depends on
      // this store. What it counts as depends on what we already know: on a
      // first probe, signed-out, because there is nothing else to go on; on a
      // refresh, whatever that region last confirmed, because a failed request
      // is no evidence the session ended. Overwriting a known sign-in with a
      // guess would report that visitor's next CTA click as a sign up.
      .catch(() =>
        recordAnswer(key, isRefresh ? snapshot.signedInRegions[key] : false),
      );
  });
}

function watchVisibility() {
  if (watchingVisibility || typeof document === "undefined") return;
  watchingVisibility = true;

  // The common way to sign in mid-visit is in another tab, which leaves this
  // page's answer stale with no remount to refresh it.
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      startCloudRegionSignInProbe(true, VISIBILITY_PROBE_REUSE_MS);
    }
  });
}

// Safe to call from anywhere that needs the answer: the first call starts the
// probe, later calls refresh it once it has gone stale. When disabled (outside
// production, where the region session endpoints are not reachable from
// localhost) the snapshot resolves immediately with no region signed in.
export function startCloudRegionSignInProbe(
  enabled: boolean,
  reuseLastProbeFor = PROBE_REUSE_MS,
) {
  if (!enabled) {
    if (!snapshot.resolved) publish({ ...snapshot, resolved: true });
    return;
  }

  watchVisibility();

  const hasProbed = lastProbeStartedAt !== 0;
  if (hasProbed && Date.now() - lastProbeStartedAt < reuseLastProbeFor) return;

  runProbe();
}
