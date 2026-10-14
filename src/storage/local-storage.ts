import { SessionState } from '../domain/models';

export const STORAGE_KEY = 'bg_expense_session_v1';

export interface StorageAdapter {
  isAvailable(): boolean;
  load(): SessionState | null;
  save(state: SessionState): boolean;
  clear(): boolean;
}

export class LocalStorageAdapter implements StorageAdapter {
  private inMemoryFallback: SessionState | null = null;
  private available: boolean;

  constructor() {
    this.available = this.checkAvailability();
  }

  private checkAvailability(): boolean {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return false;
      }
      const testKey = '__bg_storage_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  isAvailable(): boolean {
    return this.available;
  }

  load(): SessionState | null {
    if (!this.available) {
      return this.inMemoryFallback;
    }
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as SessionState;
      if (parsed && parsed.version === 1 && Array.isArray(parsed.participants)) {
        return parsed;
      }
      return null;
    } catch {
      return this.inMemoryFallback;
    }
  }

  save(state: SessionState): boolean {
    this.inMemoryFallback = state;
    if (!this.available) {
      return false;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  }

  clear(): boolean {
    this.inMemoryFallback = null;
    if (!this.available) {
      return false;
    }
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch {
      return false;
    }
  }
}
