import { createJSONStorage, type StateStorage } from "zustand/middleware";

const KEY_PREFIX = "pantry:";

// localStorage can throw (Safari private mode, storage full, blocked cookies).
// Fall back to memory so the app keeps working for the current visit.
const memoryStorage = new Map<string, string>();

const safeLocalStorage: StateStorage = {
  getItem(name) {
    try {
      return localStorage.getItem(name);
    } catch {
      return memoryStorage.get(name) ?? null;
    }
  },
  setItem(name, value) {
    try {
      localStorage.setItem(name, value);
    } catch {
      memoryStorage.set(name, value);
    }
  },
  removeItem(name) {
    try {
      localStorage.removeItem(name);
    } catch {
      memoryStorage.delete(name);
    }
  },
};

/** Options for zustand's `persist` middleware with a namespaced key. */
export function persistOptions(name: string) {
  return {
    name: `${KEY_PREFIX}${name}`,
    storage: createJSONStorage(() => safeLocalStorage),
    version: 1,
  };
}
