# Implementation Plan: Resumen de Precios de Productos en la Cuenta Exportada

**Branch**: `008-export-product-prices` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/008-export-product-prices/spec.md`

## Summary

Incorporar en el texto generado al exportar/compartir la cuenta de la partida (`generateSessionShareText`) una sección resumen con los precios unitarios de todos los productos que hayan sido consumidos por al menos un participante con cantidad mayor que cero. La sección extrae y deduplica los productos consumidos, los ordena alfabéticamente en español con desempate por precio, los formatea uniformemente en euros (`• [Nombre]: [Precio] €`), y los ubica entre la lista de jugadores y el importe total de la mesa. Si ningún participante tiene consumiciones activas, la sección se omite limpiamente.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Intl API (`Intl.NumberFormat` para moneda y `String.prototype.localeCompare` para ordenación en español), sin librerías externas

**Storage**: Sin alteraciones en el esquema de almacenamiento en `localStorage` (operación puramente en memoria y presentación)

**Testing**: Vitest (`npm test` / `npm run test:run`) para pruebas unitarias de dominio y formateo de texto

**Target Platform**: Navegadores web modernos (móvil y escritorio) en despliegue estático

**Project Type**: Single Page Application (SPA estática para GitHub Pages)

**Performance Goals**: Extracción y formateo instantáneo (<50ms para partidas de hasta 50 participantes)

**Constraints**: Mantener total compatibilidad con clientes de mensajería (WhatsApp, Telegram) mediante texto plano estructurado y viñetas estándar

**Scale/Scope**: Función pura en `src/domain/sharing.ts` y suite de pruebas unitarias en `tests/unit/sharing.test.ts`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Lógica puramente cliente en TypeScript, sin llamadas a servidor ni APIs de terceros. |
| **2. Tecnologías Autorizadas** | **PASA** | TypeScript estándar con ES Modules, compatible con el bundle existente. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el esquema de datos persistido ni genera incompatibilidades hacia atrás. |
| **4. Compatibilidad GitHub Pages** | **PASA** | 100% estático y compatible con el build en `dist/`. |
| **5. Modularidad y Calidad** | **PASA** | Separación estricta: lógica pura en `src/domain/sharing.ts` totalmente desacoplada del DOM y de la UI. |
| **6. Diseño Responsive Móvil** | **PASA** | Formato de texto limpio y legible optimizado para pantallas estrechas y apps de mensajería móvil. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento estricto del ciclo `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/008-export-product-prices/
├── plan.md              # Este plan de implementación
├── research.md          # Decisiones de arquitectura y ordenación (Fase 0)
├── data-model.md        # Definición de entidad ConsumedProductPrice e invariantes (Fase 1)
├── quickstart.md        # Guía de validación y escenarios de prueba (Fase 1)
├── contracts/
│   └── export-product-prices-contract.md # Contratos de funciones de dominio
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
src/
└── domain/
    └── sharing.ts       # Extracción, ordenación y adición de la sección de precios al texto compartido

tests/
└── unit/
    └── sharing.test.ts  # Pruebas unitarias de extracción, deduplicación, ordenación y formateo
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
