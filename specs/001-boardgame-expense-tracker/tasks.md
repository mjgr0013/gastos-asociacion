# Tasks: Control de Gastos de Consumiciones (Boardgame Expenses)

**Input**: Design documents from `specs/001-boardgame-expense-tracker/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, toolchain configuration, and baseline application shell.

- [X] T001 Initialize npm configuration with scripts (`dev`, `build`, `test`, `preview`) and devDependencies (`vite`, `typescript`, `vitest`) in `package.json`
- [X] T002 [P] Configure strict TypeScript compiler options in `tsconfig.json`
- [X] T003 [P] Configure Vite bundler with relative base path (`base: './'`) for GitHub Pages in `vite.config.ts`
- [X] T004 [P] Create initial HTML entry shell with mobile viewport meta tag, title, and application mount container in `index.html`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core domain entities, validation logic, mathematical calculations, and state persistence infrastructure.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 [P] Implement domain models and interfaces (`Participant`, `ConsumptionItem`, `SessionState`, `QuickCatalogPreset`) in `src/domain/models.ts`
- [X] T006 [P] Implement input validation functions quoting data constraints verbatim (participant name: non-empty trimmed max 50 chars; consumption name: non-empty trimmed max 80 chars; unitPrice: number strictly > 0; quantity: integer >= 1) in `src/domain/validation.ts`
- [X] T007 [P] Implement currency calculation and formatting utilities (`roundCurrency` with epsilon handling, `formatCurrency` in EUR, `calculateSubtotal`, `calculateGrandTotal`) in `src/domain/calculations.ts`
- [X] T008 [P] Implement localStorage persistence adapter with quota/security error handling and in-memory fallback in `src/storage/local-storage.ts`
- [X] T009 Implement observable `SessionStore` fulfilling `ISessionStore` contract with listener subscription and mutation dispatch in `src/storage/store.ts`
- [X] T010 [P] Implement design tokens, color palette, typography, and base CSS reset in `src/ui/styles/variables.css`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Gestión de participantes y asignación de consumiciones (Priority: P1) 🎯 MVP

**Goal**: Permitir al anfitrión/jugador dar de alta y baja participantes, y asignarles consumiciones mediante catálogo rápido de productos habituales o formulario libre.

**Independent Test**: Registrar participantes ("Manu", "Carlos"), pulsar botones de catálogo rápido ("Refresco 1.50€") o añadir consumición manual ("Snack 1.00€ x1"), y comprobar que los elementos se asocian de forma visible a la tarjeta del participante.

### Tests for User Story 1

- [X] T011 [P] [US1] Unit test for participant name and consumption input validation logic in `tests/unit/validation.test.ts`
- [X] T012 [US1] Unit test for SessionStore participant creation, deletion, and consumption addition in `tests/unit/store.test.ts`

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement participant creation form component in `src/ui/components/participant-form.ts`
- [X] T014 [P] [US1] Implement quick catalog shortcut buttons component (`Refresco 1,50 €`, `Cerveza 1,50 €`, `Snack 1,00 €`, `Café 1,20 €`) in `src/ui/components/quick-catalog.ts`
- [X] T015 [P] [US1] Implement custom consumption modal/form component for free-form name, price, and quantity entry in `src/ui/components/consumption-form.ts`
- [X] T016 [US1] Implement participant card view component rendering participant header, consumption list, and catalog/form triggers in `src/ui/components/participant-card.ts`
- [X] T017 [US1] Wire participant and consumption actions into main view coordinator in `src/ui/app-view.ts`

**Checkpoint**: User Story 1 is fully functional and delivers an independently testable MVP.

---

## Phase 4: User Story 2 - Cálculo en tiempo real de subtotales individuales y total global (Priority: P1)

**Goal**: Calcular y mostrar de forma instantánea (<100ms) el subtotal de cada participante y el sumatorio global de la mesa, permitiendo ajustar o borrar líneas.

**Independent Test**: Añadir consumiciones a varios participantes, modificar cantidades o borrar líneas, y comprobar que los subtotales individuales y el total global se recalculan inmediatamente con exactitud a dos decimales.

### Tests for User Story 2

- [X] T018 [P] [US2] Unit test for currency rounding accuracy, subtotal calculations, and grand total arithmetic in `tests/unit/calculations.test.ts`

### Implementation for User Story 2

- [X] T019 [US2] Implement quantity increment (+), decrement (-), and line deletion controls in `src/ui/components/participant-card.ts`
- [X] T020 [P] [US2] Implement sticky header summary component showing formatted grand total in `src/ui/components/header-summary.ts`
- [X] T021 [US2] Connect reactive store subscription to update card subtotales and sticky grand total in `src/ui/app-view.ts`

**Checkpoint**: User Stories 1 and 2 operate together with real-time financial tracking.

---

## Phase 5: User Story 3 - Persistencia automática ante recargas o cierres de pestaña (Priority: P2)

**Goal**: Guardar de forma atómica el estado de la sesión en el almacenamiento local del navegador tras cada cambio para no perder datos si se recarga la pestaña.

**Independent Test**: Registrar datos en la mesa, recargar la página en el navegador (`Cmd+R` / `F5`), y comprobar que el 100% de los participantes, consumiciones y totales calculados se restauran idénticos.

### Tests for User Story 3

- [X] T022 [P] [US3] Integration test for localStorage state serialization, parsing, and restoration in `tests/integration/storage.test.ts`

### Implementation for User Story 3

- [X] T023 [US3] Integrate automated synchronous save to localStorage (`bg_expense_session_v1`) on every store mutation in `src/storage/store.ts`
- [X] T024 [US3] Implement application bootstrapping to restore saved session or initialize empty state on startup in `src/main.ts`
- [X] T025 [US3] Display non-blocking warning banner when localStorage is unavailable or quota is exceeded in `src/ui/app-view.ts`

**Checkpoint**: Session state survives tab reloads and browser closures seamlessly.

---

## Phase 6: User Story 4 - Reinicio seguro de sesión con confirmación (Priority: P2)

**Goal**: Permitir vaciar la mesa y comenzar una nueva cuenta con confirmación previa obligatoria para evitar borrados accidentales de la partida.

**Independent Test**: Pulsar "Reiniciar sesión" y verificar que al pulsar "Cancelar" los datos no se alteran, y al pulsar "Confirmar" la mesa queda a 0.00 € y limpia en memoria y almacenamiento.

### Implementation for User Story 4

- [X] T026 [P] [US4] Implement accessible confirmation modal component with keyboard escape, focus trap, and confirm/cancel actions in `src/ui/components/confirm-dialog.ts`
- [X] T027 [US4] Connect "Reiniciar sesión" button in header summary to trigger confirmation modal and reset store in `src/ui/app-view.ts`
- [X] T028 [US4] Connect participant deletion confirmation prompt when participant has active consumption lines in `src/ui/components/participant-card.ts`

**Checkpoint**: Critical destructive operations are safe against accidental touch events.

---

## Phase 7: User Story 5 - Interfaz responsive optimizada para móvil y pantalla grande (Priority: P3)

**Goal**: Optimizar la experiencia visual y táctil para uso fluido en smartphone (mínimo 360px) en la mesa de juego y en pantallas de escritorio.

**Independent Test**: Probar la aplicación en viewport móvil de 360px a 414px verificando ausencia de scroll horizontal y objetivos táctiles >=44px, y en viewport de escritorio verificando cuadrícula equilibrada.

### Implementation for User Story 5

- [X] T029 [P] [US5] Implement responsive layout rules, sticky top header bar, and adaptive participant grid in `src/ui/styles/layout.css`
- [X] T030 [P] [US5] Implement card styles, button sizes (min 44x44px touch targets), chip badges, and interactive feedback in `src/ui/styles/components.css`
- [X] T031 [US5] Verify and refine mobile layout without horizontal overflow at 360px width in `src/ui/styles/layout.css`

**Checkpoint**: Interface is fully ergonomic, responsive, and tactile.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Build verification, end-to-end documentation, and GitHub Pages deployment configuration.

- [X] T032 [P] Configure production build bundling and verify clean `dist/` output for GitHub Pages in `vite.config.ts`
- [X] T033 Execute manual end-to-end acceptance scenarios from `specs/001-boardgame-expense-tracker/quickstart.md`
- [X] T034 [P] Create project documentation with architecture summary, quickstart guide, and GitHub Pages hosting instructions in `README.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately without dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents the MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (operates over participants and consumptions).
- **User Story 3 (Phase 5)**: Depends on User Story 1 & 2 (persists active session state).
- **User Story 4 (Phase 6)**: Depends on User Story 1 & 2 (resets session and handles participant removal).
- **User Story 5 (Phase 7)**: Depends on UI components from US1-US4 (applies responsive rules and touch tokens).
- **Polish (Phase 8)**: Depends on all user stories being implemented.

### Parallel Opportunities

- **Phase 1 (Setup)**: T002, T003, T004 can run in parallel once T001 creates `package.json`.
- **Phase 2 (Foundational)**: T005, T006, T007, T008, and T010 can be developed in parallel. T009 integrates them.
- **Phase 3 (US1)**: T011 test, T013 participant form, T014 quick catalog, and T015 consumption form can be created in parallel.
- **Phase 4 (US2)**: T018 test and T020 header summary can be developed in parallel.
- **Phase 5 (US3)**: T022 test can run in parallel before storage integration.
- **Phase 6 (US4)**: T026 confirm dialog can be implemented in parallel.
- **Phase 7 (US5)**: T029 layout and T030 component styles can be crafted in parallel.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete **Phase 1: Setup** (npm, tsconfig, vite, index.html).
2. Complete **Phase 2: Foundational** (domain models, validation, math, store, styles).
3. Complete **Phase 3: User Story 1** (add/remove participants, catalog buttons, custom items).
4. Complete **Phase 4: User Story 2** (subtotals and session grand total recalculation).
5. **VALIDATE MVP**: Test User Story 1 & 2 flows manually or with tests.

### Incremental Delivery

1. Foundation + US1 + US2 → Functional MVP ready to calculate board game expenses.
2. Add US3 → Automatic persistence across browser refreshes (offline safety).
3. Add US4 → Safe session reset with confirmation dialog.
4. Add US5 → Enhanced responsive layout and touch ergonomics.
5. Polish → Production build check and deployment ready for GitHub Pages.
