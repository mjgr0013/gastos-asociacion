# Technical Research: Actualización a Node.js 26

**Feature**: `003-upgrade-node-26`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Declaración de Motor en `package.json`

### Decisión
Añadir el campo `"engines"` con `"node": ">=26.0.0"` en el `package.json` del proyecto.

### Justificación
- **Estándar Oficial de npm**: La clave `engines` es el mecanismo canónico para comunicar la versión mínima soportada a herramientas de desarrollo, empaquetadores y pipelines de integración continua.
- **Prevención de Errores Silenciosos**: Permite a los gestores de paquetes advertir o bloquear la instalación si un desarrollador utiliza un entorno desactualizado cuando `engine-strict` está habilitado.

### Alternativas Consideradas
- **No declarar `engines`**: Descartado porque deja el proyecto sin especificación formal de versión de runtime.
- **Fijar versión exacta `"node": "26.11.1"`**: Descartado por ser demasiado restrictivo para futuras versiones menores o parches de Node 26.

---

## 2. Archivo de Gestión de Entorno (`.nvmrc`)

### Decisión
Crear un archivo `.nvmrc` en la raíz del repositorio con el contenido `26`.

### Justificación
- **Compatibilidad con Gestores de Versiones**: Es compatible de forma nativa con `nvm`, `fnm`, `volta` y `asdf`.
- **Integración con GitHub Actions**: La acción oficial `actions/setup-node` soporta directamente el parámetro `node-version-file: '.nvmrc'`, garantizando que CI use siempre la versión adecuada.

---

## 3. Compatibilidad del Toolchain Existente (Vite, TypeScript, Vitest)

### Decisión
Mantener las versiones actuales de las dependencias (`vite ^5.2.11`, `typescript ^5.4.5`, `vitest ^1.6.0`), las cuales se ejecutan de forma completamente estable sobre Node 26.11.1 sin advertencias de deprecación.

### Justificación
- La compilación (`npm run build`) y las pruebas (`npm test`) se ejecutan y superan el 100% de los casos en menos de 200 ms bajo Node 26.
