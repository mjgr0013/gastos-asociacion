# Interface Contract: SessionStore & Storage

**Feature**: `001-boardgame-expense-tracker`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato del Almacén de Estado (`SessionStore`)

El `SessionStore` desacopla la lógica de negocio y persistencia del renderizado visual. Expone una interfaz orientada a acciones y suscripción reactiva.

```typescript
export type StoreListener = (state: Readonly<SessionState>) => void;
export type Unsubscribe = () => void;

export interface ISessionStore {
  /**
   * Obtiene una copia inmutable del estado actual.
   */
  getState(): Readonly<SessionState>;

  /**
   * Suscribe un callback a cualquier cambio de estado.
   * Devuelve una función para cancelar la suscripción.
   */
  subscribe(listener: StoreListener): Unsubscribe;

  /**
   * Añade un nuevo participante a la sesión.
   * @throws Error si el nombre es inválido o vacío.
   */
  addParticipant(name: string): Participant;

  /**
   * Elimina un participante por su ID.
   * @returns true si fue eliminado, false si no existía.
   */
  removeParticipant(participantId: string): boolean;

  /**
   * Añade una consumición a un participante específico.
   * Si ya existe un producto con el mismo nombre y precio para ese participante,
   * incrementa la cantidad en lugar de duplicar la línea.
   * @throws Error si los datos no superan la validación.
   */
  addConsumption(
    participantId: string,
    consumption: { name: string; unitPrice: number; quantity?: number }
  ): ConsumptionItem;

  /**
   * Modifica la cantidad de una consumición existente.
   * Si la nueva cantidad es <= 0, elimina la consumición.
   */
  updateConsumptionQuantity(
    participantId: string,
    consumptionId: string,
    newQuantity: number
  ): void;

  /**
   * Elimina directamente una consumición de un participante.
   */
  removeConsumption(participantId: string, consumptionId: string): boolean;

  /**
   * Restablece la sesión completa a cero (vacía la lista y actualiza localStorage).
   */
  resetSession(): void;

  /**
   * Comprueba si el almacenamiento persistente está disponible en el navegador.
   */
  isStorageAvailable(): boolean;
}
```

---

## 2. Contrato de Notificaciones de Error en UI

Cuando una operación falla o el almacenamiento persistente no está disponible, el sistema emite eventos tipados para que la UI presente retroalimentación no bloqueante:

```typescript
export type UIWarningType = 'STORAGE_UNAVAILABLE' | 'INVALID_INPUT' | 'ACTION_BLOCKED';

export interface UIWarningEvent {
  type: UIWarningType;
  message: string;
}
```
