# Implementation Plan: Exportar Cuenta de la Sesión a PDF

**Branch**: `010-export-session-pdf` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/010-export-session-pdf/spec.md`

## Summary

Implementar la exportación de la cuenta de la sesión a un archivo PDF descargable en el navegador del cliente. La funcionalidad añade un botón "Exportar PDF" en la barra de cabecera que abre un diálogo modal solicitando el nombre de la persona que reservó la sala. Al confirmar, un generador nativo y ligero de PDF en TypeScript (`src/domain/pdf-export.ts`) crea un documento estándar A4 con la fecha y hora actual, el titular de la reserva, el desglose pormenorizado de consumiciones y subtotales por jugador, y el total acumulado de la mesa, disparando la descarga directa del archivo sin dependencias de servidor ni librerías externas pesadas.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Vanilla DOM API, generador nativo de PDF en TypeScript conforme a la norma PDF 1.4, sin librerías externas

**Storage**: Sin alteraciones en `localStorage` (la exportación se calcula en memoria a partir del estado de los participantes)

**Testing**: Vitest (`npm test`) para pruebas unitarias de generación de buffer PDF y componentes

**Target Platform**: Navegadores web modernos (móvil y escritorio) en despliegue estático de GitHub Pages

**Project Type**: Single Page Application (SPA estática)

**Performance Goals**: Generación y disparo de descarga del PDF en menos de 100ms para sesiones de hasta 30 participantes

**Constraints**: Ejecución 100% cliente sin llamadas de red ni backend; documento PDF estándar legible en visores nativos de móvil y escritorio

**Scale/Scope**: Módulos `src/domain/pdf-export.ts`, `src/utils/download.ts`, `src/ui/components/export-pdf-modal.ts`, `src/ui/components/header-summary.ts`, `src/ui/app-view.ts` y pruebas unitarias

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | La generación del binario PDF y su descarga se realizan íntegramente en el navegador del cliente sin backend. |
| **2. Tecnologías Autorizadas** | **PASA** | TypeScript, manipulación de Blobs nativos de JavaScript y CSS accesible. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el esquema de persistencia ni guarda estados efímeros de descarga. |
| **4. Compatibilidad GitHub Pages** | **PASA** | 100% estático y compatible con el bundle compilado de Vite. |
| **5. Modularidad y Calidad** | **PASA** | Generador de PDF desacoplado en la capa de dominio (`src/domain/pdf-export.ts`) y UI modal separada en `src/ui/components/export-pdf-modal.ts`. |
| **6. Diseño Responsive Móvil** | **PASA** | Modal responsive adaptado a pantallas táctiles y descarga directa compatible con iOS/Android. |
| **7. Flujo SDD Spec Kit** | **PASA** | Ciclo riguroso `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/010-export-session-pdf/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones de generación PDF (Fase 0)
├── data-model.md        # Estructuras de datos de exportación y reglas (Fase 1)
├── quickstart.md        # Guía de validación y pruebas (Fase 1)
├── contracts/
│   └── pdf-export-contract.md # Contratos de dominio, descarga y componentes UI
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
├── domain/
│   └── pdf-export.ts            # Generación pura del archivo binario PDF (PDF 1.4 estándar)
├── utils/
│   └── download.ts              # Utilidad universal de descarga de Blobs
├── ui/
│   ├── components/
│   │   ├── export-pdf-modal.ts  # Modal para capturar el nombre de la reserva con validación
│   │   └── header-summary.ts    # Botón "Exportar PDF" y gestión de estado habilitado/deshabilitado
│   ├── app-view.ts              # Coordinación de evento de exportar, modal y descarga
│   └── styles/
│       └── components.css       # Estilos para el botón de PDF y modal de reserva
tests/
└── unit/
    └── pdf-export.test.ts       # Pruebas unitarias de estructura, contenido y totales en el PDF
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
