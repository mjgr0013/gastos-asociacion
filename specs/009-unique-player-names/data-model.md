# Data Model: Nombres Únicos y Formateo con Mayúscula para Jugadores

**Feature**: `009-unique-player-names`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Entidades del Modelo

### `Participant`
Representa a un jugador en la sesión activa.

```typescript
export interface Participant {
  id: string;          // Identificador único (UUID generado)
  name: string;        // Nombre formateado (primera letra en mayúscula, trim aplicado)
  items: ConsumptionItem[];
  createdAt: string;   // Timestamp ISO 8601
}
```

---

## 2. Reglas de Validación e Invariantes

1. **Formato del Nombre (`formatParticipantName`)**:
   - Espacios periféricos: Eliminados mediante `trim()`.
   - Longitud: Mínimo 1 carácter, máximo 50 caracteres.
   - Capitalización: La primera letra debe estar en mayúscula (`name.charAt(0).toUpperCase()`).

2. **Invariante de Unicidad**:
   - En una sesión activa, para cualquier par de participantes `p1` y `p2`:
     `p1.id !== p2.id => p1.name.trim().toLowerCase() !== p2.name.trim().toLowerCase()`.
   - Si se intenta añadir un nombre cuya normalización case-insensitive coincida con un participante existente, la operación es rechazada con el error:
     `'Ya existe un jugador con este nombre en la mesa.'`.

3. **Ciclo de Vida y Transición de Estado**:
   - **Formulario (Input)**: El usuario introduce `manu`.
   - **Validación**:
     1. Comprueba si está vacío o supera 50 caracteres -> Si falla, error correspondiente.
     2. Comprueba duplicado contra participantes existentes -> Si existe, error de duplicado.
   - **Formateo**: Se transforma a `Manu`.
   - **Almacenamiento**: Se guarda en `SessionState.participants` con `name: 'Manu'`.
   - **Persistencia**: Se sincroniza automáticamente en `localStorage`.
