# Feature Specification: Compartir Resumen de Cuenta por WhatsApp o Portapapeles

**Feature Branch**: `004-share-session-summary`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "Añadir funcionalidad para compartir el resumen de la cuenta por WhatsApp o portapapeles"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compartir resumen estructurado de la cuenta (Priority: P1)

Como anfitrión o jugador al terminar una sesión de juegos de mesa, quiero pulsar un botón de "Compartir cuenta" para enviar el desglose de lo que debe pagar cada persona al grupo de mensajería (WhatsApp, Telegram) o copiarlo al portapapeles, para liquidar la cuenta de forma rápida y transparente sin tener que cantar o copiar los importes manualmente.

**Why this priority**: Es el valor principal solicitado. Elimina la fricción manual de cobro al concluir la partida, que es uno de los momentos más habituales donde se producen dudas y esperas.

**Independent Test**: Puede probarse registrando varios participantes con consumiciones asignadas, pulsando en "Compartir" y verificando que el texto generado contiene la fecha, cada jugador con sus consumiciones y subtotal en euros, y el total acumulado de la mesa coincidiendo al 100% con la pantalla.

**Acceptance Scenarios**:

1. **Given** una sesión con los participantes "Manu" (2x Refresco a 1.50 €) y "Carlos" (1x Snack a 1.00 €), **When** el usuario pulsa en "Compartir cuenta", **Then** se genera un mensaje de texto formateado con:
   - Título y fecha de la partida (ej: `🎲 Cuenta de la partida - 14/10/2026`).
   - Línea por jugador con formato: `• Manu: 3,00 € (2x Refresco)` y `• Carlos: 1,00 € (1x Snack)`.
   - Total acumulado de la mesa: `Total mesa: 4,00 €`.
2. **Given** un dispositivo móvil con soporte de Web Share API, **When** el usuario pulsa en "Compartir cuenta", **Then** el sistema operativo abre el menú nativo de compartir para seleccionar la app de mensajería deseada (WhatsApp, Telegram, etc.).
3. **Given** un navegador de escritorio sin soporte de Web Share API, **When** el usuario pulsa en "Compartir cuenta", **Then** el texto se copia de forma inmediata al portapapeles del sistema operativo.

---

### User Story 2 - Confirmación visual de copia al portapapeles (Priority: P2)

Como usuario que interactúa desde un navegador de escritorio o en un dispositivo donde no se abre el diálogo nativo, quiero recibir una notificación visual temporal (toast o aviso flotante) que me confirme claramente que el resumen ha sido copiado al portapapeles.

**Why this priority**: Evita la incertidumbre del usuario sobre si la acción ha tenido efecto y le informa de que ya puede pegar (`Cmd+V` / `Ctrl+V`) el mensaje donde desee.

**Independent Test**: Puede probarse ejecutando la acción de compartir en un navegador de escritorio y comprobando que aparece un mensaje de aviso ("¡Resumen copiado al portapapeles!") que desaparece automáticamente pasados unos segundos.

**Acceptance Scenarios**:

1. **Given** el texto copiado al portapapeles tras pulsar en "Compartir", **When** la operación finaliza con éxito, **Then** se muestra un mensaje flotante accesible indicando "¡Resumen copiado al portapapeles!".
2. **Given** el mensaje flotante visible, **When** transcurren 3 segundos, **Then** el mensaje desaparece suavemente sin requerir interacción manual.

---

### User Story 3 - Manejo de estados de mesa vacía (Priority: P3)

Como usuario, quiero que el botón de compartir esté adecuadamente desactivado o muestre un aviso si no hay jugadores registrados en la mesa, para evitar enviar mensajes en blanco.

**Why this priority**: Previene operaciones erróneas o confusas cuando la sesión todavía no ha comenzado o se encuentra a cero.

**Independent Test**: Comprobar que cuando la lista de participantes está vacía, el botón de compartir se muestra deshabilitado con un indicador explicativo.

**Acceptance Scenarios**:

1. **Given** una mesa vacía sin participantes, **When** se observa la cabecera, **Then** el botón de compartir está deshabilitado y no reacciona al clic.
2. **Given** una mesa con al menos 1 participante registrado, **When** se observa la cabecera, **Then** el botón de compartir pasa a estar activo y habilitado.

---

### Edge Cases

- **Participante sin consumiciones anotadas**: Si un participante está registrado pero no ha consumido nada (subtotal 0,00 €), el texto generado debe reflejarlo limpiamente (ej: `• Ana: 0,00 € (Sin consumiciones)`).
- **Permisos de portapapeles denegados**: Si el navegador bloquea el acceso al portapapeles, la aplicación debe mostrar un diálogo o modal con el texto preseleccionado para que el usuario pueda copiarlo manualmente con un toque.
- **Cancelación en el menú nativo de compartir**: Si el usuario abre el menú nativo de compartir pero decide cancelarlo o cerrarlo sin elegir app, la aplicación no debe mostrar errores ni bloquear la interfaz.
- **Nombres o productos con caracteres especiales y saltos**: Los nombres que contengan tildes, signos o emojis deben preservarse fielmente en el texto compartido.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE incluir un botón de "Compartir cuenta" en la barra de cabecera principal de la aplicación.
- **FR-002**: El sistema DEBE mantener deshabilitado el botón de compartir mientras no haya ningún participante registrado en la sesión.
- **FR-003**: El sistema DEBE generar una cadena de texto formateada que incluya:
  - Título descriptivo con emoji lúdico (`🎲 Cuenta de la partida`).
  - Fecha actual de la sesión en formato local estándar (`DD/MM/AAAA`).
  - Desglose ordenado de cada participante: nombre, subtotal adeudado en euros y lista compacta de consumiciones (`cantidad x nombre_producto`).
  - Indicación explícita `(Sin consumiciones)` para los participantes con 0 consumiciones.
  - Línea de separación textual legible.
  - Importe total global acumulado de la mesa en euros con dos decimales.
- **FR-004**: En dispositivos con soporte para la Web Share API (`navigator.share`), el sistema DEBE invocar dicho método para abrir el diálogo nativo del sistema operativo.
- **FR-005**: En navegadores donde la Web Share API no esté disponible o el usuario utilice un entorno de escritorio, el sistema DEBE copiar automáticamente el texto generado al portapapeles mediante la Clipboard API (`navigator.clipboard.writeText`).
- **FR-006**: Tras copiar el texto al portapapeles, el sistema DEBE mostrar una notificación flotante accesible (toast) informando del éxito de la copia durante un intervalo de entre 2.5 y 3.5 segundos.
- **FR-007**: Si el usuario cancela el diálogo nativo de compartir, el sistema DEBE capturar la excepción (`AbortError`) sin emitir mensajes de error al usuario.

### Key Entities *(include if feature involves data)*

- **Resumen Formateado de Sesión (Session Share Summary)**:
  - Atributos conceptuales: Fecha formateada, lista de líneas de participantes con subtotal e ítems, total global de la mesa, texto plano resultante listo para mensajería.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede completar la acción de compartir o copiar el resumen completo de una sesión con 6 participantes en menos de 3 segundos desde la pulsación del botón.
- **SC-002**: El 100% de los subtotales individuales y el total global del mensaje generado coinciden exactamente con los importes calculados en pantalla.
- **SC-003**: La funcionalidad opera de forma transparente en navegadores móviles modernos mediante Web Share API y en navegadores de escritorio mediante Clipboard API con cero dependencias externas.
- **SC-004**: Cero caídas o bloqueos de la aplicación en caso de cancelación del diálogo nativo o permisos de portapapeles denegados.

## Assumptions

- **Canales de envío**: La aplicación no se integra con APIs propietarias o de pago de WhatsApp; utiliza la capacidad nativa del sistema operativo (`navigator.share`) para derivar el mensaje a cualquier aplicación de mensajería que el usuario tenga instalada en su teléfono móvil.
- **Formato del texto**: El formato utilizado se basa en texto plano estructurado con emojis y viñetas para garantizar que se visualice correctamente en WhatsApp, Telegram, Signal, correo electrónico o aplicaciones de notas.
