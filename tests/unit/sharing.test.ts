import { describe, expect, it } from 'vitest';
import { generateSessionShareText } from '../../src/domain/sharing';
import { Participant } from '../../src/domain/models';

describe('Domain Sharing - generateSessionShareText', () => {
  const fixedDate = new Date(2026, 9, 14); // 14 Octubre 2026

  it('generates a clean formatted summary for participants with items', () => {
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
    expect(result).toContain('------------------------------------');
    expect(result).toMatch(/Total mesa:\s*10,50\s*€/);
  });

  it('handles participants without consumptions cleanly', () => {
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
    expect(result).toMatch(/Total mesa:\s*0,00\s*€/);
  });

  it('handles empty participant list gracefully', () => {
    const result = generateSessionShareText([], fixedDate);
    expect(result).toContain('• Sin participantes');
    expect(result).toMatch(/Total mesa:\s*0,00\s*€/);
  });
});
