export function useData<T = any>(): T {
  // Nextra v4 no longer provides `useData`; this shim avoids build-time errors
  // for legacy MDX that relied on v3 SSG patterns. Replace with real data
  // sources during the migration.
  return {} as T;
}

