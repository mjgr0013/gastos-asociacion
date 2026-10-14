import {
  calculateItemTotal,
  calculateParticipantItemUnits,
  calculateParticipantTotal,
  formatCurrency
} from '../../domain/calculations';
import { ConsumptionItem, Participant, QuickCatalogPreset } from '../../domain/models';
import { QuickCatalogComponent } from './quick-catalog';

export interface ParticipantCardOptions {
  participant: Participant;
  isCollapsed?: boolean;
  onToggleCollapse?: (participantId: string) => void;
  onSelectPreset: (participantId: string, preset: QuickCatalogPreset) => void;
  onOpenCustomForm: (participant: Participant) => void;
  onUpdateQuantity: (participantId: string, itemId: string, newQty: number) => void;
  onRequestRemoveItem?: (participant: Participant, item: ConsumptionItem) => void;
  onRemoveItem?: (participantId: string, itemId: string) => void;
  onRequestDeleteParticipant: (participant: Participant) => void;
}

export class ParticipantCardComponent {
  private element: HTMLElement;
  private options: ParticipantCardOptions;

  constructor(options: ParticipantCardOptions) {
    this.options = options;
    this.element = document.createElement('article');
    this.element.className = 'participant-card';
    if (options.isCollapsed) {
      this.element.classList.add('is-collapsed');
    }
    this.element.setAttribute('data-participant-id', options.participant.id);
    this.render();
  }

  private render(): void {
    const { participant } = this.options;
    const subtotal = calculateParticipantTotal(participant);
    const totalUnits = calculateParticipantItemUnits(participant);
    const isCollapsed = Boolean(this.options.isCollapsed);

    this.element.innerHTML = `
      <header
        class="card-header"
        role="button"
        tabindex="0"
        aria-expanded="${!isCollapsed}"
        aria-controls="card-body-${participant.id}"
        aria-label="${isCollapsed ? 'Desplegar' : 'Colapsar'} consumiciones de ${escapeHtml(participant.name)}"
      >
        <div class="participant-identity">
          <button
            type="button"
            class="btn-toggle-collapse"
            tabindex="-1"
            aria-hidden="true"
          >
            <span class="collapse-chevron">▼</span>
          </button>
          <span class="participant-avatar">🎲</span>
          <h3 class="participant-name">${escapeHtml(participant.name)}</h3>
          <span class="participant-items-count">(${totalUnits} ${totalUnits === 1 ? 'ud' : 'uds'})</span>
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

      <div id="card-body-${participant.id}" class="card-body">
        <div class="quick-catalog-mount"></div>

        <div class="items-section">
          <div class="items-section-title">Consumiciones (${participant.items.length}):</div>
          ${
            participant.items.length === 0
              ? `<div class="empty-items-notice">Sin consumiciones aún. Pulsa un botón arriba para añadir.</div>`
              : `<ul class="consumption-list">
                  ${participant.items.map((item) => this.renderItemRow(item)).join('')}
                </ul>`
          }
        </div>
      </div>
    `;

    // Montar el catálogo rápido
    const catalogMount = this.element.querySelector('.quick-catalog-mount') as HTMLElement;
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

    // Bind header toggle collapse
    const header = this.element.querySelector('.card-header') as HTMLElement;
    const toggleCollapse = () => {
      if (this.options.onToggleCollapse) {
        this.options.onToggleCollapse(participant.id);
      } else {
        const nowCollapsed = this.element.classList.toggle('is-collapsed');
        header.setAttribute('aria-expanded', String(!nowCollapsed));
        header.setAttribute(
          'aria-label',
          `${nowCollapsed ? 'Desplegar' : 'Colapsar'} consumiciones de ${participant.name}`
        );
      }
    };

    header?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.btn-delete-participant')) {
        return;
      }
      toggleCollapse();
    });

    header?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target as HTMLElement;
        if (target.closest('.btn-delete-participant')) {
          return;
        }
        e.preventDefault();
        toggleCollapse();
      }
    });

    // Bind delete participant
    const deleteBtn = this.element.querySelector('.btn-delete-participant');
    deleteBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.options.onRequestDeleteParticipant(participant);
    });
  }

  private renderItemRow(item: ConsumptionItem): string {
    const lineTotal = calculateItemTotal(item);
    return `
      <li class="consumption-item-row" data-item-id="${item.id}">
        <div class="item-info">
          <span class="item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</span>
          <span class="item-unit-price">· ${formatCurrency(item.unitPrice)}</span>
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

  private bindItemActions(): void {
    const { participant } = this.options;

    // Incrementar
    this.element.querySelectorAll<HTMLButtonElement>('.btn-qty-increase').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = participant.items.find((i) => i.id === itemId);
        if (item) {
          this.options.onUpdateQuantity(participant.id, item.id, item.quantity + 1);
        }
      });
    });

    // Decrementar
    this.element.querySelectorAll<HTMLButtonElement>('.btn-qty-decrease').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = participant.items.find((i) => i.id === itemId);
        if (item) {
          if (item.quantity <= 1) {
            if (this.options.onRequestRemoveItem) {
              this.options.onRequestRemoveItem(participant, item);
            } else if (this.options.onRemoveItem) {
              this.options.onRemoveItem(participant.id, item.id);
            }
          } else {
            this.options.onUpdateQuantity(participant.id, item.id, item.quantity - 1);
          }
        }
      });
    });

    // Eliminar línea
    this.element.querySelectorAll<HTMLButtonElement>('.btn-item-delete').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        const item = participant.items.find((i) => i.id === itemId);
        if (item) {
          if (this.options.onRequestRemoveItem) {
            this.options.onRequestRemoveItem(participant, item);
          } else if (this.options.onRemoveItem) {
            this.options.onRemoveItem(participant.id, item.id);
          }
        }
      });
    });
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
