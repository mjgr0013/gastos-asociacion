import { ConsumptionItem, Participant } from './models';

export function roundCurrency(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculateItemTotal(item: ConsumptionItem): number {
  return roundCurrency(item.unitPrice * item.quantity);
}

export function calculateParticipantTotal(participant: Participant): number {
  const total = participant.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  return roundCurrency(total);
}

export function calculateParticipantItemUnits(participant: Participant): number {
  return participant.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function calculateGrandTotal(participants: Participant[]): number {
  const total = participants.reduce(
    (sum, p) => sum + calculateParticipantTotal(p),
    0
  );
  return roundCurrency(total);
}
