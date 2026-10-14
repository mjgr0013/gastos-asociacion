import { describe, expect, it } from 'vitest';
import {
  formatPdfDate,
  generatePdfFilename,
  generateSessionPdfBlob
} from '../../src/domain/pdf-export';
import { Participant } from '../../src/domain/models';

describe('Domain PDF Export', () => {
  const fixedDate = new Date(2026, 9, 14, 21, 45, 30); // 14/10/2026 21:45:30

  describe('formatPdfDate', () => {
    it('formats date in Spanish format DD/MM/AAAA without hours or seconds', () => {
      const formatted = formatPdfDate(fixedDate);
      expect(formatted).toBe('14/10/2026');
      expect(formatted).not.toContain('21');
      expect(formatted).not.toContain('45');
      expect(formatted).not.toContain('30');
    });
  });

  describe('generatePdfFilename', () => {
    it('creates a normalized date-only filename without hours or seconds', () => {
      const filename = generatePdfFilename(fixedDate);
      expect(filename).toBe('cuenta-partida-20261014.pdf');
    });
  });

  describe('generateSessionPdfBlob', () => {
    it('generates a valid PDF blob with reservation holder, participants and date-only header', async () => {
      const participants: Participant[] = [
        {
          id: 'p1',
          name: 'Manu',
          createdAt: new Date().toISOString(),
          items: [
            { id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 },
            { id: 'i2', name: 'Snack', unitPrice: 1.0, quantity: 1 }
          ]
        },
        {
          id: 'p2',
          name: 'Carlos',
          createdAt: new Date().toISOString(),
          items: [{ id: 'i3', name: 'Pizza', unitPrice: 6.5, quantity: 1 }]
        },
        {
          id: 'p3',
          name: 'Ana',
          createdAt: new Date().toISOString(),
          items: []
        }
      ];

      const blob = generateSessionPdfBlob({
        reservationHolder: 'Manuel García',
        participants,
        generatedAt: fixedDate
      });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');
      expect(blob.size).toBeGreaterThan(500);

      const arrayBuffer = await blob.arrayBuffer();
      const text = new TextDecoder('latin1').decode(arrayBuffer);

      // Verify standard PDF header & structure
      expect(text).toContain('%PDF-1.4');
      expect(text).toContain('/Type /Catalog');
      expect(text).toContain('/Type /Pages');
      expect(text).toContain('xref');
      expect(text).toContain('%%EOF');

      // Verify header details: reservation holder and date ONLY (no hours or seconds)
      expect(text).toContain('Manuel G');
      expect(text).toContain('Fecha: 14/10/2026');
      expect(text).not.toContain('21:45');
      expect(text).not.toContain('Fecha y hora:');

      // Verify participants and items
      expect(text).toContain('Manu');
      expect(text).toContain('Carlos');
      expect(text).toContain('Ana');
      expect(text).toContain('Refresco');
      expect(text).toContain('Pizza');
      expect(text).toContain('Sin consumiciones');

      // Verify totals
      expect(text).toContain('TOTAL MESA');
    });

    it('handles multiple participants without crashing and creates valid PDF', async () => {
      const participants: Participant[] = Array.from({ length: 8 }, (_, i) => ({
        id: `p${i}`,
        name: `Jugador ${i + 1}`,
        createdAt: new Date().toISOString(),
        items: [
          { id: `i${i}_1`, name: 'Bebida', unitPrice: 2.0, quantity: i + 1 }
        ]
      }));

      const blob = generateSessionPdfBlob({
        reservationHolder: 'Club de Juegos',
        participants,
        generatedAt: fixedDate
      });

      expect(blob.size).toBeGreaterThan(1000);
      const text = new TextDecoder('latin1').decode(await blob.arrayBuffer());
      expect(text).toContain('Club de Juegos');
      expect(text).toContain('Jugador 8');
      expect(text).toContain('Fecha: 14/10/2026');
      expect(text).not.toContain('21:45');
    });
  });
});
