import { calculateGrandTotal, formatCurrency } from '../../domain/calculations';
import { Participant } from '../../domain/models';

export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested?: () => void;
  onExportPdfRequested?: () => void;
}

export class HeaderSummaryComponent {
  private element: HTMLElement;
  private totalValueElement: HTMLElement;
  private participantsCountElement: HTMLElement;
  private shareButton: HTMLButtonElement;
  private exportPdfButton: HTMLButtonElement;
  private menuToggleButton: HTMLButtonElement;
  private menuDropdown: HTMLElement;
  private menuShareItem: HTMLButtonElement;
  private menuPdfItem: HTMLButtonElement;
  private menuResetItem: HTMLButtonElement;
  private options: HeaderSummaryOptions;
  private isMobileMenuOpen = false;

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
          <!-- Desktop Actions (visibles en >= 680px) -->
          <div class="header-actions-desktop">
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
              class="btn btn-export-pdf"
              id="btn-export-pdf"
              title="Exportar cuenta a PDF"
              disabled
            >
              <span class="btn-icon">📄</span>
              <span class="btn-text">PDF</span>
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

          <!-- Mobile Actions Dropdown (visibles en < 680px) -->
          <div class="header-actions-mobile">
            <button
              type="button"
              class="btn btn-header-menu-toggle"
              id="btn-header-menu-toggle"
              aria-haspopup="true"
              aria-expanded="false"
              aria-controls="header-menu-dropdown"
              title="Acciones de la mesa"
            >
              <span class="btn-icon">⚙️</span>
              <span class="btn-text">Acciones</span>
              <span class="btn-caret">▾</span>
            </button>

            <div class="header-menu-dropdown" id="header-menu-dropdown" role="menu" aria-label="Acciones de la mesa" hidden>
              <button type="button" class="header-menu-item" id="btn-menu-share" role="menuitem" disabled>
                <span class="menu-item-icon">📤</span>
                <span class="menu-item-text">Compartir cuenta</span>
              </button>
              <button type="button" class="header-menu-item" id="btn-menu-pdf" role="menuitem" disabled>
                <span class="menu-item-icon">📄</span>
                <span class="menu-item-text">Exportar a PDF</span>
              </button>
              <div class="header-menu-divider"></div>
              <button type="button" class="header-menu-item header-menu-item-danger" id="btn-menu-reset" role="menuitem">
                <span class="menu-item-icon">🔄</span>
                <span class="menu-item-text">Reiniciar mesa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.totalValueElement = this.element.querySelector('#header-grand-total') as HTMLElement;
    this.participantsCountElement = this.element.querySelector('#header-participants-count') as HTMLElement;
    this.shareButton = this.element.querySelector('#btn-share-session') as HTMLButtonElement;
    this.exportPdfButton = this.element.querySelector('#btn-export-pdf') as HTMLButtonElement;
    this.menuToggleButton = this.element.querySelector('#btn-header-menu-toggle') as HTMLButtonElement;
    this.menuDropdown = this.element.querySelector('#header-menu-dropdown') as HTMLElement;
    this.menuShareItem = this.element.querySelector('#btn-menu-share') as HTMLButtonElement;
    this.menuPdfItem = this.element.querySelector('#btn-menu-pdf') as HTMLButtonElement;
    this.menuResetItem = this.element.querySelector('#btn-menu-reset') as HTMLButtonElement;

    // Desktop listeners
    this.shareButton.addEventListener('click', () => {
      this.options.onShareRequested?.();
    });

    this.exportPdfButton.addEventListener('click', () => {
      this.options.onExportPdfRequested?.();
    });

    const resetBtn = this.element.querySelector('#btn-reset-session');
    resetBtn?.addEventListener('click', () => {
      this.options.onResetRequested();
    });

    // Mobile menu toggle
    this.menuToggleButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMobileMenu();
    });

    // Mobile items listeners
    this.menuShareItem.addEventListener('click', () => {
      this.closeMobileMenu();
      this.options.onShareRequested?.();
    });

    this.menuPdfItem.addEventListener('click', () => {
      this.closeMobileMenu();
      this.options.onExportPdfRequested?.();
    });

    this.menuResetItem.addEventListener('click', () => {
      this.closeMobileMenu();
      this.options.onResetRequested();
    });

    // Outside click dismissal
    document.addEventListener('click', (e) => {
      if (this.isMobileMenuOpen && !this.element.contains(e.target as Node)) {
        this.closeMobileMenu();
      }
    });

    // Escape key dismissal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
        this.menuToggleButton.focus();
      }
    });
  }

  public toggleMobileMenu(forceState?: boolean): void {
    const nextState = forceState !== undefined ? forceState : !this.isMobileMenuOpen;
    this.isMobileMenuOpen = nextState;
    if (this.isMobileMenuOpen) {
      this.menuDropdown.removeAttribute('hidden');
      this.menuToggleButton.setAttribute('aria-expanded', 'true');
    } else {
      this.menuDropdown.setAttribute('hidden', '');
      this.menuToggleButton.setAttribute('aria-expanded', 'false');
    }
  }

  public closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu(false);
    }
  }

  public update(participants: Participant[]): void {
    const grandTotal = calculateGrandTotal(participants);
    this.totalValueElement.textContent = formatCurrency(grandTotal);

    const count = participants.length;
    this.participantsCountElement.textContent =
      count === 1 ? '1 jugador' : `${count} jugadores`;

    const disabled = count === 0;
    this.shareButton.disabled = disabled;
    this.exportPdfButton.disabled = disabled;
    this.menuShareItem.disabled = disabled;
    this.menuPdfItem.disabled = disabled;
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
