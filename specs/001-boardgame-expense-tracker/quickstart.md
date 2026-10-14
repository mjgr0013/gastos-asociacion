# Quickstart & Validation Guide: Control de Gastos de Consumiciones

**Feature**: `001-boardgame-expense-tracker`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

Esta guía define los pasos para arrancar el entorno local y ejecutar las comprobaciones manuales y automáticas que validan la entrega de la aplicación según la especificación (`spec.md`).

---

## 1. Requisitos Previos e Instalación

- **Node.js**: v18+ o v20+ LTS y `npm`.
- **Navegador**: Chrome, Firefox, Safari o Edge modernos.

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar entorno de desarrollo local con Vite
npm run dev

# 3. Ejecutar suite de pruebas automáticas con Vitest
npm test

# 4. Generar build estático para producción / GitHub Pages
npm run build
```

---

## 2. Escenarios de Validación Funcional E2E

### Escenario 1: Alta de participantes y uso del catálogo rápido (P1 - SC-001)
1. Abrir la aplicación en el navegador (en modo móvil / vista responsive 375px).
2. En el campo "Nuevo participante", escribir `Manu` y pulsar `Añadir`.
3. Verificar que aparece la tarjeta del participante `Manu` con subtotal `0,00 €`.
4. En la tarjeta de `Manu`, pulsar el botón de catálogo rápido `Refresco 1.50€`.
5. **Resultado esperado**: La consumición "Refresco" (1x 1.50 €) se añade al instante. El subtotal de Manu muestra `1,50 €` y la barra de Total de la Mesa muestra `1,50 €`.

### Escenario 2: Formulario libre y cálculo en tiempo real (P1 - SC-002)
1. Añadir un segundo participante `Carlos`.
2. En la tarjeta de `Carlos`, pulsar `Añadir personalizada` (formulario libre).
3. Rellenar: Producto `Pizza individual`, Precio `6.50`, Cantidad `1`. Pulsar guardar.
4. **Resultado esperado**:
   - Subtotal de Carlos: `6,50 €`.
   - Total global de la sesión: `8,00 €` (1.50 € + 6.50 €).
   - El cálculo se produce en menos de 100 ms sin refrescar la página.

### Escenario 3: Modificación y eliminación de consumiciones (P1)
1. En la tarjeta de `Manu`, incrementar la cantidad de `Refresco` a 2 unidades mediante el botón `+`.
2. **Resultado esperado**: Subtotal de Manu sube a `3,00 €`, Total global sube a `9,50 €`.
3. Pulsar el botón de eliminar línea en el refresco de Manu.
4. **Resultado esperado**: Subtotal de Manu vuelve a `0,00 €`, Total global pasa a `6,50 €`.

### Escenario 4: Persistencia automática en localStorage (P2 - SC-003)
1. Con la sesión activa (Carlos con Pizza 6.50 €), recargar la pestaña del navegador (`F5` o `Cmd+R`).
2. **Resultado esperado**: Los participantes `Manu` y `Carlos`, sus consumiciones y los importes de `0,00 €`, `6,50 €` y Total `6,50 €` permanecen exactamente iguales.

### Escenario 5: Reinicio seguro con confirmación previa (P2 - SC-004)
1. Pulsar el botón `Reiniciar sesión`.
2. Debe aparecer un diálogo modal o advertencia de confirmación.
3. Pulsar `Cancelar`.
4. **Resultado esperado**: La sesión y los datos permanecen intactos.
5. Volver a pulsar `Reiniciar sesión` y confirmar la acción.
6. **Resultado esperado**: Se limpian todos los participantes, el total vuelve a `0,00 €` y la clave en `localStorage` queda reiniciada.

### Escenario 6: Validación de responsividad y ergonomía táctil (P3 - SC-005)
1. Inspeccionar en DevTools a 360px de ancho (móvil estrecho).
2. **Resultado esperado**: Cero scroll horizontal, botones táctiles con área de pulsación cómoda (mínimo 44px de alto), barra de total fijada y visible.
