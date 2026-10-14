# Research: Nombres Únicos y Formateo con Mayúscula para Jugadores

**Feature**: `009-unique-player-names`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Algoritmo de Formateo y Capitalización de Nombres

### Contexto y Necesidad
El usuario solicita que los nombres de los jugadores se formateen con la primera letra en mayúscula para evitar inconsistencias visuales y duplicados tontos como "Manu" y "manu".

### Decision
Crear la función de dominio `formatParticipantName(name: string): string` en `src/domain/validation.ts`:
1. Aplicar `trim()` para eliminar espacios redundantes al inicio y al final.
2. Si el texto está vacío, devolver `''`.
3. Capitalizar el primer carácter alfabético: `trimmed.charAt(0).toUpperCase() + trimmed.slice(1)`.

### Rationale
- Respeta la estructura del nombre introducido por el usuario sin forzar a minúsculas posibles siglas o segundos nombres intencionales (ej. "DJ Dani", "JJ").
- Soporta adecuadamente caracteres acentuados de la localización en español (ej. "ángel" -> "Ángel") de forma nativa con `toUpperCase()`.
- Centralizar la lógica en `src/domain/validation.ts` garantiza que el formateo sea reutilizable y verificable con pruebas unitarias aisladas.

### Alternatives considered
- **Capitalización total a Title Case palabra por palabra (`split(' ').map(...)`)**: Rechazado para el alcance actual porque puede alterar nombres con preposiciones o partículas ("de la Rosa") y la especificación del usuario pide expresamente formatear con la primera letra en mayúscula.
- **Formatear únicamente en la capa de vista (`input.value`)**: Rechazado porque dejaría la lógica de negocio vulnerable a bypass si se llama directamente a `store.addParticipant`.

---

## 2. Detección y Validación de Nombres Duplicados

### Contexto y Necesidad
Los nombres de los jugadores no se pueden repetir en la mesa. La comparación debe ser insensible a mayúsculas y minúsculas (case-insensitive) y omitir espacios en blanco periféricos.

### Decision
1. Implementar la función auxiliar `isDuplicateParticipantName(name: string, existingNames: string[]): boolean` en `src/domain/validation.ts`:
   - Normalizar el nombre entrante con `name.trim().toLowerCase()`.
   - Comparar contra cada nombre existente normalizado con `existing.trim().toLowerCase()`.
2. Extender `validateParticipantName(name: string, existingNames: string[] = []): ValidationResult`:
   - Validar nombre no vacío (`error: 'El nombre del participante no puede estar vacío.'`).
   - Validar longitud máxima de 50 caracteres (`error: 'El nombre del participante no puede superar los 50 caracteres.'`).
   - Validar duplicidad (`error: 'Ya existe un jugador con este nombre en la mesa.'`).
3. En `SessionStore.addParticipant(name: string)`:
   - Pasar los nombres existentes (`this.state.participants.map(p => p.name)`) a `validateParticipantName`.
   - Guardar el nombre formateado resultante (`formatParticipantName(name)`).

### Rationale
- La comparación case-insensitive (`toLowerCase()`) garantiza que "manu", "Manu", "MANU" o "  Manu  " colisionen y sean rechazados si cualquiera de ellos ya está registrado.
- La firma de `validateParticipantName` con `existingNames: string[] = []` mantiene retrocompatibilidad con las pruebas unitarias existentes que no pasaban el segundo parámetro.
- Lanzar error en `SessionStore.addParticipant` asegura la invariante de estado en el almacén de datos.

### Alternatives considered
- **Modificar la clave primaria (ID) para que sea el nombre**: Rechazado porque los participantes ya tienen IDs UUID/opacos independientes y cambiar el ID rompería contratos existentes de consumo y referencias de ítems.
- **Sobrescribir el participante existente en lugar de rechazar**: Rechazado porque provocaría pérdida accidental de consumiciones acumuladas de un jugador.

---

## 3. Experiencia de Usuario y Manejo de Errores en el Formulario

### Contexto y Necesidad
Cuando el usuario intenta añadir un duplicado, debe recibir un mensaje de error claro, mantener el foco para corregir rápidamente y ver desaparecer el error tan pronto como escriba o introduzca un valor válido.

### Decision
1. En `ParticipantFormComponent`:
   - Capturar el error arrojado por `addParticipant` en `handleSubmit`.
   - Mostrar el mensaje exacto mediante `this.showError(msg)`.
   - Mantener el foco en el campo de texto (`this.inputElement.focus()`).
   - Añadir listener al evento `input` en `inputElement` para limpiar el error automáticamente (`this.clearError()`) en cuanto el usuario empiece a corregir el texto.

### Rationale
- Proporciona retroalimentación inmediata sin recargar la página ni desorientar al usuario en móvil.
- La limpieza automática del error al escribir elimina avisos obsoletos en pantalla.

### Alternatives considered
- **Mostrar un modal/diálogo bloqueante de confirmación**: Rechazado por ser excesivamente intrusivo para una simple validación de entrada de texto. El mensaje en línea (`aria-live="polite"`) es mucho más ágil y accesible.
