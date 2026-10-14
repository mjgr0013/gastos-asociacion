# Quickstart & Validation Guide: Compartir Resumen de Cuenta

**Feature**: `004-share-session-summary`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

---

## 1. Verificación Automática

```bash
# Ejecutar suite de pruebas unitarias
npm test

# Verificar compilación estricta de TypeScript y build de producción
npm run build
```

---

## 2. Escenarios de Validación Manual E2E

### Escenario 1: Compartir con mesa activa (P1 - SC-001)
1. Abrir la aplicación y añadir a `Manu` (2 refrescos a 1,50 € = 3,00 €) y `Carlos` (1 pizza a 6,50 € = 6,50 €).
2. Comprobar que el botón `📤 Compartir` en la cabecera está activo.
3. Pulsar el botón `Compartir`.
4. **Resultado esperado**:
   - En móvil con Web Share API: se abre el menú nativo para enviar a WhatsApp/Telegram.
   - En escritorio: el texto se copia al portapapeles y aparece la notificación "¡Resumen copiado al portapapeles!".
   - Al pegar (`Cmd+V` / `Ctrl+V`), el mensaje muestra:
     ```text
     🎲 Cuenta de la partida (14/10/2026):
     • Manu: 3,00 € (2x Refresco)
     • Carlos: 6,50 € (1x Pizza)
     ------------------------------------
     Total mesa: 9,50 €
     ```

### Escenario 2: Mensaje flotante Toast (P2)
1. En navegador de escritorio, pulsar `Compartir`.
2. **Resultado esperado**: Aparece la notificación flotante en la parte inferior durante 3 segundos y luego se oculta suavemente.

### Escenario 3: Botón deshabilitado con mesa vacía (P3)
1. Reiniciar la sesión o abrir la aplicación sin participantes.
2. **Resultado esperado**: El botón `Compartir` está en estado deshabilitado (`disabled`) y no reacciona a pulsaciones.
