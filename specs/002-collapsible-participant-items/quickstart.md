# Quickstart & Validation Guide: Desplegado y Colapsado de Consumiciones

**Feature**: `002-collapsible-participant-items`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

Esta guía define las verificaciones manuales y automáticas para validar la funcionalidad de colapsado y desplegado de consumiciones por participante.

---

## 1. Verificación Automática

```bash
# Ejecutar suite de pruebas unitarias e integración
npm test

# Verificar compilación TypeScript sin errores
npm run build
```

---

## 2. Escenarios de Validación Manual E2E

### Escenario 1: Colapsar tarjeta individual (P1 - SC-001)
1. Abrir la aplicación y añadir a los participantes `Manu` y `Carlos`.
2. Asignar 2 refrescos a `Manu` y 1 snack a `Carlos`. Ambas tarjetas deben estar expandidas por defecto.
3. Hacer clic en el chevron o en la cabecera de la tarjeta de `Manu`.
4. **Resultado esperado**:
   - El cuerpo de la tarjeta de `Manu` se oculta de inmediato (<50ms).
   - Su nombre, el subtotal `3,00 €` y el botón de eliminar permanecen visibles en la cabecera compacta.
   - La tarjeta de `Carlos` permanece expandida sin verse afectada.

### Escenario 2: Desplegar tarjeta colapsada (P1)
1. Hacer clic nuevamente en la cabecera o chevron de la tarjeta colapsada de `Manu`.
2. **Resultado esperado**:
   - El catálogo rápido y la lista de consumiciones se despliegan de nuevo con todos sus datos y controles intactos.

### Escenario 3: Accesibilidad por teclado y atributos WAI-ARIA (P2 - SC-003)
1. Usando solo la tecla `Tab`, navegar hasta la cabecera o botón de alternancia de la tarjeta.
2. Comprobar que recibe un foco visual claro.
3. Presionar `Enter` o `Espacio`.
4. **Resultado esperado**:
   - La tarjeta alterna su estado entre expandida y colapsada.
   - En el inspector de elementos, `aria-expanded` cambia dinámicamente entre `"true"` y `"false"`.

### Escenario 4: Creación de nuevo participante en estado expandido (P3)
1. Con las tarjetas existentes colapsadas, introducir un nuevo participante `Ana` en el campo superior y pulsar `Añadir`.
2. **Resultado esperado**:
   - La tarjeta de `Ana` se renderiza expandida, mostrando sus botones de catálogo rápido listos para pulsar.
   - Las tarjetas de `Manu` y `Carlos` continúan en su estado previo.
