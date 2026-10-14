import {
  calculateGrandTotal,
  calculateParticipantTotal,
  formatCurrency
} from './calculations';
import { Participant } from './models';

export function formatDateSpanish(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function generateSessionShareText(
  participants: Participant[],
  date: Date = new Date()
): string {
  const formattedDate = formatDateSpanish(date);
  const lines: string[] = [];

  lines.push(`🎲 Cuenta de la partida (${formattedDate}):`);

  if (participants.length === 0) {
    lines.push('• Sin participantes');
  } else {
    for (const p of participants) {
      const subtotal = calculateParticipantTotal(p);
      const formattedSubtotal = formatCurrency(subtotal);

      if (p.items.length === 0) {
        lines.push(`• ${p.name}: ${formattedSubtotal} (Sin consumiciones)`);
      } else {
        const itemsSummary = p.items
          .map((item) => `${item.quantity}x ${item.name}`)
          .join(', ');
        lines.push(`• ${p.name}: ${formattedSubtotal} (${itemsSummary})`);
      }
    }
  }

  const grandTotal = calculateGrandTotal(participants);
  lines.push('------------------------------------');
  lines.push(`Total mesa: ${formatCurrency(grandTotal)}`);

  return lines.join('\n');
}
