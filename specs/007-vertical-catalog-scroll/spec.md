# Feature Specification: Desplazamiento Vertical y Altura de 100px en Catálogo Rápido

**Feature Branch**: `007-vertical-catalog-scroll`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero darle al quick-catalog-chips un alto de 100 px y el flex-wrap: wrap para ver varios elementos y poder hacer scroll vertical"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Catálogo rápido multielemento con altura de 100px y scroll vertical (Priority: P1)

Como jugador o anfitrión en la mesa de juego, quiero que los botones del catálogo rápido se muestren en varias filas aprovechando el ancho de la tarjeta (`flex-wrap: wrap`) dentro de un bloque con altura de 100px y desplazamiento vertical (`overflow-y: auto`), para visualizar varios productos simultáneamente de un solo vistazo y deslizar hacia abajo cómodamente si hay más elementos.

**Why this priority**: Es la especificación directa del usuario para mejorar la visualización simultánea de productos rápidos en la tarjeta sin perder el control de la altura vertical de la pantalla.

**Independent Test**: Puede probarse abriendo una tarjeta de participante, verificando que los chips se distribuyen en múltiples líneas ocupando un contenedor de 100px de alto, y que al contener más elementos de los que caben en 100px se activa el scroll vertical.

**Acceptance Scenarios**:

1. **Given** una tarjeta de participante expandida, **When** se visualiza el catálogo rápido, **Then** el contenedor `.quick-catalog-chips` mide 100px de alto y los chips se distribuyen en múltiples líneas (`flex-wrap: wrap`).
2. **Given** un catálogo con múltiples elementos, **When** el contenido excede los 100px de altura, **Then** el contenedor permite desplazamiento vertical suave (`overflow-y: auto`) sin desbordamientos horizontales.

---

### Edge Cases

- **Márgenes y barra de scroll**: El padding derecho del contenedor debe prever el espacio para la barra de desplazamiento en navegadores de escritorio para evitar que los chips queden recortados.
- **Área táctil en móvil**: El desplazamiento vertical dentro del catálogo rápido no debe bloquear el scroll natural de la página cuando se desliza desde fuera del área del catálogo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El contenedor `.quick-catalog-chips` DEBE tener una altura establecida de 100px (`height: 100px` o `max-height: 100px`).
- **FR-002**: El contenedor `.quick-catalog-chips` DEBE aplicar `flex-wrap: wrap`, permitiendo que los chips se ubiquen en múltiples líneas consecutivas.
- **FR-003**: El contenedor `.quick-catalog-chips` DEBE habilitar desplazamiento vertical (`overflow-y: auto`) con soporte táctil fluido (`-webkit-overflow-scrolling: touch`).
- **FR-004**: El contenedor `.quick-catalog-chips` DEBE deshabilitar el desplazamiento horizontal (`overflow-x: hidden`).
- **FR-005**: Los chips individuales (`.chip`) DEBEN mantener su tamaño compacto y su interactividad táctil completa.

### Key Entities *(include if feature involves data)*

- **Presentación Visual del Catálogo Rápido (CSS Layout)**:
  - Clases: `.quick-catalog-chips`, `.chip`.
  - Propiedades: `height: 100px`, `flex-wrap: wrap`, `overflow-y: auto`, `overflow-x: hidden`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La altura del contenedor `.quick-catalog-chips` es de exactamente 100px.
- **SC-002**: Al menos 4 a 6 botones de productos son visibles de forma simultánea sin necesidad de realizar scroll en pantallas móviles comunes (≥360px).
- **SC-003**: Cero desbordamiento horizontal en el catálogo rápido (`overflow-x` permanece en 0px).

## Assumptions

- **Ajuste visual de estilos**: Esta mejora ajusta las reglas de estilo CSS de `.quick-catalog-chips` sin modificar la lógica de adición de consumiciones ni las entidades de dominio.
