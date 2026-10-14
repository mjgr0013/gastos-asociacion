import { describe, expect, it } from 'vitest';
import {
  validateConsumptionInput,
  validateParticipantName
} from '../../src/domain/validation';

describe('Domain Validation', () => {
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
