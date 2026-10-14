import { describe, expect, it } from 'vitest';
import {
  formatParticipantName,
  isDuplicateParticipantName,
  validateConsumptionInput,
  validateParticipantName
} from '../../src/domain/validation';

describe('Domain Validation', () => {
  describe('formatParticipantName', () => {
    it('capitalizes the first letter of a name and trims whitespace', () => {
      expect(formatParticipantName('manu')).toBe('Manu');
      expect(formatParticipantName('  carlos  ')).toBe('Carlos');
      expect(formatParticipantName('elena')).toBe('Elena');
    });

    it('handles accented letters and special characters at start', () => {
      expect(formatParticipantName('ángel')).toBe('Ángel');
      expect(formatParticipantName('  óscar  ')).toBe('Óscar');
    });

    it('preserves already capitalized names and empty strings', () => {
      expect(formatParticipantName('Manu')).toBe('Manu');
      expect(formatParticipantName('')).toBe('');
      expect(formatParticipantName('   ')).toBe('');
    });
  });

  describe('isDuplicateParticipantName', () => {
    const existing = ['Manu', 'Carlos'];

    it('detects duplicate names case-insensitively and ignoring spaces', () => {
      expect(isDuplicateParticipantName('Manu', existing)).toBe(true);
      expect(isDuplicateParticipantName('manu', existing)).toBe(true);
      expect(isDuplicateParticipantName('MANU', existing)).toBe(true);
      expect(isDuplicateParticipantName('  manu  ', existing)).toBe(true);
      expect(isDuplicateParticipantName('carlos', existing)).toBe(true);
    });

    it('returns false when name is not in the list', () => {
      expect(isDuplicateParticipantName('Elena', existing)).toBe(false);
      expect(isDuplicateParticipantName('Manuel', existing)).toBe(false);
    });
  });

  describe('validateParticipantName', () => {
    it('accepts valid non-empty names', () => {
      expect(validateParticipantName('Manu')).toEqual({ valid: true });
      expect(validateParticipantName('Carlos A.')).toEqual({ valid: true });
      expect(validateParticipantName('  Ana  ')).toEqual({ valid: true });
    });

    it('rejects empty or whitespace-only names', () => {
      expect(validateParticipantName('')).toEqual({
        valid: false,
        error: 'El nombre del participante no puede estar vacío.'
      });
      expect(validateParticipantName('    ')).toEqual({
        valid: false,
        error: 'El nombre del participante no puede estar vacío.'
      });
    });

    it('rejects names exceeding 50 characters', () => {
      const longName = 'A'.repeat(51);
      expect(validateParticipantName(longName)).toEqual({
        valid: false,
        error: 'El nombre del participante no puede superar los 50 caracteres.'
      });
    });

    it('rejects duplicate participant names case-insensitively', () => {
      const existing = ['Manu', 'Carlos'];
      expect(validateParticipantName('manu', existing)).toEqual({
        valid: false,
        error: 'Ya existe un jugador con este nombre en la mesa.'
      });
      expect(validateParticipantName('  MANU  ', existing)).toEqual({
        valid: false,
        error: 'Ya existe un jugador con este nombre en la mesa.'
      });
      expect(validateParticipantName('Elena', existing)).toEqual({
        valid: true
      });
    });
  });

  describe('validateConsumptionInput', () => {
    it('accepts valid consumption inputs', () => {
      expect(validateConsumptionInput('Refresco', 1.5, 1)).toEqual({ valid: true });
      expect(validateConsumptionInput('Snack', 1.0, 2)).toEqual({ valid: true });
      expect(validateConsumptionInput('Pizza', 6.95, 3)).toEqual({ valid: true });
    });

    it('rejects empty product name', () => {
      expect(validateConsumptionInput('', 1.5, 1)).toEqual({
        valid: false,
        error: 'El nombre del producto no puede estar vacío.'
      });
      expect(validateConsumptionInput('   ', 1.5, 1)).toEqual({
        valid: false,
        error: 'El nombre del producto no puede estar vacío.'
      });
    });

    it('rejects product names exceeding 80 characters', () => {
      const longName = 'X'.repeat(81);
      expect(validateConsumptionInput(longName, 2.0, 1)).toEqual({
        valid: false,
        error: 'El nombre del producto no puede superar los 80 caracteres.'
      });
    });

    it('rejects zero or negative unit price', () => {
      expect(validateConsumptionInput('Refresco', 0, 1)).toEqual({
        valid: false,
        error: 'El precio unitario debe ser un número estrictamente mayor a 0.'
      });
      expect(validateConsumptionInput('Refresco', -1.5, 1)).toEqual({
        valid: false,
        error: 'El precio unitario debe ser un número estrictamente mayor a 0.'
      });
      expect(validateConsumptionInput('Refresco', NaN, 1)).toEqual({
        valid: false,
        error: 'El precio unitario debe ser un número estrictamente mayor a 0.'
      });
    });

    it('rejects non-integer or zero/negative quantity', () => {
      expect(validateConsumptionInput('Refresco', 1.5, 0)).toEqual({
        valid: false,
        error: 'La cantidad debe ser un número entero mayor o igual a 1.'
      });
      expect(validateConsumptionInput('Refresco', 1.5, -2)).toEqual({
        valid: false,
        error: 'La cantidad debe ser un número entero mayor o igual a 1.'
      });
      expect(validateConsumptionInput('Refresco', 1.5, 1.5)).toEqual({
        valid: false,
        error: 'La cantidad debe ser un número entero mayor o igual a 1.'
      });
    });
  });
});
