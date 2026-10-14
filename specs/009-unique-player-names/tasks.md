# Tasks: Nombres Únicos y Formateo con Mayúscula para Jugadores

**Input**: Design documents from `specs/009-unique-player-names/`  
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

**Purpose**: Pure domain formatting and duplicate checking functions.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Implement `formatParticipantName(name)` and `isDuplicateParticipantName(name, existingNames)` in `src/domain/validation.ts`

**Checkpoint**: Foundation ready - story implementation can begin.

---

## Phase 3: User Story 1 - Formateo automático de la primera letra en mayúscula (Priority: P1) 🎯 MVP

**Goal**: Formatear automáticamente cualquier nombre introducido con la primera letra en mayúscula y recortar espacios en blanco antes de guardarlo en el estado.

**Independent Test**: Introducir "manu" o "  carlos  " en el formulario y verificar que el participante se crea y almacena con el nombre capitalizado ("Manu", "Carlos").

### Tests for User Story 1

- [X] T003 [P] [US1] Add unit tests in `tests/unit/validation.test.ts` for `formatParticipantName` covering lowercase names, leading/trailing whitespace, and accented letters (e.g., "ángel" -> "Ángel")

### Implementation for User Story 1

- [X] T004 [US1] Integrate `formatParticipantName` into `SessionStore.addParticipant` in `src/storage/store.ts` to ensure participant names are saved with their first letter capitalized

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Prevención y rechazo de nombres duplicados (Priority: P2)

**Goal**: Rechazar la adición de participantes cuyo nombre ya exista en la mesa en una comprobación case-insensitive (ej: impedir añadir "manu" si ya existe "Manu").

**Independent Test**: Añadir un participante "Manu", intentar añadir "manu" o "MANU", y verificar que la operación arroja error con el mensaje "Ya existe un jugador con este nombre en la mesa." sin modificar la lista.

### Tests for User Story 2

- [X] T005 [P] [US2] Add unit tests in `tests/unit/validation.test.ts` and `tests/unit/store.test.ts` for case-insensitive duplicate name detection in `validateParticipantName` and `SessionStore.addParticipant`

### Implementation for User Story 2

- [X] T006 [US2] Update `validateParticipantName(name, existingNames)` in `src/domain/validation.ts` to check duplicates against `existingNames` with the error message "Ya existe un jugador con este nombre en la mesa."
- [X] T007 [US2] Connect `validateParticipantName` in `SessionStore.addParticipant` in `src/storage/store.ts` passing the active participants' names

**Checkpoint**: Duplicate prevention is fully operational across domain and store layers.

---

## Phase 5: User Story 3 - Limpieza y recuperación tras error de validación (Priority: P3)

**Goal**: Limpiar el mensaje de error del formulario de participantes cuando el usuario empiece a escribir o cuando envíe un nombre válido, y mantener el foco en el campo de texto.

**Independent Test**: Provocar un error de duplicado en el formulario, verificar que se muestra el mensaje de error, empezar a escribir un nuevo nombre y comprobar que el error se limpia y el foco permanece en el input.

### Implementation for User Story 3

- [X] T008 [US3] Update `ParticipantFormComponent` in `src/ui/components/participant-form.ts` to attach an `input` event listener that invokes `clearError()` and ensure `inputElement.focus()` is called on validation errors

**Checkpoint**: Form UI error handling and user recovery are seamless.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T009 [P] Run full test suite and type check with `npm test` and `npm run build`
- [X] T010 Execute manual end-to-end validation scenarios following `specs/009-unique-player-names/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2). Represents MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3). Enhances validation with duplicate checking.
- **User Story 3 (Phase 5)**: Depends on User Story 2 (Phase 4). Refines form UI error display and clearing.
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### Parallel Opportunities

- T001 and T002 can be prepared quickly.
- T003 [US1] and T005 [US2] can be written in parallel for TDD test coverage.
- T009 in Phase 6 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (`formatParticipantName` and `isDuplicateParticipantName`)
3. Complete Phase 3: User Story 1 (Capitalization in store + tests)
4. Validate MVP: Run tests in `tests/unit/validation.test.ts`
5. Proceed incrementally to Phase 4 (US2 - Duplicate rejection) and Phase 5 (US3 - UI clearing)
6. Conclude with Phase 6 (Polish & quickstart validation)
