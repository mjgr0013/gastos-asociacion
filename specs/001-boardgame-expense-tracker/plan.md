# Implementation Plan: Control de Gastos de Consumiciones (Boardgame Expenses)

**Branch**: `001-boardgame-expense-tracker` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-boardgame-expense-tracker/spec.md`

## Summary

Implementar una aplicación web cliente pura (SPA estática) construida con **Vite + TypeScript + Vanilla CSS**, diseñada específicamente para registrar consumiciones y calcular gastos en sesiones de juegos de mesa. La solución ofrece:
- Gestión ágil de participantes y consumiciones con doble modalidad (catálogo rápido con botones de un toque y formulario libre).
- Cálculo en tiempo real (<100ms) de subtotales por persona y del importe total acumulado de la mesa.
- Persistencia automática atómica en `localStorage` del navegador ante recargas de pestaña.
- Flujo de reinicio seguro de sesión con diálogo de confirmación obligatoria.
- Despliegue estático autónomo para GitHub Pages sin requerir backend ni base de datos externa.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Vite (herramienta de bundling y desarrollo local), Vanilla DOM API (cero frameworks en runtime como React/Vue)

**Storage**: `localStorage` del navegador bajo la clave `bg_expense_session_v1` (con degradación elegante a memoria volátil ante cuota excedida o bloqueo de storage)

**Testing**: Vitest para pruebas unitarias automatizadas de la capa de dominio, cálculos monetarios y persistencia

**Target Platform**: Navegadores web modernos (Chrome, Safari, Firefox, Edge) en dispositivos móviles y de escritorio

**Project Type**: Single Page Application (SPA estática optimizada para GitHub Pages)

**Performance Goals**: Recálculo en tiempo real en <100ms; tiempo de carga interactiva en <1s en conexiones móviles

**Constraints**: Cero dependencias de backend, funcionamiento 100% offline-first en cliente, diseño responsive sin scroll horizontal (mínimo 360px), objetivos táctiles mínimos de 44x44px

**Scale/Scope**: Sesión típica de juegos de mesa (1 mesa, 2-15 participantes, decenas de consumiciones por velada)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | La aplicación se compila a un bundle estático (`dist/`) con HTML, CSS y JS puro, sin APIs server-side. |
| **2. Tecnologías Autorizadas** | **PASA** | Se emplea TypeScript moderno, HTML5 y Vanilla CSS con custom properties. |
| **3. Persistencia en `localStorage`** | **PASA** | Todo el estado se sincroniza síncronamente con `localStorage` del navegador. |
| **4. Compatibilidad GitHub Pages** | **PASA** | Configuración `base: './'` en Vite para garantizar portabilidad en subrutas de GitHub Pages. |
| **5. Modularidad y Separación** | **PASA** | Capa de negocio (`src/domain/`, `src/storage/`) totalmente desacoplada de la capa visual (`src/ui/`). |
| **6. Diseño Responsive Móvil** | **PASA** | Enfoque Mobile-First con controles táctiles optimizados para manejo con una sola mano. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento estricto del ciclo: `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/001-boardgame-expense-tracker/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Modelado de entidades y validación (Fase 1)
├── quickstart.md        # Guía de validación y escenarios E2E (Fase 1)
├── contracts/           # Contratos de interfaces y esquemas (Fase 1)
│   ├── store-contract.md
│   └── storage-schema.json
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code (repository root)

```text
index.html                     # Punto de entrada HTML estático con meta viewport móvil
package.json                   # Scripts (dev, build, test, preview) y dependencias dev
tsconfig.json                  # Configuración estricta de TypeScript
vite.config.ts                 # Configuración de Vite con base relativa para GitHub Pages

src/
├── domain/
│   ├── models.ts              # Interfaces de datos (Participant, ConsumptionItem, SessionState)
│   ├── calculations.ts        # Cálculo de subtotales, totales y redondeo de céntimos en €
│   └── validation.ts          # Validación de nombres, importes mayores a cero y cantidades
├── storage/
│   ├── local-storage.ts       # Adaptador de lectura/escritura en localStorage con fallback
│   └── store.ts               # SessionStore observable con despacho de eventos y mutaciones
├── ui/
│   ├── styles/
│   │   ├── variables.css      # Design tokens (paleta lúdica de alto contraste, tipografía, espacios)
│   │   ├── layout.css         # Cuadrícula responsive y barra fija de resumen
│   │   └── components.css     # Estilos de tarjetas, chips de catálogo, formularios y modales
│   ├── components/
│   │   ├── header-summary.ts  # Componente de total global y botón de reinicio
│   │   ├── participant-form.ts# Componente de alta de participante
│   │   ├── participant-card.ts# Tarjeta individual con desglose y total personal
│   │   ├── quick-catalog.ts   # Botones de un toque para productos habituales
│   │   ├── consumption-form.ts# Formulario para consumición personalizada libre
│   │   └── confirm-dialog.ts  # Modal accesible de confirmación (reinicio / borrado)
│   └── app-view.ts            # Controlador principal que conecta SessionStore con el DOM
└── main.ts                    # Bootstrap e inicialización de la aplicación

tests/
├── unit/
│   ├── calculations.test.ts   # Validación de precisión decimal y sumatorios
│   ├── validation.test.ts     # Validación de entradas erróneas y límites
│   └── store.test.ts          # Comprobación de altas, bajas y suscripciones
└── integration/
    └── storage.test.ts        # Comprobación de persistencia y restauración ante recargas
```

**Structure Decision**: Estructura de proyecto web cliente modular único en la raíz del repositorio, agrupando la lógica de dominio en `src/domain/`, la persistencia en `src/storage/`, los controladores visuales desacoplados en `src/ui/` y las pruebas automáticas en `tests/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No se registran violaciones a la constitución ni complejidades injustificadas. La arquitectura es 100% estática, desacoplada y orientada a cliente.*
