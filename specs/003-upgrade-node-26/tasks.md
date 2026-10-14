# Tasks: Actualización del Entorno de Ejecución a Node.js 26

**Input**: Design documents from `specs/003-upgrade-node-26/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify active runtime environment in local workspace.

- [X] T001 [P] Verify active Node version matches 26.x (`node -v`) in `.nvmrc`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create runtime environment configuration files.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Create `.nvmrc` specifying Node version `26` in `.nvmrc`

**Checkpoint**: Runtime target declared.

---

## Phase 3: User Story 1 - Compatibilidad y soporte oficial con Node.js 26 (Priority: P1) 🎯 MVP

**Goal**: Declarar explícitamente el soporte de Node 26 en el manifiesto de npm y comprobar la ejecución limpia de pruebas y build.

**Independent Test**: Ejecutar `npm test` y `npm run build` bajo Node.js 26 y comprobar que finalizan con código de salida 0 sin advertencias de runtime.

### Implementation for User Story 1

- [X] T003 [US1] Add `engines` specification `"node": ">=26.0.0"` in `package.json`
- [X] T004 [US1] Run automated test suite with `npm test` to verify Vitest compatibility in `tests/`
- [X] T005 [US1] Run production compilation with `npm run build` to verify Vite output in `dist/`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Actualización de documentación de requisitos previos (Priority: P2)

**Goal**: Documentar Node.js 26 como versión recomendada en las instrucciones de instalación del proyecto.

**Independent Test**: Revisar `README.md` y comprobar que la sección de requisitos previos especifica Node.js v26+.

### Implementation for User Story 2

- [X] T006 [P] [US2] Update runtime requirement to Node.js v26+ in `README.md`

**Checkpoint**: Documentation is aligned with runtime configuration.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Final verification of project status and quickstart guide scenarios.

- [X] T007 [P] Execute end-to-end verification scenarios from `specs/003-upgrade-node-26/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents MVP.
- **User Story 2 (Phase 4)**: Can run in parallel with US1.
- **Polish (Phase 5)**: Depends on all user story implementations.

### Parallel Opportunities

- T001 and T002 can run in parallel.
- T006 can run in parallel with T003.
- T007 validates the final state.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup (`node -v`)
2. Complete Phase 2: Foundational (`.nvmrc`)
3. Complete Phase 3: User Story 1 (`package.json` engines + `npm test` + `npm run build`)
4. Validate MVP
5. Complete Phase 4: User Story 2 (`README.md`)
