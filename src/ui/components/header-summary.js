import { calculateGrandTotal, formatCurrency } from '../../domain/calculations';
export class HeaderSummaryComponent {
    element;
    totalValueElement;
    participantsCountElement;
    options;
    constructor(options) {
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
        this.totalValueElement = this.element.querySelector('#header-grand-total');
        this.participantsCountElement = this.element.querySelector('#header-participants-count');
        const resetBtn = this.element.querySelector('#btn-reset-session');
        resetBtn?.addEventListener('click', () => {
            this.options.onResetRequested();
        });
    }
    update(participants) {
        const grandTotal = calculateGrandTotal(participants);
        this.totalValueElement.textContent = formatCurrency(grandTotal);
        const count = participants.length;
        this.participantsCountElement.textContent =
            count === 1 ? '1 jugador' : `${count} jugadores`;
    }
    getElement() {
        return this.element;
    }
}
