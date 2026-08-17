import { useSyncExternalStore } from "react";
import * as api from "@/services/api";
import type { Database, User } from "./types";

const emptyDb: Database = {
  cases: [],
  evidence: [],
  analyses: [],
  timeline: [],
  notes: [],
  audit: [],
  reports: [],
};

export function useDatabase(): Database {
  return useSyncExternalStore(api.subscribe, api.getSnapshot, () => emptyDb);
}

export function useCurrentUser(): User | null {
  return useSyncExternalStore(api.subscribe, api.getUser, () => null);
}

export function useHydrated(): boolean {
  return useSyncExternalStore(api.subscribe, api.isHydrated, () => false);
}

export { api };
