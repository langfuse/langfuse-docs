import { useState, useEffect } from "react";
import { nanoid } from "ai";

export const usePersistedNanoId = (key: string): string | null => {
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    let value = localStorage.getItem(key);

    if (!value) {
      value = nanoid();
      localStorage.setItem(key, value);
    }

    setState(value);
  }, []);

  return state;
};
