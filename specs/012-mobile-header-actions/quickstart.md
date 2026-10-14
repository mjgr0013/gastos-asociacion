# Quickstart & Validation Guide: Agrupación de Acciones de Cabecera en Móvil

**Feature**: `012-mobile-header-actions`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo verificar y validar que las acciones de la cabecera se agrupan en un menú desplegable accesible en dispositivos móviles y que se muestran en línea en pantallas de escritorio.

---

## 1. Prerrequisitos

- Node.js instalado (v26 o superior).
- Dependencias instaladas (`npm install`).

---

## 2. Validación Automatizada

Ejecutar la suite completa de pruebas:

```bash
npm run test:coverage
```
Resultado esperado: Todas las pruebas pasando con 100% de éxito.

---

## 3. Validación Manual en el Navegador

1. Iniciar el servidor local:
   ```bash
   npm run dev
   ```
2. Abrir la aplicación en el navegador (`http://localhost:5173/`).
3. Abrir las herramientas de desarrollador (`F12` / Inspeccionar) y activar el modo de emulación de dispositivo móvil (ej: iPhone o viewport de 375px de ancho).
4. **Paso 1 (Vista Móvil Agrupada)**:
   - Comprobar que en la cabecera no aparecen 3 botones sueltos, sino un único botón `"Acciones ▾"`.
   - Comprobar que no hay desbordamiento horizontal en la página.
5. **Paso 2 (Apertura y Opciones en Móvil)**:
   - Pulsar en el botón `"Acciones ▾"`.
   - Comprobar que se despliega el menú flotante con:
     - 📤 Compartir cuenta (deshabilitado si hay 0 jugadores).
     - 📄 Exportar a PDF (deshabilitado si hay 0 jugadores).
     - 🔄 Reiniciar mesa.
6. **Paso 3 (Cierre por clic exterior o Escape)**:
   - Pulsar fuera del menú o presionar la tecla `Escape`.
   - Comprobar que el menú se cierra limpiamente.
7. **Paso 4 (Ejecución de acción)**:
   - Añadir un participante (ej: "Manu").
   - Pulsar `"Acciones ▾"` -> comprobar que "Compartir cuenta" y "Exportar a PDF" están habilitados.
   - Pulsar "Exportar a PDF" -> comprobar que se abre el modal de reserva y el menú de acciones se cierra automáticamente.
8. **Paso 5 (Transición a Escritorio)**:
   - Cambiar el viewport a >= 680px (o desactivar modo móvil).
   - Comprobar que el botón `"Acciones ▾"` desaparece y los tres botones ("Compartir", "PDF", "Reiniciar") se muestran desplegados en línea.

---

## 4. Validación de Calidad y Compilación

```bash
npm run test:coverage
npm run build
```
Resultado esperado: Cero errores de compilación TypeScript y bundle estático generado con éxito.
