import { LocalStorageAdapter } from './storage/local-storage';
import { SessionStore } from './storage/store';
import { AppView } from './ui/app-view';

function initApp(): void {
  const mountPoint = document.getElementById('app');
  if (!mountPoint) {
    console.error('No se encontró el elemento contenedor #app en el DOM.');
    return;
  }

  const storage = new LocalStorageAdapter();
  const store = new SessionStore(storage);
  new AppView(mountPoint, store);

  // Registro del Service Worker para PWA y soporte offline
  registerServiceWorker();
}

function registerServiceWorker(): void {
  if (
    'serviceWorker' in navigator &&
    (window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                // Actualizado
              });
            }
          });
        })
        .catch((err) => {
          console.warn('Registro de Service Worker no completado:', err);
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
