# Data Model: Desplegado y Colapsado de Consumiciones por Participante

**Feature**: `002-collapsible-participant-items`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Modelo de Estado de Presentación (UI View State)

El estado de colapsado pertenece exclusivamente a la capa visual de la aplicación para preservar la pureza del modelo de dominio.

```typescript
export interface CardViewState {
  participantId: string;
  isCollapsed: boolean; // false por defecto (expandida)
}

export type CollapsedCardsMap = Set<string>; // Conjunto con los IDs de participantes colapsados
```

---

## 2. Entidades de Dominio Inalteradas

Las entidades de negocio persisten exactamente con el contrato establecido en la especificación base:
- `Participant` (`id`, `name`, `items`, `createdAt`)
- `ConsumptionItem` (`id`, `name`, `unitPrice`, `quantity`)
- `SessionState` (`version: 1`, `updatedAt`, `participants`)

---

## 3. Reglas de Transición de Estado de la Tarjeta

1. **Creación**: Al registrar un participante nuevo, su ID no pertenece al conjunto de colapsados (`isCollapsed === false`), renderizándose **expandido**.
2. **Alternancia manual**: Al accionar el botón de toggle o la cabecera, si estaba expandido pasa a colapsado (se añade su ID a `collapsedCards`); si estaba colapsado pasa a expandido (se remueve su ID).
3. **Eliminación**: Al eliminar un participante, se purga su ID del conjunto de colapsados.
4. **Reinicio de sesión**: Al reiniciar la mesa, el conjunto de colapsados se vacía completamente.
