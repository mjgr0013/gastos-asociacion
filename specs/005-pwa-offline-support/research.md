# Technical Research: Soporte de Progressive Web App (PWA) e Instalación Offline

**Feature**: `005-pwa-offline-support`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Estrategia de Implementación PWA (Nativo vs. `vite-plugin-pwa`)

### Decisión
Implementar el Service Worker (`public/sw.js`) y el manifiesto (`public/manifest.webmanifest`) de forma **nativa** sin dependencias ni plugins externos pesados (como Workbox).

### Justificación
- **Alineación con la Constitución**: Mantiene la arquitectura limpia, minimalista y con cero dependencias innecesarias en runtime o build.
- **Transparencia y Control Total**: La lógica de precaching, interceptación de `fetch`, `skipWaiting()` y limpieza de cachés antiguas se gestiona directamente en código claro y mantenible (<80 líneas).
- **Compatibilidad con GitHub Pages**: Las rutas relativas (`./`) se resuelven de forma determinista sin colisiones con subdirectorios de repositorios de GitHub.

### Alternativas Consideradas
- **`vite-plugin-pwa`**: Añade dependencias de Workbox y abstracciones complejas innecesarias para una aplicación estática de una sola página.

---

## 2. Estrategia de Caché y Actualización Inmediata (Clarificación C)

### Decisión
- **Caché Versionada**: Clave `bg_expenses_cache_v1`.
- **Estrategia Cache-First con Fallback a Red**: Los activos estáticos (`./`, `index.html`, CSS, JS, iconos) se sirven instantáneamente desde la caché local.
- **Actualización Inmediata**: En el evento `install` del Service Worker se invoca `self.skipWaiting()`. En el cliente (`src/main.ts`), el evento `controllerchange` refresca automáticamente la aplicación para aplicar la nueva versión de inmediato, preservando intactos los datos en `localStorage`.
- **Activación y Limpieza**: En el evento `activate` se eliminan todas las cachés cuyo nombre no coincida con la versión actual.

---

## 3. Especificación de Web App Manifest e Iconos

### Decisión
Declarar `public/manifest.webmanifest` con los campos estándar de instalabilidad:
- `name`: "Gastos de Mesa - Boardgame Expenses"
- `short_name`: "GastosMesa"
- `start_url`: "./"
- `scope`: "./"
- `display`: "standalone"
- `theme_color`: "#2563eb"
- `background_color`: "#f8fafc"
- Iconos: SVG vectorial para escalabilidad infinita + PNGs (192x192 y 512x512) con soporte adaptable (`any maskable`).

---

## 4. Metatags y Optimización para iOS Safari

### Decisión
Añadir en `index.html` los metatags propietarios de Apple para una experiencia nativa fluida en iPhone/iPad:
- `<link rel="apple-touch-icon" href="./icons/icon-192.png">`
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="default">`
- `<meta name="apple-mobile-web-app-title" content="GastosMesa">`
