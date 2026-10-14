import { calculateGrandTotal, formatCurrency } from '../../domain/calculations';
import { Participant } from '../../domain/models';

export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested?: () => void;
}

export class HeaderSummaryComponent {
  private element: HTMLElement;
  private totalValueElement: HTMLElement;
  private participantsCountElement: HTMLElement;
  private shareButton: HTMLButtonElement;
  private options: HeaderSummaryOptions;

  constructor(options: HeaderSummaryOptions) {
    this.options = options;
    this.element = document.createElement('header');
    this.element.className = 'app-header-summary';

    this.element.innerHTML = `
      <div class="header-content-wrapper">
        <div class="header-brand">
          <span class="header-logo">🎲</span>
          <div class="header-titles">
            <h1 class="header-title">Gastos de Mesa</h1>
            <span class="header-subtitle" id="header-participants-count">0 jugadores</span>
          </div>
        </div>

        <div class="header-total-container">
          <span class="header-total-label">TOTAL MESA</span>
          <span class="header-total-value" id="header-grand-total">0,00 €</span>
        </div>

        <div class="header-actions">
          <button
            type="button"
            class="btn btn-share-session"
            id="btn-share-session"
            title="Compartir cuenta por WhatsApp o portapapeles"
            disabled
          >
            <span class="btn-icon">📤</span>
            <span class="btn-text">Compartir</span>
          </button>
          <button
            type="button"
            class="btn btn-outline-danger btn-reset-session"
            id="btn-reset-session"
            title="Reiniciar mesa y empezar una cuenta nueva"
          >
            <span class="btn-icon">🔄</span>
            <span class="btn-text">Reiniciar</span>
          </button>
        </div>
      </div>
    `;

    this.totalValueElement = this.element.querySelector('#header-grand-total') as HTMLElement;
    this.participantsCountElement = this.element.querySelector('#header-participants-count') as HTMLElement;
    this.shareButton = this.element.querySelector('#btn-share-session') as HTMLButtonElement;

    this.shareButton.addEventListener('click', () => {
      this.options.onShareRequested?.();
    });

    const resetBtn = this.element.querySelector('#btn-reset-session');
    resetBtn?.addEventListener('click', () => {
      this.options.onResetRequested();
    });
  }

  public update(participants: Participant[]): void {
    const grandTotal = calculateGrandTotal(participants);
    this.totalValueElement.textContent = formatCurrency(grandTotal);

    const count = participants.length;
    this.participantsCountElement.textContent =
      count === 1 ? '1 jugador' : `${count} jugadores`;

    this.shareButton.disabled = count === 0;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
