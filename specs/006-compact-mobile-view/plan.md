# Implementation Plan: Vista Móvil Compacta y Densidad Visual de Consumiciones

**Branch**: `006-compact-mobile-view` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/006-compact-mobile-view/spec.md`

## Summary

Optimizar la densidad visual y la ergonomía de la interfaz en pantallas móviles para que 10 consumiciones no saturen la pantalla. La solución incluye:
- Rediseño de la fila de consumición a un formato horizontal continuo de una sola línea (`Nombre · Precio`) con altura reducida a ~36px.
- Contenedor de catálogo rápido en una sola fila con desplazamiento horizontal táctil (`overflow-x: auto`), reduciendo la altura de 3 líneas a 34px fijos.
- Altura máxima acotada (`max-height: 280px`) con scroll vertical interno en listas de más de 5-6 productos por participante.
- Truncado inteligente con puntos suspensivos en nombres largos.
- Ajuste de paddings y márgenes globales en móvil en `layout.css` y `components.css`.

## Technical Context

**Language/Version**: CSS3 (Modern Flexbox, CSS Grid, Custom Properties), TypeScript 5.x / HTML5

**Primary Dependencies**: Vanilla DOM API, Vite, Vitest (cero frameworks adicionales)

**Storage**: Sin impacto en almacenamiento local

**Testing**: Vitest (`npm test`) y validación de compilación (`npm run build`)

**Target Platform**: Navegadores móviles (pantallas desde 360px a 430px de ancho) y adaptación a escritorio

**Project Type**: Single Page Application (SPA estática para GitHub Pages)

**Performance Goals**: Reducción de altura vertical >40%; 0px de desbordamiento horizontal global

**Constraints**: Preservar áreas táctiles de pulsación para controles de cantidad y borrado

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Ajustes puramente visuales y de presentación en CSS y maquetación DOM. |
| **2. Tecnologías Autorizadas** | **PASA** | HTML5, TypeScript y Vanilla CSS. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el modelo de datos financiero ni el almacenamiento local. |
| **4. Compatibilidad GitHub Pages** | **PASA** | 100% estático y portable. |
| **5. Modularidad y Separación** | **PASA** | Modificaciones concentradas en `src/ui/styles/` y `ParticipantCardComponent`. |
| **6. Diseño Responsive Móvil** | **PASA** | Atiende directamente la ergonomía y densidad en dispositivos móviles. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento estricto del ciclo de Spec Kit. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/006-compact-mobile-view/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Especificación de densidad y tokens visuales (Fase 1)
├── quickstart.md        # Guía de validación y escenarios E2E (Fase 1)
├── contracts/
│   └── compact-view-contract.md # Contrato de estructura DOM compacta
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
├── ui/
│   ├── components/
│   │   └── participant-card.ts # Maquetación compacta de fila (nombre y precio en 1 línea)
│   └── styles/
│       ├── layout.css          # Compactación de paddings en vista móvil
│       └── components.css      # Fila de ~36px, catálogo horizontal scroll y max-height
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
