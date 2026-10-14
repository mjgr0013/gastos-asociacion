import { describe, expect, it } from 'vitest';
import {
  extractConsumedProductPrices,
  generateSessionShareText
} from '../../src/domain/sharing';
import { Participant } from '../../src/domain/models';

describe('Domain Sharing - extractConsumedProductPrices', () => {
  it('extracts consumed items with quantity > 0 and ignores items with quantity <= 0', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 },
          { id: 'i2', name: 'Golosinas', unitPrice: 1.0, quantity: 0 }
        ]
      },
      {
        id: 'p2',
        name: 'Carlos',
        createdAt: new Date().toISOString(),
        items: [{ id: 'i3', name: 'Pizza', unitPrice: 6.5, quantity: 1 }]
      }
    ];

    const prices = extractConsumedProductPrices(participants);

    expect(prices).toEqual([
      { name: 'Pizza', unitPrice: 6.5 },
      { name: 'Refresco', unitPrice: 1.5 }
    ]);
  });

  it('deduplicates items consumed by multiple participants with the same price', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [{ id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 1 }]
      },
      {
        id: 'p2',
        name: 'Carlos',
        createdAt: new Date().toISOString(),
        items: [{ id: 'i2', name: 'Refresco', unitPrice: 1.5, quantity: 3 }]
      }
    ];

    const prices = extractConsumedProductPrices(participants);

    expect(prices).toHaveLength(1);
    expect(prices[0]).toEqual({ name: 'Refresco', unitPrice: 1.5 });
  });

  it('sorts products alphabetically in Spanish collation with secondary unit price sort', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'i1', name: 'Snack', unitPrice: 1.2, quantity: 1 },
          { id: 'i2', name: 'Café caliente', unitPrice: 0.8, quantity: 1 },
          { id: 'i3', name: 'Árbol de golosinas', unitPrice: 2.0, quantity: 1 },
          { id: 'i4', name: 'Refresco', unitPrice: 1.5, quantity: 1 }
        ]
      }
    ];

    const prices = extractConsumedProductPrices(participants);

    expect(prices.map((p) => p.name)).toEqual([
      'Árbol de golosinas',
      'Café caliente',
      'Refresco',
      'Snack'
    ]);
  });

  it('keeps distinct entries if same product name has different unit prices', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [{ id: 'i1', name: 'Tapa', unitPrice: 2.5, quantity: 1 }]
      },
      {
        id: 'p2',
        name: 'Carlos',
        createdAt: new Date().toISOString(),
        items: [{ id: 'i2', name: 'Tapa', unitPrice: 2.0, quantity: 1 }]
      }
    ];

    const prices = extractConsumedProductPrices(participants);

    expect(prices).toEqual([
      { name: 'Tapa', unitPrice: 2.0 },
      { name: 'Tapa', unitPrice: 2.5 }
    ]);
  });

  it('returns empty array when participants have no consumptions', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Ana',
        createdAt: new Date().toISOString(),
        items: []
      }
    ];

    const prices = extractConsumedProductPrices(participants);
    expect(prices).toEqual([]);
  });
});

describe('Domain Sharing - generateSessionShareText', () => {
  const fixedDate = new Date(2026, 9, 14); // 14 Octubre 2026

  it('generates a clean formatted summary with product price summary for consumed items', () => {
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
      }
    ];

    const result = generateSessionShareText(participants, fixedDate);

    expect(result).toContain('🎲 Cuenta de la partida (14/10/2026):');
    expect(result).toMatch(/• Manu:\s*4,00\s*€\s*\(2x Refresco, 1x Snack\)/);
    expect(result).toMatch(/• Carlos:\s*6,50\s*€\s*\(1x Pizza\)/);
    expect(result).toContain('Precios de productos:');
    expect(result).toMatch(/• Pizza:\s*6,50\s*€/);
    expect(result).toMatch(/• Refresco:\s*1,50\s*€/);
    expect(result).toMatch(/• Snack:\s*1,00\s*€/);
    expect(result).toMatch(/Total mesa:\s*10,50\s*€/);

    // Verify ordering in output: participants before product prices, product prices before total
    const participantsIndex = result.indexOf('• Manu:');
    const pricesSectionIndex = result.indexOf('Precios de productos:');
    const totalIndex = result.indexOf('Total mesa:');

    expect(participantsIndex).toBeLessThan(pricesSectionIndex);
    expect(pricesSectionIndex).toBeLessThan(totalIndex);
  });

  it('handles participants without consumptions cleanly and omits product prices section', () => {
    const participants: Participant[] = [
      {
        id: 'p1',
        name: 'Ana',
        createdAt: new Date().toISOString(),
        items: []
      }
    ];

    const result = generateSessionShareText(participants, fixedDate);

    expect(result).toMatch(/• Ana:\s*0,00\s*€\s*\(Sin consumiciones\)/);
    expect(result).not.toContain('Precios de productos:');
    expect(result).toMatch(/Total mesa:\s*0,00\s*€/);
  });

  it('handles empty participant list gracefully and omits product prices section', () => {
    const result = generateSessionShareText([], fixedDate);
    expect(result).toContain('• Sin participantes');
    expect(result).not.toContain('Precios de productos:');
    expect(result).toMatch(/Total mesa:\s*0,00\s*€/);
  });
});
