# Tasks: Agrupación de Acciones de Cabecera en Dispositivos Móviles

**Input**: Design documents from `specs/012-mobile-header-actions/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify workspace environment, dependencies, and baseline test suite.

- [X] T001 [P] Verify project dependencies and baseline tests pass with `npm test` and `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Responsive CSS layout containers and dropdown styling.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Implement responsive CSS layout rules in `src/ui/styles/layout.css` for desktop (`.header-actions-desktop`) and mobile (`.header-actions-mobile`) containers at the 680px breakpoint
- [X] T003 [P] Implement visual CSS styles for mobile action menu toggle, dropdown container, menu items, and dividers in `src/ui/styles/components.css`

**Checkpoint**: Responsive structure and visual styles ready for component integration.

---

## Phase 3: User Story 1 & 4 - Menú de acciones agrupadas en móvil con estado reactivo (Priority: P1) 🎯 MVP

**Goal**: Agrupar las acciones de la cabecera en móvil bajo un botón desplegable ("Acciones ▾") que muestra un menú flotante con las tres opciones sincronizando su estado reactivo de disponibilidad según los participantes de la mesa.

**Independent Test**: Abrir la aplicación en un viewport móvil (< 680px), comprobar que se muestra el botón agrupador en lugar de los tres botones sueltos, pulsar para abrir el menú, verificar opciones con estado habilitado/deshabilitado y pulsar una opción para verificar que se ejecuta y se cierra el menú.

### Implementation for User Story 1 & 4

- [X] T004 [US1] Update `HeaderSummaryComponent` in `src/ui/components/header-summary.ts` with DOM markup for mobile action menu toggle, dropdown items, and click listeners
- [X] T005 [US1] Implement mobile dropdown open/toggle logic, auto-closing on item selection, and callback dispatch in `src/ui/components/header-summary.ts`
- [X] T006 [US4] Update `HeaderSummaryComponent.update(participants)` in `src/ui/components/header-summary.ts` to synchronize the `disabled` state for both desktop buttons and mobile menu items

**Checkpoint**: User Story 1 and 4 functional as an MVP increment.

---

## Phase 4: User Story 2 - Cierre fluido y accesibilidad del menú desplegable (Priority: P2)

**Goal**: Permitir cerrar el menú móvil al hacer clic fuera o presionar Escape, actualizando atributos `aria-expanded` y gestionando el foco accesible.

**Independent Test**: Abrir el menú de acciones en móvil, pulsar fuera o presionar Escape y verificar que se cierra limpiamente y el foco regresa al botón de acciones.

### Implementation for User Story 2

- [X] T007 [US2] Implement outside-click listener and Escape keydown handler to close the mobile menu and manage `aria-expanded` in `src/ui/components/header-summary.ts`

**Checkpoint**: Dropdown menu dismissibility and accessibility fully operational.

---

## Phase 5: User Story 3 - Visualización extendida en pantallas grandes (Priority: P3)

**Goal**: Confirmar que en pantallas de escritorio o tablet (≥ 680px) los tres botones continúan mostrándose en línea y el botón agrupador móvil permanece oculto.

**Independent Test**: Redimensionar el navegador a ≥ 680px y comprobar que los tres botones ("Compartir", "PDF", "Reiniciar") se visualizan directamente en la barra y el botón de acciones móvil no se muestra.

### Implementation for User Story 3

- [X] T008 [US3] Verify that desktop actions container displays in line and mobile actions toggle is hidden on viewports >= 680px in `src/ui/styles/layout.css`

**Checkpoint**: Desktop layout visual parity verified.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T009 [P] Run full test suite with coverage and production build with `npm run test:coverage` and `npm run build`
- [X] T010 Execute manual validation scenarios following `specs/012-mobile-header-actions/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately.
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 & 4 (Phase 3)**: Depends on Foundational (Phase 2). Represents MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3). Enhances dismissal and accessibility.
- **User Story 3 (Phase 5)**: Depends on Foundational (Phase 2). Validates desktop behavior.
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### Parallel Opportunities

- T001, T002, and T003 can be prepared in parallel.
- T009 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 & 4 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (CSS rules in `layout.css` and `components.css`)
3. Complete Phase 3: User Story 1 & 4 (`HeaderSummaryComponent` DOM + toggle + disabled sync)
4. Validate MVP manually in mobile viewport
5. Proceed to Phase 4 (US2 - Outside click & Escape) and Phase 5 (US3 - Desktop check)
6. Conclude with Phase 6 (Polish & coverage build)
