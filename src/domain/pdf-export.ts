import {
  calculateGrandTotal,
  calculateParticipantTotal,
  formatCurrency
} from './calculations';
import { Participant } from './models';

export interface PdfExportOptions {
  reservationHolder: string;
  participants: Participant[];
  generatedAt?: Date;
}

export function formatPdfDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export const formatPdfDateTime = formatPdfDate;

export function generatePdfFilename(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `cuenta-partida-${year}${month}${day}.pdf`;
}

/**
 * Escapes and encodes text into WinAnsiEncoding for PDF string literals.
 */
function encodePdfString(text: string): string {
  const charMap: Record<string, number> = {
    '€': 128,
    'á': 225,
    'é': 233,
    'í': 237,
    'ó': 243,
    'ú': 250,
    'Á': 193,
    'É': 201,
    'Í': 205,
    'Ó': 211,
    'Ú': 218,
    'ñ': 241,
    'Ñ': 209,
    'ü': 252,
    'Ü': 220,
    '¡': 161,
    '¿': 191
  };

  let out = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '(') {
      out += '\\(';
    } else if (char === ')') {
      out += '\\)';
    } else if (char === '\\') {
      out += '\\\\';
    } else if (charMap[char] !== undefined) {
      out += '\\' + charMap[char].toString(8).padStart(3, '0');
    } else {
      const code = char.charCodeAt(0);
      if (code >= 32 && code <= 126) {
        out += char;
      } else if (code <= 255) {
        out += '\\' + code.toString(8).padStart(3, '0');
      } else {
        out += '?';
      }
    }
  }
  return out;
}

class SimplePdfWriter {
  private pages: string[][] = [[]];
  private currentPage = 0;

  public newPage(): void {
    this.pages.push([]);
    this.currentPage++;
  }

  public drawRect(
    x: number,
    y: number,
    w: number,
    h: number,
    fillRgb?: [number, number, number],
    strokeRgb?: [number, number, number],
    lineWidth: number = 1
  ): void {
    const cmds = this.pages[this.currentPage];
    cmds.push('q');
    cmds.push(`${lineWidth.toFixed(2)} w`);
    if (fillRgb) {
      cmds.push(`${fillRgb[0]} ${fillRgb[1]} ${fillRgb[2]} rg`);
    }
    if (strokeRgb) {
      cmds.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
    }
    cmds.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re`);
    if (fillRgb && strokeRgb) {
      cmds.push('B');
    } else if (fillRgb) {
      cmds.push('f');
    } else {
      cmds.push('S');
    }
    cmds.push('Q');
  }

  public drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    strokeRgb: [number, number, number] = [0.8, 0.8, 0.8],
    lineWidth: number = 0.5
  ): void {
    const cmds = this.pages[this.currentPage];
    cmds.push('q');
    cmds.push(`${lineWidth.toFixed(2)} w`);
    cmds.push(`${strokeRgb[0]} ${strokeRgb[1]} ${strokeRgb[2]} RG`);
    cmds.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
    cmds.push('Q');
  }

  public drawText(
    text: string,
    x: number,
    y: number,
    font: 'F1' | 'F2' = 'F1',
    size: number = 10,
    colorRgb: [number, number, number] = [0.15, 0.15, 0.15]
  ): void {
    const cmds = this.pages[this.currentPage];
    cmds.push('BT');
    cmds.push(`/${font} ${size} Tf`);
    cmds.push(`${colorRgb[0]} ${colorRgb[1]} ${colorRgb[2]} rg`);
    cmds.push(`${x.toFixed(2)} ${y.toFixed(2)} Td`);
    cmds.push(`(${encodePdfString(text)}) Tj`);
    cmds.push('ET');
  }

  public toUint8Array(): Uint8Array {
    const pageCount = this.pages.length;
    const body: string[] = [];
    const offsets: number[] = [];

    // Header
    const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
    let currentOffset = header.length;

    // Allocate object IDs:
    // Obj 1: Font F1
    // Obj 2: Font F2
    // Obj 3: Catalog
    // Obj 4: Pages tree
    // Then for each page: Page obj (5 + i*2), Content stream obj (6 + i*2)

    offsets.push(currentOffset);
    const f1Str = '1 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n';
    body.push(f1Str);
    currentOffset += f1Str.length;

    offsets.push(currentOffset);
    const f2Str = '2 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n';
    body.push(f2Str);
    currentOffset += f2Str.length;

    // Obj 3: Catalog
    offsets.push(currentOffset);
    const catStr = '3 0 obj\n<< /Type /Catalog /Pages 4 0 R >>\nendobj\n';
    body.push(catStr);
    currentOffset += catStr.length;

    // Obj 4: Pages
    const pageObjIds: number[] = [];
    for (let i = 0; i < pageCount; i++) {
      pageObjIds.push(5 + i * 2);
    }

    const pagesKidsStr = pageObjIds.map((id) => `${id} 0 R`).join(' ');
    offsets.push(currentOffset);
    const pagesStr = `4 0 obj\n<< /Type /Pages /Kids [${pagesKidsStr}] /Count ${pageCount} >>\nendobj\n`;
    body.push(pagesStr);
    currentOffset += pagesStr.length;

    // For each page
    for (let i = 0; i < pageCount; i++) {
      const pageId = 5 + i * 2;
      const contentId = 6 + i * 2;
      const contentStream = this.pages[i].join('\n');
      const contentLen = contentStream.length;

      // Page Obj
      offsets.push(currentOffset);
      const pageObjStr = `${pageId} 0 obj\n<< /Type /Page /Parent 4 0 R /MediaBox [0 0 595.28 841.89] /Contents ${contentId} 0 R /Resources << /Font << /F1 1 0 R /F2 2 0 R >> >> >>\nendobj\n`;
      body.push(pageObjStr);
      currentOffset += pageObjStr.length;

      // Content Obj
      offsets.push(currentOffset);
      const contentObjStr = `${contentId} 0 obj\n<< /Length ${contentLen} >>\nstream\n${contentStream}\nendstream\nendobj\n`;
      body.push(contentObjStr);
      currentOffset += contentObjStr.length;
    }

    // XRef
    const xrefOffset = currentOffset;
    let xref = `xref\n0 ${offsets.length + 1}\n0000000000 65535 f \n`;
    for (const offset of offsets) {
      xref += String(offset).padStart(10, '0') + ' 00000 n \n';
    }

    const trailer = `trailer\n<< /Size ${offsets.length + 1} /Root 3 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    const fullPdf = header + body.join('') + xref + trailer;

    // Encode to Latin1 / binary Uint8Array
    const bytes = new Uint8Array(fullPdf.length);
    for (let i = 0; i < fullPdf.length; i++) {
      bytes[i] = fullPdf.charCodeAt(i) & 0xff;
    }
    return bytes;
  }
}

/**
 * Generates a standard A4 PDF Blob with the session summary,
 * participant breakdown, unit prices, subtotals, grand total, and reservation info.
 */
export function generateSessionPdfBlob(options: PdfExportOptions): Blob {
  const { reservationHolder, participants, generatedAt = new Date() } = options;
  const doc = new SimplePdfWriter();

  const formattedDate = formatPdfDate(generatedAt);
  const grandTotal = calculateGrandTotal(participants);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 45;
  const contentWidth = pageWidth - marginX * 2; // 505.28

  let y = pageHeight - 50;

  // Header Box
  doc.drawRect(marginX, y - 55, contentWidth, 55, [0.15, 0.2, 0.35], undefined);
  doc.drawText('CUENTA DE LA PARTIDA', marginX + 16, y - 24, 'F2', 18, [1, 1, 1]);
  doc.drawText('Control de gastos y consumiciones de la sala', marginX + 16, y - 44, 'F1', 10, [0.85, 0.88, 0.95]);

  y -= 75;

  // Reservation details banner
  doc.drawRect(marginX, y - 42, contentWidth, 42, [0.95, 0.96, 0.98], [0.82, 0.85, 0.9], 1);
  doc.drawText('DATOS DE LA RESERVA', marginX + 12, y - 16, 'F2', 9, [0.35, 0.4, 0.5]);
  doc.drawText(`Titular de la reserva: ${reservationHolder}`, marginX + 12, y - 32, 'F2', 11, [0.1, 0.15, 0.25]);
  doc.drawText(`Fecha: ${formattedDate}`, marginX + 350, y - 32, 'F1', 10, [0.3, 0.35, 0.45]);

  y -= 62;

  // Section: Participants
  doc.drawText('DESGLOSE POR JUGADOR', marginX, y, 'F2', 11, [0.2, 0.25, 0.35]);
  doc.drawLine(marginX, y - 5, marginX + contentWidth, y - 5, [0.75, 0.8, 0.88], 1);
  y -= 20;

  for (const p of participants) {
    const pTotal = calculateParticipantTotal(p);
    const formattedTotal = formatCurrency(pTotal);
    const itemCount = p.items.length;
    const cardHeight = Math.max(38, 22 + (itemCount > 0 ? itemCount * 16 : 16));

    // Page overflow check
    if (y - cardHeight < 90) {
      doc.newPage();
      y = pageHeight - 50;
      doc.drawText('CUENTA DE LA PARTIDA (Continuación)', marginX, y, 'F2', 12, [0.2, 0.25, 0.35]);
      doc.drawLine(marginX, y - 5, marginX + contentWidth, y - 5, [0.75, 0.8, 0.88], 1);
      y -= 25;
    }

    // Participant Card Background
    doc.drawRect(marginX, y - cardHeight, contentWidth, cardHeight, [0.98, 0.99, 1.0], [0.85, 0.88, 0.92], 0.75);

    // Participant Header
    doc.drawText(p.name, marginX + 10, y - 16, 'F2', 11, [0.1, 0.15, 0.25]);
    doc.drawText(`Total: ${formattedTotal}`, marginX + 410, y - 16, 'F2', 11, [0.1, 0.45, 0.25]);

    // Items list
    let itemY = y - 32;
    if (p.items.length === 0) {
      doc.drawText('• Sin consumiciones (0,00 €)', marginX + 20, itemY, 'F1', 9.5, [0.55, 0.58, 0.65]);
    } else {
      for (const item of p.items) {
        const itemSubtotal = item.unitPrice * item.quantity;
        const lineText = `• ${item.quantity}x ${item.name} (${formatCurrency(item.unitPrice)} c/u)`;
        doc.drawText(lineText, marginX + 20, itemY, 'F1', 9.5, [0.25, 0.28, 0.35]);
        doc.drawText(formatCurrency(itemSubtotal), marginX + 440, itemY, 'F1', 9.5, [0.25, 0.28, 0.35]);
        itemY -= 16;
      }
    }

    y -= (cardHeight + 10);
  }

  // Grand Total Box
  if (y < 90) {
    doc.newPage();
    y = pageHeight - 50;
  }

  y -= 10;
  doc.drawRect(marginX, y - 40, contentWidth, 40, [0.15, 0.2, 0.35], undefined);
  doc.drawText('TOTAL MESA', marginX + 16, y - 25, 'F2', 13, [1, 1, 1]);
  doc.drawText(formatCurrency(grandTotal), marginX + 390, y - 25, 'F2', 15, [1, 1, 1]);

  // Document footer note
  doc.drawText('Generado automáticamente por Boardgame Expenses', marginX, 30, 'F1', 8, [0.6, 0.65, 0.7]);

  const pdfBytes = doc.toUint8Array();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
