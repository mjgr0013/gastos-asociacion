# Implementation Plan: Ejecución de Pruebas con Análisis y Reporte de Cobertura

**Branch**: `011-test-coverage-report` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/011-test-coverage-report/spec.md`

## Summary

Configurar el soporte oficial de análisis de cobertura de código en la suite de pruebas del proyecto con Vitest y `@vitest/coverage-v8`. Se añadirá la dependencia de desarrollo `@vitest/coverage-v8`, se configurará la sección `test.coverage` en `vite.config.ts` para generar reportes en consola (`text`) y reporte interactivo en HTML (`coverage/`), se agregará el script `"test:coverage": "vitest run --coverage"` en `package.json`, y se documentará su uso en el `README.md`.

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 26+

**Primary Dependencies**: Vitest (`vitest@^1.6.0`), `@vitest/coverage-v8@^1.6.0` en `devDependencies`

**Storage**: No aplica (herramienta de desarrollo y testing)

**Testing**: Vitest (`npm run test:coverage`)

**Target Platform**: Entorno de desarrollo local (CLI) y pipelines de CI

**Project Type**: Herramientas de calidad y pruebas para Single Page Application

**Performance Goals**: Ejecución y recolección de cobertura completa en menos de 5 segundos

**Constraints**: Alcance restringido a `src/**/*.ts`, excluyendo tests y configs; salida de `coverage/` ignorada por Git

**Scale/Scope**: Archivos `package.json`, `vite.config.ts`, `README.md` y `.gitignore`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | La cobertura es una herramienta de testing en tiempo de compilación/desarrollo; la SPA estática generada en `dist/` no se altera. |
| **2. Tecnologías Autorizadas** | **PASA** | Utiliza Vitest y el proveedor V8 oficial del ecosistema Node/TypeScript. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el almacenamiento de la aplicación cliente. |
| **4. Compatibilidad GitHub Pages** | **PASA** | `npm run build` sigue produciendo la SPA 100% estática en `dist/`. |
| **5. Modularidad y Calidad** | **PASA** | Proporciona visibilidad objetiva de la calidad y cobertura de pruebas de los módulos de dominio y UI. |
| **6. Diseño Responsive Móvil** | **PASA** | No afecta negativamente a la interfaz de usuario. |
| **7. Flujo SDD Spec Kit** | **PASA** | Ciclo riguroso `spec.md` -> `plan.md` -> `tasks.md` -> `implement`. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/011-test-coverage-report/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación y decisiones de proveedor de cobertura (Fase 0)
├── data-model.md        # Estructura de configuración y métricas de cobertura (Fase 1)
├── quickstart.md        # Guía de ejecución y validación de reportes (Fase 1)
├── contracts/
│   └── coverage-contract.md # Contratos de scripts en package.json y configuración en vite.config.ts
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
package.json             # Inclusión de @vitest/coverage-v8 y script "test:coverage"
vite.config.ts           # Configuración de cobertura (proveedor, reporteros, include/exclude)
README.md                # Documentación del comando de cobertura
.gitignore               # Verificación de exclusión de coverage/
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
