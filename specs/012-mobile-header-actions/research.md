# Research: Agrupación de Acciones de Cabecera en Dispositivos Móviles

**Feature**: `012-mobile-header-actions`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Patrón de Diseño para Agrupación de Acciones en Móvil

### Contexto y Necesidad
En dispositivos móviles (< 680px), la cabecera fija de la aplicación contiene el logotipo y título de la mesa, la caja del total acumulado y tres botones de acción ("Compartir", "PDF" y "Reiniciar"). Esta acumulación provoca saturación visual, reducción del área legible y riesgo de desbordamiento horizontal o saltos de línea antiestéticos.

### Decision
Implementar un menú desplegable contextual (Dropdown Action Menu) anclado al botón agrupador en la cabecera:
1. En pantallas móviles (`< 680px`):
   - Ocultar la barra de botones en línea (`.header-actions-desktop`).
   - Mostrar el contenedor móvil (`.header-actions-mobile`) compuesto por un botón disparador `"Acciones ▾"` y un menú desplegable flotante (`.header-menu-dropdown`).
2. En pantallas de escritorio (`>= 680px`):
   - Mostrar los tres botones individuales en línea y ocultar el control móvil.
3. El menú flotante incluye las tres acciones con iconos y textos descriptivos ("Compartir cuenta", "Exportar a PDF", "Reiniciar mesa") separados visualmente para distinguir la acción destructiva ("Reiniciar").

### Rationale
- Reduce de 3 a 1 los controles directos visibles en la barra superior en pantallas estrechas, despejando el espacio para el total de la mesa y el título.
- Proporciona una experiencia intuitiva de 2 toques en móvil (1 toque para abrir, 1 toque para ejecutar).
- Mantiene la visibilidad directa sin clics adicionales en pantallas grandes donde hay espacio suficiente.

### Alternatives considered
- **Action Sheet / Bottom Sheet**: Requiere un overlay a pantalla completa en la parte inferior. Resulta desproporcionado para solo 3 opciones rápidas; el dropdown contextual en la cabecera es mucho más ágil y ligero.
- **Iconos sin texto (solo emojis en botones pequeños)**: Si bien ocupa menos espacio, perjudica la accesibilidad y comprensión, ya que los usuarios confunden o dudan del significado de los iconos sin etiquetas.

---

## 2. Accesibilidad y Comportamiento de Cierre

### Decision
1. Atributos WAI-ARIA:
   - Botón disparador: `aria-haspopup="true"`, `aria-expanded="false|true"`, `aria-controls="header-menu-dropdown"`.
   - Menú: `role="menu"`, `aria-label="Acciones de la mesa"`.
   - Ítems: `role="menuitem"`.
2. Eventos de cierre:
   - Clic en cualquier elemento exterior del menú (`document.addEventListener('click', ...)`).
   - Pulsación de la tecla `Escape`.
   - Selección de cualquiera de las opciones del menú (ejecuta la acción y cierra inmediatamente).
   - Al cerrar mediante `Escape`, el foco retorna al botón disparador.

### Rationale
- Garantiza cumplimiento con los estándares de accesibilidad para lectores de pantalla y navegación asistida por teclado.
- Evita que el usuario quede atrapado con el menú tapando las tarjetas de la mesa.

---

## 3. Estado Reactivo y Sincronización con Participantes

### Decision
En el método `update(participants: Participant[])` de `HeaderSummaryComponent`:
- Tanto los botones de escritorio como los ítems del menú móvil actualizan su propiedad `disabled` de forma simultánea (`disabled = participants.length === 0` para Compartir y PDF).
- Si el menú estuviera abierto y se reinicia la mesa, se cierra automáticamente.
