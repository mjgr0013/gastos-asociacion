/**
 * Modal dialog for inputting reservation holder name before generating a PDF.
 */
export class ExportPdfModalComponent {
  public static show(): Promise<string | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'export-pdf-modal-title');

      overlay.innerHTML = `
        <div class="modal-card modal-export-pdf-card">
          <div class="modal-header">
            <h2 id="export-pdf-modal-title" class="modal-title">Exportar cuenta a PDF</h2>
            <button type="button" class="btn-close-modal" aria-label="Cerrar modal">&times;</button>
          </div>
          <form class="export-pdf-form" novalidate>
            <div class="modal-body">
              <p class="export-pdf-description">
                Introduce el nombre de la persona o grupo que ha reservado la sala para incluirlo en el comprobante en PDF.
              </p>
              <div class="form-group">
                <label for="pdf-reservation-holder">Nombre de la reserva *</label>
                <input
                  type="text"
                  id="pdf-reservation-holder"
                  class="input-reservation-holder"
                  placeholder="ej: Manuel García, Club de Rol..."
                  maxlength="60"
                  autocomplete="off"
                  required
                />
              </div>
              <div class="form-error" id="pdf-modal-error" role="alert" aria-live="polite"></div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary btn-pdf-cancel">
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary btn-pdf-confirm">
                <span class="btn-icon">📄</span>
                <span>Descargar PDF</span>
              </button>
            </div>
          </form>
        </div>
      `;

      const inputElement = overlay.querySelector('#pdf-reservation-holder') as HTMLInputElement;
      const errorElement = overlay.querySelector('#pdf-modal-error') as HTMLElement;
      const form = overlay.querySelector('.export-pdf-form') as HTMLFormElement;
      const closeBtn = overlay.querySelector('.btn-close-modal');
      const cancelBtn = overlay.querySelector('.btn-pdf-cancel');

      const cleanup = (result: string | null) => {
        document.removeEventListener('keydown', handleKeyDown);
        overlay.remove();
        resolve(result);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cleanup(null);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      inputElement.addEventListener('input', () => {
        errorElement.textContent = '';
        errorElement.classList.remove('visible');
      });

      cancelBtn?.addEventListener('click', () => cleanup(null));
      closeBtn?.addEventListener('click', () => cleanup(null));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup(null);
        }
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = inputElement.value.trim();
        if (!value) {
          errorElement.textContent = 'Por favor, introduce el nombre del titular de la reserva.';
          errorElement.classList.add('visible');
          inputElement.focus();
          return;
        }
        cleanup(value);
      });

      document.body.appendChild(overlay);
      inputElement.focus();
    });
  }
}
