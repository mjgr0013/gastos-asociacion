# Implementation Plan: Desplegado y Colapsado de Consumiciones por Participante

**Branch**: `002-collapsible-participant-items` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-collapsible-participant-items/spec.md`

## Summary

Implementar la capacidad de alternar (colapsar y expandir) el bloque de consumiciones y catálogo rápido de cada participante de forma individual. Esta mejora permite reducir significativamente el scroll vertical en dispositivos móviles al jugar en mesa, manteniendo el nombre, el avatar, el recuento de consumiciones, el subtotal acumulado y el botón de eliminación siempre visibles y accesibles en la cabecera compacta de la tarjeta.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Vanilla DOM API, Vite, Vitest (cero frameworks en tiempo de ejecución)

**Storage**: No requiere mutaciones en `localStorage`; el estado de despliegue se gestiona como `UI View State` en memoria durante la sesión activa

**Testing**: Vitest para pruebas de lógica y componentes; comprobación de compilación con TypeScript

**Target Platform**: Navegadores web modernos (Chrome, Safari, Firefox, Edge) en dispositivos móviles y de escritorio

**Project Type**: Single Page Application (SPA estática para GitHub Pages)

**Performance Goals**: Alternancia de colapso en <50ms; reducción de altura visible en smartphone >60%

**Constraints**: Accesibilidad WAI-ARIA (`aria-expanded`, `aria-controls`), soporte de navegación por teclado, sin desbordamiento horizontal a 360px

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Funcionalidad puramente de presentación cliente en TypeScript y CSS. |
| **2. Tecnologías Autorizadas** | **PASA** | TypeScript, HTML5 y Vanilla CSS con custom properties. |
| **3. Persistencia en `localStorage`** | **PASA** | La persistencia de datos de negocio de consumiciones permanece intacta y compatible. |
| **4. Compatibilidad GitHub Pages** | **PASA** | Cero dependencias server-side, 100% estático. |
| **5. Modularidad y Separación** | **PASA** | El estado de colapso es UI View State desacoplado de las entidades de dominio. |
| **6. Diseño Responsive Móvil** | **PASA** | Optimiza expresamente la experiencia en móviles reduciendo el scroll vertical. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento del ciclo de Spec Kit. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/002-collapsible-participant-items/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Modelado de UI View State (Fase 1)
├── quickstart.md        # Guía de validación y escenarios E2E (Fase 1)
├── contracts/
│   └── ui-card-contract.md # Contrato de opciones y ARIA de la tarjeta
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
├── ui/
│   ├── components/
│   │   └── participant-card.ts # Soporte para colapso, chevron y eventos de alternancia
│   ├── app-view.ts             # Gestión del conjunto de IDs colapsados y coordinación
│   └── styles/
│       └── components.css      # Reglas CSS para .participant-card.is-collapsed y chevron
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
