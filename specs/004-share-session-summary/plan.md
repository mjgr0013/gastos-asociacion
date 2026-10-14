# Implementation Plan: Compartir Resumen de Cuenta por WhatsApp o Portapapeles

**Branch**: `004-share-session-summary` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/004-share-session-summary/spec.md`

## Summary

Implementar la capacidad de generar y compartir el resumen formateado de la cuenta de la partida. La funcionalidad añade un botón "Compartir" en la cabecera fija de la aplicación que utiliza la Web Share API en dispositivos móviles para enviar directamente el desglose a WhatsApp/Telegram, o la Clipboard API con notificación flotante (toast) en ordenadores y entornos sin menú nativo. El formato incluye fecha, lista de jugadores con consumiciones e importes, y el total acumulado de la mesa.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Web Share API (`navigator.share`), Clipboard API (`navigator.clipboard.writeText`), Vanilla DOM API

**Storage**: Sin impacto en el esquema de persistencia en `localStorage` (operación puramente de presentación y compartición en memoria)

**Testing**: Vitest (`npm test`) para pruebas de formateo de texto y validación de build estático (`npm run build`)

**Target Platform**: Navegadores web modernos (Chrome, Safari, Firefox, Edge) en móvil y escritorio

**Project Type**: Single Page Application (SPA estática para GitHub Pages)

**Performance Goals**: Generación y compartición en <3s; visualización de toast accesible en <50ms

**Constraints**: Manejo seguro de `AbortError` (cancelación de compartir) y fallback ante permisos de portapapeles

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Utiliza APIs nativas del navegador del cliente (`navigator.share` y `navigator.clipboard`), sin backend. |
| **2. Tecnologías Autorizadas** | **PASA** | TypeScript, HTML5 y Vanilla CSS con custom properties. |
| **3. Persistencia en `localStorage`** | **PASA** | La persistencia de datos de negocio no se altera. |
| **4. Compatibilidad GitHub Pages** | **PASA** | Totalmente compatible y portable en `dist/`. |
| **5. Modularidad y Separación** | **PASA** | La función de formateo (`src/domain/sharing.ts`) está desacoplada del DOM y del servicio de UI (`src/ui/components/toast.ts`). |
| **6. Diseño Responsive Móvil** | **PASA** | Botón integrado en la barra fija superior de fácil acceso con una sola mano. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento del ciclo de Spec Kit. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/004-share-session-summary/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Modelo de payload y resultado de compartición (Fase 1)
├── quickstart.md        # Guía de validación y escenarios E2E (Fase 1)
├── contracts/
│   └── sharing-contract.md # Contratos de formateo, servicio y UI
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
├── domain/
│   └── sharing.ts             # Generación pura del texto formateado para mensajería
├── ui/
│   ├── components/
│   │   ├── header-summary.ts  # Botón de compartir y estado de habilitación
│   │   └── toast.ts           # Notificación flotante accesible de éxito de copia
│   ├── app-view.ts            # Coordinación del evento compartir y despacho de toast
│   └── styles/
│       └── components.css     # Estilos del botón de compartir y componente toast
tests/
└── unit/
    └── sharing.test.ts        # Pruebas unitarias del formateo de texto de la cuenta
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
