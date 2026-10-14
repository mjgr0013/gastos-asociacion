# Data Model: Resumen de Precios de Productos en la Cuenta Exportada

**Feature**: `008-export-product-prices`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Entidades de Dominio

### `ConsumedProductPrice`
Representa una entrada de producto consumido por al menos un participante en la sesión activa, lista para ser reflejada en el resumen de precios unitarios.

```typescript
export interface ConsumedProductPrice {
  /** Nombre representativo del producto (ej. "Refresco", "Café caliente") */
  name: string;
  /** Precio unitario numérico en euros (ej. 1.50) */
  unitPrice: number;
}
```

### Relación con Entidades Existentes
```text
Participant
  └── ConsumptionItem [0..*]
        ├── id: string
        ├── name: string
        ├── unitPrice: number
        └── quantity: number
               │
               ▼ (Al menos un participante con quantity > 0)
        ConsumedProductPrice [0..*]
          ├── name: string
          └── unitPrice: number
```

---

## 2. Reglas de Validación e Invariantes

1. **Condición de Inclusión**:
   - Un producto se incluye en la lista de `ConsumedProductPrice` si y sólo si existe al menos un `Participant` con un `ConsumptionItem` tal que `item.quantity > 0`.
   - Productos con `quantity <= 0` son explícitamente ignorados.
   - Productos presentes en catálogos o menús pero no consumidos por ningún participante son explícitamente ignorados.

2. **Deduplicación**:
   - Clave única de agrupación: `[item.name, item.unitPrice]`.
   - Si 5 participantes consumieron "Refresco" a 1,50 €, se genera exactamente una única entrada `{ name: 'Refresco', unitPrice: 1.5 }`.
   - Si existen variantes con el mismo nombre y diferente precio unitario (ej. consumición personalizada "Tapa" a 2.00 € y "Tapa" a 2.50 €), se generan dos entradas distintas.

3. **Ordenación**:
   - Orden primario: Nombre alfabético ascendente en español (`a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })`).
   - Orden secundario (en caso de igualdad de nombre): Precio unitario ascendente (`a.unitPrice - b.unitPrice`).

4. **Invariantes del Mensaje Exportado**:
   - Si `consumedProducts.length === 0`: La sección `Precios de productos:` se omite completamente del mensaje de texto.
   - Si `consumedProducts.length > 0`: La sección se incluye con el formato:
     ```text
     ------------------------------------
     Precios de productos:
     • [Nombre]: [X,XX €]
     ...
     ```
     inmediatamente antes de la línea `Total mesa: [X,XX €]`.
