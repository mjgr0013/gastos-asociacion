# Data Model: Configuración y Métricas de Cobertura de Pruebas

**Feature**: `011-test-coverage-report`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Entidades de Configuración de Cobertura

### `CoverageConfig`
Estructura de configuración para la recolección de métricas de cobertura en `vite.config.ts`.

```typescript
export interface CoverageConfig {
  provider: 'v8';
  reporter: ('text' | 'html')[];
  reportsDirectory: string;
  include: string[];
  exclude: string[];
}
```

---

## 2. Métricas y Artefactos Generados

1. **Salida en Terminal (Reporter `text`)**:
   - `% Statements`: Porcentaje de sentencias ejecutadas.
   - `% Branch`: Porcentaje de bifurcaciones condicionales (`if`, `switch`, ternarios) evaluadas en todos sus caminos.
   - `% Functions`: Porcentaje de funciones invocadas.
   - `% Lines`: Porcentaje de líneas de código cubiertas.
   - `Uncovered Line #s`: Intervalo de líneas específicas sin ejecutar.

2. **Salida Visual HTML (Reporter `html`)**:
   - Directorio: `coverage/`.
   - Punto de entrada: `coverage/index.html`.
   - Subdirectorios por módulo (`domain/`, `storage/`, `ui/`, `utils/`).
   - Código fuente coloreado indicando líneas ejecutadas y no ejecutadas.

3. **Invariantes y Reglas de Ignorado**:
   - `coverage/` debe estar presente en `.gitignore`.
   - Cero artefactos de `coverage/` deben incluirse en commits.
