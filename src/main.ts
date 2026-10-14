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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
