# Contracts: Test Coverage CLI and Configuration

**Feature**: `011-test-coverage-report`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de Scripts en `package.json`

```json
{
  "scripts": {
    "test": "vitest run",
    "test:coverage": "vitest run --coverage"
  },
  "devDependencies": {
    "@vitest/coverage-v8": "^1.6.0"
  }
}
```

### Comportamiento del comando `npm run test:coverage`:
- Ejecuta todas las pruebas unitarias y de integración del proyecto sin modo watch (`run`).
- Activa el recolector de cobertura V8.
- Imprime la tabla resumen en stdout.
- Genera la carpeta `coverage/` con el reporte HTML.
- Termina con código de salida `0` si todos los tests pasan, o código `!= 0` si algún test falla.

---

## 2. Contrato de Configuración en `vite.config.ts`

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/main.ts', 'src/**/*.d.ts']
    }
  }
});
```
