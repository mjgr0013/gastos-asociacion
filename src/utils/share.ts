export interface SharePayload {
  title: string;
  text: string;
}

export type ShareResult = 'shared' | 'copied' | 'cancelled' | 'error';

export async function shareOrCopyText(payload: SharePayload): Promise<ShareResult> {
  // 1. Intentar Web Share API si está soportado en el navegador (móviles)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (!navigator.canShare || navigator.canShare({ text: payload.text })) {
        await navigator.share({
          title: payload.title,
          text: payload.text
        });
        return 'shared';
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'cancelled';
      }
      // En caso de otro error, continuamos al fallback de portapapeles
    }
  }

  // 2. Fallback a Clipboard API (escritorio y navegadores compatibles)
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    try {
      await navigator.clipboard.writeText(payload.text);
      return 'copied';
    } catch (err) {
      console.warn('Fallo al copiar con Clipboard API, probando fallback:', err);
    }
  }

  // 3. Fallback para entornos donde clipboard esté restringido
  try {
    const textarea = document.createElement('textarea');
    textarea.value = payload.text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const success = document.execCommand('copy');
    textarea.remove();
    if (success) {
      return 'copied';
    }
  } catch {
    // Si todo falla
  }

  return 'error';
}
