# Quickstart & Validation Guide: Ejecución de Pruebas con Cobertura

**Feature**: `011-test-coverage-report`  
**Date**: 2026-10-14  
**Status**: Ready for Implementation  

Esta guía describe cómo ejecutar la suite de pruebas del proyecto con análisis de cobertura de código y verificar los informes tanto en terminal como en navegador web.

---

## 1. Prerrequisitos

- Node.js instalado (v26 o superior).
- Dependencias de desarrollo instaladas (`npm install`).

---

## 2. Validación Automatizada de Cobertura en Terminal

Ejecutar el script de cobertura:

```bash
npm run test:coverage
```

### Resultados esperados en la terminal:
1. Todas las pruebas pasan con éxito (`46 passed` o superior).
2. Se imprime una tabla con las columnas:
   - `File`: Lista de archivos fuente analizados (`src/domain/*`, `src/storage/*`, `src/ui/*`, `src/utils/*`).
   - `% Stmts`: Porcentaje de sentencias ejecutadas.
   - `% Branch`: Porcentaje de bifurcaciones condicionales cubiertas.
   - `% Funcs`: Porcentaje de funciones cubiertas.
   - `% Lines`: Porcentaje de líneas cubiertas.
   - `Uncovered Line #s`: Líneas pendientes de cobertura.
3. El comando finaliza con código de salida `0`.

---

## 3. Validación del Reporte Interactivo HTML

1. Comprobar que tras la ejecución del comando se ha creado el archivo:
   ```bash
   ls -la coverage/index.html
   ```
2. Abrir el archivo `coverage/index.html` en el navegador predeterminado:
   - En macOS: `open coverage/index.html`
   - En Linux: `xdg-open coverage/index.html`
   - En Windows: `start coverage/index.html`
3. Navegar por los diferentes módulos (`domain`, `storage`, `ui`, `utils`).
4. Verificar que se resaltan las líneas de código ejecutadas en verde y las no cubiertas en rojo.

---

## 4. Validación de Control de Versiones (Git)

Comprobar que los archivos generados en `coverage/` están excluidos del control de versiones:

```bash
git status --porcelain coverage/
```
Resultado esperado: Salida vacía (ningún archivo dentro de `coverage/` es rastreado).
