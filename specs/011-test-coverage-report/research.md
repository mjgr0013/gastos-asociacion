# Research: Ejecución de Pruebas con Análisis y Reporte de Cobertura

**Feature**: `011-test-coverage-report`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Proveedor de Cobertura para Vitest

### Contexto y Necesidad
El proyecto utiliza Vitest 1.6 (`vitest run`). Para calcular y reportar la cobertura de código en sentencias, ramas, funciones y líneas, Vitest requiere un proveedor de instrumentación de cobertura (`@vitest/coverage-v8` o `@vitest/coverage-istanbul`).

### Decision
Utilizar el proveedor oficial `@vitest/coverage-v8` versión `^1.6.0` (matching con `vitest@1.6.1`).

### Rationale
- `@vitest/coverage-v8` utiliza las APIs nativas de inspección de V8 integradas en Node.js, lo que ofrece un rendimiento superior y ejecución ultrarrápida frente a transpiladores como Istanbul.
- Es el proveedor recomendado por el equipo oficial de Vitest.
- Produce reportes precisos directamente mapeados con los source maps de TypeScript.

### Alternatives considered
- `@vitest/coverage-istanbul`: Más pesado y lento por requerir re-instrumentar el AST con Babel/Istanbul.
- `c8` independiente: Obsoleto en favor de la integración directa de Vitest.

---

## 2. Configuración de Reporteros y Alcance de Archivos

### Decision
Configurar en `vite.config.ts`:
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html'],
    reportsDirectory: './coverage',
    include: ['src/**/*.ts'],
    exclude: ['src/main.ts', 'src/**/*.d.ts']
  }
}
```

### Rationale
- `text`: Imprime de forma inmediata en la terminal la tabla con el resumen de métricas (% Stmts, % Branch, % Funcs, % Lines, Uncovered Line #s) al terminar la ejecución de tests.
- `html`: Genera la carpeta `coverage/` con el visor estático `coverage/index.html` para inspección interactiva y visual en cualquier navegador.
- `include: ['src/**/*.ts']`: Limita el cálculo a los archivos de código fuente de la aplicación, evitando que archivos de test (`tests/`), scripts de herramientas o configs de Vite contaminen el resultado.

---

## 3. Scripts de Ejecución y Documentación

### Decision
1. Añadir en `package.json` el script:
   `"test:coverage": "vitest run --coverage"`
2. Documentar en `README.md` el nuevo comando dentro de la sección de testing y scripts disponibles.

### Rationale
- Estandariza la invocación mediante `npm run test:coverage` común en el ecosistema Node.js.
- Facilita su uso tanto en desarrollo local como en pipelines de CI.
