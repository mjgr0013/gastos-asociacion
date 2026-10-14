# UI Contract: Collapsible Participant Card

**Feature**: `002-collapsible-participant-items`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Opciones del Componente `ParticipantCardComponent`

Se amplía la interfaz `ParticipantCardOptions` para recibir el estado de colapso y notificar su alternancia:

```typescript
export interface ParticipantCardOptions {
  participant: Participant;
  isCollapsed?: boolean;
  onToggleCollapse?: (participantId: string) => void;
  onSelectPreset: (participantId: string, preset: QuickCatalogPreset) => void;
  onOpenCustomForm: (participant: Participant) => void;
  onUpdateQuantity: (participantId: string, itemId: string, newQty: number) => void;
  onRequestRemoveItem?: (participant: Participant, item: ConsumptionItem) => void;
  onRemoveItem?: (participantId: string, itemId: string) => void;
  onRequestDeleteParticipant: (participant: Participant) => void;
}
```

---

## 2. Estructura y Atributos DOM para WAI-ARIA

```html
<article class="participant-card" data-participant-id="{participantId}">
  <header class="card-header" role="button" tabindex="0" aria-expanded="true" aria-controls="card-body-{participantId}">
    <div class="participant-identity">
      <button type="button" class="btn-toggle-collapse" aria-label="Colapsar consumiciones de {name}">
        <span class="collapse-chevron">▼</span>
      </button>
      <span class="participant-avatar">🎲</span>
      <h3 class="participant-name">{name}</h3>
      <span class="participant-items-count">({count})</span>
    </div>
    <div class="card-header-actions">
      <div class="participant-subtotal-badge">{subtotal}</div>
      <button type="button" class="btn-icon-danger btn-delete-participant" aria-label="Eliminar a {name}">
        🗑️
      </button>
    </div>
  </header>
  <div id="card-body-{participantId}" class="card-body">
    <!-- Catálogo rápido y lista de consumiciones -->
  </div>
</article>
```
