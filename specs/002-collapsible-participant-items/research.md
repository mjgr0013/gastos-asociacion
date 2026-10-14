# Technical Research: Desplegado y Colapsado de Consumiciones por Participante

**Feature**: `002-collapsible-participant-items`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Gestión del Estado de Despliegue (UI View State vs. Domain State)

### Decisión
Gestionar el estado de colapsado (`isCollapsed`) a nivel de interfaz de usuario (`AppView` / `ParticipantCardComponent`), manteniendo una colección en memoria (`Set<string> collapsedParticipantIds`) o un estado local por tarjeta, sin modificar el esquema de persistencia en `localStorage` (`SessionState`).

### Justificación
- **Desacoplamiento Limpio (Constitución Art. 2)**: La constitución exige separación entre capa de negocio/dominio y renderizado visual. El hecho de que una tarjeta esté plegada o desplegada es una preferencia de visualización transitoria en el cliente, no un dato financiero ni de auditoría de la sesión.
- **Compatibilidad Hacia Atrás**: No altera el contrato JSON `bg_expense_session_v1` ya existente en los navegadores de los usuarios.
- **Rendimiento Instantáneo**: La mutación del estado visual se resuelve en memoria en <1ms sin escrituras redundantes en disco/storage.

### Alternativas Consideradas
- **Almacenar `isCollapsed` en la entidad `Participant`**: Descartado porque contaminaría el modelo de datos financiero con detalles efímeros de presentación y obligaría a modificar los contratos de storage.

---

## 2. Ergonomía Táctil y Mecanismo de Activación

### Decisión
Permitir la alternancia de colapsado/desplegado mediante dos vías complementarias:
1. Un botón de alternancia explícito con icono indicador (chevron ▾ / ▴) en la cabecera.
2. Clic/toque en la propia barra de cabecera de la tarjeta (evitando la propagación cuando el usuario pulsa específicamente en el botón de eliminar participante).

### Justificación
- **Uso en Mesa de Juego con Una Sola Mano**: En un smartphone sobre la mesa, acertar a un botón pequeño de 20px genera frustración; permitir tocar la cabecera completa (manteniendo protegido el botón de borrar) ofrece una experiencia sumamente cómoda y ágil.

---

## 3. Estrategia de Ocultación y Rendimiento CSS

### Decisión
Utilizar la clase `.participant-card.is-collapsed` combinada con ocultación controlada del `.card-body` mediante CSS (`display: none` o `max-height: 0` con `overflow: hidden`) y rotación del chevron (`transform: rotate(-90deg)` / `rotate(0deg)`).

### Justificación
- **Tiempo de Respuesta Inmediato (SC-001 < 50ms)**: El toggle de clases en el DOM nativo se resuelve en un único frame de renderizado (<16ms).
- **Ahorro Efectivo de Espacio (SC-002 > 60%)**: Oculta íntegramente la fila del catálogo rápido y el listado de ítems, reduciendo la tarjeta a una fila compacta de 52px.

---

## 4. Patrón de Accesibilidad (WAI-ARIA Disclosure)

### Decisión
Implementar el patrón de disclosure de W3C WAI-ARIA:
- Botón con `aria-expanded="true"` cuando está abierto y `aria-expanded="false"` cuando está colapsado.
- `aria-controls="card-body-{participantId}"` asociando el botón al contenedor colapsable.
- Accesible mediante teclado: foco visual claro y activación con `Enter` y `Espacio`.
