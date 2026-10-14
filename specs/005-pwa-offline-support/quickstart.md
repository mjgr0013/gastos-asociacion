# Quickstart & Validation Guide: PWA e Instalación Offline

**Feature**: `005-pwa-offline-support`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

---

## 1. Verificación Automática

```bash
# 1. Ejecutar suite de pruebas
npm test

# 2. Generar build estático para producción
npm run build
```

---

## 2. Escenarios de Validación Manual E2E

### Escenario 1: Detección del Manifiesto y Criterios de Instalación (P1 - SC-001)
1. Abrir la aplicación en Chrome / Edge / Safari.
2. Abrir **DevTools > Application > Manifest**.
3. **Resultado esperado**:
   - `name`, `short_name`, `theme_color` (#2563eb), `background_color` e iconos cargan sin errores ni advertencias.
   - En la barra de direcciones o menú aparece el botón *"Instalar aplicación"*.

### Escenario 2: Funcionamiento 100% Offline (P1 - SC-002)
1. Tras cargar la web por primera vez, abrir **DevTools > Network** y marcar **Offline** (o activar modo avión en el móvil).
2. Recargar la página (`Cmd+R` / `F5`).
3. **Resultado esperado**:
   - La aplicación carga inmediatamente (<1s) desde la caché del Service Worker.
   - Los participantes guardados se restauran desde `localStorage`.
   - Se puede añadir un nuevo jugador y registrar consumiciones sin cortes.

### Escenario 3: Ejecución en Modo Standalone (P2 - SC-003)
1. Instalar la aplicación en la pantalla de inicio o escritorio.
2. Abrirla desde el icono creado.
3. **Resultado esperado**: La ventana se abre como aplicación independiente sin barra de direcciones ni controles de navegador.
