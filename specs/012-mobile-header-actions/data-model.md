# Data Model: Estado y Opciones del Menú de Cabecera Móvil

**Feature**: `012-mobile-header-actions`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Estructuras de Estado de UI

### `HeaderMenuState`
Representa el estado reactivo del componente de cabecera respecto a las acciones y su menú móvil.

```typescript
export interface HeaderMenuState {
  /** Indica si el menú desplegable móvil está abierto o cerrado */
  isMenuOpen: boolean;
  /** Indica si las acciones dependientes de participantes están habilitadas */
  canExportOrShare: boolean;
}
```

---

## 2. Invariantes y Reglas de Interacción

1. **Estado de Visibilidad (`isMenuOpen`)**:
   - Por defecto: `false` (menú cerrado / oculto).
   - Al pulsar el botón `"Acciones ▾"`: alterna su valor (`!isMenuOpen`).
   - Al pulsar cualquier opción del menú: pasa a `false`.
   - Al hacer clic fuera del contenedor o presionar `Escape`: pasa a `false`.
   - Al redimensionar la ventana por encima del breakpoint (>= 680px): el menú móvil se oculta vía CSS (`display: none`).

2. **Invariante de Disponibilidad (`canExportOrShare`)**:
   - `canExportOrShare = participants.length > 0`.
   - Cuando es `false`:
     - Botón de compartir en escritorio: `disabled = true`.
     - Botón de PDF en escritorio: `disabled = true`.
     - Ítem "Compartir cuenta" en menú móvil: `disabled = true`.
     - Ítem "Exportar a PDF" en menú móvil: `disabled = true`.
   - La acción "Reiniciar mesa" siempre permanece disponible si el usuario decide vaciar la mesa.
