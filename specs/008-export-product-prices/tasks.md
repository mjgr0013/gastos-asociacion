# Tasks: Resumen de Precios de Productos en la Cuenta Exportada

**Input**: Design documents from `specs/008-export-product-prices/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify workspace environment, dependencies, and test baseline.

- [X] T001 [P] Verify project dependencies and baseline tests pass with `npm test` and `npm run build`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and domain interfaces for consumed product prices.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Define `ConsumedProductPrice` interface (`name: string`, `unitPrice: number`) in `src/domain/sharing.ts`

**Checkpoint**: Base domain model ready for story implementation.

---

## Phase 3: User Story 1 - Consulta de precios de referencia de productos consumidos en la cuenta compartida (Priority: P1) 🎯 MVP

**Goal**: Incluir en el texto exportado al compartir la cuenta una sección con el precio unitario de cada producto que al menos una persona haya consumido con cantidad mayor a cero, excluyendo productos del catálogo no consumidos.

**Independent Test**: Registrar participantes con consumiciones asignadas (ej. "Manu" con 2x Refresco a 1,50 € y "Carlos" con 1x Snack a 1,00 €), pulsar "Compartir" y verificar que el texto generado contiene la sección `Precios de productos:` listando `• Refresco: 1,50 €` y `• Snack: 1,00 €`.

### Tests for User Story 1

- [X] T003 [P] [US1] Add unit tests in `tests/unit/sharing.test.ts` for extracting and displaying unit prices of consumed products in `generateSessionShareText` and verifying unconsumed catalog items are excluded

### Implementation for User Story 1

- [X] T004 [US1] Implement `extractConsumedProductPrices(participants: Participant[]): ConsumedProductPrice[]` function filtering items with `quantity > 0` in `src/domain/sharing.ts`
- [X] T005 [US1] Update `generateSessionShareText` in `src/domain/sharing.ts` to append the `Precios de productos:` section between participants and grand total

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Desduplicación y ordenación de productos en la lista de precios (Priority: P2)

**Goal**: Garantizar que los productos consumidos aparezcan sin duplicados en la lista de precios y ordenados alfabéticamente en español, soportando variantes de precio con el mismo nombre.

**Independent Test**: Añadir varios participantes que coincidan en haber consumido "Refresco" y verificar que aparece una única vez, y verificar que productos en orden arbitrario ("Snack", "Café caliente", "Refresco") se ordenan alfabéticamente ("Café caliente", "Refresco", "Snack").

### Tests for User Story 2

- [X] T006 [P] [US2] Add unit tests in `tests/unit/sharing.test.ts` covering product deduplication across multiple participants, alphabetical ordering using Spanish collation (`localeCompare('es')`), and distinct pricing variants for same product names

### Implementation for User Story 2

- [X] T007 [US2] Implement deduplication with composite key `${item.name}:::${item.unitPrice}` and alphabetical sorting with secondary unit price ascending sort in `extractConsumedProductPrices` in `src/domain/sharing.ts`

**Checkpoint**: Deduplication and alphabetical sorting work independently and seamlessly with US1.

---

## Phase 5: User Story 3 - Omisión limpia de la sección cuando no hay consumiciones (Priority: P3)

**Goal**: Omitir completamente la sección de precios de productos cuando los participantes registrados tengan 0 consumiciones asignadas o la mesa esté vacía.

**Independent Test**: Generar el texto para compartir con participantes que tienen 0 consumiciones registradas y verificar que el bloque `Precios de productos:` no aparece en el texto.

### Tests for User Story 3

- [X] T008 [P] [US3] Add unit tests in `tests/unit/sharing.test.ts` verifying that `generateSessionShareText` cleanly omits the `Precios de productos:` section when participants have 0 consumptions or table is empty

### Implementation for User Story 3

- [X] T009 [US3] Ensure `generateSessionShareText` in `src/domain/sharing.ts` guards against empty `ConsumedProductPrice[]` and completely omits the section and its delimiters

**Checkpoint**: Empty session states handled cleanly without redundant text or headers.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build validation, and manual E2E checks.

- [X] T010 [P] Run full test suite and type check with `npm test` and `npm run build`
- [X] T011 Execute manual end-to-end validation scenarios following `specs/008-export-product-prices/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately (verifies baseline).
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) completion. Represents MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 (Phase 3). Enhances extraction with sorting and deduplication.
- **User Story 3 (Phase 5)**: Depends on User Story 1 (Phase 3). Validates and ensures clean omission behavior for 0-consumption sessions.
- **Polish (Phase 6)**: Depends on all user story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Independent foundation for product price display in exported text.
- **US2 (P2)**: Refines `extractConsumedProductPrices` in `src/domain/sharing.ts` with Spanish collation and composite deduplication.
- **US3 (P3)**: Validates omission guard in `generateSessionShareText` when no consumed items exist.

### Parallel Opportunities

- Phase 1 (T001) and Phase 2 (T002) can be prepared quickly.
- Within each story, writing tests (T003, T006, T008) can precede implementation.
- T010 in Phase 6 runs in parallel with manual checks.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`npm test && npm run build`)
2. Complete Phase 2: Foundational (`ConsumedProductPrice` interface)
3. Complete Phase 3: User Story 1 (`extractConsumedProductPrices` basic + `generateSessionShareText` section)
4. Validate MVP: Run tests in `tests/unit/sharing.test.ts`
5. Proceed incrementally to Phase 4 (US2) and Phase 5 (US3)
6. Conclude with Phase 6 (Polish & quickstart validation)
