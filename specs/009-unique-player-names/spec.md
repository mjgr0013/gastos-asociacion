# Feature Specification: Nombres Únicos y Formateo con Mayúscula para Jugadores

**Feature Branch**: `009-unique-player-names`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Los nombres de los jugadores no se pueden repetir, se han de formatear con la primera letra en mayúscula para evitar duplicados tontos como \"Manu\" y \"manu\""

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Formateo automático de la primera letra en mayúscula (Priority: P1) 🎯 MVP

Como anfitrión o jugador que registra participantes en la mesa desde un teléfono móvil o teclado de escritorio, quiero que al escribir un nombre en minúsculas (ej. "manu") o con espacios periféricos el sistema lo formatee automáticamente con la primera letra en mayúscula (ej. "Manu"), para que las tarjetas de los jugadores y los resúmenes exportados luzcan limpios, homogéneos y profesionales sin necesidad de cambiar manualmente a mayúsculas en el teclado.

**Why this priority**: Resuelve la inconsistencia visual y simplifica la entrada de datos en móvil, donde frecuentemente se escriben nombres rápidos en minúsculas. Es la base sobre la que se apoya la experiencia de usuario y la normalización de nombres.

**Independent Test**: Introducir "manu" en el formulario de participante, pulsar "Añadir" y verificar que el jugador se crea y muestra con el nombre "Manu".

**Acceptance Scenarios**:

1. **Given** el formulario de nuevo participante vacío, **When** el usuario introduce "manu" y pulsa "Añadir", **Then** el jugador se añade a la mesa con el nombre "Manu".
2. **Given** el formulario de nuevo participante, **When** el usuario introduce "  carlos  " (con espacios al inicio y final), **Then** los espacios se eliminan y el jugador se añade como "Carlos".
3. **Given** un nombre que comienza con un carácter con tilde como "ángel", **When** se añade a la mesa, **Then** la primera letra se capitaliza correctamente como "Ángel".

---

### User Story 2 - Prevención y rechazo de nombres duplicados (Priority: P2)

Como usuario que anota consumiciones para los jugadores de la partida, quiero que el sistema me impida añadir dos veces al mismo jugador (incluso si se escribe con diferente combinación de mayúsculas y minúsculas o con espacios), para evitar tener dos tarjetas del mismo participante y no generar discrepancias al repartir la cuenta.

**Why this priority**: Evita errores críticos en la gestión de cuentas donde dos personas puedan compartir nombre accidentalmente o donde el anfitrión cree por error dos participantes "Manu" y "manu" asignando consumiciones en lugares distintos.

**Independent Test**: Añadir un participante llamado "Manu", intentar añadir a continuación otro participante llamado "manu" o "MANU", y comprobar que la operación se rechaza mostrando un mensaje de error y sin duplicar tarjetas en la lista.

**Acceptance Scenarios**:

1. **Given** una mesa con un participante ya existente llamado "Manu", **When** el usuario intenta añadir un nuevo participante con el nombre "manu", "MANU" o "Manu", **Then** el sistema rechaza la creación y muestra un mensaje de advertencia: "Ya existe un jugador con este nombre en la mesa".
2. **Given** una mesa con un participante llamado "Carlos", **When** se intenta añadir "  carlos  ", **Then** el sistema detecta la duplicidad tras la normalización y no crea el nuevo jugador.
3. **Given** un rechazo por nombre duplicado, **When** se comprueba el estado de la mesa, **Then** el número total de participantes y sus consumiciones permanecen inalterados.

---

### User Story 3 - Limpieza y recuperación tras error de validación (Priority: P3)

Como usuario que ha recibido un mensaje de error por nombre duplicado, quiero que al corregir el campo y enviar un nombre válido el mensaje de error desaparezca de inmediato y el campo quede listo para el siguiente jugador.

**Why this priority**: Facilita la interacción fluida al añadir múltiples jugadores sucesivamente tras una corrección.

**Independent Test**: Forzar un error de duplicado introduciendo un nombre existente, comprobar que aparece el mensaje de error, cambiar el texto por un nombre nuevo y enviar, verificando que el error desaparece y el nuevo jugador queda añadido.

**Acceptance Scenarios**:

1. **Given** un mensaje de error activo en el formulario ("Ya existe un jugador con este nombre en la mesa"), **When** el usuario introduce un nombre válido y no duplicado (ej. "Elena") y pulsa "Añadir", **Then** el jugador "Elena" se añade a la mesa, el campo de texto se vacía y el mensaje de error se oculta.

---

### Edge Cases

- **Nombres de una sola letra**: Introducir "m" debe formatearse a "M". Si ya existe "M", un nuevo intento con "m" debe ser rechazado como duplicado.
- **Nombres con tildes y caracteres internacionales**: Nombres con acentos como "ángel" deben capitalizarse a "Ángel". "ángel" y "Ángel" deben considerarse duplicados equivalentes.
- **Nombres compuestos**: Si el usuario introduce "juan carlos", la primera letra se capitaliza a "Juan carlos" (o capitalización de la primera letra del nombre completo).
- **Nombres con múltiples espacios internos o extremos**: "   manu   " se recortará a "Manu". Los espacios sobrantes no deben eludir el filtro de duplicados.
- **Mantenimiento de reglas existentes**: Los nombres vacíos o que contengan solo espacios seguirán siendo rechazados con el mensaje de nombre obligatorio ("Por favor, introduce el nombre del participante."), y los nombres mayores de 50 caracteres seguirán limitados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE formatear automáticamente cualquier nombre de participante capitalizando su primera letra antes de almacenarlo o mostrarlo.
- **FR-002**: El sistema DEBE recortar los espacios en blanco iniciales y finales (trim) del nombre del participante antes de su formateo y validación.
- **FR-003**: El sistema DEBE verificar si ya existe un participante con el mismo nombre en la sesión activa antes de permitir su creación.
- **FR-004**: La comprobación de unicidad de nombres DEBE ser insensible a mayúsculas y minúsculas (case-insensitive) y omitir espacios superfluos al inicio y final.
- **FR-005**: Si se intenta registrar un participante cuyo nombre normalizado ya existe en la mesa, el sistema DEBE rechazar la creación y mostrar un mensaje de error descriptivo: "Ya existe un jugador con este nombre en la mesa".
- **FR-006**: El sistema DEBE mantener y aplicar las validaciones previas de formato de nombre: rechazar nombres vacíos o compuestos únicamente por espacios y no exceder los 50 caracteres de longitud máxima.
- **FR-007**: Si se produce un error de validación (por nombre vacío o duplicado), el sistema DEBE mantener el foco en el campo de entrada del nombre para agilizar su corrección.
- **FR-008**: Al enviar con éxito un nombre válido y no duplicado, el sistema DEBE limpiar cualquier mensaje de error visible y restablecer el campo de texto a vacío.

### Key Entities *(include if feature involves data)*

- **Participante (Participant)**:
  - Atributo `name`: Cadena de texto de hasta 50 caracteres, sin espacios en los extremos, con su primera letra capitalizada en mayúscula.
  - Invariante de unicidad: Dentro del array de participantes de la sesión, no pueden coexistir dos participantes cuyo `name.trim().toLowerCase()` sea idéntico.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 0% de las sesiones activas contiene participantes duplicados (garantía de unicidad total case-insensitive en la lista de participantes).
- **SC-002**: El 100% de los participantes añadidos a la mesa tienen su primera letra en mayúscula en su nombre registrado.
- **SC-003**: La detección de nombres duplicados y la presentación del mensaje de error se produce de forma inmediata en menos de 20 milisegundos tras pulsar en añadir.
- **SC-004**: Cero pérdida de participantes o consumiciones existentes al rechazar un intento de adición duplicada.

## Assumptions

- **Ámbito de unicidad**: La restricción de unicidad aplica a nivel de la sesión actual de la mesa (no existe base de datos global ni cuentas compartidas entre múltiples sesiones).
- **Formateo de nombres compuestos**: La capitalización se asegura en el primer carácter alfabético del nombre completo; si el usuario introduce un nombre compuesto en minúsculas (ej. "juan carlos"), la primera letra pasa a mayúscula ("Juan carlos").
- **Edición / Renombrado**: Actualmente los participantes se crean y se eliminan; si en el futuro se implementara el renombrado de un participante, deberá someterse a la misma regla de unicidad y capitalización.
