import { calculateItemTotal, calculateParticipantTotal, formatCurrency } from '../../domain/calculations';
import { QuickCatalogComponent } from './quick-catalog';
export class ParticipantCardComponent {
    element;
    options;
    constructor(options) {
        this.options = options;
        this.element = document.createElement('article');
        this.element.className = 'participant-card';
        this.element.setAttribute('data-participant-id', options.participant.id);
        this.render();
    }
    render() {
        const { participant } = this.options;
        const subtotal = calculateParticipantTotal(participant);
        this.element.innerHTML = `
      <header class="card-header">
        <div class="participant-identity">
          <span class="participant-avatar">🎲</span>
          <h3 class="participant-name">${escapeHtml(participant.name)}</h3>
        </div>
        <div class="card-header-actions">
          <div class="participant-subtotal-badge" title="Subtotal de ${escapeHtml(participant.name)}">
            ${formatCurrency(subtotal)}
          </div>
          <button
            type="button"
            class="btn-icon-danger btn-delete-participant"
            title="Eliminar a ${escapeHtml(participant.name)}"
            aria-label="Eliminar participante ${escapeHtml(participant.name)}"
          >
            🗑️
          </button>
        </div>
      </header>

      <div class="card-body">
        <div class="quick-catalog-mount"></div>

        <div class="items-section">
          <div class="items-section-title">Consumiciones (${participant.items.length}):</div>
          ${participant.items.length === 0
            ? `<div class="empty-items-notice">Sin consumiciones aún. Pulsa un botón arriba para añadir.</div>`
            : `<ul class="consumption-list">
                  ${participant.items.map((item) => this.renderItemRow(item)).join('')}
                </ul>`}
        </div>
      </div>
    `;
        // Montar el catálogo rápido
        const catalogMount = this.element.querySelector('.quick-catalog-mount');
        if (catalogMount) {
            const catalog = new QuickCatalogComponent({
                participantId: participant.id,
                onSelectPreset: (preset) => this.options.onSelectPreset(participant.id, preset),
                onOpenCustomForm: () => this.options.onOpenCustomForm(participant)
            });
            catalogMount.appendChild(catalog.getElement());
        }
        // Bind item actions (+, -, delete)
        this.bindItemActions();
        // Bind delete participant
        const deleteBtn = this.element.querySelector('.btn-delete-participant');
        deleteBtn?.addEventListener('click', () => {
            this.options.onRequestDeleteParticipant(participant);
        });
    }
    renderItemRow(item) {
        const lineTotal = calculateItemTotal(item);
        return `
      <li class="consumption-item-row" data-item-id="${item.id}">
        <div class="item-info">
          <span class="item-name">${escapeHtml(item.name)}</span>
          <span class="item-unit-price">${formatCurrency(item.unitPrice)} /ud</span>
        </div>
        <div class="item-controls">
          <div class="qty-counter">
            <button
              type="button"
              class="btn-qty btn-qty-decrease"
              data-item-id="${item.id}"
              title="Restar una unidad"
              aria-label="Disminuir cantidad"
            >
              －
            </button>
            <span class="qty-value">${item.quantity}</span>
            <button
              type="button"
              class="btn-qty btn-qty-increase"
              data-item-id="${item.id}"
              title="Sumar una unidad"
              aria-label="Aumentar cantidad"
            >
              ＋
            </button>
          </div>
          <span class="item-line-total">${formatCurrency(lineTotal)}</span>
          <button
            type="button"
            class="btn-item-delete"
            data-item-id="${item.id}"
            title="Eliminar esta línea"
            aria-label="Eliminar ${escapeHtml(item.name)}"
          >
            ✕
          </button>
        </div>
      </li>
    `;
    }
    bindItemActions() {
        const { participant } = this.options;
        // Incrementar
        this.element.querySelectorAll('.btn-qty-increase').forEach((btn) => {
            btn.addEventListener('click', () => {
                const itemId = btn.getAttribute('data-item-id');
                const item = participant.items.find((i) => i.id === itemId);
                if (item) {
                    this.options.onUpdateQuantity(participant.id, item.id, item.quantity + 1);
                }
            });
        });
        // Decrementar
        this.element.querySelectorAll('.btn-qty-decrease').forEach((btn) => {
            btn.addEventListener('click', () => {
                const itemId = btn.getAttribute('data-item-id');
                const item = participant.items.find((i) => i.id === itemId);
                if (item) {
                    this.options.onUpdateQuantity(participant.id, item.id, item.quantity - 1);
                }
            });
        });
        // Eliminar línea
        this.element.querySelectorAll('.btn-item-delete').forEach((btn) => {
            btn.addEventListener('click', () => {
                const itemId = btn.getAttribute('data-item-id');
                if (itemId) {
                    this.options.onRemoveItem(participant.id, itemId);
                }
            });
        });
    }
    getElement() {
        return this.element;
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
