# Technical Research: Compartir Resumen de Cuenta por WhatsApp o Portapapeles

**Feature**: `004-share-session-summary`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Generación del Texto Estructurado de la Cuenta

### Decisión
Implementar una función pura `generateSessionShareText(participants: Participant[], date?: Date): string` en la capa de dominio (`src/domain/sharing.ts`), totalmente desacoplada del DOM y de APIs del navegador.

### Justificación
- **Testabilidad Integral**: Permite probar con Vitest todas las variantes (múltiples jugadores, jugadores sin consumiciones, productos con caracteres especiales, formato de moneda con céntimos) sin mocks de navegador.
- **Formato Optimizado para Mensajería**:
  ```text
  🎲 Cuenta de la partida (14/10/2026):
  • Manu: 4,50 € (2x Refresco, 1x Snack)
  • Carlos: 6,50 € (1x Pizza)
  ------------------------------------
  Total mesa: 11,00 €
  ```
  El uso de viñetas `•`, saltos de línea y separadores legibles garantiza compatibilidad perfecta con WhatsApp, Telegram, correo y SMS.

---

## 2. Estrategia de Compartición (Web Share API vs. Clipboard API)

### Decisión
Crear una utilidad modular `shareOrCopyText(payload: { title: string, text: string }): Promise<'shared' | 'copied' | 'cancelled'>`:
1. Si `navigator.share` está disponible y `navigator.canShare` lo valida, invocar `await navigator.share(payload)`. Si el usuario cancela (`AbortError`), se retorna `'cancelled'` sin alertas.
2. Si `navigator.share` no está disponible o falla, recurrir a `await navigator.clipboard.writeText(payload.text)` y retornar `'copied'`.
3. Fallback de emergencia si el portapapeles está bloqueado: presentar un diálogo modal con el texto seleccionado para copiar manualmente.

### Justificación
- **Experiencia Nativa en Móvil**: En Android/iOS abre directamente WhatsApp/Telegram para seleccionar el grupo de juego.
- **Fluidez en Escritorio**: En PC/Mac copia directamente al portapapeles sin fricción.

---

## 3. Notificación Visual Flotante (Toast Accesible)

### Decisión
Crear `ToastNotificationComponent` (`Toast.show(message, durationMs = 3000)`) con contenedor fijado en la parte inferior de la pantalla, animación CSS suave y atributos `role="status"` y `aria-live="polite"`.

### Justificación
- Proporciona retroalimentación inequívoca cuando el texto se copia al portapapeles.
- Desaparece automáticamente a los 3 segundos sin requerir clics del usuario.
