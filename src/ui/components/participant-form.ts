export interface ParticipantFormOptions {
  onSubmit: (name: string) => void;
}

export class ParticipantFormComponent {
  private element: HTMLElement;
  private inputElement: HTMLInputElement;
  private errorElement: HTMLElement;
  private options: ParticipantFormOptions;

  constructor(options: ParticipantFormOptions) {
    this.options = options;
    this.element = document.createElement('section');
    this.element.className = 'participant-form-section';

    this.element.innerHTML = `
      <form class="participant-form" id="participant-add-form" novalidate>
        <div class="form-group">
          <label for="new-participant-name" class="visually-hidden">Nombre del participante</label>
          <input
            type="text"
            id="new-participant-name"
            class="input-participant-name"
            placeholder="Añadir jugador (ej: Manu, Carlos)..."
            maxlength="50"
            autocomplete="off"
          />
        </div>
        <button type="submit" class="btn btn-primary btn-add-participant">
          <span class="btn-icon">＋</span>
          <span>Añadir</span>
        </button>
      </form>
      <div class="form-error" id="participant-form-error" role="alert" aria-live="polite"></div>
    `;

    this.inputElement = this.element.querySelector('#new-participant-name') as HTMLInputElement;
    this.errorElement = this.element.querySelector('#participant-form-error') as HTMLElement;

    this.inputElement.addEventListener('input', () => {
      this.clearError();
    });

    const form = this.element.querySelector('#participant-add-form') as HTMLFormElement;
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    const name = this.inputElement.value.trim();

    if (!name) {
      this.showError('Por favor, introduce el nombre del participante.');
      this.inputElement.focus();
      return;
    }

    try {
      this.options.onSubmit(name);
      this.inputElement.value = '';
      this.clearError();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al añadir participante';
      this.showError(msg);
      this.inputElement.focus();
    }
  }

  public showError(message: string): void {
    this.errorElement.textContent = message;
    this.errorElement.classList.add('visible');
  }

  public clearError(): void {
    this.errorElement.textContent = '';
    this.errorElement.classList.remove('visible');
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
