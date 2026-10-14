# Contracts: Sharing & Toast Services

**Feature**: `004-share-session-summary`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Formateo de Texto (`src/domain/sharing.ts`)

```typescript
export function generateSessionShareText(
  participants: Participant[],
  date: Date = new Date()
): string;
```

---

## 2. Contrato de Servicio de Compartición / Portapapeles

```typescript
export async function shareOrCopyText(payload: {
  title: string;
  text: string;
}): Promise<'shared' | 'copied' | 'cancelled'>;
```

---

## 3. Contrato de Notificación Toast (`src/ui/components/toast.ts`)

```typescript
export class ToastComponent {
  public static show(message: string, durationMs?: number): void;
}
```

---

## 4. Contrato de `HeaderSummaryComponent`

Se añade la acción de compartir y el estado de habilitación a sus opciones y método de actualización:

```typescript
export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested: () => void;
}

// En update(participants: Participant[]) habilita/deshabilita el botón de compartir
```
