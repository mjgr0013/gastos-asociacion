# Feature Specification: Vista Móvil Compacta y Densidad Visual de Consumiciones

**Feature Branch**: `006-compact-mobile-view`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "en vista mobile necesito hacer más compacta la vista, porque si hay 10 productos ocupan toda la pantalla"

## Clarifications

### Session 2026-10-14
- Q: ¿Cómo debe distribuirse el texto de cada consumición (nombre y precio unitario) en la fila compacta en móviles? (FR-003) → A: Nombre y precio unitario integrados en una sola línea horizontal continua (ej: "Refresco · 1,50€"), logrando una altura mínima de fila de aproximadamente 36px y evitando saltos de línea.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Filas de consumición compactas de alta densidad en móvil (Priority: P1)

Como jugador o anfitrión que utiliza el teléfono móvil en la mesa de juego, quiero que las líneas de consumición dentro de cada tarjeta ocupen un espacio vertical optimizado (padding reducido, tipografía ajustada y controles en una única fila compacta) para que una lista de 8 a 10 productos se visualice cómodamente sin ocupar toda la pantalla ni exigir scroll constante.

**Why this priority**: Resuelve directamente el problema reportado: el exceso de espacio vertical desperdiciado en móvil por cada producto cuando hay muchas consumiciones en la partida.

**Independent Test**: Puede probarse registrando 10 consumiciones en una tarjeta en un viewport móvil (ej: 375px de ancho) y comprobando que cada fila mide ≤42px de alto, reduciendo la altura total ocupada en más de un 40% respecto a la versión anterior mientras los botones de cantidad y borrado siguen siendo cómodos de pulsar.

**Acceptance Scenarios**:

1. **Given** un participante con 10 consumiciones en pantalla móvil, **When** se observa la lista de productos, **Then** cada línea presenta un diseño horizontal compacto donde el nombre, precio, contador de cantidad, subtotal y botón de borrado están alineados sin saltos de línea innecesarios.
2. **Given** un producto con nombre largo (ej: "Hamburguesa doble completa"), **When** se renderiza en la fila compacta, **Then** el texto aplica puntos suspensivos (`ellipsis`) preservando fijos y visibles los controles de cantidad, el subtotal y el botón de borrado.

---

### User Story 2 - Fila de catálogo rápido horizontal no invasiva (Priority: P1)

Como usuario en móvil, quiero que los botones de acceso rápido del catálogo se organicen en una sola fila horizontal desplazable con el dedo (o cuadrícula compacta fija) en lugar de apilarse en 2 o 3 líneas verticales, para no empujar la lista de consumiciones hacia abajo.

**Why this priority**: En pantallas estrechas, los 4 chips de catálogo más el botón "Otro..." ocupaban hasta 3 líneas verticales completas, restando espacio antes de poder ver la primera consumición.

**Independent Test**: Comprobar que en pantallas móviles el contenedor de catálogo rápido ocupa una altura máxima fija de ~40px y permite deslizar horizontalmente con el dedo para acceder a todos los botones.

**Acceptance Scenarios**:

1. **Given** una tarjeta de participante en pantalla móvil, **When** se visualiza el bloque de catálogo rápido, **Then** los botones se disponen en una sola fila horizontal con desplazamiento táctil suave (`overflow-x: auto`), sin ocupar múltiples líneas verticales.
2. **Given** el catálogo en móvil, **When** el usuario desliza con el dedo, **Then** puede alcanzar todos los productos predefinidos y el botón "Otro..." con fluidez.

---

### User Story 3 - Límite de altura máxima con scroll interno por tarjeta (Priority: P2)

Como usuario con varios participantes en la mesa, quiero que cuando una tarjeta tenga muchas consumiciones (más de 5 o 6), la lista de productos disponga de un scroll interno suave en lugar de estirar infinitamente la tarjeta, para poder ver y acceder a las tarjetas de los demás jugadores de la partida sin scroll kilométrico.

**Why this priority**: Evita que un jugador que pida muchas cosas monopolice toda la pantalla del teléfono, manteniendo el contexto global de la mesa.

**Independent Test**: Añadir 10 consumiciones a una tarjeta y verificar que la lista interna tiene una altura máxima delimitada con scroll vertical propio, permitiendo ver a los participantes adyacentes.

**Acceptance Scenarios**:

1. **Given** un participante con 10 consumiciones en móvil, **When** se expande la tarjeta, **Then** la lista de consumiciones tiene una altura máxima acotada (entre 260px y 300px) con scroll vertical interno suave.

---

### Edge Cases

- **Nombres de productos muy largos**: Deben truncarse limpiamente con `text-overflow: ellipsis` sin que el precio o los botones se desplacen fuera de la pantalla.
- **Área táctil mínima en botones compactos**: Los botones de incremento (`＋`), decremento (`－`) y borrado (`✕`) deben conservar un padding táctil adecuado para evitar pulsaciones erróneas o dobles clics involuntarios.
- **Vista en tablet y escritorio**: La optimización de densidad compacta no debe deteriorar la estética ni la legibilidad en pantallas grandes (mantener diseño armónico en grid de 2 y 3 columnas).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE reducir la altura vertical de cada fila de consumición a aproximadamente 36px-38px en dispositivos móviles, compactando márgenes y espaciados internos.
- **FR-002**: El sistema DEBE organizar los botones del catálogo rápido en dispositivos móviles en una sola fila horizontal con desplazamiento táctil (`overflow-x: auto`) con una altura máxima de 40px.
- **FR-003**: El sistema DEBE integrar en una sola línea horizontal continua el nombre del producto y su precio unitario (ej: `Refresco · 1,50€`, con truncado por elipsis en nombres largos), junto con el selector compacto de cantidad (`- [N] +`), subtotal formateado y botón de eliminación.
- **FR-004**: El sistema DEBE aplicar una altura máxima acotada (entre 260px y 300px) con scroll vertical interno en la lista de consumiciones de cada tarjeta cuando supere 5 productos en pantallas móviles.
- **FR-005**: El sistema DEBE compactar los espaciados y padding de la cabecera fija (`header-summary`) y del formulario de añadir jugador en dispositivos móviles para maximizar el área visible de tarjetas.
- **FR-006**: Todos los botones de acción (`+`, `-`, `✕`, chips de catálogo) DEBEN mantener un área reactiva táctil accesible para interacción precisa con un dedo.

### Key Entities *(include if feature involves data)*

- **Presentación Visual Compacta (CSS Mobile Density Layout)**:
  - Propiedades: Altura de fila de ítem, layout flex/grid horizontal, scroll interno de lista, chips desplazables horizontalmente.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Una lista de 10 consumiciones reduce su altura total en al menos un 40% en viewports móviles estándar (375px a 414px de ancho).
- **SC-002**: El bloque de catálogo rápido pasa de ocupar hasta 3 líneas verticales a una única fila de 40px de alto en móvil.
- **SC-003**: Cero desbordamiento horizontal en el ancho total de la página (ancho de página = 100% del viewport sin scroll horizontal global).
- **SC-004**: Los usuarios pueden pulsar los botones de incremento, decremento y borrado sin experimentar toques accidentales en elementos vecinos.

## Assumptions

- **Compatibilidad de datos**: La optimización es puramente visual y de estilos CSS (junto con pequeños ajustes de maquetación en las plantillas de componentes), sin impacto en la lógica financiera, en los cálculos de subtotales ni en la persistencia de `localStorage`.
- **Adaptabilidad responsiva**: Los estilos compactos se aplican con enfoque Mobile-First asegurando que en tablet y escritorio la presentación continúe siendo espaciosa y equilibrada.
