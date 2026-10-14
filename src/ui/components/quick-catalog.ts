import { DEFAULT_CATALOG_PRESETS, QuickCatalogPreset } from '../../domain/models';

export interface QuickCatalogOptions {
  participantId: string;
  onSelectPreset: (preset: QuickCatalogPreset) => void;
  onOpenCustomForm: () => void;
}

export class QuickCatalogComponent {
  private element: HTMLElement;
  private options: QuickCatalogOptions;

  constructor(options: QuickCatalogOptions) {
    this.options = options;
    this.element = document.createElement('div');
    this.element.className = 'quick-catalog-container';
    this.render();
  }

  private render(): void {
    this.element.innerHTML = `
      <div class="quick-catalog-chips">
        ${DEFAULT_CATALOG_PRESETS.map(
          (preset) => `
          <button
            type="button"
            class="chip chip-catalog"
            data-preset-id="${preset.id}"
            title="Añadir ${preset.name} (${preset.unitPrice.toFixed(2)} €)"
          >
            <span class="chip-icon">${preset.icon ?? '🏷️'}</span>
            <span class="chip-name">${preset.name}</span>
            <span class="chip-price">${preset.unitPrice.toFixed(2)}€</span>
          </button>
        `
        ).join('')}
        <button
          type="button"
          class="chip chip-custom"
          data-action="custom"
          title="Añadir consumición personalizada con otro precio"
        >
          <span class="chip-icon">✏️</span>
          <span class="chip-name">Otro...</span>
        </button>
      </div>
    `;

    // Asignar listeners a los botones del catálogo
    const presetButtons = this.element.querySelectorAll<HTMLButtonElement>('.chip-catalog');
    presetButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-preset-id');
        const preset = DEFAULT_CATALOG_PRESETS.find((p) => p.id === id);
        if (preset) {
          this.options.onSelectPreset(preset);
        }
      });
    });

    const customBtn = this.element.querySelector<HTMLButtonElement>('[data-action="custom"]');
    if (customBtn) {
      customBtn.addEventListener('click', () => {
        this.options.onOpenCustomForm();
      });
    }
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
