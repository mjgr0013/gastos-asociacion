# Implementation Plan: Nombres Únicos y Formateo con Mayúscula para Jugadores

**Branch**: `009-unique-player-names` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/009-unique-player-names/spec.md`

## Summary

Garantizar que todos los participantes registrados en la sesión comiencen con su primera letra en mayúscula (mediante la función de dominio `formatParticipantName`) y que no puedan existir nombres duplicados en la mesa (mediante validación case-insensitive e insensible a espacios en blanco en `validateParticipantName` y `SessionStore.addParticipant`). En la interfaz de usuario, `ParticipantFormComponent` mostrará el error en línea cuando se intente introducir un duplicado y limpiará el mensaje cuando el usuario comience a escribir o introduzca un valor válido.

## Technical Context

**Language/Version**: TypeScript 5.x / JavaScript ES2022+ (ejecución nativa en navegador)

**Primary Dependencies**: Vanilla DOM API, sin librerías externas adicionales

**Storage**: Esquema de persistencia en `localStorage` intacto (`Participant` con `name: string`). Los nombres se guardan ya capitalizados y limpios.

**Testing**: Vitest (`npm test`) para pruebas unitarias de validación, store y componentes

**Target Platform**: Navegadores web modernos (móvil y escritorio)

**Project Type**: Single Page Application (SPA estática para GitHub Pages)

**Performance Goals**: Validación y formateo instantáneo (<5ms por comprobación)

**Constraints**: Retrocompatibilidad con nombres existentes en persistencia local; experiencia de adición rápida en móvil

**Scale/Scope**: Módulos `src/domain/validation.ts`, `src/storage/store.ts`, `src/ui/components/participant-form.ts` y sus suites de pruebas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | Validación y formateo 100% en cliente sin dependencias externas. |
| **2. Tecnologías Autorizadas** | **PASA** | TypeScript, manipulación estándar de strings y DOM accesible. |
| **3. Persistencia en `localStorage`** | **PASA** | Almacena el nombre normalizado sin romper el esquema existente de `Participant`. |
| **4. Compatibilidad GitHub Pages** | **PASA** | 100% estático y compatible con el empaquetado de Vite. |
| **5. Modularidad y Calidad** | **PASA** | La lógica de validación y formateo reside en `src/domain/validation.ts`, desacoplada de la UI. |
| **6. Diseño Responsive Móvil** | **PASA** | Entrada de datos fluida en teclado móvil con capitalización automática. |
| **7. Flujo SDD Spec Kit** | **PASA** | Ciclo estricto `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/009-unique-player-names/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación y decisiones técnicas (Fase 0)
├── data-model.md        # Entidades e invariantes de unicidad (Fase 1)
├── quickstart.md        # Guía de validación y pruebas (Fase 1)
├── contracts/
│   └── player-names-contract.md # Contratos de validación, store y UI
└── checklists/
    └── requirements.md  # Checklist de calidad de especificación
```

### Source Code Touched / Added

```text
src/
├── domain/
│   └── validation.ts             # formatParticipantName, isDuplicateParticipantName, validateParticipantName
├── storage/
│   └── store.ts                  # Integración de validación de duplicados y formateo en addParticipant
└── ui/
    └── components/
        └── participant-form.ts   # Manejo de error de duplicado, foco y evento input

tests/
└── unit/
    ├── validation.test.ts        # Pruebas de formateo y detección de duplicados
    └── store.test.ts             # Pruebas de rechazo de duplicados en SessionStore
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
