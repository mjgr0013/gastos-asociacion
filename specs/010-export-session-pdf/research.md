# Research: Exportar Cuenta de la Sesión a PDF

**Feature**: `010-export-session-pdf`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Motor de Generación del Documento PDF

### Contexto y Necesidad
El usuario requiere generar un archivo PDF que contenga el desglose completo de la cuenta (consumiciones por participante, precios unitarios, subtotales personales, gran total, fecha/hora actual y el nombre del titular de la reserva). El proyecto es una SPA cliente estática para GitHub Pages sin backend.

### Decision
Implementar un generador de PDF ligero y nativo en TypeScript (`src/domain/pdf-export.ts` y `src/utils/pdf-builder.ts`):
1. Construir una estructura binaria/textual conforme a la especificación estándar PDF 1.4:
   - Header `%PDF-1.4`.
   - Objeto Catalog, Pages y Page en formato A4 vertical (595.28 x 841.89 puntos tipográficos).
   - Tipografías estándar embebidas en visores PDF: `/Helvetica` y `/Helvetica-Bold`.
   - Mapeo de caracteres españoles (á, é, í, ó, ú, Á, É, Í, Ó, Ú, ñ, Ñ, €, etc.) mediante codificación estándar WinAnsi (`/WinAnsiEncoding`).
   - Flujo de contenido (`/Contents`) con operadores de texto y líneas divisorias (`BT`, `Tf`, `Td`, `Tj`, `ET`, `re`, `f`, `m`, `l`, `S`).
   - Tabla de referencias cruzadas (`xref`) y trailer válidos.
2. Generar el documento resultante como `Blob` de tipo `application/pdf`.

### Rationale
- **Cero dependencias externas**: Cumple estrictamente con el principio de no introducir librerías de terceros innecesarias ni engordar el bundle final (ahorro de más de 350 KB frente a `jspdf` o `pdfmake`).
- **Compatibilidad con pruebas unitarias en Vitest**: Funciona de forma 100% pura y determinista tanto en Node como en navegadores sin requerir mocks complejos de `HTMLCanvasElement`, `window` o polyfills de DOM.
- **Precisión estética y control de layout**: Permite definir márgenes, encabezado destacado con la reserva, cajas visuales, alineación numérica a la derecha y líneas de total con precisión milimétrica.

### Alternatives considered
- **Librería externa `jspdf`**: Rechazada porque añade ~350 KB de dependencias en `node_modules`, introduce potenciales problemas de ejecución en entornos Node durante la ejecución de pruebas unitarias (`vitest run`), y no es necesaria para un documento estructurado de facturación.
- **Impresión con `window.print()`**: Rechazada porque no genera un archivo descargable `.pdf` directamente en el dispositivo, depende de la configuración de impresión del navegador y no cumple la especificación de generar un archivo PDF independiente.

---

## 2. Diálogo Modal de Entrada para la Reserva

### Contexto y Necesidad
El nombre de la persona que reservó la sala debe introducirse en un campo de texto tras pulsar el botón de exportar a PDF antes de generar el documento.

### Decision
Crear el componente `ExportPdfModalComponent` en `src/ui/components/export-pdf-modal.ts`:
1. Modal accesible con `role="dialog"`, `aria-labelledby` y `aria-modal="true"`.
2. Campo de texto (`<input type="text" maxlength="60">`) con foco automático.
3. Validación en línea: si el usuario confirma vacío o con espacios, muestra el mensaje de error: `"Por favor, introduce el nombre del titular de la reserva."`.
4. Botón "Cancelar" (cierra el modal sin emitir acción) y botón "Descargar PDF" (valida, genera y dispara la descarga).
5. Atajos de teclado: `Enter` para confirmar, `Escape` para cancelar.

### Rationale
- Reutiliza el lenguaje visual y las clases de estilo (`modal-backdrop`, `modal-dialog`, `btn-primary`, `btn-secondary`) ya presentes en `ConsumptionFormComponent` y `ConfirmDialogComponent`.
- Experiencia fluida tanto en dispositivos móviles táctiles como en escritorio con teclado.

### Alternatives considered
- **Usar `window.prompt()` nativo**: Rechazado por estética tosca, falta de control sobre estilos en navegadores móviles y mala accesibilidad.

---

## 3. Disparo de la Descarga en el Cliente

### Decision
Crear la utilidad de descarga `downloadBlob(blob: Blob, filename: string): void` en `src/utils/download.ts`:
1. Crear una URL de objeto temporal con `URL.createObjectURL(blob)`.
2. Crear un elemento `<a>` oculto con atributos `href` y `download={filename}`.
3. Añadirlo temporalmente al DOM, invocar `.click()` y retirarlo.
4. Liberar la URL del objeto con `URL.revokeObjectURL(url)`.

### Rationale
- Mecanismo estándar universal en navegadores modernos (Chrome, Safari iOS/macOS, Firefox, Edge).
- Evita bloqueos de ventanas emergentes al ejecutarse en respuesta a una acción directa del usuario (clic en "Descargar PDF").
