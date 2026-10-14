export interface ConsumptionItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface Participant {
  id: string;
  name: string;
  items: ConsumptionItem[];
  createdAt: string;
}

export interface QuickCatalogPreset {
  id: string;
  name: string;
  unitPrice: number;
  icon?: string;
}

export const DEFAULT_CATALOG_PRESETS: ReadonlyArray<QuickCatalogPreset> = [
  { id: 'preset-soda', name: 'Refresco', unitPrice: 1.50, icon: '🥤' },
  { id: 'preset-beer', name: 'Cerveza', unitPrice: 1.50, icon: '🍺' },
  { id: 'preset-snack', name: 'Snack', unitPrice: 1.00, icon: '🍿' },
  { id: 'preset-coffee', name: 'Café', unitPrice: 1.20, icon: '☕' }
];

export interface SessionState {
  version: 1;
  updatedAt: string;
  participants: Participant[];
}

export function createInitialSessionState(): SessionState {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    participants: []
  };
}
