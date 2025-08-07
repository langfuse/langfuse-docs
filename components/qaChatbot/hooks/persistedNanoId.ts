import { useState, useEffect } from "react";

function generateId(): string {
  // Simple random id; sufficient for client-side ephemeral usage.
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export const usePersistedNanoId = (key: string): string | null => {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    let value = localStorage.getItem(key);

    if (!value) {
      value = generateId();
      localStorage.setItem(key, value);
    }

    setState(value);
  }, []);

  return state;
};
