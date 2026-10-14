import { beforeEach, describe, expect, it } from 'vitest';
import { StorageAdapter } from '../../src/storage/local-storage';
import { SessionStore } from '../../src/storage/store';
import { SessionState } from '../../src/domain/models';

class MockStorageAdapter implements StorageAdapter {
  private data: SessionState | null = null;
  public available: boolean = true;

  isAvailable(): boolean {
    return this.available;
  }
  load(): SessionState | null {
    return this.data;
  }
  save(state: SessionState): boolean {
    this.data = state;
    return true;
  }
  clear(): boolean {
    this.data = null;
    return true;
  }
}

describe('SessionStore - User Story 1', () => {
  let mockStorage: MockStorageAdapter;
  let store: SessionStore;

  beforeEach(() => {
    mockStorage = new MockStorageAdapter();
    store = new SessionStore(mockStorage);
  });

  it('starts with an empty session', () => {
    const state = store.getState();
    expect(state.participants).toEqual([]);
    expect(state.version).toBe(1);
  });

  it('adds participants successfully and trims whitespace', () => {
    const p1 = store.addParticipant('  Manu  ');
    expect(p1.name).toBe('Manu');
    expect(p1.items).toEqual([]);

    const state = store.getState();
    expect(state.participants).toHaveLength(1);
    expect(state.participants[0].name).toBe('Manu');
  });

  it('throws error when adding invalid participant name', () => {
    expect(() => store.addParticipant('')).toThrow();
    expect(() => store.addParticipant('   ')).toThrow();
  });

  it('removes an existing participant', () => {
    const p1 = store.addParticipant('Manu');
    store.addParticipant('Carlos');
    expect(store.getState().participants).toHaveLength(2);

    const removed = store.removeParticipant(p1.id);
    expect(removed).toBe(true);

    const remaining = store.getState().participants;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('Carlos');
  });

  it('adds consumption to a participant', () => {
    const p = store.addParticipant('Carlos');
    const item = store.addConsumption(p.id, {
      name: 'Refresco',
      unitPrice: 1.5,
      quantity: 2
    });

    expect(item.name).toBe('Refresco');
    expect(item.unitPrice).toBe(1.5);
    expect(item.quantity).toBe(2);

    const updatedParticipant = store.getState().participants[0];
    expect(updatedParticipant.items).toHaveLength(1);
    expect(updatedParticipant.items[0]).toEqual(item);
  });

  it('increments quantity when adding the same item name and price', () => {
    const p = store.addParticipant('Carlos');
    store.addConsumption(p.id, { name: 'Refresco', unitPrice: 1.5, quantity: 1 });
    store.addConsumption(p.id, { name: 'Refresco', unitPrice: 1.5, quantity: 2 });

    const updatedParticipant = store.getState().participants[0];
    expect(updatedParticipant.items).toHaveLength(1);
    expect(updatedParticipant.items[0].quantity).toBe(3);
  });
});
