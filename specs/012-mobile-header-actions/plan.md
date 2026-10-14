# Implementation Plan: Agrupación de Acciones de Cabecera en Dispositivos Móviles

**Branch**: `012-mobile-header-actions` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/012-mobile-header-actions/spec.md`

## Summary

Optimizar la presentación de la cabecera fija de la aplicación en dispositivos móviles (< 680px) agrupando los tres botones de acción ("Compartir", "Exportar PDF" y "Reiniciar") en un único botón desplegable de acciones accesible ("Acciones ▾"). Al pulsarlo, se desplegará un menú flotante con las tres opciones, con cierre automático al seleccionar una acción, al hacer clic exterior o presionar Escape. En pantallas grandes (>= 680px), las tres acciones continuarán mostrándose de forma expandida en línea.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Vanilla DOM API, CSS Moderno con Custom Properties y Media Queries

**Storage**: Sin alteraciones en `localStorage` (el estado abierto/cerrado del menú es puramente efímero en UI)

**Testing**: Vitest (`npm test` / `npm run test:coverage`)

**Target Platform**: Navegadores web modernos (móvil y escritorio) en despliegue estático de GitHub Pages

**Project Type**: Single Page Application (SPA estática)

**Performance Goals**: Apertura y cierre del menú instantáneos (< 16ms, 60fps), 0 saltos de layout o desbordamiento horizontal

**Constraints**: Accesibilidad WAI-ARIA (`aria-haspopup`, `aria-expanded`, `role="menu"`, `role="menuitem"`), áreas táctiles >= 44px

**Scale/Scope**: Archivos `src/ui/components/header-summary.ts`, `src/ui/styles/components.css`, `src/ui/styles/layout.css`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Lógica y estilos 100% cliente sin dependencias ni llamadas de red. |
| **2. Tecnologías Autorizadas** | **PASA** | HTML5 semántico, CSS moderno y TypeScript modular. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el esquema de almacenamiento de la sesión. |
| **4. Compatibilidad GitHub Pages** | **PASA** | 100% estático y compatible con el empaquetado de producción de Vite. |
| **5. Modularidad y Calidad** | **PASA** | Componente `HeaderSummaryComponent` encapsula la lógica del menú móvil sin acoplarse indebidamente. |
| **6. Diseño Responsive Móvil** | **PASA** | Resuelve directamente la saturación visual en pantallas móviles, garantizando objetivos táctiles >= 44px. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento riguroso del ciclo `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/012-mobile-header-actions/
├── plan.md              # Este plan de implementación
├── research.md          # Decisiones de diseño y accesibilidad del menú móvil (Fase 0)
├── data-model.md        # Estado del menú de cabecera e invariantes de interacción (Fase 1)
├── quickstart.md        # Guía de verificación manual y responsiva (Fase 1)
├── contracts/
│   └── header-actions-contract.md # Contratos del componente y estructura DOM
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
└── ui/
    ├── components/
    │   └── header-summary.ts  # Soporte de menú móvil desplegable y callbacks de acciones
    └── styles/
        ├── components.css     # Estilos del botón agrupador, dropdown y menú de acciones
        └── layout.css         # Breakpoint responsive (móvil agrupado vs escritorio en línea)
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
