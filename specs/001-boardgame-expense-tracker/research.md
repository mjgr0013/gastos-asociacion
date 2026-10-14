# Technical Research: Control de Gastos de Consumiciones (Boardgame Expenses)

**Feature**: `001-boardgame-expense-tracker`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Stack Técnico y Arquitectura de la Aplicación

### Decisión
Utilizar **Vite + TypeScript + Vanilla CSS** para una Single Page Application (SPA) cliente pura, sin frameworks pesados en tiempo de ejecución (React/Vue/Angular).

### Justificación
- **Alineación con la Constitución**: Cumple con la exigencia de una aplicación web cliente pura (SPA estática), sin dependencias de servidor ni backend, 100% compatible con GitHub Pages.
- **Robustez y Seguridad de Tipos**: TypeScript previene errores de redondeo o datos nulos/indefinidos en los cálculos financieros de consumiciones y subtotales.
- **Rendimiento Máximo (<100ms)**: Al prescindir de un virtual DOM pesado, la renderización directa mediante controladores modulares de vista DOM garantiza tiempos de respuesta instantáneos y carga inicial inferior a 1 segundo incluso en dispositivos móviles con conexiones lentas.
- **Desarrollo y Testing Ágil**: Vite proporciona recarga en caliente instantánea y compilación optimizada a estáticos (`dist/`) lista para GitHub Pages.

### Alternativas Consideradas
- **React / Vue**: Descartado para evitar overhead de dependencias y complejidad innecesaria en una aplicación enfocada en simplicidad y velocidad en mesa.
- **Vanilla JavaScript sin empaquetador**: Descartado porque carece de verificación estática de tipos en tiempo de compilación y dificulta la ejecución directa de tests unitarios automáticos en TypeScript.

---

## 2. Gestión de Estado y Persistencia en `localStorage`

### Decisión
Implementar un patrón de almacén observable desacoplado (`SessionStore`) con sincronización inmediata a `localStorage` bajo la clave `bg_expense_session_v1` y mecanismo de degradación elegante a memoria volátil ante restricciones de almacenamiento.

### Justificación
- **Separación de Capas (Constitución Art. 2)**: La lógica de negocio (añadir/eliminar participantes, añadir consumiciones del catálogo o formulario, cálculo de sumas con precisión decimal de 2 dígitos) reside íntegramente en el almacén de estado, desacoplada de la manipulación del DOM.
- **Persistencia Atómica (FR-009, SC-003)**: Cada mutación de estado invoca un guardado síncrono serializado en JSON.
- **Resiliencia ante Excepciones de Almacenamiento**: Si `localStorage.setItem` falla (por modo incógnito restrictivo o cuota excedida), se captura el error (`QuotaExceededError`, `SecurityError`), la app continúa operativa en memoria durante la partida y se notifica al usuario mediante un aviso discreto en la interfaz.

### Alternativas Consideradas
- **IndexedDB**: Descartado por ser asíncrono y añadir complejidad excesiva para un volumen de datos que en una partida habitual rara vez supera unos pocos kilobytes.
- **Librerías externas de estado (Redux, Zustand)**: Innecesarias dado que el patrón Observer nativo con TypeScript cubre todas las necesidades con menos de 100 líneas de código limpio.

---

## 3. Estrategia de Diseño Visual y Responsividad Móvil

### Decisión
Utilizar **Vanilla CSS moderno** estructurado mediante variables CSS (Design Tokens para paleta de colores, espaciados y sombras), Mobile-First Flexbox/Grid y diseño optimizado para interacción táctil con una sola mano.

### Justificación
- **Directrices del CLI Gemini**: Priorizar Vanilla CSS y evitar Tailwind CSS salvo petición explícita, manteniendo máxima flexibilidad y control sin procesadores externos.
- **Ergonomía en Mesa de Juego (FR-013, SC-005)**:
  - Objetivos táctiles mínimos de 44x44px para botones de acción y chips de catálogo rápido.
  - Barra de resumen fijada (*sticky summary*) con el total global visible en todo momento.
  - Tipografía legible con alto contraste adaptada para visualización a distancia en la mesa.
  - Adaptación fluida de 1 columna en smartphones (360px+) a cuadrícula multitarjeta en tablet/escritorio.

### Alternativas Consideradas
- **Tailwind CSS**: Descartado en cumplimiento de las directrices estándar para evitar herramientas y clases utilitarias redundantes para una interfaz de una sola pantalla.

---

## 4. Estrategia de Testing y Verificación de Calidad

### Decisión
Integrar **Vitest** como motor de pruebas unitarias para validación de la capa de dominio, cálculos de subtotales, redondeos monetarios y persistencia en localStorage.

### Justificación
- Vitest funciona de forma nativa con la configuración de Vite sin dependencias de compilación adicionales (`ts-jest`, `babel`).
- Permite simular `localStorage` (mediante jsdom o mocks en memoria) para validar el 100% de los escenarios de aceptación y edge cases definidos en `spec.md`.

### Alternativas Consideradas
- **Jest**: Configuración más pesada con ES Modules y TypeScript en entornos modernos.

---

## 5. Estrategia de Despliegue en GitHub Pages

### Decisión
Configurar Vite con `base: './'` en `vite.config.ts`, permitiendo que los activos generados en `dist/` contengan rutas relativas aptas para cualquier subdirectorio de GitHub Pages (ej: `https://usuario.github.io/prueba-cuenta/`).

### Justificación
- Elimina problemas habituales de rutas absolutas 404 al desplegar en proyectos con ruta base de repositorio.
- Compatible con GitHub Actions `actions/deploy-pages` o despliegue directo de rama.
