# Quickstart & Validation Guide: Vista Móvil Compacta

**Feature**: `006-compact-mobile-view`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

---

## 1. Verificación Automática

```bash
# Ejecutar suite de pruebas unitarias
npm test

# Verificar compilación estricta de TypeScript y build
npm run build
```

---

## 2. Escenarios de Validación Manual E2E en Móvil (DevTools Responsive 375x667 / 390x844)

### Escenario 1: Reducción de Altura con 10 Productos (P1 - SC-001)
1. Abrir DevTools en modo responsive (viewport 375px de ancho).
2. Añadir a un participante `Carlos` e introducir 10 consumiciones variadas.
3. **Resultado esperado**:
   - Cada fila mide entre 34px y 38px de altura.
   - El nombre y precio aparecen en una sola línea horizontal continua (`Refresco · 1,50 €`).
   - La lista de 10 productos no desborda la pantalla del teléfono.

### Escenario 2: Desplazamiento Horizontal en Catálogo Rápido (P1 - SC-002)
1. Observar la sección de catálogo rápido encima de las consumiciones.
2. **Resultado esperado**:
   - Los chips forman una sola fila horizontal compacta de ~34px de alto.
   - Deslizar horizontalmente con el dedo o ratón permite acceder al botón `Otro...` y demás productos.

### Escenario 3: Truncado de Nombres Extensos (P1)
1. Añadir una consumición con nombre muy largo (ej: *"Pizza barbacoa familiar crujiente"*).
2. **Resultado esperado**: El nombre se trunca limpiamente con puntos suspensivos sin ocultar el selector de cantidad (`- 1 +`), el subtotal ni el botón `✕`.

### Escenario 4: Scroll Interno en Listas Largas (P2)
1. En una tarjeta con más de 6 consumiciones, observar la lista.
2. **Resultado esperado**: La lista contiene un scroll vertical interno suave (`max-height: 280px`), permitiendo visualizar a los demás participantes debajo.
