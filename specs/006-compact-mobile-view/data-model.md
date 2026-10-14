# Data Model: Especificación de Densidad y Estilos Compactos

**Feature**: `006-compact-mobile-view`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Métricas de Densidad en Vista Móvil

| Elemento | Altura Anterior | Altura Optimizada | Ahorro en 10 ítems |
|---|---|---|---|
| Fila de Consumición | ~54px - 58px | **~36px** | ~180px - 220px |
| Catálogo Rápido | ~85px - 110px | **~34px** | ~60px |
| Padding de Tarjeta | ~32px total | **~18px total** | ~14px |
| **Total Tarjeta (10 productos)** | **~680px** | **≤ 360px** (o scroll máx 280px) | **> 45% reducción** |

---

## 2. Invariantes de Dominio

Las entidades de negocio (`Participant`, `ConsumptionItem`, `SessionState`) y la lógica de cálculos monetarios se mantienen 100% inalteradas.
