# Contracts: PWA & Service Worker Interface

**Feature**: `005-pwa-offline-support`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Registro del Service Worker (`src/main.ts`)

```typescript
export function registerServiceWorker(): void;
```
- Registra `sw.js` con scope relativo `./`.
- Escucha el evento `controllerchange` para recargar la página automáticamente cuando un nuevo Service Worker toma el control (`skipWaiting()`), cumpliendo con la clarificación C.

---

## 2. Contrato de Ciclo de Vida del Service Worker (`public/sw.js`)

- **`install`**: Precarga la lista de URLs base y llama a `self.skipWaiting()`.
- **`activate`**: Llama a `clients.claim()` y elimina las cachés de versiones antiguas.
- **`fetch`**: Estrategia Cache-First para recursos estáticos con fallback a la red. Si la red no está disponible, sirve el recurso desde la caché local sin errores.
