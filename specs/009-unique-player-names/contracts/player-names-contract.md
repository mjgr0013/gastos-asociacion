# Contracts: Player Names Formatting and Uniqueness

**Feature**: `009-unique-player-names`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Funciones de Dominio (`src/domain/validation.ts`)

```typescript
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Formatea un nombre de participante eliminando espacios periféricos
 * y capitalizando su primera letra.
 */
export function formatParticipantName(name: string): string;

/**
 * Comprueba si un nombre de participante ya existe en la lista de nombres dada,
 * realizando una comparación case-insensitive y sin espacios periféricos.
 */
export function isDuplicateParticipantName(
  name: string,
  existingNames: string[]
): boolean;

/**
 * Valida un nombre de participante verificando:
 * 1. No vacío tras trim (error: "El nombre del participante no puede estar vacío.")
 * 2. Longitud máxima <= 50 (error: "El nombre del participante no puede superar los 50 caracteres.")
 * 3. No duplicado respecto a existingNames (error: "Ya existe un jugador con este nombre en la mesa.")
 */
export function validateParticipantName(
  name: string,
  existingNames?: string[]
): ValidationResult;
```

---

## 2. Contrato de `SessionStore.addParticipant` (`src/storage/store.ts`)

```typescript
export class SessionStore {
  /**
   * Añade un nuevo participante a la sesión activa tras validar:
   * - Longitud y no vacío
   * - No duplicidad case-insensitive contra this.state.participants
   * Almacena el nombre formateado mediante formatParticipantName.
   *
   * @throws Error con el mensaje de validación si no es válido
   * @returns El nuevo participante creado
   */
  public addParticipant(name: string): Participant;
}
```

---

## 3. Contrato de UI `ParticipantFormComponent` (`src/ui/components/participant-form.ts`)

```typescript
export class ParticipantFormComponent {
  /**
   * Maneja el envío del formulario. Si addParticipant falla por duplicado o vacío:
   * - Muestra el mensaje de error en #participant-form-error.
   * - Mantiene el foco en el input.
   * Al escribir en el input o enviar con éxito:
   * - Limpia el mensaje de error.
   */
  private handleSubmit(event: Event): void;
  public showError(message: string): void;
  public clearError(): void;
}
```
