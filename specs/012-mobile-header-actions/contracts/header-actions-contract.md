# Contracts: Header Actions and Mobile Menu

**Feature**: `012-mobile-header-actions`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Componente `HeaderSummaryComponent` (`src/ui/components/header-summary.ts`)

```typescript
import { Participant } from '../../domain/models';

export interface HeaderSummaryOptions {
  onResetRequested: () => void;
  onShareRequested?: () => void;
  onExportPdfRequested?: () => void;
}

export class HeaderSummaryComponent {
  constructor(options: HeaderSummaryOptions);

  /**
   * Actualiza el total de la mesa, el contador de jugadores y el estado
   * habilitado/deshabilitado de las acciones tanto en escritorio como en móvil.
   */
  public update(participants: Participant[]): void;

  /**
   * Abre o cierra el menú desplegable de acciones en móvil.
   */
  public toggleMobileMenu(forceState?: boolean): void;

  /**
   * Cierra el menú desplegable móvil si está abierto.
   */
  public closeMobileMenu(): void;

  /**
   * Devuelve el elemento contenedor del header para su montaje en el DOM.
   */
  public getElement(): HTMLElement;
}
```

---

## 2. Contrato de Estructura DOM de la Cabecera

```html
<div class="header-actions">
  <!-- Desktop Actions (visibles en >= 680px) -->
  <div class="header-actions-desktop">
    <button type="button" class="btn btn-share-session" id="btn-share-session">
      <span class="btn-icon">📤</span>
      <span class="btn-text">Compartir</span>
    </button>
    <button type="button" class="btn btn-export-pdf" id="btn-export-pdf">
      <span class="btn-icon">📄</span>
      <span class="btn-text">PDF</span>
    </button>
    <button type="button" class="btn btn-outline-danger btn-reset-session" id="btn-reset-session">
      <span class="btn-icon">🔄</span>
      <span class="btn-text">Reiniciar</span>
    </button>
  </div>

  <!-- Mobile Actions (visibles en < 680px) -->
  <div class="header-actions-mobile">
    <button
      type="button"
      class="btn btn-header-menu-toggle"
      id="btn-header-menu-toggle"
      aria-haspopup="true"
      aria-expanded="false"
      aria-controls="header-menu-dropdown"
      title="Acciones de la mesa"
    >
      <span class="btn-icon">⚙️</span>
      <span class="btn-text">Acciones</span>
      <span class="btn-caret">▾</span>
    </button>

    <div class="header-menu-dropdown" id="header-menu-dropdown" role="menu" hidden>
      <button type="button" class="header-menu-item" id="btn-menu-share" role="menuitem" disabled>
        <span class="menu-item-icon">📤</span>
        <span class="menu-item-text">Compartir cuenta</span>
      </button>
      <button type="button" class="header-menu-item" id="btn-menu-pdf" role="menuitem" disabled>
        <span class="menu-item-icon">📄</span>
        <span class="menu-item-text">Exportar a PDF</span>
      </button>
      <div class="header-menu-divider"></div>
      <button type="button" class="header-menu-item header-menu-item-danger" id="btn-menu-reset" role="menuitem">
        <span class="menu-item-icon">🔄</span>
        <span class="menu-item-text">Reiniciar mesa</span>
      </button>
    </div>
  </div>
</div>
```
