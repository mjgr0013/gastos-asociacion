import { describe, expect, it } from 'vitest';
import {
  calculateGrandTotal,
  calculateItemTotal,
  calculateParticipantTotal,
  formatCurrency,
  roundCurrency
} from '../../src/domain/calculations';
import { ConsumptionItem, Participant } from '../../src/domain/models';

describe('Domain Calculations & Currency Formatting', () => {
  describe('roundCurrency', () => {
    it('rounds standard decimals to two decimal places', () => {
      expect(roundCurrency(1.5)).toBe(1.5);
      expect(roundCurrency(1.555)).toBe(1.56);
      expect(roundCurrency(1.554)).toBe(1.55);
    });

    it('resolves floating point rounding quirks (0.1 + 0.2)', () => {
      expect(roundCurrency(0.1 + 0.2)).toBe(0.3);
    });
  });

  describe('formatCurrency', () => {
    it('formats EUR currency with 2 decimals in Spanish format', () => {
      const formatted = formatCurrency(1.5);
      // Handles standard non-breaking spaces or regular spaces in Intl output
      expect(formatted).toMatch(/1,50\s*€/);
    });

    it('formats 0 EUR correctly', () => {
      const formatted = formatCurrency(0);
      expect(formatted).toMatch(/0,00\s*€/);
    });
  });

  describe('calculateItemTotal', () => {
    it('multiplies price by quantity with correct rounding', () => {
      const item: ConsumptionItem = {
        id: '1',
        name: 'Refresco',
        unitPrice: 1.5,
        quantity: 3
      };
      expect(calculateItemTotal(item)).toBe(4.5);
    });
  });

  describe('calculateParticipantTotal and calculateGrandTotal', () => {
    it('sums all items for a participant', () => {
      const participant: Participant = {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 }, // 3.00
          { id: 'i2', name: 'Snack', unitPrice: 1.0, quantity: 1 }      // 1.00
        ]
      };
      expect(calculateParticipantTotal(participant)).toBe(4.0);
    });

    it('sums grand total for multiple participants', () => {
      const p1: Participant = {
        id: 'p1',
        name: 'Manu',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'i1', name: 'Refresco', unitPrice: 1.5, quantity: 2 } // 3.00
        ]
      };
      const p2: Participant = {
        id: 'p2',
        name: 'Carlos',
        createdAt: new Date().toISOString(),
        items: [
          { id: 'i2', name: 'Snack', unitPrice: 1.25, quantity: 2 } // 2.50
        ]
      };

      expect(calculateGrandTotal([p1, p2])).toBe(5.5);
    });

    it('returns 0 for empty list of participants', () => {
      expect(calculateGrandTotal([])).toBe(0);
    });
  });
});
