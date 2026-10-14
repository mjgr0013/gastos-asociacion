# Constitución del Proyecto: Boardgame Expenses (Frontend Estático)

## 1. Stack Técnico y Alojamiento
- **Naturaleza:** Aplicación web cliente pura (SPA estática) sin dependencias de servidor ni base de datos externa.
- **Tecnologías:** HTML5, CSS moderno (o Tailwind CSS) y JavaScript moderno (ES Modules) o TypeScript.
- **Persistencia:** Exclusivamente en `localStorage` del navegador para conservar la sesión actual ante recargas.
- **Despliegue:** 100% compatible con GitHub Pages (sin backend ni procesos server-side).

## 2. Arquitectura y Calidad
- Modularidad: Separación clara entre la capa de estado/lógica de negocio (cálculo de totales, gestión de participantes) y la capa de renderizado visual (DOM/UI).
- Accesible desde móvil y escritorio con diseño responsive (para apuntar consumiciones desde el teléfono mientras se juega).
- Código limpio, legible y documentado.

## 3. Flujo de Trabajo SDD
- Los cambios respetan el ciclo de Spec Kit: `spec.md` -> `plan.md` -> `tasks.md` -> `implement`.
