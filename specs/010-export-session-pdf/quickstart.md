# Quickstart & Validation Guide: Exportar Cuenta de la Sesión a PDF

**Feature**: `010-export-session-pdf`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo verificar y validar la exportación de la cuenta de la partida en formato PDF con el nombre de la persona que reservó la sala, fecha actual (sólo fecha `DD/MM/AAAA`) y desglose de consumiciones.

---

## 1. Prerrequisitos

- Node.js instalado (v26 o superior).
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
   - Contiene el texto de la reserva (`Titular de la reserva:`), exclusivamente la fecha en formato `DD/MM/AAAA` (sin horas ni segundos), y el título de la cuenta.
2. **Desglose de consumiciones y precios**:
   - Cada participante figura con sus consumiciones, precios unitarios y subtotales.
   - Si un participante no tiene consumiciones, figura con "Sin consumiciones" y `0,00 €`.
   - El importe total acumulado de la mesa coincide con `calculateGrandTotal`.
3. **Nombre de archivo sugerido**:
   - `generatePdfFilename(date)` devuelve una cadena con formato `cuenta-partida-YYYYMMDD.pdf`.

---

## 3. Validación Manual en el Navegador

1. Iniciar el servidor local:
   ```bash
   npm run dev
   ```
2. Abrir la aplicación en el navegador (`http://localhost:5173/`).
3. Añadir jugadores con consumiciones.
4. Pulsar en "📄 PDF", introducir el nombre del titular y pulsar "Descargar PDF".
5. Abrir el PDF descargado y comprobar que en el encabezado figura `Fecha: DD/MM/AAAA` sin horas ni segundos.

---

## 4. Validación de Calidad y Compilación

```bash
npm test
npm run build
```
Resultado esperado: Todas las pruebas pasando y build completado sin errores.
