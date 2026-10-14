# Quickstart & Validation Guide: Nombres Únicos y Formateo con Mayúscula

**Feature**: `009-unique-player-names`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo verificar y validar que los nombres de los jugadores se formatean automáticamente con la primera letra en mayúscula y que se rechazan nombres duplicados.

---

## 1. Prerrequisitos

- Node.js instalado (v20 o superior).
- Dependencias instaladas (`npm install`).

---

## 2. Validación Automatizada (Unit Tests)

Ejecutar las pruebas unitarias de validación y de almacén de participantes:

```bash
npm test tests/unit/validation.test.ts tests/unit/store.test.ts
```

### Escenarios cubiertos:
1. **Capitalización de primera letra**:
   - `formatParticipantName("manu")` -> `"Manu"`
   - `formatParticipantName("  carlos  ")` -> `"Carlos"`
   - `formatParticipantName("ángel")` -> `"Ángel"`
2. **Detección de duplicados case-insensitive**:
   - Con participante existente `Manu`:
     - Intentar `Manu` -> inválido (`valid: false`, mensaje de error).
     - Intentar `manu` -> inválido (`valid: false`, mensaje de error).
     - Intentar `  MANU  ` -> inválido (`valid: false`, mensaje de error).
     - Intentar `Carlos` -> válido (`valid: true`).
3. **Persistencia y Store**:
   - `store.addParticipant("manu")` crea participante con `name: "Manu"`.
   - Llamar a continuación `store.addParticipant("MANU")` lanza excepción y no modifica el estado.

---

## 3. Validación Manual en el Navegador

1. Iniciar el servidor local de desarrollo:
   ```bash
   npm run dev
   ```
2. Abrir la aplicación en el navegador (ej. `http://localhost:5173/`).
3. **Paso 1 (Capitalización)**:
   - En el campo "Añadir jugador", escribir `manu` (todo en minúsculas) y pulsar "＋ Añadir" o Enter.
   - Comprobar que en la tarjeta del jugador aparece `Manu` (con M mayúscula).
4. **Paso 2 (Duplicado exacto)**:
   - Escribir `Manu` y pulsar "＋ Añadir".
   - Comprobar que aparece el mensaje de error "Ya existe un jugador con este nombre en la mesa." y no se añade ninguna tarjeta nueva.
5. **Paso 3 (Duplicado case-insensitive y espacios)**:
   - Escribir `  manu  ` y pulsar "＋ Añadir".
   - Comprobar que vuelve a salir el mensaje de error.
6. **Paso 4 (Recuperación y limpieza)**:
   - Escribir `carlos` en el campo. Comprobar que al escribir o enviar se limpia el error.
   - Pulsar "＋ Añadir". Comprobar que se añade `Carlos`.

---

## 4. Validación de Calidad y Compilación

```bash
npm test
npm run build
```
Resultado esperado: Todas las pruebas pasando y build completado sin errores.
