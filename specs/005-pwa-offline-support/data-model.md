# Data Model: Manifiesto PWA y Almacén de Caché

**Feature**: `005-pwa-offline-support`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Estructura del Manifiesto Web App (`manifest.webmanifest`)

```json
{
  "name": "Gastos de Mesa - Boardgame Expenses",
  "short_name": "GastosMesa",
  "description": "Control de gastos de consumiciones en sesiones de juegos de mesa",
  "start_url": "./",
  "scope": "./",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#f8fafc",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "./icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "./icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any"
    }
  ]
}
```

---

## 2. Almacén de Caché del Service Worker (`CacheStorage`)

- **Nombre de Caché**: `bg_expenses_cache_v1`
- **Activos Precargados**:
  - Shell: `./`, `./index.html`, `./manifest.webmanifest`
  - Iconos: `./icons/icon.svg`, `./icons/icon-192.png`, `./icons/icon-512.png`
  - Activos dinámicos: peticiones a `assets/*.js` y `assets/*.css` cacheadas en `fetch`.
