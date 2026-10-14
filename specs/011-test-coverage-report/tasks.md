# Tasks: Ejecución de Pruebas con Análisis y Reporte de Cobertura

**Input**: Design documents from `specs/011-test-coverage-report/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify workspace environment, dependencies, and baseline test suite.

- [X] T001 [P] Verify project dependencies and baseline tests pass with `npm test` and `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Install the official Vitest V8 coverage provider.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 Install `@vitest/coverage-v8` development dependency in `package.json` matching the active vitest version (`^1.6.0`)

**Checkpoint**: Foundation ready - coverage provider available in development environment.

---

## Phase 3: User Story 1 - Ejecución de pruebas con métricas de cobertura en la terminal (Priority: P1) 🎯 MVP

**Goal**: Permitir ejecutar `npm run test:coverage` y visualizar de inmediato en la consola una tabla con los porcentajes de cobertura (% Stmts, % Branch, % Funcs, % Lines) para los módulos en `src/`.

**Independent Test**: Ejecutar `npm run test:coverage` en la terminal y comprobar que todas las pruebas pasan, finaliza con código de salida 0 y muestra la tabla de métricas en la consola.

### Implementation for User Story 1

- [X] T003 [US1] Configure test coverage options in `vite.config.ts` specifying provider `'v8'`, reporter `['text']`, and scope `include: ['src/**/*.ts']`
- [X] T004 [US1] Add `"test:coverage": "vitest run --coverage"` script to `package.json`
- [X] T005 [US1] Execute and verify `npm run test:coverage` terminal output and exit code 0

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Generación de reporte interactivo visual en HTML (Priority: P2)

**Goal**: Generar el reporte interactivo navegable en `coverage/index.html` para inspección visual de líneas cubiertas y no cubiertas en el navegador, preservando el ignorado en Git.

**Independent Test**: Ejecutar `npm run test:coverage`, verificar la creación de `coverage/index.html` y confirmar que `git status` no detecta archivos no rastreados en `coverage/`.

### Implementation for User Story 2

- [X] T006 [US2] Update coverage configuration in `vite.config.ts` to include `'html'` reporter and output directory `./coverage`
- [X] T007 [US2] Verify `coverage/index.html` generation and confirm `coverage/` exclusion in `.gitignore`

**Checkpoint**: HTML interactive coverage report generated and untracked by Git.

---

## Phase 5: User Story 3 - Documentación del comando de cobertura en el proyecto (Priority: P3)

**Goal**: Documentar el comando `npm run test:coverage` y cómo consultar el reporte HTML en el archivo `README.md`.

**Independent Test**: Abrir `README.md` y verificar que las instrucciones de ejecución y visualización de cobertura están presentes y claras.

### Implementation for User Story 3

- [X] T008 [P] [US3] Document `npm run test:coverage` and HTML report instructions in `README.md`

**Checkpoint**: Project documentation fully updated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T009 [P] Run full test suite with coverage and production build with `npm run test:coverage` and `npm run build`
- [X] T010 Execute manual validation scenarios following `specs/011-test-coverage-report/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2). Represents MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3). Expands reporters to HTML.
- **User Story 3 (Phase 5)**: Depends on User Story 1 (Phase 3). Documents the feature.
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### Parallel Opportunities

- T001 and T008 can be prepared in parallel once foundational work is in place.
- T009 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (Install `@vitest/coverage-v8`)
3. Complete Phase 3: User Story 1 (Configure `vite.config.ts` + add script to `package.json` + verify terminal table)
4. Validate MVP: Run `npm run test:coverage`
5. Proceed incrementally to Phase 4 (US2 - HTML report) and Phase 5 (US3 - Documentation)
6. Conclude with Phase 6 (Polish & quickstart validation)
