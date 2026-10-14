# Contracts: Export Product Prices

**Feature**: `008-export-product-prices`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Interfaz y Tipos de Dominio (`src/domain/sharing.ts`)

```typescript
import { Participant } from './models';

/**
 * Representa la información de precio de un producto que al menos
 * una persona ha consumido en la partida.
 */
export interface ConsumedProductPrice {
  name: string;
  unitPrice: number;
}
```

---

## 2. Contrato de la Función de Extracción (`src/domain/sharing.ts`)

```typescript
/**
 * Extrae y deduplica la lista ordenada de productos con su precio unitario
 * que han sido consumidos por al menos un participante con cantidad > 0.
 *
 * @param participants Lista de participantes de la sesión
 * @returns Array de productos consumidos ordenados alfabéticamente
 */
export function extractConsumedProductPrices(
  participants: Participant[]
): ConsumedProductPrice[];
```

### Comportamiento esperado:
- Si `participants` está vacío o ningún participante tiene consumiciones con `quantity > 0`: devuelve `[]`.
- Deduplica ítems por `name` y `unitPrice`.
- Ordena alfabéticamente por `name` usando `localeCompare('es', { sensitivity: 'base' })`.
- En caso de nombres idénticos con distinto precio, ordena por `unitPrice` ascendente.

---

## 3. Contrato de Generación del Resumen Compartido (`src/domain/sharing.ts`)

```typescript
/**
 * Genera el texto plano formateado de la cuenta de la partida para compartir
 * por WhatsApp o copiar al portapapeles. Incluye el desglose por jugador,
 * el resumen de precios unitarios de productos consumidos (si existen)
 * y el total global de la mesa.
 *
 * @param participants Lista de participantes
 * @param date Fecha de la partida (por defecto actual)
 * @returns Cadena de texto lista para enviar
 */
export function generateSessionShareText(
  participants: Participant[],
  date?: Date
): string;
```

### Formato de salida cuando existen productos consumidos:
```text
🎲 Cuenta de la partida (14/10/2026):
• Manu: 4,00 € (2x Refresco, 1x Snack)
• Carlos: 6,50 € (1x Pizza)
------------------------------------
Precios de productos:
• Pizza: 6,50 €
• Refresco: 1,50 €
• Snack: 1,00 €
------------------------------------
Total mesa: 10,50 €
```

### Formato de salida cuando ningún participante ha consumido:
```text
🎲 Cuenta de la partida (14/10/2026):
• Ana: 0,00 € (Sin consumiciones)
------------------------------------
Total mesa: 0,00 €
```
