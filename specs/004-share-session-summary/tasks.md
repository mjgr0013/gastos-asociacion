# Tasks: Compartir Resumen de Cuenta por WhatsApp o Portapapeles

**Input**: Design documents from `specs/004-share-session-summary/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify feature workspace environment and baseline test status.

- [X] T001 [P] Verify feature workspace environment and baseline test suite pass in `specs/004-share-session-summary/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Text generation domain function, unit tests, and toast/share CSS tokens.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Implement pure text generator `generateSessionShareText(participants, date)` in `src/domain/sharing.ts`
- [X] T003 [P] Add unit tests for `generateSessionShareText` covering players with and without items in `tests/unit/sharing.test.ts`
- [X] T004 [P] Implement CSS styles for `.btn-share-session` and accessible `.toast-notification` in `src/ui/styles/components.css`

**Checkpoint**: Core formatting and styling ready.

---

## Phase 3: User Story 1 - Compartir resumen estructurado de la cuenta (Priority: P1) 🎯 MVP

**Goal**: Permitir al anfitrión pulsar un botón para enviar el desglose estructurado a WhatsApp/Telegram vía Web Share API o copiarlo al portapapeles.

**Independent Test**: Añadir participantes con consumiciones, pulsar "Compartir cuenta" y verificar que el texto generado contiene la fecha, cada jugador con sus consumiciones y el total exacto de la mesa.

### Implementation for User Story 1

- [X] T005 [P] [US1] Implement `shareOrCopyText` helper with `navigator.share`, `AbortError` handling, and clipboard fallback in `src/utils/share.ts`
- [X] T006 [US1] Add share button with icon (`📤`) and click trigger in `src/ui/components/header-summary.ts`
- [X] T007 [US1] Wire share action in `AppView` connecting store participants to `shareOrCopyText` in `src/ui/app-view.ts`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Confirmación visual de copia al portapapeles (Priority: P2)

**Goal**: Mostrar una notificación visual flotante (toast) cuando el resumen se copie al portapapeles en escritorio o cuando la Web Share API no esté disponible.

**Independent Test**: En navegador de escritorio, pulsar "Compartir" y verificar que aparece una notificación flotante indicando "¡Resumen copiado al portapapeles!" que desaparece tras 3 segundos.

### Implementation for User Story 2

- [X] T008 [P] [US2] Implement accessible `ToastComponent` (`Toast.show(message, duration)`) with `role="status"` and `aria-live="polite"` in `src/ui/components/toast.ts`
- [X] T009 [US2] Connect `ToastComponent.show` in `AppView` when summary text is copied to clipboard in `src/ui/app-view.ts`

**Checkpoint**: Visual confirmation feedback is fully operational.

---

## Phase 5: User Story 3 - Manejo de estados de mesa vacía (Priority: P3)

**Goal**: Deshabilitar el botón de compartir cuando la mesa no tenga ningún participante registrado para evitar envíos en blanco.

**Independent Test**: Con la mesa vacía, comprobar que el botón de compartir se muestra deshabilitado (`disabled`) y se habilita automáticamente al registrar al primer participante.

### Implementation for User Story 3

- [X] T010 [US3] Add disabled state management and visual styling for share button when table has 0 participants in `src/ui/components/header-summary.ts`

**Checkpoint**: Empty session state is handled cleanly.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build check, and manual E2E validation.

- [X] T011 [P] Run TypeScript type-checking and automated test suite with `npm test` and `npm run build`
- [X] T012 Execute manual end-to-end validation scenarios from `specs/004-share-session-summary/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents MVP.
- **User Story 2 (Phase 4)**: Enhances User Story 1 with feedback.
- **User Story 3 (Phase 5)**: Manages empty state on the header button.
- **Polish (Phase 6)**: Depends on all user story implementations.

### Parallel Opportunities

- T002, T003, and T004 can run in parallel in Phase 2.
- T005 and T008 can be developed in parallel.
- T011 and T012 run in Phase 6.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (`sharing.ts`, tests, CSS)
3. Complete Phase 3: User Story 1 (share button + Web Share / clipboard helper)
4. Validate MVP manually
5. Complete Phase 4: User Story 2 (Toast notification)
6. Complete Phase 5: User Story 3 (Disabled state on empty table)
