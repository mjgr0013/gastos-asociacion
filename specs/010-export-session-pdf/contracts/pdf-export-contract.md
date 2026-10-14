# Contracts: PDF Export Services

**Feature**: `010-export-session-pdf`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Generación del PDF (`src/domain/pdf-export.ts`)

```typescript
import { Participant } from './models';

export interface PdfExportOptions {
  reservationHolder: string;
  participants: Participant[];
  generatedAt?: Date;
}

/**
 * Formatea una fecha a representación local en español de sólo fecha: DD/MM/AAAA.
 */
export function formatPdfDate(date: Date): string;

/**
 * Genera un Blob con el documento PDF de la sesión conteniendo:
 * - Título y fecha (sólo fecha DD/MM/AAAA)
 * - Titular de la reserva
 * - Desglose detallado por participante (consumiciones, precios unitarios y subtotales)
 * - Total general de la mesa
 *
 * @param options Parámetros de exportación
 * @returns Blob binario de tipo application/pdf
 */
export function generateSessionPdfBlob(options: PdfExportOptions): Blob;

/**
 * Genera el nombre de archivo sugerido para la descarga del PDF basado en la fecha:
 * ej. "cuenta-partida-20261014.pdf"
 */
export function generatePdfFilename(date?: Date): string;
```

---

## 2. Contrato de Descarga (`src/utils/download.ts`)

```typescript
export function downloadBlob(blob: Blob, filename: string): void;
```

---

## 3. Contrato del Diálogo Modal (`src/ui/components/export-pdf-modal.ts`)

```typescript
export class ExportPdfModalComponent {
  public static show(): Promise<string | null>;
}
```

---

## 4. Contrato de Cabecera `HeaderSummaryComponent` (`src/ui/components/header-summary.ts`)

```typescript
export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested?: () => void;
  onExportPdfRequested?: () => void;
}
```
