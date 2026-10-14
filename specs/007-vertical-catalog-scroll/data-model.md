# Data Model: Especificación de Estilo de Catálogo Rápido

**Feature**: `007-vertical-catalog-scroll`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Especificación de Clases CSS

### `.quick-catalog-chips`
- `display: flex;`
- `flex-wrap: wrap;`
- `height: 100px;` (o `max-height: 100px;`)
- `overflow-y: auto;`
- `overflow-x: hidden;`
- `-webkit-overflow-scrolling: touch;`
- `gap: var(--space-2);`
- `align-content: flex-start;`

---

## 2. Invariantes de Dominio

La lógica de negocio y las entidades de dominio (`Participant`, `ConsumptionItem`, `SessionState`) permanecen inalteradas.
