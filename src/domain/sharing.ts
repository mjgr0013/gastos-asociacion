import {
  calculateGrandTotal,
  calculateParticipantTotal,
  formatCurrency
} from './calculations';
import { Participant } from './models';

export interface ConsumedProductPrice {
  name: string;
  unitPrice: number;
}

export function extractConsumedProductPrices(
  participants: Participant[]
): ConsumedProductPrice[] {
  const map = new Map<string, ConsumedProductPrice>();

  for (const p of participants) {
    for (const item of p.items) {
      if (item.quantity > 0) {
        const key = `${item.name}:::${item.unitPrice}`;
        if (!map.has(key)) {
          map.set(key, {
            name: item.name,
            unitPrice: item.unitPrice
          });
        }
      }
    }
  }

  const result = Array.from(map.values());

  result.sort((a, b) => {
    const nameComparison = a.name.localeCompare(b.name, 'es', {
      sensitivity: 'base'
    });
    if (nameComparison !== 0) {
      return nameComparison;
    }
    return a.unitPrice - b.unitPrice;
  });

  return result;
}

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

  const consumedPrices = extractConsumedProductPrices(participants);
  if (consumedPrices.length > 0) {
    lines.push('------------------------------------');
    lines.push('Precios de productos:');
    for (const p of consumedPrices) {
      lines.push(`• ${p.name}: ${formatCurrency(p.unitPrice)}`);
    }
  }

  const grandTotal = calculateGrandTotal(participants);
  lines.push('------------------------------------');
  lines.push(`Total mesa: ${formatCurrency(grandTotal)}`);

  return lines.join('\n');
}
