# Feature Specification: Agrupación de Acciones de Cabecera en Dispositivos Móviles

**Feature Branch**: `012-mobile-header-actions`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "necesito en mobile agrupar las acciones de la cabecera de la app porque está muy sobrecargado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Menú de acciones agrupadas en vista móvil (Priority: P1) 🎯 MVP

Como usuario que utiliza la aplicación desde un teléfono móvil en la mesa de juego, quiero que los botones de acción de la cabecera ("Compartir", "Exportar PDF" y "Reiniciar") se agrupen bajo un único botón desplegable de acciones ("Acciones ▾"), para que la barra superior fija no quede saturada de texto ni botones apretados, manteniendo despejada la información principal (el título de la mesa y el importe total acumulado).

**Why this priority**: Resuelve directamente el problema de sobrecarga y falta de espacio en pantallas móviles estrechas, donde tres botones de acción provocan desbordamientos visuales o reducción excesiva del tamaño de la información clave.

**Independent Test**: Redimensionar el navegador o abrir la app en un viewport móvil (< 680px de ancho) y comprobar que en lugar de mostrarse los tres botones individuales sueltos, se muestra un único botón "Acciones ▾" que al pulsarse despliega un menú con "Compartir cuenta", "Exportar a PDF" y "Reiniciar mesa", y que al seleccionar cualquiera de ellas se ejecuta la acción y se cierra el menú.

**Acceptance Scenarios**:

1. **Given** una pantalla móvil (< 680px), **When** se visualiza la cabecera, **Then** solo se muestra un botón agrupador de acciones ("Acciones ▾") junto al total de la mesa.
2. **Given** la cabecera en móvil, **When** el usuario pulsa en el botón agrupador de acciones, **Then** se despliega un menú flotante con las opciones: "Compartir cuenta", "Exportar a PDF" y "Reiniciar mesa".
3. **Given** el menú de acciones abierto, **When** el usuario pulsa sobre "Compartir cuenta", **Then** se activa el flujo de compartir y el menú se cierra automáticamente.

---

### User Story 2 - Cierre fluido y accesibilidad del menú desplegable (Priority: P2)

Como usuario que ha abierto el menú de acciones en móvil, quiero que el menú se cierre limpiamente si pulso fuera de él, si vuelvo a pulsar el botón agrupador o si presiono la tecla Escape, para poder cancelar la interacción sin esfuerzo y sin que el menú tape el contenido de la mesa.

**Why this priority**: Garantiza una experiencia de usuario natural y accesible en pantallas táctiles y teclado, evitando que el usuario quede atrapado con el menú abierto.

**Independent Test**: Abrir el menú de acciones en móvil, pulsar en cualquier área fuera del menú (o pulsar Escape en teclado) y comprobar que el menú desaparece de inmediato.

**Acceptance Scenarios**:

1. **Given** el menú de acciones abierto en móvil, **When** el usuario pulsa en cualquier punto fuera del menú, **Then** el menú se cierra de forma inmediata.
2. **Given** el menú de acciones abierto, **When** el usuario presiona la tecla Escape, **Then** el menú se cierra y el foco regresa al botón de acciones.
3. **Given** la navegación asistida o lector de pantalla, **When** se examina el botón de acciones, **Then** cuenta con los atributos `aria-haspopup="true"` y `aria-expanded="false|true"` según su estado.

---

### User Story 3 - Visualización extendida en pantallas grandes (Priority: P3)

Como usuario que utiliza una tablet o pantalla de escritorio (≥ 680px), quiero que las acciones individuales sigan mostrándose directamente en la cabecera sin necesidad de abrir menús desplegables, aprovechando el espacio horizontal disponible.

**Why this priority**: Evita clics innecesarios en pantallas grandes donde hay espacio de sobra para tener los botones siempre visibles y accesibles con un solo clic.

**Independent Test**: Ampliar la ventana a ≥ 680px de ancho y comprobar que los tres botones ("Compartir", "PDF", "Reiniciar") se muestran en línea y el botón agrupador móvil permanece oculto.

**Acceptance Scenarios**:

1. **Given** un viewport de escritorio (≥ 680px), **When** se observa la cabecera, **Then** los botones individuales están visibles en línea y el botón agrupador de acciones está oculto.

---

### User Story 4 - Estado reactivo de las opciones en el menú móvil (Priority: P2)

Como usuario con una mesa recién creada o sin participantes, quiero que las opciones de "Compartir" y "Exportar a PDF" figuren como inactivas o deshabilitadas dentro del menú móvil mientras la mesa no tenga jugadores, igual que ocurre en escritorio.

**Why this priority**: Mantiene la consistencia de reglas de negocio en todos los formatos de visualización.

**Independent Test**: Abrir el menú de acciones con 0 jugadores en la mesa y verificar que las opciones "Compartir" y "Exportar a PDF" se muestran deshabilitadas y no ejecutan ninguna acción al pulsarse.

**Acceptance Scenarios**:

1. **Given** una mesa con 0 participantes en móvil, **When** se despliega el menú de acciones, **Then** "Compartir" y "Exportar a PDF" están deshabilitados.
2. **Given** una mesa con al menos 1 participante, **When** se despliega el menú en móvil, **Then** todas las opciones están habilitadas para su uso.

---

### Edge Cases

- **Cambio dinámico de orientación (pantalla girada en móvil)**: Si el usuario rota el teléfono de vertical a horizontal superando el breakpoint de 680px, el menú desplegable debe cerrarse automáticamente y la barra debe mostrar los botones en línea sin artefactos visuales.
- **Área táctil mínima en el menú**: Cada ítem de acción dentro del menú desplegable debe tener una altura táctil mínima de 44px para permitir toques precisos con el dedo.
- **Anclaje seguro a la derecha**: El menú flotante debe estar alineado al borde derecho del contenedor de la cabecera para evitar que sobresalga de la pantalla y genere scroll horizontal en la página.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE agrupar las acciones de la cabecera ("Compartir", "Exportar PDF" y "Reiniciar") en un único botón desplegable en dispositivos con pantallas móviles (< 680px de ancho).
- **FR-002**: El botón agrupador en móvil DEBE incluir un texto y/o icono intuitivo ("Acciones ▾") y los atributos de accesibilidad `aria-haspopup="true"` y `aria-expanded`.
- **FR-003**: Al pulsar el botón agrupador en móvil, el sistema DEBE alternar la visibilidad de un menú desplegable posicionado bajo la cabecera y anclado a la derecha.
- **FR-004**: Al pulsar sobre cualquier opción del menú móvil, el sistema DEBE invocar el callback de la acción seleccionada y cerrar automáticamente el menú.
- **FR-005**: El menú móvil DEBE cerrarse al hacer clic en cualquier área exterior del menú o al presionar la tecla Escape.
- **FR-006**: Las opciones de "Compartir" y "Exportar PDF" del menú móvil DEBEN deshabilitarse cuando la sesión cuente con 0 participantes, y habilitarse cuando haya 1 o más participantes.
- **FR-007**: En pantallas iguales o mayores a 680px de ancho, el sistema DEBE mostrar los botones de acción individuales desplegados en línea y ocultar el botón agrupador móvil.

### Key Entities *(include if feature involves data)*

- **Estado del Menú Móvil de Cabecera (MobileHeaderMenuState)**:
  - `isOpen`: Booleano que indica si el menú desplegable está visible u oculto.
  - `canShare`: Booleano derivado de si hay participantes (`participants.length > 0`).
  - `canExportPdf`: Booleano derivado de si hay participantes (`participants.length > 0`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El número de botones de acción directos visibles en la cabecera en pantallas móviles (< 680px) se reduce de 3 a 1, disminuyendo la sobrecarga visual de la barra superior.
- **SC-002**: 0 píxeles de desbordamiento horizontal en el ancho del viewport (ancho 100% sin scroll horizontal) en dispositivos móviles de 320px a 679px al abrir o interactuar con el menú.
- **SC-003**: El 100% de las acciones disponibles en escritorio son accesibles en móvil con un máximo de 2 toques (1 para abrir el menú, 1 para pulsar la opción).
- **SC-004**: El cierre del menú por clic exterior o tecla Escape se ejecuta de forma inmediata sin retrasos perceptibles (< 16ms).

## Assumptions

- **Punto de ruptura responsivo**: Se emplea el breakpoint estándar del proyecto (`680px`) para garantizar coherencia con el layout existente en `layout.css`.
- **Persistencia**: El estado abierto o cerrado del menú es puramente temporal y no se persiste entre recargas de página.
