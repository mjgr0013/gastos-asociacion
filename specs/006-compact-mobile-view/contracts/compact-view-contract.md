# UI Contract: Compact Consumption Row & Catalog

**Feature**: `006-compact-mobile-view`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Estructura DOM de la Fila Compacta (`ParticipantCardComponent`)

```html
<li class="consumption-item-row" data-item-id="{id}">
  <div class="item-info">
    <span class="item-name" title="{name}">{name}</span>
    <span class="item-unit-price">· {price}</span>
  </div>
  <div class="item-controls">
    <div class="qty-counter">
      <button type="button" class="btn-qty btn-qty-decrease">－</button>
      <span class="qty-value">{qty}</span>
      <button type="button" class="btn-qty btn-qty-increase">＋</button>
    </div>
    <span class="item-line-total">{lineTotal}</span>
    <button type="button" class="btn-item-delete" title="Eliminar">✕</button>
  </div>
</li>
```
- `.item-info`: layout `display: flex; align-items: baseline; gap: 4px; min-width: 0; flex: 1;`.
- `.item-name`: `overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 600;`.
- `.item-unit-price`: `color: var(--color-text-muted); font-size: var(--font-size-xs); white-space: nowrap;`.

---

## 2. Contrato de Catálogo Rápido Desplazable Horizontalmente

- Contenedor `.quick-catalog-chips`: `flex-wrap: nowrap; overflow-x: auto;`
- Chips `.chip`: `flex-shrink: 0; height: 32px;`
