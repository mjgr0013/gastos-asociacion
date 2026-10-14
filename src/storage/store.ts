import {
  ConsumptionItem,
  createInitialSessionState,
  Participant,
  SessionState
} from '../domain/models';
import {
  formatParticipantName,
  validateConsumptionInput,
  validateParticipantName
} from '../domain/validation';
import { LocalStorageAdapter, StorageAdapter } from './local-storage';

export type StoreListener = (state: Readonly<SessionState>) => void;
export type Unsubscribe = () => void;

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

export class SessionStore {
  private state: SessionState;
  private listeners: Set<StoreListener> = new Set();
  private storage: StorageAdapter;

  constructor(storageAdapter?: StorageAdapter) {
    this.storage = storageAdapter ?? new LocalStorageAdapter();
    const persisted = this.storage.load();
    if (persisted) {
      this.state = persisted;
    } else {
      this.state = createInitialSessionState();
      this.storage.save(this.state);
    }
  }

  public getState(): Readonly<SessionState> {
    return this.state;
  }

  public isStorageAvailable(): boolean {
    return this.storage.isAvailable();
  }

  public subscribe(listener: StoreListener): Unsubscribe {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.state.updatedAt = new Date().toISOString();
    this.storage.save(this.state);
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('Error in SessionStore listener', err);
      }
    });
  }

  public addParticipant(name: string): Participant {
    const existingNames = this.state.participants.map((p) => p.name);
    const validation = validateParticipantName(name, existingNames);
    if (!validation.valid) {
      throw new Error(validation.error || 'Nombre de participante no válido');
    }

    const newParticipant: Participant = {
      id: generateId(),
      name: formatParticipantName(name),
      items: [],
      createdAt: new Date().toISOString()
    };

    this.state = {
      ...this.state,
      participants: [...this.state.participants, newParticipant]
    };

    this.notify();
    return newParticipant;
  }

  public removeParticipant(participantId: string): boolean {
    const initialCount = this.state.participants.length;
    const filtered = this.state.participants.filter((p) => p.id !== participantId);
    if (filtered.length === initialCount) {
      return false;
    }

    this.state = {
      ...this.state,
      participants: filtered
    };

    this.notify();
    return true;
  }

  public addConsumption(
    participantId: string,
    consumption: { name: string; unitPrice: number; quantity?: number }
  ): ConsumptionItem {
    const qty = consumption.quantity ?? 1;
    const validation = validateConsumptionInput(consumption.name, consumption.unitPrice, qty);
    if (!validation.valid) {
      throw new Error(validation.error || 'Datos de consumición no válidos');
    }

    const participantIndex = this.state.participants.findIndex((p) => p.id === participantId);
    if (participantIndex === -1) {
      throw new Error(`Participante no encontrado (id: ${participantId})`);
    }

    const participant = this.state.participants[participantIndex];
    const normalizedName = consumption.name.trim();

    // Si ya existe un producto con el mismo nombre y precio, incrementamos la cantidad
    const existingIndex = participant.items.findIndex(
      (item) =>
        item.name.toLowerCase() === normalizedName.toLowerCase() &&
        item.unitPrice === consumption.unitPrice
    );

    let createdOrUpdatedItem: ConsumptionItem;
    let updatedItems: ConsumptionItem[];

    if (existingIndex >= 0) {
      const existing = participant.items[existingIndex];
      createdOrUpdatedItem = {
        ...existing,
        quantity: existing.quantity + qty
      };
      updatedItems = [...participant.items];
      updatedItems[existingIndex] = createdOrUpdatedItem;
    } else {
      createdOrUpdatedItem = {
        id: generateId(),
        name: normalizedName,
        unitPrice: consumption.unitPrice,
        quantity: qty
      };
      updatedItems = [...participant.items, createdOrUpdatedItem];
    }

    const updatedParticipant: Participant = {
      ...participant,
      items: updatedItems
    };

    const newParticipants = [...this.state.participants];
    newParticipants[participantIndex] = updatedParticipant;

    this.state = {
      ...this.state,
      participants: newParticipants
    };

    this.notify();
    return createdOrUpdatedItem;
  }

  public updateConsumptionQuantity(
    participantId: string,
    consumptionId: string,
    newQuantity: number
  ): void {
    if (newQuantity <= 0) {
      this.removeConsumption(participantId, consumptionId);
      return;
    }

    const participantIndex = this.state.participants.findIndex((p) => p.id === participantId);
    if (participantIndex === -1) return;

    const participant = this.state.participants[participantIndex];
    const itemIndex = participant.items.findIndex((item) => item.id === consumptionId);
    if (itemIndex === -1) return;

    const updatedItem: ConsumptionItem = {
      ...participant.items[itemIndex],
      quantity: Math.floor(newQuantity)
    };

    const updatedItems = [...participant.items];
    updatedItems[itemIndex] = updatedItem;

    const updatedParticipant: Participant = {
      ...participant,
      items: updatedItems
    };

    const newParticipants = [...this.state.participants];
    newParticipants[participantIndex] = updatedParticipant;

    this.state = {
      ...this.state,
      participants: newParticipants
    };

    this.notify();
  }

  public removeConsumption(participantId: string, consumptionId: string): boolean {
    const participantIndex = this.state.participants.findIndex((p) => p.id === participantId);
    if (participantIndex === -1) return false;

    const participant = this.state.participants[participantIndex];
    const initialLen = participant.items.length;
    const filteredItems = participant.items.filter((item) => item.id !== consumptionId);
    if (filteredItems.length === initialLen) return false;

    const updatedParticipant: Participant = {
      ...participant,
      items: filteredItems
    };

    const newParticipants = [...this.state.participants];
    newParticipants[participantIndex] = updatedParticipant;

    this.state = {
      ...this.state,
      participants: newParticipants
    };

    this.notify();
    return true;
  }

  public resetSession(): void {
    this.state = createInitialSessionState();
    this.storage.clear();
    this.notify();
  }
}
