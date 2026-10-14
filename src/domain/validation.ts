export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateParticipantName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'El nombre del participante no puede estar vacío.' };
  }
  if (trimmed.length > 50) {
    return { valid: false, error: 'El nombre del participante no puede superar los 50 caracteres.' };
  }
  return { valid: true };
}

export function validateConsumptionInput(
  name: string,
  unitPrice: number,
  quantity: number = 1
): ValidationResult {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: 'El nombre del producto no puede estar vacío.' };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: 'El nombre del producto no puede superar los 80 caracteres.' };
  }
  if (typeof unitPrice !== 'number' || isNaN(unitPrice) || !isFinite(unitPrice) || unitPrice <= 0) {
    return { valid: false, error: 'El precio unitario debe ser un número estrictamente mayor a 0.' };
  }
  if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
    return { valid: false, error: 'La cantidad debe ser un número entero mayor o igual a 1.' };
  }
  return { valid: true };
}
