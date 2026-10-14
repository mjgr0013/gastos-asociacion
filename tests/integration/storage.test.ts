import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { SessionState } from '../../src/domain/models';
import { LocalStorageAdapter, STORAGE_KEY } from '../../src/storage/local-storage';

describe('LocalStorageAdapter Integration', () => {
  let mockStorageStore: Record<string, string> = {};

  beforeEach(() => {
    mockStorageStore = {};
    const mockLocalStorage = {
      getItem: (key: string) => mockStorageStore[key] ?? null,
      setItem: (key: string, value: string) => {
        mockStorageStore[key] = value;
      },
      removeItem: (key: string) => {
        delete mockStorageStore[key];
      },
      clear: () => {
        mockStorageStore = {};
      }
    };

    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: mockLocalStorage },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    mockStorageStore = {};
  });

  it('detects storage availability and saves/loads state correctly', () => {
    const adapter = new LocalStorageAdapter();
    expect(adapter.isAvailable()).toBe(true);

    const testState: SessionState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      participants: [
        {
          id: 'p1',
          name: 'Manu',
          createdAt: new Date().toISOString(),
          items: [{ id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 }]
        }
      ]
    };

    const saved = adapter.save(testState);
    expect(saved).toBe(true);
    expect(mockStorageStore[STORAGE_KEY]).toBeDefined();

    const loaded = adapter.load();
    expect(loaded).toEqual(testState);
  });

  it('handles clearing storage on session reset', () => {
    const adapter = new LocalStorageAdapter();
    const testState: SessionState = {
      version: 1,
      updatedAt: new Date().toISOString(),
      participants: []
    };

    adapter.save(testState);
    expect(adapter.load()).not.toBeNull();

    adapter.clear();
    expect(adapter.load()).toBeNull();
    expect(mockStorageStore[STORAGE_KEY]).toBeUndefined();
  });

  it('handles corrupted JSON in storage without throwing', () => {
    mockStorageStore[STORAGE_KEY] = 'not-valid-json{{{{';
    const adapter = new LocalStorageAdapter();
    const loaded = adapter.load();
    expect(loaded).toBeNull();
  });
});
