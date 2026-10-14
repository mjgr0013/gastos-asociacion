# Feature Specification: Ejecución de Pruebas con Análisis y Reporte de Cobertura

**Feature Branch**: `011-test-coverage-report`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero poder ejecutar los test con cobertura y ver el coverage"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ejecución de pruebas con métricas de cobertura en la terminal (Priority: P1) 🎯 MVP

Como desarrollador o mantenedor del proyecto, quiero ejecutar un comando de pruebas con análisis de cobertura en la consola (`npm run test:coverage`), para que la suite de pruebas evalúe el código de la aplicación y muestre de inmediato en la terminal una tabla clara con los porcentajes de cobertura (líneas, funciones, ramas y sentencias) de cada módulo en `src/`, permitiéndome identificar rápidamente qué partes del código carecen de pruebas automatizadas.

**Why this priority**: Es la necesidad nuclear solicitada por el usuario. Permite obtener retroalimentación instantánea sobre la cobertura de las pruebas durante el desarrollo y la integración continua sin necesidad de herramientas externas.

**Independent Test**: Ejecutar `npm run test:coverage` en la terminal y comprobar que la suite completa de pruebas se ejecuta, finaliza con código de salida 0 y muestra en la consola la tabla con los porcentajes de cobertura de los archivos de `src/`.

**Acceptance Scenarios**:

1. **Given** el proyecto con la suite de pruebas existente, **When** el usuario ejecuta `npm run test:coverage`, **Then** todas las pruebas se ejecutan y se imprime en la terminal un resumen tabular con el desglose de cobertura (% de sentencias, ramas, funciones y líneas) por archivo.
2. **Given** la suite de pruebas pasando al 100%, **When** el comando de cobertura finaliza, **Then** el proceso termina con código de salida 0 (éxito).

---

### User Story 2 - Generación de reporte interactivo visual en HTML (Priority: P2)

Como desarrollador que necesita examinar qué líneas o ramas condicionales específicas no están cubiertas por los tests, quiero que la ejecución de cobertura genere un informe interactivo en formato HTML en el directorio local `coverage/`, de modo que pueda abrirlo en cualquier navegador web e inspeccionar visualmente el código fuente con las líneas cubiertas en verde y las no cubiertas en rojo.

**Why this priority**: Facilita enormemente el diagnóstico y la redacción de nuevos casos de prueba al permitir ver exactamente qué bifurcaciones lógicas o líneas de código no han sido ejecutadas.

**Independent Test**: Ejecutar el comando de cobertura, verificar que se crea el archivo `coverage/index.html` y comprobar que dicho archivo se puede abrir en el navegador mostrando el reporte interactivo.

**Acceptance Scenarios**:

1. **Given** la ejecución del comando de cobertura, **When** se completa el análisis, **Then** se genera el archivo `coverage/index.html` con el informe visual navegable.
2. **Given** la generación del directorio `coverage/`, **When** se consulta el estado de control de versiones con `git status`, **Then** el directorio `coverage/` no aparece como archivo no rastreado por estar ignorado en `.gitignore`.

---

### User Story 3 - Documentación del comando de cobertura en el proyecto (Priority: P3)

Como nuevo colaborador o desarrollador que consulta las instrucciones del repositorio, quiero que el comando para ejecutar las pruebas con cobertura esté documentado en el archivo `README.md`, para poder descubrirlo y usarlo sin necesidad de inspeccionar manualmente los scripts de `package.json`.

**Why this priority**: Asegura que el equipo conozca y aproveche la herramienta de cobertura de forma uniforme.

**Independent Test**: Abrir `README.md` y verificar que existe una entrada explicando cómo ejecutar las pruebas con cobertura y cómo consultar el informe.

**Acceptance Scenarios**:

1. **Given** el archivo `README.md`, **When** se consulta la sección de testing o scripts de desarrollo, **Then** se describe claramente el comando `npm run test:coverage` y la ubicación del informe HTML.

---

### Edge Cases

- **Archivos excluidos del análisis**: La cobertura debe centrarse en el código de la aplicación (`src/`) y excluir expresamente los archivos de pruebas (`tests/`), scripts de desarrollo y archivos de configuración para no distorsionar las métricas reales.
- **Rendimiento de la medición**: La instrumentación de código y la recolección de cobertura no deben ralentizar excesivamente la ejecución de los tests (tiempo total inferior a 10 segundos).
- **Ejecución en entornos CI/sin navegador**: El comando debe ser compatible con entornos de terminal pura o integración continua generando el resumen por consola sin exigir abrir ventanas emergentes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El proyecto DEBE incluir un script en `package.json` denominado `test:coverage` para ejecutar las pruebas con recolección de cobertura de código.
- **FR-002**: La ejecución del comando de cobertura DEBE imprimir en la consola del terminal un reporte tabular con métricas de cobertura por líneas, sentencias, funciones y ramas para cada archivo fuente en `src/`.
- **FR-003**: La ejecución del comando de cobertura DEBE generar un reporte HTML interactivo en la carpeta `coverage/` que permita inspeccionar visualmente las líneas cubiertas y no cubiertas.
- **FR-004**: La configuración de cobertura DEBE delimitar su alcance a los archivos de código fuente de la aplicación (`src/**/*.ts`), ignorando archivos de test (`tests/`) y archivos de configuración del proyecto.
- **FR-005**: El directorio de artefactos de cobertura (`coverage/`) DEBE permanecer excluido del control de versiones en el archivo `.gitignore`.
- **FR-006**: La documentación del repositorio (`README.md`) DEBE incluir la descripción del comando `npm run test:coverage` y las instrucciones para consultar el reporte.

### Key Entities *(include if feature involves data)*

- **Configuración de Cobertura de Pruebas**:
  - Parámetros: Proveedor de cobertura, reporteros configurados (`text` para consola, `html` para navegador), directorio de salida (`coverage/`), rutas de inclusión (`src/**/*.ts`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El comando `npm run test:coverage` se ejecuta y presenta el reporte en terminal en menos de 10 segundos.
- **SC-002**: El 100% de los módulos de la capa de dominio (`src/domain/`) y almacenamiento (`src/storage/`) quedan reflejados en el reporte de cobertura.
- **SC-003**: Cero archivos del directorio `coverage/` son rastreados por Git.
- **SC-004**: El archivo interactivo `coverage/index.html` se abre correctamente en el navegador local mostrando el reporte detallado con resaltado de código.

## Assumptions

- **Compatibilidad con Vitest**: Vitest es el framework de pruebas establecido en el proyecto (`vitest run` en `package.json`), por lo que la cobertura se configurará utilizando el proveedor oficial soportado por Vitest (V8) y su correspondiente paquete de desarrollo.
