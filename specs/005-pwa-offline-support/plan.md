# Implementation Plan: Soporte de Progressive Web App (PWA) e Instalación Offline

**Branch**: `005-pwa-offline-support` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/005-pwa-offline-support/spec.md`

## Summary

Convertir la aplicación en una Progressive Web App (PWA) instalable y 100% operativa sin conexión a internet. La implementación incluye:
- Manifiesto de aplicación web (`public/manifest.webmanifest`) con metadatos de instalación standalone.
- Iconos SVG y PNG adaptables (192x192 y 512x512) para Android, iOS y escritorio.
- Service Worker nativo (`public/sw.js`) con estrategia Cache-First para recursos estáticos y actualización inmediata con `skipWaiting()`.
- Metatags específicos para iOS Safari en `index.html`.
- Registro del Service Worker y auto-refresco en `src/main.ts`.

## Technical Context

**Language/Version**: JavaScript (Service Worker API), TypeScript 5.x / HTML5

**Primary Dependencies**: Service Worker API nativo, CacheStorage API nativo, Web App Manifest (cero dependencias externas)

**Storage**: CacheStorage del navegador (`bg_expenses_cache_v1`) para activos estáticos; `localStorage` para datos de la partida

**Testing**: Vitest (`npm test`) y validación de build estático (`npm run build`)

**Target Platform**: Navegadores móviles (Android Chrome, iOS Safari) y de escritorio (Chrome, Edge)

**Project Type**: Progressive Web Application (PWA estática para GitHub Pages)

**Performance Goals**: Carga offline interactiva en <1s; tamaño de caché offline <2MB

**Constraints**: Rutas relativas (`./`) para portabilidad en subdirectorios de GitHub Pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | El Service Worker y el manifiesto son estáticos y operan íntegramente en el navegador del cliente. |
| **2. Tecnologías Autorizadas** | **PASA** | Estándares web nativos (HTML5, Service Worker, Manifest, SVG/PNG). |
| **3. Persistencia en `localStorage`** | **PASA** | Los datos de la sesión se preservan intactos durante la operativa offline y recargas. |
| **4. Compatibilidad GitHub Pages** | **PASA** | Rutas relativas `./` compatibles con cualquier subdominio/subdirectorio. |
| **5. Modularidad y Separación** | **PASA** | El Service Worker es independiente del código de la aplicación. |
| **6. Diseño Responsive Móvil** | **PASA** | Eleva la experiencia en dispositivos móviles a nivel de aplicación nativa. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento del ciclo de Spec Kit. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/005-pwa-offline-support/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Manifiesto y estructura de caché (Fase 1)
├── quickstart.md        # Guía de validación y escenarios E2E (Fase 1)
├── contracts/
│   └── pwa-contract.md  # Contratos de manifiesto y Service Worker
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
public/
├── manifest.webmanifest # Manifiesto de la aplicación PWA
├── sw.js                # Service Worker para caché offline y skipWaiting
└── icons/
    ├── icon.svg         # Icono vectorial de dado lúdico
    ├── icon-192.png     # Icono rasterizado 192x192 adaptable
    └── icon-512.png     # Icono rasterizado 512x512 adaptable
index.html               # Enlace a manifest, meta theme-color y tags iOS Safari
src/
└── main.ts              # Registro de sw.js y escucha de controllerchange
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
