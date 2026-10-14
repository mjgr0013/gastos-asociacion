# Feature Specification: Resumen de Precios de Productos en la Cuenta Exportada

**Feature Branch**: `008-export-product-prices`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero que en la información de exportar la cuenta se añada un resumen del precio de los productos que al menos tenga una persona"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consulta de precios de referencia de productos consumidos en la cuenta compartida (Priority: P1)

Como jugador o anfitrión que recibe o revisa el resumen exportado de la cuenta de la partida en el grupo de mensajería (WhatsApp, Telegram) o portapapeles, quiero ver una lista con el precio unitario de cada producto que al menos una persona haya consumido durante la sesión, para entender rápidamente el coste individual de cada consumición sin tener que calcularlo mentalmente o preguntar en el grupo.

**Why this priority**: Es el valor nuclear solicitado por el usuario. Al liquidar una cuenta entre varias personas, suele haber dudas sobre el precio unitario de los productos consumidos (por ejemplo, "¿a cuánto estaba el refresco?" o "¿cuánto costaba cada snack?"). Incluir esta tabla de referencia en el resumen compartido aporta total transparencia inmediata.

**Independent Test**: Registrar participantes con consumiciones asignadas (por ejemplo "Manu" con 2x Refresco a 1,50 € y "Carlos" con 1x Snack a 1,00 €), pulsar en "Compartir" y verificar que el texto generado contiene una sección de precios con `• Refresco: 1,50 €` y `• Snack: 1,00 €`.

**Acceptance Scenarios**:

1. **Given** una sesión con los participantes "Manu" (2x Refresco a 1,50 €) y "Carlos" (1x Snack a 1,00 €), **When** se pulsa en "Compartir" para exportar la cuenta, **Then** el mensaje resultante incluye una sección identificada de precios que lista `• Refresco: 1,50 €` y `• Snack: 1,00 €`.
2. **Given** un catálogo con productos disponibles (por ejemplo Cerveza o Golosinas) que ningún jugador ha seleccionado en la partida, **When** se genera el resumen para compartir, **Then** esos productos no consumidos no aparecen en la sección de precios.

---

### User Story 2 - Desduplicación y ordenación de productos en la lista de precios (Priority: P2)

Como usuario que visualiza el resumen compartido, quiero que cada producto consumido aparezca una sola vez en la lista de precios unitarios y esté ordenado de forma lógica (alfabéticamente), independientemente de cuántos participantes lo hayan pedido o cuántas unidades se hayan consumido.

**Why this priority**: Si varios participantes piden el mismo artículo (por ejemplo, tres personas piden "Refresco"), repetir el producto en la lista de precios generaría ruido visual innecesario en un mensaje de chat móvil. La desduplicación y el orden alfabético garantizan una lectura rápida y limpia.

**Independent Test**: Añadir varios participantes que coincidan en haber consumido "Refresco" y verificar que en la sección de precios el ítem "Refresco" aparece una única vez.

**Acceptance Scenarios**:

1. **Given** los participantes "Manu" (1x Refresco a 1,50 €), "Carlos" (2x Refresco a 1,50 €) y "Elena" (1x Pizza a 6,50 €), **When** se exporta la cuenta, **Then** en la sección de precios "Refresco: 1,50 €" se muestra una sola vez.
2. **Given** consumiciones de diferentes productos ("Snack", "Café caliente", "Refresco"), **When** se genera el resumen, **Then** la lista de precios se presenta ordenada alfabéticamente por el nombre del producto ("Café caliente", "Refresco", "Snack").

---

### User Story 3 - Omisión limpia de la sección cuando no hay consumiciones (Priority: P3)

Como usuario que exporta o visualiza una cuenta donde los participantes no tienen ninguna consumición anotada (o una mesa recién creada), quiero que la sección de precios de productos se omita para evitar encabezados vacíos o textos redundantes en el mensaje exportado.

**Why this priority**: Evita mostrar secciones de precios vacías o confusas cuando los jugadores están anotados pero aún no han consumido nada.

**Independent Test**: Crear participantes sin consumiciones (o con 0 consumiciones), pulsar "Compartir" y comprobar que el mensaje no incluye el bloque de precios de productos.

**Acceptance Scenarios**:

1. **Given** participantes registrados en la sesión con 0 consumiciones, **When** se genera el texto para compartir la cuenta, **Then** no se añade la sección de precios de productos y se mantiene el desglose de participantes y total a cero.

---

### Edge Cases

- **Productos personalizados con el mismo nombre y distinto precio unitario**: Si se han añadido consumiciones manuales donde dos ítems tienen el mismo nombre pero diferente precio (por ejemplo un "Bocadillo" a 3,50 € y otro "Bocadillo" a 4,00 €), el resumen de precios debe listar ambas variantes con sus precios respectivos para no ocultar ninguno de los costes reales.
- **Consumiciones con cantidad cero**: Si una consumición tuviera cantidad 0 (o fue reducida a 0 unidades), no se debe considerar producto consumido y no debe figurar en la lista de precios.
- **Caracteres especiales, tildes y mayúsculas/minúsculas**: Los nombres de productos con tildes (ej. "Café"), caracteres especiales o combinaciones de mayúsculas/minúsculas deben ordenarse y unificarse correctamente según las reglas de ordenación del idioma español.
- **Formato monetario uniforme**: Todos los precios de los productos en el resumen deben mostrarse con el mismo formato numérico y de moneda que el resto de la aplicación (dos decimales, coma decimal y símbolo del euro: `X,XX €`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El texto generado para exportar o compartir la cuenta DEBE incluir una sección dedicada al resumen de precios de los productos consumidos en la sesión.
- **FR-002**: La sección de precios de productos DEBE incluir exclusivamente los productos que hayan sido consumidos por al menos un participante con una cantidad mayor que cero.
- **FR-003**: La sección de precios de productos NO DEBE listar ningún producto del catálogo que tenga 0 consumiciones en el conjunto de la sesión.
- **FR-004**: Cada producto consumido con el mismo nombre y precio unitario DEBE mostrarse una única vez en la sección de precios (sin entradas duplicadas).
- **FR-005**: Cada línea de la sección de precios de productos DEBE mostrar el nombre del producto y su precio unitario formateado en euros con dos cifras decimales (formato: `• [Nombre]: [Precio] €`).
- **FR-006**: Si existen productos consumidos con el mismo nombre pero diferente precio unitario, el sistema DEBE listar cada variante de precio de manera diferenciada en la lista.
- **FR-007**: Los productos listados en la sección de precios DEBEN presentarse ordenados alfabéticamente por su nombre.
- **FR-008**: Si ningún participante de la sesión cuenta con consumiciones (todos los participantes tienen 0 consumiciones o no hay consumiciones activas), la sección de precios de productos DEBE omitirse por completo del texto exportado.
- **FR-009**: La sección de precios de productos DEBE integrarse de forma armoniosa en la estructura del mensaje exportado, situándose a continuación del desglose por participante y antes del importe total global de la mesa, separada mediante divisores textuales legibles.

### Key Entities *(include if feature involves data)*

- **Resumen de Precios de Productos Consumidos (Consumed Product Price Entry)**:
  - Representa cada entrada única de producto consumido en la partida.
  - Atributos conceptuales: Nombre del producto, precio unitario de venta al participante.
- **Mensaje de Resumen de Cuenta Exportada (Exported Session Summary)**:
  - Cadena de texto plano estructurada lista para enviar por mensajería o portapapeles.
  - Atributos conceptuales: Encabezado y fecha, desglose de participantes (nombre, subtotal, lista de consumiciones), bloque de precios de productos consumidos, total general de la mesa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los productos con al menos una unidad consumida en la sesión aparecen reflejados con su precio unitario en el texto exportado al compartir.
- **SC-002**: El 0% de los productos sin consumiciones (0 unidades asignadas) aparecen en la sección de precios del mensaje exportado.
- **SC-003**: El 100% de los precios unitarios listados en el resumen exportado coinciden con exactitud al céntimo con los precios registrados en las consumiciones de los participantes.
- **SC-004**: La generación del texto de exportación con la sección de precios añadida se ejecuta de forma imperceptible (tiempo de respuesta inferior a 50 milisegundos para partidas de hasta 20 jugadores).
- **SC-005**: El formato del texto generado es legible y compatible al 100% con clientes de mensajería instantánea (WhatsApp, Telegram) y visores de texto plano sin dependencias externas.

## Assumptions

- **Flujo de exportación**: La información de exportar la cuenta corresponde a la funcionalidad existente de compartir cuenta (accesible mediante el botón "Compartir" de la cabecera, que utiliza Web Share API o copia al portapapeles).
- **Contenido del resumen de precios**: El resumen consiste en mostrar los precios unitarios de referencia de los productos consumidos (`• Nombre: X,XX €`), permitiendo a los jugadores verificar el precio de cada artículo sin alterar el formato del desglose individual por participante.
- **Ubicación en el texto**: La sección se coloca entre el desglose por jugador y el total de la mesa, con el título `Precios de productos:` para que los destinatarios comprendan claramente su propósito.
