# Feature Specification: Actualización del Entorno de Ejecución a Node.js 26

**Feature Branch**: `003-upgrade-node-26`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero actualizar el proyecto con la node 26"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compatibilidad y soporte oficial con Node.js 26 (Priority: P1)

Como desarrollador o mantenedor del proyecto, quiero que la configuración del proyecto y sus herramientas de desarrollo reconozcan oficialmente Node.js 26 como entorno de ejecución soportado (mediante `.nvmrc` y el campo `engines` en `package.json`), para que cualquier persona o pipeline de integración que trabaje en el repositorio utilice la versión adecuada sin discrepancias de entorno.

**Why this priority**: Establece la base operativa del proyecto, garantizando que el entorno local y de integración continua operen bajo la versión esperada sin advertencias ni fallos de compatibilidad.

**Independent Test**: Puede probarse de forma independiente verificando que `.nvmrc` especifica la versión 26, que `package.json` declara `engines.node`, y que los comandos principales (`npm test` y `npm run build`) finalizan con código de salida 0 bajo Node.js 26.

**Acceptance Scenarios**:

1. **Given** un entorno con Node.js 26 activo, **When** el usuario ejecuta `npm test`, **Then** la suite completa de pruebas se ejecuta y pasa al 100% sin advertencias de versión de runtime.
2. **Given** un entorno con Node.js 26 activo, **When** el usuario ejecuta `npm run build`, **Then** el compilador de TypeScript y Vite generan el paquete de producción en `dist/` limpiamente.
3. **Given** una herramienta de gestión de versiones como `nvm`, **When** se ejecuta `nvm use` en la raíz del proyecto, **Then** se selecciona automáticamente la versión de Node.js 26 especificada en `.nvmrc`.

---

### User Story 2 - Actualización de documentación de requisitos previos (Priority: P2)

Como nuevo colaborador del proyecto, quiero que la documentación (`README.md` y guías de inicio rápido) indique de forma explícita que se requiere Node.js 26 para el desarrollo local, evitando confusiones con versiones anteriores.

**Why this priority**: Garantiza una incorporación fluida para cualquier persona que clone el repositorio o consulte los requerimientos del proyecto.

**Independent Test**: Puede probarse revisando la sección de "Requisitos Previos" de la documentación para comprobar que hace referencia a Node.js 26.

**Acceptance Scenarios**:

1. **Given** el archivo `README.md`, **When** se consulta la sección de instalación o requisitos previos, **Then** se especifica claramente Node.js 26 como versión requerida.

---

### Edge Cases

- **Uso de versiones anteriores de Node**: Si un colaborador intenta ejecutar el proyecto con una versión anterior (ej: Node 18 o 20), el sistema debe advertir mediante el campo `engines` de `package.json` para facilitar el diagnóstico de posibles incompatibilidades.
- **Herramientas de empaquetado**: Las dependencias de desarrollo (`vite`, `typescript`, `vitest`) deben ser plenamente operativas bajo Node 26 sin requerir banderas experimentales.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El proyecto DEBE declarar el soporte explícito de Node.js 26 en el campo `engines.node` de `package.json` (ej: `>=26.0.0`).
- **FR-002**: El proyecto DEBE incluir un archivo de configuración de versión de Node (`.nvmrc`) en la raíz del repositorio especificando la versión 26.
- **FR-003**: Todas las tareas del ciclo de vida del proyecto (`npm test`, `npm run build`, `npm run dev`) DEBEN ejecutarse y completarse exitosamente bajo Node.js 26.
- **FR-004**: La documentación del proyecto (`README.md`) DEBE actualizarse para reflejar Node.js 26 como versión de ejecución recomendada en los requisitos previos.

### Key Entities *(include if feature involves data)*

- **Manifiesto de Configuración de Entorno**:
  - Archivos: `package.json` (campo `engines`), `.nvmrc`.
  - Atributos: Versión de Node objetivo (`26` / `>=26.0.0`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de las pruebas automatizadas existentes pasan exitosamente bajo Node.js 26 en menos de 5 segundos.
- **SC-002**: El comando de build de producción (`npm run build`) genera el paquete estático sin errores de compilación ni advertencias de motor bajo Node.js 26.
- **SC-003**: Cero advertencias de incompatibilidad de motor (`EBADENGINE`) al instalar o ejecutar scripts bajo Node.js 26.

## Assumptions

- **Disponibilidad de Node.js 26**: El entorno de trabajo actual del usuario cuenta con Node.js 26 instalado (v26.11.1).
- **Compatibilidad de la SPA cliente**: La aplicación web compilada sigue siendo una SPA estática servida en navegador, por lo que el cambio de versión de Node.js afecta exclusivamente al entorno de desarrollo, testing y build, sin alterar la experiencia del usuario final en GitHub Pages.
