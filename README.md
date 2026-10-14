# Control de Gastos de Consumiciones (Boardgame Expenses) 🎲

Aplicación web cliente pura (SPA estática) diseñada para registrar consumiciones y calcular gastos en sesiones de juegos de mesa de forma rápida, táctil y sin desbordamientos en pantallas móviles.

Desplegable directamente en **GitHub Pages** sin servidores ni bases de datos externas.

---

## Características Principales

1. **Gestión de Participantes**: Alta inmediata de jugadores y eliminación con confirmación si tienen gastos asignados.
2. **Doble Modalidad de Consumiciones**:
   - **Catálogo Rápido**: Botones de acceso directo para consumiciones habituales (Refresco 1,50 €, Cerveza 1,50 €, Snack 1,00 €, Café 1,20 €) para asignación con un solo toque.
   - **Formulario Libre**: Modal accesible para registrar cualquier producto con precio y cantidad personalizados.
3. **Cálculo en Tiempo Real**: Subtotales automáticos por participante e importe total acumulado de la mesa (<100ms) con formato estándar en euros (€).
4. **Persistencia Automática**: Sincronización continua en el `localStorage` del navegador (`bg_expense_session_v1`) para no perder datos si se recarga la pestaña o se apaga la pantalla del móvil.
5. **Reinicio Seguro de Sesión**: Botón para vaciar la mesa y comenzar una nueva cuenta con confirmación obligatoria contra toques involuntarios.
6. **Diseño Mobile-First**: Optimizado para uso con una sola mano en mesa de juego, objetivos táctiles de al menos 44x44px, barra fija de resumen y adaptación fluida a pantallas grandes.

---

## Tecnologías y Requisitos

- **Entorno de Ejecución**: Node.js v26+ (especificado en `.nvmrc` y `engines` de `package.json`).
- **Lenguaje**: TypeScript 5.x estricto.
- **Herramientas**: Vite 5.x y Vitest.
- **Estilos**: Vanilla CSS con Custom Properties (Design Tokens), Flexbox y CSS Grid.
- **Persistencia**: `localStorage` nativo con degradación elegante a memoria en modo incógnito restrictivo.

---

## Instalación y Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo en local
npm run dev

# 3. Ejecutar suite de pruebas unitarias e integración
npm test

# 4. Generar build estático para producción
npm run build

# 5. Previsualizar el bundle de producción
npm run preview
```

---

## Despliegue en GitHub Pages

El proyecto está configurado con `base: './'` en `vite.config.ts`, por lo que el contenido generado en `dist/` es 100% portable a cualquier repositorio de GitHub Pages.

Para desplegar automáticamente mediante GitHub Actions:
1. Ir a **Settings > Pages** en el repositorio de GitHub.
2. En **Build and deployment > Source**, seleccionar **GitHub Actions**.
3. El flujo de trabajo estándar de Vite desplegará la carpeta `dist/` de forma instantánea.

---

## Licencia

MIT
