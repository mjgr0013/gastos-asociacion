# Quickstart & Validation Guide: Exportar Cuenta de la Sesión a PDF

**Feature**: `010-export-session-pdf`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo verificar y validar la exportación de la cuenta de la partida en formato PDF con el nombre de la persona que reservó la sala, fecha/hora y desglose de consumiciones.

---

## 1. Prerrequisitos

- Node.js instalado (v20 o superior).
- Dependencias instaladas (`npm install`).

---

## 2. Validación Automatizada (Unit Tests)

Ejecutar las pruebas unitarias del generador de PDF:

```bash
npm test tests/unit/pdf-export.test.ts
```

### Escenarios de prueba automatizados:
1. **Estructura y cabecera del PDF**:
   - `generateSessionPdfBlob` genera un Blob con MIME `application/pdf`.
   - El buffer del PDF comienza con `%PDF-1.4`.
   - Contiene el texto de la reserva (`Reserva:` / `Titular:`), la fecha y hora, y el título de la cuenta.
2. **Desglose de consumiciones y precios**:
   - Cada participante figura con sus consumiciones, precios unitarios y subtotales.
   - Si un participante no tiene consumiciones, figura con "Sin consumiciones" y `0,00 €`.
   - El importe total acumulado de la mesa coincide con `calculateGrandTotal`.
3. **Nombre de archivo sugerido**:
   - `generatePdfFilename(date)` devuelve una cadena con formato `cuenta-partida-YYYYMMDD-HHmm.pdf`.

---

## 3. Validación Manual en el Navegador

1. Iniciar el servidor local:
   ```bash
   npm run dev
   ```
2. Abrir la aplicación en el navegador (`http://localhost:5173/`).
3. **Paso 1 (Estado inicial deshabilitado)**:
   - Con 0 jugadores, comprobar que el botón "📄 Exportar PDF" en la cabecera está deshabilitado.
4. **Paso 2 (Añadir participantes)**:
   - Añadir al menos dos jugadores (ej. "Manu" y "Carlos").
   - Asignar consumiciones (ej. 2x Refresco a 1,50 € a Manu, y 1x Snack a 1,00 € a Carlos).
   - Comprobar que el botón "📄 Exportar PDF" se habilita.
5. **Paso 3 (Apertura del modal y validación)**:
   - Pulsar en "📄 Exportar PDF".
   - Se abre el modal con título "Exportar cuenta a PDF" y campo "Nombre de la reserva".
   - Dejar el campo vacío y pulsar "Descargar PDF". Comprobar que muestra el mensaje de error "Por favor, introduce el nombre del titular de la reserva." y no descarga nada.
   - Pulsar "Cancelar" o Escape y comprobar que el modal se cierra.
6. **Paso 4 (Generación y descarga)**:
   - Pulsar de nuevo en "📄 Exportar PDF".
   - Escribir "Manuel García" y pulsar Enter o "Descargar PDF".
   - Comprobar que se inicia la descarga del archivo `cuenta-partida-....pdf` y el modal se cierra.
   - Abrir el PDF descargado y comprobar:
     - Fecha y hora actual.
     - "Reserva a nombre de: Manuel García".
     - Desglose de Manu: 2x Refresco (1,50 €) = 3,00 €. Total: 3,00 €.
     - Desglose de Carlos: 1x Snack (1,00 €) = 1,00 €. Total: 1,00 €.
     - Total de la mesa: 4,00 €.

---

## 4. Validación de Calidad y Compilación

```bash
npm test
npm run build
```
Resultado esperado: Todas las pruebas pasando y build completado sin errores.
