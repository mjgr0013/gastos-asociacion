# Feature Specification: Control de Gastos de Consumiciones en Sesiones de Juegos de Mesa

**Feature Branch**: `001-boardgame-expense-tracker`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Crear una aplicación web estática para controlar gastos de consumiciones en sesiones de juegos de mesa, desplegable en GitHub Pages. Requisitos funcionales: 1. Interfaz responsive optimizada para móvil y pantalla grande. 2. Gestión de participantes: añadir personas (ej: Manu, Carlos) y eliminarlas. 3. Catálogo rápido o formulario de consumiciones por participante: producto, precio unitario en euros y cantidad (ej: Refresco 1.50€ x2, Snack 1.00€ x1). 4. Desglose en tiempo real: cálculo automático de lo que debe pagar cada persona. 5. Sumatorio global: mostrar el total recaudado/pendiente de la sesión completa. 6. Persistencia automática: guardar el estado actual de la sesión en el localStorage del navegador tras cada cambio para no perder datos si se recarga la pestaña. 7. Botón de 'Reiniciar sesión' con confirmación previa para vaciar la mesa y empezar una nueva cuenta."

## Clarifications

### Session 2026-10-14
- Q: ¿Debe la aplicación permitir marcar a los participantes como 'pagados' para desglosar el total recaudado frente al pendiente? (FR-007) → A: Mantener el flujo simple calculando exclusivamente el importe total global adeudado de la sesión, sin gestionar estados de pago ni marcas de cobro individual.
- Q: ¿Cómo debe ofrecerse la entrada de consumiciones para agilizar el registro durante la partida? (FR-004) → A: Ofrecer botones de catálogo rápido con consumiciones habituales preconfiguradas (ej: Refresco 1.50€, Cerveza 1.50€, Snack 1.00€, Café 1.20€) para asignación ágil con un toque, complementado con un formulario libre para productos y precios personalizados.
- Q: ¿Cómo deben gestionarse los gastos compartidos entre varios participantes (por ejemplo, picoteo o comida común)? (FR-004) → A: Exclusivamente consumiciones individuales por participante; la división automática o prorrateo de gastos compartidos queda explícitamente fuera de alcance para esta versión.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestión de participantes y asignación de consumiciones (Priority: P1)

Como jugador o anfitrión de una sesión de juegos de mesa, quiero poder añadir los nombres de los participantes y registrar las consumiciones de cada uno tanto mediante accesos directos de productos habituales como mediante formulario libre (producto, precio unitario en euros y cantidad) para llevar un control claro y ordenado de los gastos individuales durante la partida.

**Why this priority**: Es el núcleo esencial de valor de la herramienta. Sin participantes ni registro de consumos, la aplicación no tiene utilidad práctica.

**Independent Test**: Puede probarse de forma independiente registrando participantes (ej: "Manu", "Carlos"), añadiendo consumiciones a cada uno mediante catálogo rápido (ej: "Refresco 1.50€") o formulario libre (ej: "Snack 1.00€ x1") y verificando que los elementos quedan asociados al participante correspondiente de forma visible.

**Acceptance Scenarios**:

1. **Given** la aplicación abierta sin participantes, **When** el usuario introduce el nombre "Manu" y pulsa en añadir, **Then** "Manu" aparece en la lista de participantes de la mesa listo para recibir consumiciones.
2. **Given** un participante registrado "Carlos", **When** el usuario pulsa en el botón de catálogo rápido "Refresco 1.50€", **Then** se añade inmediatamente un refresco por 1.50 € a la lista de consumiciones de "Carlos".
3. **Given** un participante registrado "Carlos", **When** se le añade una consumición manual mediante formulario libre con producto "Tapa especial", precio unitario "2.50" y cantidad "2", **Then** dicha consumición aparece listada bajo la tarjeta o sección de "Carlos".
4. **Given** un participante con consumiciones registradas, **When** el usuario pulsa en eliminar participante y confirma la acción, **Then** el participante y sus consumiciones asociadas desaparecen de la mesa.

---

### User Story 2 - Cálculo en tiempo real de subtotales individuales y total global (Priority: P1)

Como participante o anfitrión, quiero ver de forma automática e inmediata cuánto debe pagar cada persona y el sumatorio total acumulado de toda la mesa para saber la cuenta exacta sin necesidad de cálculos manuales.

**Why this priority**: Resuelve la principal molestia durante una sesión de juego: calcular deudas y cuadrar el importe total recaudado/pendiente.

**Independent Test**: Puede probarse de forma independiente añadiendo múltiples consumiciones a varios participantes y verificando que el total individual de cada participante coincide con la suma de sus consumiciones (`precio unitario * cantidad`), y que el total global de la mesa refleja fielmente la suma de todos los subtotales individuales.

**Acceptance Scenarios**:

1. **Given** el participante "Manu" con consumición "Refresco 1.50€ x2" (3.00€) y "Snack 1.00€ x1" (1.00€), **When** se visualiza su tarjeta, **Then** su subtotal individual muestra exactamente "4.00 €".
2. **Given** "Manu" con un subtotal de 4.00 € y "Carlos" con un subtotal de 3.50 €, **When** se consulta el sumatorio global de la mesa, **Then** el marcador de total muestra "7.50 €".
3. **Given** una consumición existente de 2 unidades a 1.50 €, **When** se incrementa la cantidad a 3 unidades o se elimina la línea, **Then** el subtotal del participante y el total global se actualizan inmediatamente sin recargar la página.

---

### User Story 3 - Persistencia automática ante recargas o cierres de pestaña (Priority: P2)

Como usuario que utiliza el teléfono móvil en la mesa de juego, quiero que cualquier modificación se guarde de forma automática en el almacenamiento local del navegador para no perder los datos si la pantalla se apaga, se recarga la pestaña o se abre otra aplicación.

**Why this priority**: En sesiones de juego prolongadas en móviles es muy común que el navegador suspenda o recargue pestañas en segundo plano. La pérdida de datos arruinaría la experiencia.

**Independent Test**: Puede probarse registrando varios participantes y consumiciones, cerrando o recargando el navegador, y comprobando que al volver a abrir la aplicación todos los participantes, consumiciones y totales calculados se restauran exactamente en el mismo estado.

**Acceptance Scenarios**:

1. **Given** una sesión activa con participantes y consumiciones asignadas, **When** el usuario recarga la página en su navegador, **Then** todos los participantes, consumiciones y totales permanecen idénticos a como estaban antes de recargar.
2. **Given** una sesión restaurada, **When** el usuario añade un nuevo participante o modifica una consumición, **Then** el nuevo estado queda actualizado y preservado para futuras visitas.

---

### User Story 4 - Reinicio seguro de sesión con confirmación (Priority: P2)

Como anfitrión de la sesión, quiero un botón para vaciar la mesa y comenzar una cuenta nueva desde cero, solicitando confirmación previa obligatoria para evitar borrados accidentales durante la partida.

**Why this priority**: Permite reutilizar la herramienta en sucesivas partidas o quedadas, evitando al mismo tiempo el riesgo catastrófico de borrar la cuenta en curso por un toque accidental.

**Independent Test**: Puede probarse intentando reiniciar la sesión: comprobando que si se cancela la confirmación los datos permanecen intactos, y si se acepta la confirmación la mesa queda completamente limpia y con total a 0.00 €.

**Acceptance Scenarios**:

1. **Given** una mesa con participantes y consumos acumulados, **When** el usuario pulsa en "Reiniciar sesión" y cancela la advertencia, **Then** ningún dato se borra y la sesión continúa inalterada.
2. **Given** una mesa con participantes y consumos acumulados, **When** el usuario pulsa en "Reiniciar sesión" y confirma explícitamente, **Then** se eliminan todos los participantes y consumiciones, el total global vuelve a 0.00 € y el almacenamiento persistente queda reiniciado.

---

### User Story 5 - Interfaz responsive optimizada para móvil y pantalla grande (Priority: P3)

Como usuario, quiero utilizar la aplicación con la misma comodidad desde la pantalla táctil de un smartphone (con botones táctiles accesibles y tipografía clara) que desde una tablet o portátil colocado en la mesa.

**Why this priority**: Los usuarios en mesas de juegos suelen interactuar desde sus teléfonos móviles mientras juegan, por lo que la ergonomía táctil y la ausencia de desbordamientos son fundamentales para el uso real.

**Independent Test**: Puede probarse ajustando el viewport a medidas típicas de smartphone (ej: 375px de ancho) y de escritorio (1200px+), verificando legibilidad, accesibilidad de controles y distribución adaptativa del catálogo y desglose.

**Acceptance Scenarios**:

1. **Given** un dispositivo móvil de pantalla estrecha, **When** se consulta la aplicación, **Then** los elementos se apilan verticalmente sin desbordamiento horizontal y los botones principales son cómodamente accionables con una sola mano.
2. **Given** una pantalla de escritorio o tablet apaisada, **When** se visualiza la aplicación, **Then** el diseño aprovecha el ancho para distribuir la información de participantes y totales de forma equilibrada y clara.

---

### Edge Cases

- **Nombres vacíos o duplicados**: Si el usuario intenta añadir un participante sin nombre o solo con espacios en blanco, el sistema debe rechazar la acción e indicar que el nombre es obligatorio. Si ya existe un participante con el mismo nombre, se debe permitir o diferenciar para evitar confusiones en la cuenta.
- **Valores numéricos no válidos o negativos**: Si se introduce un precio unitario menor o igual a 0, con caracteres no numéricos o una cantidad menor a 1, el sistema debe bloquear el registro y solicitar valores positivos válidos.
- **Precisión monetaria y decimales**: Los precios en euros deben admitir céntimos (hasta dos posiciones decimales) y los redondeos matemáticos deben evitar discrepancias de céntimos en la suma acumulada.
- **Eliminación de participante con gastos**: Al eliminar un participante que ya tiene consumiciones asignadas, el sistema debe pedir confirmación para evitar que el total de la mesa se descuadre de forma involuntaria.
- **Eliminación de consumición**: Al pulsar el botón de eliminar o reducir la cantidad de una consumición a 0, el sistema debe solicitar confirmación previa indicando el producto y participante para evitar borrados accidentales en dispositivos táctiles.
- **Almacenamiento del navegador lleno o bloqueado**: Si el almacenamiento local del navegador no está disponible (modo incógnito muy restrictivo o cuota excedida), la aplicación debe continuar funcionando en memoria durante la sesión activa e informar al usuario de que los cambios no persistirán ante recargas.
- **Pulsación accidental de reinicio**: El diálogo de confirmación debe requerir una acción deliberada y clara para evitar que un doble clic o toque rápido borre la mesa.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE permitir registrar participantes mediante un nombre visible no vacío.
- **FR-002**: El sistema DEBE permitir eliminar participantes existentes de la sesión de juego.
- **FR-003**: El sistema DEBE solicitar confirmación antes de eliminar a un participante que tenga consumiciones registradas.
- **FR-004**: El sistema DEBE permitir registrar consumiciones vinculadas a un participante específico mediante dos modalidades:
  - **Catálogo rápido**: Botones de acceso directo con productos habituales preconfigurados (mínimo Refresco 1,50 €, Cerveza 1,50 €, Snack 1,00 €, Café 1,20 €) para asignación inmediata con un solo toque.
  - **Formulario libre**: Campos para especificar concepto/nombre del producto personalizado, precio unitario en euros (€) mayor que cero y cantidad entera positiva (mínimo 1).
- **FR-005**: El sistema DEBE permitir modificar la cantidad o eliminar una consumición previamente asignada a un participante, requiriendo confirmación previa antes de eliminarla.
- **FR-006**: El sistema DEBE calcular y mostrar en tiempo real el subtotal adeudado por cada participante (suma de `precio unitario * cantidad` de todas sus consumiciones).
- **FR-007**: El sistema DEBE calcular y mostrar en tiempo real el importe total global adeudado de la sesión (suma acumulada de los subtotales de todos los participantes), sin gestionar estados de pago ni cobro individual.
- **FR-008**: El sistema DEBE formatear todos los importes monetarios en euros con dos decimales estándar (ej: `1,50 €` o `1.50 €`).
- **FR-009**: El sistema DEBE guardar automáticamente el estado íntegro de la sesión (participantes, consumiciones y configuración) en el almacenamiento local del navegador (`localStorage`) inmediatamente después de cualquier creación, edición o borrado.
- **FR-010**: El sistema DEBE recuperar y cargar de manera automática el estado de la sesión almacenado cuando el usuario acceda o recargue la aplicación.
- **FR-011**: El sistema DEBE incluir un botón o acción destacada de "Reiniciar sesión" que vacíe la lista de participantes y consumiciones dejando la cuenta a cero.
- **FR-012**: El sistema DEBE requerir una confirmación explícita del usuario antes de proceder con el reinicio de la sesión.
- **FR-013**: La interfaz DEBE ser completamente responsiva, adaptándose sin scroll horizontal a pantallas móviles (desde 360px de ancho) y pantallas grandes de escritorio.
- **FR-014**: La aplicación DEBE funcionar de forma 100% autónoma en el navegador del cliente sin requerir servidor backend ni bases de datos remotas, siendo apta para su despliegue en GitHub Pages.

### Key Entities *(include if feature involves data)*

- **Participante**: Representa a una persona individual en la mesa de juego.
  - Atributos conceptuales: Identificador único, nombre del participante, colección de consumiciones asignadas, subtotal monetario acumulado.
- **Consumición**: Representa una línea de gasto asociada a un participante.
  - Atributos conceptuales: Identificador único, descripción/nombre del producto (ej: Refresco, Snack, Cerveza, Pizza), precio unitario en euros (€), cantidad de unidades (entero positivo), importe total de la línea (`precio unitario * cantidad`).
- **Sesión de Mesa**: Representa el estado global de la partida o velada actual.
  - Atributos conceptuales: Lista ordenada de participantes activos, total monetario global de la sesión.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Los usuarios pueden dar de alta a un nuevo participante y asignarle su primera consumición en menos de 15 segundos en un dispositivo móvil.
- **SC-002**: El subtotal de cada participante y el sumatorio total de la mesa se recalculan y muestran en pantalla de forma instantánea (en menos de 100 milisegundos tras cualquier cambio en consumiciones o participantes).
- **SC-003**: El 100% de los datos de la sesión (participantes, consumiciones y totales) se conservan intactos tras recargar la página o cerrar la pestaña del navegador.
- **SC-004**: Cero pérdidas accidentales de datos de la sesión por pulsaciones involuntarias en el botón de reinicio, verificado mediante el diálogo de confirmación obligatoria.
- **SC-005**: La interfaz se visualiza y opera sin desbordamiento horizontal en resoluciones móviles estándar (a partir de 360 píxeles de ancho).
- **SC-006**: La aplicación carga y queda lista para interactuar en menos de 1 segundo en conexiones móviles estándar al ser servida como sitio estático.

## Assumptions

- **Entorno de ejecución**: El usuario utiliza un navegador web moderno (Chrome, Safari, Firefox, Edge en sus versiones recientes) con soporte para almacenamiento local en el navegador (`localStorage`).
- **Moneda y formato**: La moneda de uso principal es el Euro (€), presentándose con 2 decimales para garantizar la exactitud en céntimos.
- **Concurrencia**: La sesión se gestiona localmente en el dispositivo de quien lleva la cuenta (generalmente el anfitrión o un jugador voluntario); no se requiere sincronización en tiempo real multi-dispositivo ni cuentas de usuario en la nube en esta versión.
- **Catálogo de consumiciones**: Habrá un catálogo de consumiciones definido en un fichero JSON, que tendrán nombre, precio e imagen (desde url externa). Se añadirán consumiciones a cada participante mediante botones. También se podrán eliminar consumiciones añadidas con otro botón de X.
- **Gastos compartidos**: Quedan fuera de alcance en esta versión inicial; cada consumición se asigna íntegramente a un único participante (si se comparte un gasto, los usuarios asignan el importe individualmente o a un único responsable).
- **Despliegue**: La aplicación no requiere backend, APIs de servidor ni autenticación remota, cumpliendo íntegramente los requisitos de despliegue estático en GitHub Pages.
