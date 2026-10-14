# Feature Specification: Desplegado y Colapsado de Consumiciones por Participante

**Feature Branch**: `002-collapsible-participant-items`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Quiero que la información de las consumiciones de cada participante se pueda colapsar"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Colapsar y expandir individualmente las consumiciones de un participante (Priority: P1)

Como jugador o anfitrión en una sesión de juegos de mesa, quiero poder plegar (colapsar) el cuerpo de consumiciones y catálogo de la tarjeta de un participante para ahorrar espacio vertical en la pantalla del móvil y tener una visión global y compacta de todos los jugadores de la mesa con sus subtotales.

**Why this priority**: Es la funcionalidad principal solicitada por el usuario para resolver el exceso de scroll vertical cuando hay varios jugadores o muchas consumiciones anotadas.

**Independent Test**: Puede probarse de forma independiente registrando participantes con consumiciones, pulsando el control de alternancia en una tarjeta y comprobando que el desglose de consumiciones y los botones de catálogo se ocultan mientras la cabecera con el nombre y subtotal permanece visible e interactiva.

**Acceptance Scenarios**:

1. **Given** un participante "Carlos" con 3 consumiciones en estado expandido, **When** el usuario pulsa en el control de colapso de la tarjeta de "Carlos", **Then** el catálogo rápido y la lista de consumiciones se ocultan, y la cabecera muestra el nombre "Carlos", su subtotal acumulado y el indicador en posición colapsada.
2. **Given** un participante "Carlos" en estado colapsado, **When** el usuario pulsa en el control de expansión de su tarjeta, **Then** el catálogo rápido y la lista detallada de consumiciones vuelven a ser visibles.
3. **Given** varios participantes en la mesa, **When** se colapsa la tarjeta de "Carlos", **Then** el estado de despliegue de las tarjetas de los demás participantes no se ve afectado (comportamiento independiente por participante).

---

### User Story 2 - Resumen visual y accesibilidad en la cabecera colapsada (Priority: P2)

Como usuario que visualiza la mesa en el teléfono móvil, quiero que la cabecera colapsada muestre claramente un indicador de orientación (chevron/flecha) y el recuento de consumiciones para conocer el estado y volumen de gasto de cada persona sin necesidad de abrir la tarjeta.

**Why this priority**: Proporciona información contextual inmediata y garantiza que la interfaz sea clara y accesible tanto de forma táctil como mediante tecnologías de asistencia o teclado.

**Independent Test**: Puede probarse verificando que al colapsar una tarjeta con 2 consumiciones, la cabecera refleja el indicador correspondiente, el atributo accesible `aria-expanded="false"`, y que la activación mediante teclado (Enter o Espacio) alterna el estado correctamente.

**Acceptance Scenarios**:

1. **Given** una tarjeta de participante expandida, **When** se inspecciona el control de despliegue, **Then** presenta el atributo `aria-expanded="true"` y un indicador visual orientado hacia arriba (▲ o chevron up).
2. **Given** una tarjeta de participante colapsada, **When** se inspecciona el control de despliegue, **Then** presenta el atributo `aria-expanded="false"` y un indicador visual orientado hacia abajo (▼ o chevron down).
3. **Given** un usuario que navega con teclado, **When** enfoca el botón de alternancia y presiona `Enter` o `Espacio`, **Then** la tarjeta alterna su estado entre expandida y colapsada.

---

### User Story 3 - Estado inicial consistente al dar de alta participantes (Priority: P3)

Como usuario que anota gastos en plena partida, quiero que cuando añada a un nuevo participante a la mesa, su tarjeta aparezca expandida por defecto para poder asignarle inmediatamente sus primeras consumiciones sin clics adicionales.

**Why this priority**: Minimiza la fricción operativa durante el juego, permitiendo añadir un jugador y seleccionar enseguida un producto del catálogo rápido.

**Independent Test**: Puede probarse creando un nuevo participante en la mesa y verificando que su tarjeta se renderiza inicialmente con el catálogo rápido visible y listo para recibir toques.

**Acceptance Scenarios**:

1. **Given** la aplicación abierta, **When** el usuario introduce el nombre de un nuevo participante y pulsa en añadir, **Then** la nueva tarjeta se crea y muestra en estado expandido.

---

### Edge Cases

- **Añadir consumición a participante colapsado**: Si en el futuro se recibiera un evento o actualización de consumiciones para un participante colapsado, el subtotal de la cabecera debe actualizarse en tiempo real de forma inmediata sin obligar a expandir la tarjeta.
- **Eliminar participante colapsado**: El botón de eliminación del participante debe ser accesible y funcional tanto si la tarjeta está colapsada como si está expandida, solicitando la confirmación de borrado correspondiente si tiene gastos.
- **Participante sin consumiciones**: Si un participante no tiene ninguna consumición registrada, la tarjeta igualmente puede colapsarse y expandirse normalmente.
- **Transiciones y animaciones en móviles antiguos**: La ocultación/visualización del bloque de contenido debe ser fluida, instantánea y no generar desbordamientos horizontales ni desfases en la altura calculada de la cuadrícula.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir alternar (colapsar y expandir) individualmente el bloque de contenido (catálogo rápido y lista de consumiciones) de cada tarjeta de participante.
- **FR-002**: La cabecera de la tarjeta del participante DEBE permanecer siempre visible tanto en estado expandido como colapsado, mostrando el avatar, el nombre del participante, el subtotal acumulado y el botón de eliminación.
- **FR-003**: El sistema DEBE incluir un control de alternancia interactivo en la tarjeta con un indicador visual (ej: icono chevron o flecha) que señale inequívocamente si la tarjeta está abierta o cerrada.
- **FR-004**: El control de alternancia DEBE incluir atributos de accesibilidad estándar (`aria-expanded="true|false"` y `aria-controls` o `aria-label`) y ser operable mediante teclado (teclas Enter y Espacio).
- **FR-005**: El sistema DEBE mantener el subtotal y el total global de la mesa calculados y sincronizados en tiempo real independientemente del estado colapsado o expandido de las tarjetas.
- **FR-006**: Las tarjetas de participantes recién creados DEBEN mostrarse por defecto en estado expandido para permitir la asignación inmediata de consumiciones.
- **FR-007**: El estado colapsado o expandido de un participante NO DEBE alterar ni afectar a los estados de colapso de los demás participantes de la mesa.

### Key Entities *(include if feature involves data)*

- **Estado de Visualización de Tarjeta (UI View State)**:
  - Atributos conceptuales: Identificador de participante (`participantId`), indicador booleano de despliegue (`isCollapsed: boolean`, false por defecto al crear).
- **Participante** (Entidad de dominio existente):
  - Mantiene sus atributos de negocio (nombre, lista de consumiciones, subtotal acumulado). El estado de colapso es un estado de presentación visual de la tarjeta en el cliente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La respuesta al pulsar el botón de alternancia para colapsar o expandir la tarjeta se produce en menos de 50 milisegundos.
- **SC-002**: En una sesión con 6 participantes con consumiciones en un dispositivo móvil (viewport de 375px de ancho), colapsar las tarjetas reduce la altura vertical de la lista en más de un 60%, facilitando la vista general de la mesa sin scroll prolongado.
- **SC-003**: El 100% de los controles de alternancia de colapso son totalmente accionables mediante navegación por teclado (foco visible y tecla Enter/Espacio).
- **SC-004**: Cero desincronizaciones en el cálculo en tiempo real de subtotales individuales y del total global al alternar entre estados expandido y colapsado.

## Assumptions

- **Persistencia del estado de colapso**: El estado de colapso es un estado de interfaz de usuario de la sesión activa en el navegador; no modifica el esquema de datos persistido en `localStorage` de las consumiciones y participantes de negocio, garantizando compatibilidad con versiones previas.
- **Estado inicial por defecto**: Los participantes nuevos se inician expandidos para agilizar la entrada de datos; el usuario puede colapsarlos en cualquier momento con un solo toque.
- **Interacción**: Se puede colapsar/expandir pulsando el botón dedicado de la cabecera o la barra superior de la tarjeta (excepto al pulsar específicamente en el botón de eliminar participante).
