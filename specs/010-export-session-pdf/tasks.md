# Tasks: Exportar Cuenta de la Sesión a PDF (Solo Fecha)

**Input**: Design documents from `specs/010-export-session-pdf/`  
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

**Purpose**: Core date formatting and filename generation without hours/seconds.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Update `formatPdfDate(date)` and `generatePdfFilename(date)` in `src/domain/pdf-export.ts` to output date-only (`DD/MM/AAAA`) and `cuenta-partida-YYYYMMDD.pdf`

**Checkpoint**: Base date helpers updated for date-only formatting.

---

## Phase 3: User Story 1 - Generación y descarga del PDF de la sesión con titular y solo fecha (Priority: P1) 🎯 MVP

**Goal**: Generar y descargar el documento PDF mostrando exclusivamente la fecha actual (`DD/MM/AAAA`) sin horas ni segundos en el encabezado.

**Independent Test**: Ejecutar pruebas unitarias en `tests/unit/pdf-export.test.ts` verificando que el texto del PDF incluye `Fecha: DD/MM/AAAA` y no contiene horas ni segundos.

### Tests for User Story 1

- [X] T003 [P] [US1] Update unit tests in `tests/unit/pdf-export.test.ts` to verify `formatPdfDate` outputs `DD/MM/AAAA`, filename matches `cuenta-partida-YYYYMMDD.pdf`, and PDF stream excludes hours/seconds

### Implementation for User Story 1

- [X] T004 [US1] Update `generateSessionPdfBlob` in `src/domain/pdf-export.ts` to render `Fecha: ${formattedDate}` in the reservation details banner

**Checkpoint**: User Story 1 is functional as an MVP increment with date-only output.

---

## Phase 4: User Story 2 & 3 - Validación de reserva y estado del botón (Priority: P2/P3)

**Goal**: Confirmar que la validación del modal y el estado reactivo del botón PDF en la cabecera siguen operando correctamente.

**Independent Test**: Comprobar que el modal valida campos vacíos y que el botón PDF permanece deshabilitado cuando no hay participantes.

### Implementation for User Story 2 & 3

- [X] T005 [US2] Verify `ExportPdfModalComponent` in `src/ui/components/export-pdf-modal.ts` enforces non-empty reservation holder name and handles cancel events
- [X] T006 [US3] Verify `HeaderSummaryComponent` in `src/ui/components/header-summary.ts` and `AppView` in `src/ui/app-view.ts` maintain the disabled state when participant count is 0

**Checkpoint**: Modal validation and button availability verified.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T007 [P] Run full test suite with coverage and production build with `npm run test:coverage` and `npm run build`
- [X] T008 Execute manual validation scenarios following `specs/010-export-session-pdf/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2). Represents MVP.
- **User Story 2 & 3 (Phase 4)**: Depends on User Story 1 (Phase 3).
- **Polish (Phase 5)**: Depends on all user story phases being complete.

### Parallel Opportunities

- T001 and T002 can be started immediately.
- T003 [US1] tests can be written alongside T004 implementation.
- T007 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (`formatPdfDate` & `generatePdfFilename` date-only)
3. Complete Phase 3: User Story 1 (`tests/unit/pdf-export.test.ts` + `generateSessionPdfBlob`)
4. Validate MVP: Run tests in `tests/unit/pdf-export.test.ts`
5. Proceed to Phase 4 (US2 & US3 verification)
6. Conclude with Phase 5 (Polish & build)
