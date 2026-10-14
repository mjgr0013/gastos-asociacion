# Data Model: Compartir Resumen de Cuenta

**Feature**: `004-share-session-summary`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Modelo de Datos de Compartición

```typescript
export interface SessionSharePayload {
  title: string;
  text: string;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error';
```

---

## 2. Invariantes del Mensaje Generado

- Título: `🎲 Cuenta de la partida ({fecha}):`
- Por cada participante:
  - Si tiene consumiciones: `• {nombre}: {subtotal} ({cant}x {producto}, ...)`
  - Si no tiene consumiciones: `• {nombre}: 0,00 € (Sin consumiciones)`
- Separador: `------------------------------------`
- Total mesa: `Total mesa: {grandTotal}`
