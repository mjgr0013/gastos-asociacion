# Data Model: Control de Gastos de Consumiciones (Boardgame Expenses)

**Feature**: `001-boardgame-expense-tracker`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Definición de Entidades

### 1.1 `ConsumptionItem` (Consumición)
Representa una línea individual de producto o consumición asignada a un participante.

```typescript
export interface ConsumptionItem {
  id: string;          // Identificador único (UUID v4 o timestamp aleatorio)
  name: string;        // Nombre descriptivo del producto (ej: "Refresco", "Snack")
  unitPrice: number;   // Precio unitario en euros (positivo, > 0.00, 2 decimales)
  quantity: number;    // Cantidad consumida (entero positivo >= 1)
}
```

#### Atributos Derivados / Calculados
- `lineTotal`: `number` = `roundCurrency(item.unitPrice * item.quantity)`

---

### 1.2 `Participant` (Participante)
Representa a una persona en la mesa de juego con su registro de consumiciones.

```typescript
export interface Participant {
  id: string;                  // Identificador único (UUID v4)
  name: string;                // Nombre visible (no vacío, recortado en extremos)
  items: ConsumptionItem[];    // Colección de consumiciones asignadas
  createdAt: string;           // Marca de tiempo ISO 8601 de creación
}
```

#### Atributos Derivados / Calculados
- `totalAmount`: `number` = `roundCurrency(items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0))`
- `itemCount`: `number` = `items.reduce((sum, item) => sum + item.quantity, 0)`

---

### 1.3 `QuickCatalogPreset` (Elemento del Catálogo Rápido)
Plantillas de productos habituales preconfigurados para inserción con un toque.

```typescript
export interface QuickCatalogPreset {
  id: string;
  name: string;
  unitPrice: number;
  icon?: string;
}

export const DEFAULT_CATALOG_PRESETS: ReadonlyArray<QuickCatalogPreset> = [
  { id: 'preset-soda', name: 'Refresco', unitPrice: 1.50 },
  { id: 'preset-beer', name: 'Cerveza', unitPrice: 1.50 },
  { id: 'preset-snack', name: 'Snack', unitPrice: 1.00 },
  { id: 'preset-coffee', name: 'Café', unitPrice: 1.20 }
];
```

---

### 1.4 `SessionState` (Estado de la Sesión)
Estado global de la partida persistido en `localStorage`.

```typescript
export interface SessionState {
  version: 1;                  // Versión de esquema para migraciones futuras
  updatedAt: string;           // Fecha de última modificación (ISO 8601)
  participants: Participant[]; // Lista ordenada de participantes
}
```

#### Atributos Derivados / Calculados
- `grandTotal`: `number` = `roundCurrency(participants.reduce((sum, p) => sum + p.totalAmount, 0))`
- `totalParticipants`: `number` = `participants.length`
- `isEmpty`: `boolean` = `participants.length === 0`

---

## 2. Reglas de Validación y Normalización

1. **Nombre de Participante (FR-001)**:
   - Debe ser una cadena de texto no vacía tras aplicar `trim()`.
   - Longitud máxima recomendada: 50 caracteres.
   - No se permiten cadenas compuestas únicamente por espacios en blanco.

2. **Consumiciones (FR-004)**:
   - `name`: Cadena no vacía tras `trim()`, longitud máxima 80 caracteres.
   - `unitPrice`: Número estrictamente mayor a `0` (`unitPrice > 0`). Se trunca/redondea a dos cifras decimales. Valores no numéricos (NaN, Infinity, negativos) son rechazados.
   - `quantity`: Número entero estrictamente mayor o igual a `1` (`Number.isInteger(q) && q >= 1`).

3. **Precisión Monetaria y Redondeo**:
   - Para prevenir anomalías de punto flotante en JavaScript (ej: `0.1 + 0.2 !== 0.3`):
   ```typescript
   export function roundCurrency(amount: number): number {
     return Math.round((amount + Number.EPSILON) * 100) / 100;
   }
   
   export function formatCurrency(amount: number): string {
     return new Intl.NumberFormat('es-ES', {
       style: 'currency',
       currency: 'EUR',
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     }).format(amount);
   }
   ```

---

## 3. Ciclo de Vida y Transiciones de Estado

```text
[ Inicio / Mesa Vacía ]
       │
       ▼ (Añadir participante)
[ Participante Creado ] ◄────────────────────────┐
       │                                         │
       ▼ (Añadir consumición rápido/manual)     │ (Añadir otro participante)
[ Consumición Registrada ]                       │
       │                                         │
       ├─► (Incrementar/decrementar cantidad) ───┤
       ├─► (Eliminar consumición) ───────────────┤
       │                                         │
       ▼ (Eliminar participante con confirmación)
[ Participante Eliminado ]
       │
       ▼ (Pulsar "Reiniciar sesión" + Confirmación explícita)
[ Sesión Restablecida a Cero ] (Vuelve a Mesa Vacía y limpia localStorage)
```
