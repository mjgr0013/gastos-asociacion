export class ParticipantFormComponent {
    element;
    inputElement;
    errorElement;
    options;
    constructor(options) {
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
        this.inputElement = this.element.querySelector('#new-participant-name');
        this.errorElement = this.element.querySelector('#participant-form-error');
        const form = this.element.querySelector('#participant-add-form');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    handleSubmit(event) {
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
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Error al añadir participante';
            this.showError(msg);
        }
    }
    showError(message) {
        this.errorElement.textContent = message;
        this.errorElement.classList.add('visible');
    }
    clearError() {
        this.errorElement.textContent = '';
        this.errorElement.classList.remove('visible');
    }
    getElement() {
        return this.element;
    }
}
