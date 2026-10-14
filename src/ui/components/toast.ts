export class ToastComponent {
  private static activeTimeout: number | null = null;
  private static toastElement: HTMLElement | null = null;

  public static show(message: string, durationMs: number = 3000): void {
    if (!this.toastElement) {
      this.toastElement = document.createElement('div');
      this.toastElement.className = 'toast-notification';
      this.toastElement.setAttribute('role', 'status');
      this.toastElement.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.toastElement);
    }

    if (this.activeTimeout !== null) {
      clearTimeout(this.activeTimeout);
      this.activeTimeout = null;
    }

    this.toastElement.textContent = message;
    this.toastElement.classList.add('is-visible');

    this.activeTimeout = window.setTimeout(() => {
      this.toastElement?.classList.remove('is-visible');
      this.activeTimeout = null;
    }, durationMs);
  }
}
