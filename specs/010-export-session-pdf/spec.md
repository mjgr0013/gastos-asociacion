# Feature Specification: Exportar Cuenta de la Sesión a PDF

**Feature Branch**: `010-export-session-pdf`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero poder generar un PDF con la información de lo que ha consumido cada uno, su precio, el total de cada uno y el total de toda la cuenta. En el PDF debe de ir el día y hora actual así como el nombre del que ha reservado la sala, que se meterá en un campo de texto al darle a exportar a PDF."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Generación y descarga del PDF de la sesión con titular de reserva (Priority: P1) 🎯 MVP

Como anfitrión o responsable de la partida en una sala de juegos o asociación, quiero pulsar un botón de "Exportar a PDF" e introducir en un cuadro de diálogo el nombre de la persona que realizó la reserva de la sala, para descargar un documento PDF formal con la fecha y hora exacta, el desglose individual de cada jugador (productos consumidos, precio unitario y total personal) y el importe total acumulado de la mesa, facilitando un comprobante imprimible o archivables para liquidar los gastos de la sala.

**Why this priority**: Es la funcionalidad nuclear solicitada. Proporciona un justificante formal estructurado y listo para imprimir o enviar por correo que acredita los gastos de la sala vinculados a una reserva concreta.

**Independent Test**: Registrar participantes con consumiciones (ej. "Manu" con 2x Refresco a 1,50 € y "Carlos" con 1x Snack a 1,00 €), pulsar "Exportar a PDF", escribir "Manuel García" en el campo de titular de reserva y confirmar, verificando que se descarga un archivo PDF que contiene la fecha y hora actual, el nombre "Manuel García", el desglose de consumiciones y precios por jugador, y el total de la mesa (4,00 €).

**Acceptance Scenarios**:

1. **Given** una sesión activa con participantes y consumiciones registradas, **When** el usuario pulsa "Exportar a PDF", **Then** se abre un diálogo modal solicitando el nombre de quien reservó la sala.
2. **Given** el diálogo modal de exportación abierto, **When** el usuario introduce el nombre de la reserva (ej. "Laura Gómez") y pulsa "Generar PDF", **Then** se genera y descarga automáticamente un documento PDF que incluye:
   - Título formal de la cuenta de la sesión.
   - Nombre de la persona que reservó la sala ("Reserva a nombre de: Laura Gómez").
   - Fecha y hora exacta de emisión en formato local (`DD/MM/AAAA HH:mm`).
   - Sección por cada participante con su lista de consumiciones (unidades, nombre del producto, precio unitario y subtotal) y el total personal a pagar.
   - Importe total global acumulado de toda la mesa.
3. **Given** un participante registrado que no ha realizado ninguna consumición (0,00 €), **When** se genera el PDF, **Then** figura en el documento con indicación explícita de "Sin consumiciones" y subtotal de 0,00 €.

---

### User Story 2 - Validación del campo de reserva y cancelación en el diálogo (Priority: P2)

Como usuario que va a generar el PDF, quiero que el sistema me alerte si olvido escribir el nombre del responsable de la reserva antes de generar el documento, o me permita cancelar la acción si decido no exportarlo en ese momento.

**Why this priority**: Garantiza que no se generen documentos PDF incompletos sin el dato obligatorio de la reserva y permite abortar la acción sin efectos colaterales.

**Independent Test**: Abrir el diálogo de exportación a PDF, intentar confirmar dejando el campo de nombre vacío y comprobar que aparece un mensaje de advertencia; a continuación pulsar "Cancelar" y verificar que el diálogo se cierra sin generar archivos.

**Acceptance Scenarios**:

1. **Given** el diálogo de exportación a PDF abierto, **When** el usuario pulsa "Generar PDF" con el campo de texto vacío o con solo espacios en blanco, **Then** no se genera el PDF y se muestra un mensaje de validación: "Por favor, introduce el nombre del titular de la reserva."
2. **Given** el diálogo de exportación abierto, **When** el usuario pulsa el botón "Cancelar" o presiona la tecla Escape, **Then** el diálogo se cierra limpiamente sin descargar ningún archivo y el estado de la mesa permanece inalterado.

---

### User Story 3 - Control de disponibilidad según el estado de la mesa (Priority: P3)

Como usuario de la aplicación, quiero que el botón de exportar a PDF se mantenga deshabilitado cuando no haya ningún jugador registrado en la partida, para prevenir exportaciones vacías o erróneas.

**Why this priority**: Evita la generación de documentos en blanco antes de comenzar a usar la aplicación.

**Independent Test**: Con la mesa vacía (0 participantes), verificar que el botón "Exportar a PDF" se muestra deshabilitado; añadir un participante y comprobar que pasa a estar habilitado.

**Acceptance Scenarios**:

1. **Given** una sesión vacía sin participantes registrados, **When** se observa la barra de cabecera/acciones, **Then** el botón de exportar a PDF se muestra deshabilitado y no responde al clic.
2. **Given** una sesión con al menos 1 participante registrado, **When** se observa la barra de acciones, **Then** el botón de exportar a PDF se encuentra activo y habilitado.

---

### Edge Cases

- **Nombres de reserva con caracteres especiales o tildes**: Nombres con caracteres acentuados, eñes o caracteres especiales (ej. "Peña", "Álvaro") deben imprimirse fielmente en el PDF sin sustitución por caracteres extraños.
- **Múltiples participantes o muchas consumiciones**: Si la sesión cuenta con muchos jugadores o consumiciones que exceden una sola página, el documento PDF debe paginar correctamente manteniendo el encabezado o la coherencia visual entre páginas.
- **Dispositivos móviles y bloqueadores de ventanas emergentes**: La descarga del PDF debe realizarse mediante descarga directa de archivo binario (blob/ObjectURL) con atributo `download`, asegurando compatibilidad en navegadores móviles (iOS Safari, Android Chrome) sin depender de ventanas emergentes externas bloqueables.
- **Nombre de archivo sugerido**: El archivo descargado debe tener un nombre descriptivo y normalizado, por ejemplo: `cuenta-partida-YYYYMMDD-HHmm.pdf`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE incorporar un botón de acción "Exportar a PDF" en la interfaz principal de la aplicación.
- **FR-002**: El sistema DEBE mantener el botón de exportar a PDF deshabilitado mientras haya 0 participantes registrados en la sesión.
- **FR-003**: Al pulsar el botón de exportar a PDF, el sistema DEBE abrir un diálogo modal solicitando el nombre de la persona que ha reservado la sala.
- **FR-004**: El sistema DEBE validar que el nombre del titular de la reserva no esté vacío ni compuesto solo por espacios antes de proceder a la generación.
- **FR-005**: El diálogo DEBE permitir cancelar la operación en cualquier momento cerrando el modal sin generar documentos.
- **FR-006**: El documento PDF generado DEBE incluir la fecha y hora actual del momento de la generación en formato local legible (`DD/MM/AAAA HH:mm`).
- **FR-007**: El documento PDF generado DEBE incluir de forma destacada el nombre del titular de la reserva de la sala introducido por el usuario.
- **FR-008**: El documento PDF generado DEBE desglosar por cada participante de la mesa:
  - Nombre del participante.
  - Detalle de cada consumición: cantidad, nombre del producto, precio unitario en euros y subtotal del producto.
  - Indicación de "Sin consumiciones" para participantes con 0 ítems.
  - Subtotal adeudado por el participante en euros con dos decimales.
- **FR-009**: El documento PDF generado DEBE mostrar el importe total general de toda la cuenta de la mesa en euros con dos decimales.
- **FR-010**: La generación del documento PDF DEBE llevarse a cabo íntegramente en el navegador del cliente (SPA estática) sin requerir backend, servidores de renderizado ni llamadas a APIs externas.
- **FR-011**: Al completarse la generación, el sistema DEBE disparar la descarga automática del archivo PDF en el dispositivo del usuario y cerrar el diálogo modal.

### Key Entities *(include if feature involves data)*

- **Datos de Exportación a PDF (PdfExportData)**:
  - `reservationHolder`: Nombre de quien ha reservado la sala (cadena obligatoria, recortada de espacios).
  - `generatedAt`: Fecha y hora de generación (objeto Date / string formateado).
  - `participants`: Lista de participantes con sus nombres, consumiciones desglosadas (cantidad, producto, precio unitario, subtotal) y subtotal individual.
  - `grandTotal`: Total global de la sesión en euros.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El documento PDF se genera y se pone a disposición para su descarga en menos de 2 segundos desde la confirmación del nombre de la reserva en el modal.
- **SC-002**: El 100% de los importes individuales por producto, subtotales por jugador y total global calculados en el PDF coinciden exactamente con los valores calculados en la interfaz de usuario.
- **SC-003**: Cero peticiones de red externas para la generación del documento (100% de ejecución offline en cliente).
- **SC-004**: El documento generado es 100% estándar y reproducible en los visores nativos de PDF de Android, iOS, Windows, macOS y Linux.

## Assumptions

- **Ubicación del control**: El botón de exportar a PDF se sitúa en la barra superior de acciones de la cabecera (junto al botón de compartir existente), manteniendo consistencia visual.
- **Formato del documento**: El PDF tendrá formato estándar A4 vertical con tipografía legible, alineación monetaria a la derecha y encabezado con la información de la reserva y fecha/hora.
- **Persistencia del nombre de reserva**: El nombre de quien reservó la sala se solicita en el momento de exportar el PDF y no requiere ser almacenado permanentemente en la sesión una vez completada la descarga.
