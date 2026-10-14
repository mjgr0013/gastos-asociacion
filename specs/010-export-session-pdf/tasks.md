# Tasks: Exportar Cuenta de la Sesión a PDF

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

**Purpose**: Binary download utility and pure TypeScript PDF 1.4 document builder.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Implement `downloadBlob(blob, filename)` client-side download utility in `src/utils/download.ts`
- [X] T003 [P] Implement `generateSessionPdfBlob(options)` and `generatePdfFilename(date)` in `src/domain/pdf-export.ts`

**Checkpoint**: Foundation ready - PDF generation and download engine available.

---

## Phase 3: User Story 1 - Generación y descarga del PDF de la sesión con titular de reserva (Priority: P1) 🎯 MVP

**Goal**: Generar y descargar un documento PDF formateado con la fecha/hora actual, el nombre del titular de la reserva, el desglose individual por participante (consumiciones, precios unitarios y subtotales) y el total acumulado de la mesa.

**Independent Test**: Registrar participantes con consumiciones (ej. "Manu" con 2x Refresco a 1,50 € y "Carlos" con 1x Snack a 1,00 €), pulsar "Exportar a PDF", introducir "Manuel García" y confirmar, verificando que se descarga el PDF conteniendo todos los datos correctos y totalizando 4,00 €.

### Tests for User Story 1

- [X] T004 [P] [US1] Add unit tests in `tests/unit/pdf-export.test.ts` verifying PDF binary generation, header, reservation holder, timestamp, participant item lines, and grand total

### Implementation for User Story 1

- [X] T005 [US1] Implement `ExportPdfModalComponent` in `src/ui/components/export-pdf-modal.ts` for capturing reservation holder name and confirming PDF export
- [X] T006 [US1] Add styling rules for export PDF modal and action button in `src/ui/styles/components.css`
- [X] T007 [US1] Connect export PDF button in `HeaderSummaryComponent` in `src/ui/components/header-summary.ts` and coordinate modal display and download in `src/ui/app-view.ts`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Validación del campo de reserva y cancelación en el diálogo (Priority: P2)

**Goal**: Validar que el nombre del titular de la reserva no esté vacío antes de generar el PDF y permitir la cancelación limpia del diálogo modal sin efectos colaterales.

**Independent Test**: Abrir el diálogo modal de exportación, pulsar "Descargar PDF" con el campo vacío y comprobar que se muestra el mensaje de error "Por favor, introduce el nombre del titular de la reserva."; pulsar "Cancelar" o presionar Escape y comprobar que el modal se cierra sin descargar nada.

### Implementation for User Story 2

- [X] T008 [US2] Add inline validation in `ExportPdfModalComponent` in `src/ui/components/export-pdf-modal.ts` for empty/whitespace reservation holder name and handle cancel/escape events

**Checkpoint**: Dialog validation and error feedback operate reliably.

---

## Phase 5: User Story 3 - Control de disponibilidad según el estado de la mesa (Priority: P3)

**Goal**: Mantener el botón de exportar a PDF deshabilitado cuando no haya participantes registrados en la sesión y habilitarlo cuando haya al menos 1 participante.

**Independent Test**: Comprobar que con 0 participantes el botón "Exportar PDF" está deshabilitado (`disabled`), y al añadir un participante se habilita de forma reactiva.

### Implementation for User Story 3

- [X] T009 [US3] Update `HeaderSummaryComponent` in `src/ui/components/header-summary.ts` to manage the `disabled` state of the export PDF button according to participants count

**Checkpoint**: Export button accurately reflects session availability.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T010 [P] Run full test suite and type check with `npm test` and `npm run build`
- [X] T011 Execute manual end-to-end validation scenarios following `specs/010-export-session-pdf/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2). Represents MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3). Enhances modal validation.
- **User Story 3 (Phase 5)**: Depends on User Story 1 (Phase 3). Refines header button reactivity.
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### Parallel Opportunities

- T001, T002, and T003 can be prepared in parallel.
- T004 [US1] tests can be written while assembling modal UI components.
- T010 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (`downloadBlob` and `generateSessionPdfBlob`)
3. Complete Phase 3: User Story 1 (Modal + Header button + PDF download)
4. Validate MVP: Run tests in `tests/unit/pdf-export.test.ts`
5. Proceed incrementally to Phase 4 (US2 - Validation & Cancel) and Phase 5 (US3 - Disabled state)
6. Conclude with Phase 6 (Polish & quickstart validation)
