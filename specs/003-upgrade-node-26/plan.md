# Implementation Plan: Actualización del Entorno de Ejecución a Node.js 26

**Branch**: `003-upgrade-node-26` | **Date**: 2026-10-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/003-upgrade-node-26/spec.md`

## Summary

Actualizar la configuración del proyecto y la documentación de desarrollo para establecer explícitamente el soporte de Node.js 26 (`>=26.0.0`). Esto incluye declarar el campo `engines` en `package.json`, añadir el archivo `.nvmrc` con la versión 26, verificar la ejecución de compilación y tests sin advertencias, y reflejar el requisito en `README.md`.

## Technical Context

**Language/Version**: Node.js 26.x (activo en el sistema: v26.11.1), TypeScript 5.x

**Primary Dependencies**: npm, Vite, Vitest

**Storage**: Sin impacto en almacenamiento local

**Testing**: Vitest (`npm test`) y validación de compilación TypeScript/Vite (`npm run build`)

**Target Platform**: Entorno de desarrollo local (Node.js 26) y hosting estático (GitHub Pages)

**Project Type**: Single Page Application / Web Project

**Performance Goals**: Pruebas automáticas en <5s; build en <1s

**Constraints**: Cero dependencias adicionales de runtime

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio Constitucional | Estado | Justificación |
|---|---|---|
| **1. SPA Estática sin Servidor** | **PASA** | La actualización de Node solo afecta al entorno de compilación y tooling; la salida sigue siendo una SPA estática pura. |
| **2. Tecnologías Autorizadas** | **PASA** | Se mantienen TypeScript, HTML5 y CSS puro. |
| **3. Persistencia en `localStorage`** | **PASA** | No altera el almacenamiento local en cliente. |
| **4. Compatibilidad GitHub Pages** | **PASA** | La compilación genera el mismo bundle estático en `dist/`. |
| **5. Modularidad y Separación** | **PASA** | No afecta a la arquitectura interna del código. |
| **6. Diseño Responsive Móvil** | **PASA** | No altera la interfaz de usuario. |
| **7. Flujo SDD Spec Kit** | **PASA** | Cumplimiento estricto del ciclo de Spec Kit. |

*Resultado*: **PASA sin violaciones** (0 excepciones requeridas).

## Project Structure

### Documentation (this feature)

```text
specs/003-upgrade-node-26/
├── plan.md              # Este plan de implementación
├── research.md          # Investigación técnica y decisiones (Fase 0)
├── data-model.md        # Manifiesto de entorno (Fase 1)
├── quickstart.md        # Guía de validación y comandos (Fase 1)
├── contracts/
│   └── environment-contract.md # Contrato de package.json y .nvmrc
└── checklists/
    └── requirements.md  # Checklist de calidad de la especificación
```

### Source Code Touched / Added

```text
.nvmrc                   # Declaración de versión 26 para nvm/fnm/actions
package.json             # Declaración de engines: { "node": ">=26.0.0" }
README.md                # Requisitos previos actualizados a Node.js 26
```

## Complexity Tracking

*No se registran violaciones a la constitución ni complejidades injustificadas.*
