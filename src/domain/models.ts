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
  { id: 'preset-guest', name: 'Invitado', unitPrice: 3, icon: '🪪' },
  { id: 'preset-soda', name: 'Refresco', unitPrice: 1, icon: '🥤' },
  { id: 'preset-beer', name: 'Cerveza', unitPrice: 1, icon: '🍺' },
  { id: 'preset-snack', name: 'Snack', unitPrice: 1.20, icon: '🥨' },
  { id: 'preset-popcorns', name: 'Palomitas', unitPrice: 1, icon: '🍿' },
  { id: 'preset-coffee-hot', name: 'Café caliente', unitPrice: 0.8, icon: '☕' },
  { id: 'preset-coffee-cold', name: 'Café frío', unitPrice: 1.20, icon: '🧋' },
  { id: 'preset-monster', name: 'Monster', unitPrice: 1.50, icon: '⚡' },
  { id: 'preset-pipes', name: 'Pipas', unitPrice: 1, icon: '🌻' },
  { id: 'preset-candies', name: 'Golosinas', unitPrice: 1, icon: '🍬' },
  { id: 'preset-scrambled', name: 'Revuelto', unitPrice: 1, icon: '🥜' },
  { id: 'preset-water', name: 'Agua', unitPrice: 1, icon: '💧' },
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
