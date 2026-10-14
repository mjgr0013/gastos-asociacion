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
 * Genera un Blob con el documento PDF de la sesión conteniendo:
 * - Título y fecha/hora
 * - Titular de la reserva
 * - Desglose detallado por participante (consumiciones, precios unitarios y subtotales)
 * - Total general de la mesa
 *
 * @param options Parámetros de exportación
 * @returns Blob binario de tipo application/pdf
 */
export function generateSessionPdfBlob(options: PdfExportOptions): Blob;

/**
 * Genera el nombre de archivo sugerido para la descarga del PDF:
 * ej. "cuenta-partida-20261014-2230.pdf"
 */
export function generatePdfFilename(date?: Date): string;
```

---

## 2. Contrato de Descarga (`src/utils/download.ts`)

```typescript
/**
 * Dispara la descarga de un Blob en el navegador con el nombre especificado.
 *
 * @param blob Archivo binario a descargar
 * @param filename Nombre con el que se guardará el archivo
 */
export function downloadBlob(blob: Blob, filename: string): void;
```

---

## 3. Contrato del Diálogo Modal (`src/ui/components/export-pdf-modal.ts`)

```typescript
export interface ExportPdfModalOptions {
  /** Callback ejecutado al confirmar con un nombre válido */
  onConfirm: (reservationHolder: string) => void;
  /** Callback ejecutado al cancelar o cerrar el diálogo */
  onCancel: () => void;
}

export class ExportPdfModalComponent {
  constructor(options: ExportPdfModalOptions);
  public mount(parent: HTMLElement): void;
  public destroy(): void;
  public showError(message: string): void;
}
```

---

## 4. Contrato de Cabecera `HeaderSummaryComponent` (`src/ui/components/header-summary.ts`)

Se añade el botón de exportación a PDF y su callback a las opciones:

```typescript
export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested?: () => void;
  onExportPdfRequested?: () => void;
}

// update(participants: Participant[]):
// Habilita o deshabilita tanto el botón de compartir como el botón de exportar a PDF (disabled cuando count === 0).
```
