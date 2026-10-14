# Tasks: Soporte de Progressive Web App (PWA) e Instalación Offline

**Input**: Design documents from `specs/005-pwa-offline-support/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`  

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Verify feature workspace environment and baseline test status.

- [X] T001 [P] Verify feature workspace environment and baseline test suite pass in `specs/005-pwa-offline-support/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create icon assets and Web App Manifest specification.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T002 [P] Create dice-themed SVG vector and PNG icons (192x192, 512x512) in `public/icons/`
- [X] T003 [P] Create Web App Manifest specifying standalone mode, name, and theme color in `public/manifest.webmanifest`

**Checkpoint**: Core PWA metadata and graphic assets created.

---

## Phase 3: User Story 1 - Instalación en pantalla de inicio como aplicación autónoma (Priority: P1) 🎯 MVP

**Goal**: Permitir la instalación de la app en la pantalla de inicio del dispositivo móvil o escritorio en modo standalone sin barras de navegador.

**Independent Test**: Visitar la app en el navegador y comprobar que el manifest es reconocido y se habilita la opción de instalación en pantalla de inicio.

### Implementation for User Story 1

- [X] T004 [US1] Link Web App Manifest and viewport/theme metadata in `index.html`
- [X] T005 [US1] Verify Vite build copies public assets (`manifest.webmanifest`, `icons/`, `sw.js`) cleanly to `dist/` in `vite.config.ts`

**Checkpoint**: User Story 1 is functional as an MVP increment.

---

## Phase 4: User Story 2 - Disponibilidad y funcionamiento 100% offline (Priority: P1)

**Goal**: Permitir la carga y funcionamiento pleno de la aplicación sin conexión de red mediante Service Worker con caché local y auto-actualización.

**Independent Test**: Desconectar la red o activar el modo avión en el dispositivo, recargar la página y verificar que la app carga en <1s desde la caché local sin errores.

### Implementation for User Story 2

- [X] T006 [P] [US2] Implement native Service Worker with Cache-First asset precaching, skipWaiting, and clean cache purge in `public/sw.js`
- [X] T007 [US2] Register Service Worker with scope `./` and handle auto-reload on `controllerchange` in `src/main.ts`

**Checkpoint**: 100% offline functionality is operational.

---

## Phase 5: User Story 3 - Identidad visual de la app y compatibilidad iOS / Android (Priority: P2)

**Goal**: Proporcionar iconos adaptables (maskable) en Android y metatags dedicados de Apple Touch Icon para iOS Safari.

**Independent Test**: Inspeccionar en DevTools Application > Manifest que los iconos adaptables son válidos y verificar los metatags de iOS en `index.html`.

### Implementation for User Story 3

- [X] T008 [P] [US3] Add Apple touch icon links and iOS standalone status bar meta tags in `index.html`
- [X] T009 [P] [US3] Configure maskable purpose and icon paths in `public/manifest.webmanifest`

**Checkpoint**: Native visual fidelity guaranteed across iOS and Android.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Test suite verification, production build check, and manual PWA audit.

- [X] T010 [P] Run TypeScript type-checking and automated test suite with `npm test` and `npm run build`
- [X] T011 Execute manual PWA audit and offline simulation scenarios from `specs/005-pwa-offline-support/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion.
- **User Story 1 (Phase 3)**: Depends on Foundational completion. Represents MVP.
- **User Story 2 (Phase 4)**: Can run in parallel with US1.
- **User Story 3 (Phase 5)**: Can run in parallel with US1/US2.
- **Polish (Phase 6)**: Depends on all user story implementations.

### Parallel Opportunities

- T002 (icons) and T003 (manifest) can run in parallel in Phase 2.
- T006 (sw.js) and T008 (iOS tags) can run in parallel.
- T010 and T011 run in Phase 6.

---

## Implementation Strategy

### MVP First (User Story 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (icons + manifest)
3. Complete Phase 3: User Story 1 (link manifest in `index.html`)
4. Complete Phase 4: User Story 2 (`public/sw.js` + register in `src/main.ts`)
5. Validate offline operation
6. Complete Phase 5: User Story 3 (iOS icons and metadata)
