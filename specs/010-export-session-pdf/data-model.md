# Data Model: Exportar Cuenta de la Sesión a PDF

**Feature**: `010-export-session-pdf`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Entidades y Estructuras de Datos

### `PdfExportOptions`
Parámetros de entrada para la generación del documento PDF.

```typescript
export interface PdfExportOptions {
  /** Nombre de la persona o grupo que realizó la reserva de la sala */
  reservationHolder: string;
  /** Fecha y hora de generación (por defecto la fecha actual) */
  generatedAt?: Date;
  /** Lista de participantes con sus consumiciones activas */
  participants: Participant[];
}
```

### `PdfParticipantBreakdown`
Estructura calculada de cada participante para el renderizado del documento.

```typescript
export interface PdfConsumptionLine {
  quantity: number;
  name: string;
  unitPrice: number;
  subtotal: number;
}

export interface PdfParticipantBreakdown {
  participantId: string;
  name: string;
  items: PdfConsumptionLine[];
  subtotal: number;
}

export interface PdfDocumentData {
  title: string;
  reservationHolder: string;
  formattedDate: string;
  participants: PdfParticipantBreakdown[];
  grandTotal: number;
}
```

---

## 2. Reglas de Validación e Invariantes

1. **Titular de la reserva (`reservationHolder`)**:
   - Obligatorio: `reservationHolder.trim().length > 0`.
   - Longitud máxima: 60 caracteres.
   - Si no cumple, el diálogo bloquea la confirmación y muestra error de validación.

2. **Participantes (`participants`)**:
   - Mínimo 1 participante en la sesión para poder exportar.
   - Si un participante tiene 0 consumiciones, se genera una línea indicativa `"Sin consumiciones"` con subtotal `0,00 €`.
   - Si un participante tiene consumiciones, cada línea detalla: `${quantity}x ${name} (${formatCurrency(unitPrice)}) = ${formatCurrency(subtotal)}`.

3. **Totales e Importes**:
   - Cada subtotal de producto = `quantity * unitPrice`.
   - Cada subtotal de participante = suma de subtotales de sus consumiciones.
   - `grandTotal` = suma de subtotales de todos los participantes.
   - Todos los importes se formatean con dos cifras decimales y símbolo del euro (`X,XX €`).

4. **Fecha y Hora (`formattedDate`)**:
   - Formato local en español: `DD/MM/AAAA HH:mm` (ej: `14/10/2026 22:30`).

5. **Formato de Archivo Descargado (`filename`)**:
   - Patrón sugerido: `cuenta-partida-YYYYMMDD-HHmm.pdf` (con fecha y hora numéricas normalizadas para evitar caracteres conflictivos en el sistema de archivos).
