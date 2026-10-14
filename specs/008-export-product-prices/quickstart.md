# Quickstart & Validation Guide: Resumen de Precios de Productos en Cuenta Exportada

**Feature**: `008-export-product-prices`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo verificar y validar de extremo a extremo que el resumen de precios unitarios de productos consumidos funciona correctamente en la exportación de la cuenta.

---

## 1. Prerrequisitos

- Node.js instalado (v20 o superior).
- Dependencias instaladas (`npm install`).

---

## 2. Validación Automatizada (Unit Tests)

Ejecutar las pruebas unitarias para el módulo de compartición y cálculo:

```bash
npm test tests/unit/sharing.test.ts
```

### Escenarios cubiertos por las pruebas:
1. **Múltiples participantes con productos consumidos**:
   - Verificar que se genera la sección `Precios de productos:` entre los participantes y el total de la mesa.
   - Verificar que cada producto consumido aparece con su precio unitario (`• Refresco: 1,50 €`).
   - Verificar que los productos no consumidos del catálogo no aparecen.
2. **Deduplicación y orden alfabético**:
   - Varios participantes con el mismo producto ("Refresco") generan una sola línea en `Precios de productos:`.
   - Los productos aparecen ordenados alfabéticamente (ej: `Café caliente`, `Pizza`, `Refresco`).
3. **Mesa sin consumiciones o vacía**:
   - Si los participantes no tienen consumiciones, la sección `Precios de productos:` no se incluye en el texto exportado.
4. **Productos con el mismo nombre y precio diferente**:
   - Variantes personalizadas con diferente precio unitario figuran como entradas independientes.

---

## 3. Validación Manual en el Navegador

1. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
2. Abrir la URL local en el navegador (ej. `http://localhost:5173/`).
3. **Paso 1**: Añadir 2 participantes: "Manu" y "Carlos".
4. **Paso 2**: Asignar consumiciones a "Manu" (ej. 2x "Refresco" a 1.00 €) y a "Carlos" (ej. 1x "Snack" a 1.20 €).
5. **Paso 3**: Pulsar en el botón **"Compartir"** de la cabecera.
6. **Paso 4**:
   - En escritorio: Comprobar el toast de confirmación y pegar el contenido (`Ctrl+V` o `Cmd+V`) en un editor de texto o app de notas.
   - En móvil: Comprobar la vista previa del menú de compartir del sistema operativo.
7. **Paso 5**: Verificar que el texto contiene:
   ```text
   🎲 Cuenta de la partida (DD/MM/AAAA):
   • Manu: 2,00 € (2x Refresco)
   • Carlos: 1,20 € (1x Snack)
   ------------------------------------
   Precios de productos:
   • Refresco: 1,00 €
   • Snack: 1,20 €
   ------------------------------------
   Total mesa: 3,20 €
   ```
8. **Paso 6 (Caso borde)**: Crear una nueva sesión sin consumiciones, pulsar "Compartir" y verificar que la sección `Precios de productos:` no aparece.

---

## 4. Validación de Calidad y Compilación

Ejecutar la suite completa de pruebas y el build estático de producción:

```bash
npm run test:run
npm run build
```
Resultado esperado: Todas las pruebas en verde y build completado sin advertencias ni errores TypeScript.
