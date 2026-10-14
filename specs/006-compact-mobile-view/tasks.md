# Tasks: Vista Móvil Compacta y Densidad Visual de Consumiciones

**Input**: Design documents from `specs/006-compact-mobile-view/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify feature workspace environment and baseline test status.

- [X] T001 [P] Verify feature workspace environment and baseline test suite pass in `specs/006-compact-mobile-view/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Component markup alignment and global layout padding tuning.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Update item row template in `ParticipantCardComponent` to render single-line product name and unit price in `src/ui/components/participant-card.ts`
- [X] T003 [P] Compact mobile layout paddings in `src/ui/styles/layout.css`

**Checkpoint**: Base DOM structure aligned for high-density styling.

---

## Phase 3: User Story 1 - Filas de consumición compactas de alta densidad en móvil (Priority: P1) 🎯 MVP

**Goal**: Reducir la altura de cada fila de consumición a ~36px con nombre y precio en una sola línea continua, truncado elíptico y controles compactos.

**Independent Test**: Añadir 10 consumiciones a una tarjeta en un viewport móvil de 375px y comprobar que cada fila mide ≤38px y los controles de cantidad y borrado permanecen perfectamente alineados.

### Implementation for User Story 1

- [X] T004 [P] [US1] Implement compact CSS styles for `.consumption-item-row` (~36px height, single-line flex layout, ellipsis truncation) in `src/ui/styles/components.css`
- [X] T005 [P] [US1] Compact quantity counter (`.qty-counter`, `.btn-qty`), font sizes, and line delete button in `src/ui/styles/components.css`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Fila de catálogo rápido horizontal no invasiva (Priority: P1)

**Goal**: Transformar el bloque de catálogo rápido en una sola fila desplazable horizontalmente de 34px fijos para no desplazar el contenido vertical de la tarjeta.

**Independent Test**: Comprobar en móvil que los chips de catálogo se muestran en una sola fila desplazable horizontalmente con el dedo sin saltar a múltiples líneas.

### Implementation for User Story 2

- [X] T006 [US2] Implement single-row horizontal scrolling chips with hidden scrollbar for `.quick-catalog-chips` in `src/ui/styles/components.css`
- [X] T007 [US2] Compact `.chip` dimensions (32px height, adjusted padding) in `src/ui/styles/components.css`

**Checkpoint**: Quick catalog uses a fixed single horizontal row.

---

## Phase 5: User Story 3 - Límite de altura máxima con scroll interno por tarjeta (Priority: P2)

**Goal**: Acotar la altura máxima de la lista de consumiciones a 280px con scroll vertical interno cuando supere 5-6 productos para evitar monopolizar la pantalla móvil.

**Independent Test**: Añadir más de 6 consumiciones a una tarjeta y verificar que la lista tiene scroll vertical interno suave y la tarjeta no desborda desmesuradamente la pantalla.

### Implementation for User Story 3

- [X] T008 [US3] Add `max-height: 280px` and internal `overflow-y: auto` for `.consumption-list` in `src/ui/styles/components.css`

**Checkpoint**: Card height is bounded on long lists.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build check, and manual mobile audit.

- [X] T009 [P] Run TypeScript type-checking and automated test suite with `npm test` and `npm run build`
- [X] T010 Execute manual mobile verification scenarios from `specs/006-compact-mobile-view/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents MVP.
- **User Story 2 (Phase 4)**: Can run in parallel with US1.
- **User Story 3 (Phase 5)**: Builds on the item list styling.
- **Polish (Phase 6)**: Depends on all user story implementations.

### Parallel Opportunities

- T002 (markup) and T003 (layout.css) can run in parallel in Phase 2.
- T004 and T005 can run in parallel in Phase 3.
- T009 and T010 run in Phase 6.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (markup + layout)
3. Complete Phase 3: User Story 1 (compact item row ~36px)
4. Complete Phase 4: User Story 2 (horizontal catalog chips)
5. Complete Phase 5: User Story 3 (scrollable list max-height)
6. Validate with 10 products in mobile DevTools
