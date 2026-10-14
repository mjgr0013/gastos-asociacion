# Tasks: Desplegado y Colapsado de Consumiciones por Participante

**Input**: Design documents from `specs/002-collapsible-participant-items/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify feature workspace readiness and baseline test status.

- [X] T001 [P] Verify feature workspace environment and baseline test suite pass in `specs/002-collapsible-participant-items/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Styling tokens and interface contract extensions for collapsible cards.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Implement CSS classes for `.participant-card.is-collapsed`, `.collapse-chevron` rotation, and card body hiding in `src/ui/styles/components.css`
- [X] T003 [P] Extend `ParticipantCardOptions` interface to support `isCollapsed?: boolean` and `onToggleCollapse?: (participantId: string) => void` in `src/ui/components/participant-card.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Colapsar y expandir individualmente las consumiciones (Priority: P1) 🎯 MVP

**Goal**: Permitir al usuario alternar individualmente el bloque de consumiciones y catálogo de cada tarjeta manteniendo la cabecera visible.

**Independent Test**: Registrar participantes, pulsar el botón o cabecera de alternancia en una tarjeta; verificar que el cuerpo se oculta/muestra de inmediato mientras el nombre y subtotal siguen visibles en la cabecera.

### Implementation for User Story 1

- [X] T004 [US1] Implement toggle button and click handlers to alternate card body visibility and trigger `onToggleCollapse` in `src/ui/components/participant-card.ts`
- [X] T005 [US1] Update `AppView` to track `collapsedParticipantIds` set in memory and pass `isCollapsed` state to cards in `src/ui/app-view.ts`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Resumen visual y accesibilidad en la cabecera colapsada (Priority: P2)

**Goal**: Añadir indicador visual de flecha/chevron, recuento de consumiciones en la cabecera y atributos accesibles WAI-ARIA (`aria-expanded`, `aria-controls`) con soporte para teclado.

**Independent Test**: Verificar que al alternar el estado, el chevron rota entre ▲ y ▼, el contador muestra `(N consumiciones)`, `aria-expanded` cambia dinámicamente y la tecla Enter/Espacio activa la alternancia.

### Implementation for User Story 2

- [X] T006 [P] [US2] Add WAI-ARIA disclosure attributes (`aria-expanded`, `aria-controls`, `role="button"`) and keyboard event listeners (Enter and Space) in `src/ui/components/participant-card.ts`
- [X] T007 [P] [US2] Add item count badge in the participant card header displaying total items in `src/ui/components/participant-card.ts`

**Checkpoint**: Collapsible cards are fully accessible and visually descriptive.

---

## Phase 5: User Story 3 - Estado inicial consistente al dar de alta participantes (Priority: P3)

**Goal**: Garantizar que los nuevos participantes se inicialicen expandidos por defecto y que las tarjetas colapsadas conserven su estado al registrar nuevas consumiciones o jugadores.

**Independent Test**: Colapsar una tarjeta, añadir un nuevo participante y verificar que el nuevo participante aparece expandido mientras el participante colapsado permanece colapsado.

### Implementation for User Story 3

- [X] T008 [US3] Ensure newly added participants default to expanded state and preserve existing collapsed cards across store updates in `src/ui/app-view.ts`

**Checkpoint**: Behavior is predictable across all creation and update operations.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Build verification and end-to-end scenario validation.

- [X] T009 [P] Run TypeScript type-checking and automated test suite with `npm test` and `npm run build`
- [X] T010 Execute manual end-to-end validation scenarios from `specs/002-collapsible-participant-items/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents MVP.
- **User Story 2 (Phase 4)**: Enhances User Story 1 with accessibility and badges.
- **User Story 3 (Phase 5)**: Builds on state coordination in `AppView`.
- **Polish (Phase 6)**: Depends on all user story implementations.

### Parallel Opportunities

- T002 (CSS) and T003 (types) can be developed in parallel in Phase 2.
- T006 (ARIA/keyboard) and T007 (count badge) can be developed in parallel in Phase 4.
- T009 and T010 can run in parallel in Phase 6.

---

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CSS rules and interface options)
3. Complete Phase 3: User Story 1 (toggle logic and view state)
4. Validate MVP manually
5. Proceed with US2 (accessibility) and US3 (consistency)
