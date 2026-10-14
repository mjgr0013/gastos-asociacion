export interface ConfirmDialogOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export class ConfirmDialogComponent {
  public static show(options: ConfirmDialogOptions): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'alertdialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'confirm-dialog-title');

      const confirmBtnClass = options.isDanger ? 'btn-danger' : 'btn-primary';

      overlay.innerHTML = `
        <div class="modal-card modal-confirm-card">
          <div class="modal-header">
            <h2 id="confirm-dialog-title" class="modal-title">${escapeHtml(options.title)}</h2>
          </div>
          <div class="modal-body">
            <p class="confirm-message">${escapeHtml(options.message)}</p>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary btn-confirm-cancel">
              ${escapeHtml(options.cancelText || 'Cancelar')}
            </button>
            <button type="button" class="btn ${confirmBtnClass} btn-confirm-accept">
              ${escapeHtml(options.confirmText || 'Confirmar')}
            </button>
          </div>
        </div>
      `;

      const cleanup = (result: boolean) => {
        document.removeEventListener('keydown', handleKeyDown);
        overlay.remove();
        resolve(result);
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          cleanup(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      const cancelBtn = overlay.querySelector('.btn-confirm-cancel');
      cancelBtn?.addEventListener('click', () => cleanup(false));

      const acceptBtn = overlay.querySelector('.btn-confirm-accept') as HTMLButtonElement;
      acceptBtn?.addEventListener('click', () => cleanup(true));

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup(false);
        }
      });

      document.body.appendChild(overlay);
      acceptBtn?.focus();
    });
  }
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
