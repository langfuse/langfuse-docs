import { nanoid } from "nanoid";

export const getPersistedNanoId = ({
  key,
  prefix,
}: {
  key: string;
  prefix?: string;
}): string => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    // During SSR, return a temporary ID that will be replaced on client-side
    return prefix ? `${prefix}temp` : "temp";
  }

  let value = localStorage.getItem(key);
  if (!value) {
    value = prefix ? `${prefix}${nanoid()}` : nanoid();
    localStorage.setItem(key, value);
  }
  return value;
};
