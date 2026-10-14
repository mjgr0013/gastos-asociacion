export class ConsumptionFormComponent {
    overlay;
    formElement;
    errorElement;
    options;
    handleKeyDownBound;
    constructor(options) {
        this.options = options;
        this.handleKeyDownBound = (e) => this.handleKeyDown(e);
        this.overlay = document.createElement('div');
        this.overlay.className = 'modal-overlay';
        this.overlay.setAttribute('role', 'dialog');
        this.overlay.setAttribute('aria-modal', 'true');
        this.overlay.setAttribute('aria-labelledby', 'modal-title');
        this.overlay.innerHTML = `
      <div class="modal-card">
        <div class="modal-header">
          <h2 id="modal-title" class="modal-title">Nueva Consumición para ${escapeHtml(options.participantName)}</h2>
          <button type="button" class="btn-close" aria-label="Cerrar modal">&times;</button>
        </div>
        <form class="custom-consumption-form" novalidate>
          <div class="form-group">
            <label for="custom-item-name" class="form-label">Producto / Concepto</label>
            <input
              type="text"
              id="custom-item-name"
              class="form-control"
              placeholder="Ej: Pizza familiar, Cerveza artesana..."
              maxlength="80"
              required
              autocomplete="off"
            />
          </div>
          <div class="form-row">
            <div class="form-group form-col">
              <label for="custom-item-price" class="form-label">Precio Unitario (€)</label>
              <input
                type="number"
                id="custom-item-price"
                class="form-control"
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
              />
            </div>
            <div class="form-group form-col">
              <label for="custom-item-qty" class="form-label">Cantidad</label>
              <input
                type="number"
                id="custom-item-qty"
                class="form-control"
                value="1"
                step="1"
                min="1"
                required
              />
            </div>
          </div>
          <div class="form-error" id="custom-form-error" role="alert"></div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary btn-cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary btn-save">Guardar consumición</button>
          </div>
        </form>
      </div>
    `;
        this.formElement = this.overlay.querySelector('.custom-consumption-form');
        this.errorElement = this.overlay.querySelector('#custom-form-error');
        this.bindEvents();
    }
    bindEvents() {
        this.formElement.addEventListener('submit', (e) => this.handleSubmit(e));
        const closeBtn = this.overlay.querySelector('.btn-close');
        closeBtn?.addEventListener('click', () => this.options.onCancel());
        const cancelBtn = this.overlay.querySelector('.btn-cancel');
        cancelBtn?.addEventListener('click', () => this.options.onCancel());
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.options.onCancel();
            }
        });
        document.addEventListener('keydown', this.handleKeyDownBound);
    }
    handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.options.onCancel();
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        const nameInput = this.overlay.querySelector('#custom-item-name');
        const priceInput = this.overlay.querySelector('#custom-item-price');
        const qtyInput = this.overlay.querySelector('#custom-item-qty');
        const name = nameInput.value.trim();
        const unitPrice = parseFloat(priceInput.value);
        const quantity = parseInt(qtyInput.value, 10);
        if (!name) {
            this.showError('El nombre del producto no puede estar vacío.');
            nameInput.focus();
            return;
        }
        if (isNaN(unitPrice) || unitPrice <= 0) {
            this.showError('Introduce un precio válido mayor a 0.00 €.');
            priceInput.focus();
            return;
        }
        if (isNaN(quantity) || quantity < 1) {
            this.showError('La cantidad debe ser al menos 1.');
            qtyInput.focus();
            return;
        }
        this.options.onSubmit({
            name,
            unitPrice,
            quantity
        });
    }
    showError(msg) {
        this.errorElement.textContent = msg;
        this.errorElement.classList.add('visible');
    }
    mount(container = document.body) {
        container.appendChild(this.overlay);
        const nameInput = this.overlay.querySelector('#custom-item-name');
        nameInput?.focus();
    }
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDownBound);
        this.overlay.remove();
    }
}
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
