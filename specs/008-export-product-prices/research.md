# Research: Resumen de Precios de Productos en la Cuenta Exportada

**Feature**: `008-export-product-prices`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Algoritmo de Extracción y Deduplicación de Productos Consumidos

### Contexto y Necesidad
El usuario solicita que en la información de exportar la cuenta se añada un resumen del precio de los productos que al menos tenga una persona asignada. Es necesario extraer de todos los participantes los productos con cantidad mayor que 0, deduplicarlos adecuadamente y excluir productos del catálogo que no hayan sido consumidos.

### Decision
Crear una función pura de dominio `extractConsumedProductPrices(participants: Participant[]): ConsumedProductPrice[]` en `src/domain/sharing.ts` que:
1. Itere sobre todos los `items` de todos los `participants`.
2. Filtre los ítems con `quantity > 0`.
3. Utilice como clave de unicidad compuesta `${item.name}:::${item.unitPrice}` para deduplicar productos idénticos sin perder variantes personalizadas con el mismo nombre y precio diferente (cumpliendo con el caso borde y FR-006).
4. Devuelva una lista estructurada con `{ name: string, unitPrice: number }`.

### Rationale
- Una función pura en la capa de dominio (`src/domain/sharing.ts`) asegura modularidad, total aislamiento del DOM y facilita pruebas unitarias exhaustivas con Vitest sin necesidad de simular navegadores.
- La clave compuesta `${name}:::${unitPrice}` preserva la integridad si un anfitrión añade manualmente dos productos con el mismo nombre pero diferente precio (ej. "Tapa: 2,00 €" y "Tapa: 2,50 €").
- Filtrar `quantity > 0` garantiza que si un ítem fue puesto a 0, no contamina el resumen.

### Alternatives considered
- **Deduplicar únicamente por nombre (`item.name`)**: Rechazado porque si dos personas piden consumiciones personalizadas con el mismo nombre y distinto precio, una de las dos quedaría silenciada o sobreescrita con un precio erróneo.
- **Obtener los productos desde el catálogo por defecto (`DEFAULT_CATALOG_PRESETS`)**: Rechazado porque excluiría consumiciones personalizadas ("Otro...") y violaría el requisito de listar solo los productos que realmente tengan al menos una persona.

---

## 2. Criterio de Ordenación de la Lista de Precios

### Decision
Ordenar los productos resultantes alfabéticamente por nombre utilizando `name.localeCompare(other.name, 'es', { sensitivity: 'base' })`. En caso de empate de nombre (diferente precio), desempatar por `unitPrice` ascendente (`a.unitPrice - b.unitPrice`).

### Rationale
- Los mensajes en aplicaciones de mensajería (WhatsApp, Telegram) se leen en dispositivos móviles con pantallas estrechas. El orden alfabético facilita la búsqueda visual inmediata del precio de un artículo específico ("¿cuánto costaba el Refresco?").
- `localeCompare` con la localización en español (`'es'`) respeta correctamente caracteres acentuados ("Café caliente"), la letra ñ y evita inconsistencias por mayúsculas/minúsculas.

### Alternatives considered
- **Ordenar por orden de aparición en la sesión**: Rechazado porque genera un orden aleatorio y difícil de predecir o contrastar para los usuarios.
- **Ordenar por precio (de mayor a menor)**: Rechazado porque al buscar un producto concreto por nombre resulta más lento y menos intuitivo que el orden alfabético.

---

## 3. Formato e Integración en la Estructura del Texto Compartido

### Decision
Integrar el resumen de precios en `generateSessionShareText` situándolo a continuación de la lista de participantes y precediendo al total global de la mesa, delimitado por líneas de guiones estándar:

```text
🎲 Cuenta de la partida (14/10/2026):
• Manu: 4,00 € (2x Refresco, 1x Snack)
• Carlos: 6,50 € (1x Pizza)
------------------------------------
Precios de productos:
• Pizza: 6,50 €
• Refresco: 1,50 €
• Snack: 1,00 €
------------------------------------
Total mesa: 10,50 €
```

Si ningún participante tiene consumiciones (0 productos en toda la mesa), la sección `Precios de productos:` se omite limpiamente:

```text
🎲 Cuenta de la partida (14/10/2026):
• Ana: 0,00 € (Sin consumiciones)
------------------------------------
Total mesa: 0,00 €
```

### Rationale
- La estructura actual de `generateSessionShareText` es clara y reconocida por los usuarios.
- Colocar los precios de referencia justo antes del `Total mesa:` permite a los integrantes del grupo revisar la lista de consumiciones individuales, consultar el precio unitario de cada producto consumido y finalmente validar el gran total de la mesa.
- Omitir la sección cuando la mesa no tiene consumiciones evita texto innecesario y líneas vacías en partidas recién iniciadas.

### Alternatives considered
- **Colocar la lista de precios al principio del mensaje**: Rechazado porque desplaza hacia abajo lo más relevante para cada jugador (saber cuánto debe pagar cada uno personalmente).
- **Incluir el precio unitario dentro de cada línea de participante**: (ej: `• Manu: 4,00 € (2x Refresco a 1,50 €, 1x Snack a 1,00 €)`). Rechazado porque saturaría y alargaría enormemente las líneas individuales de cada persona, provocando saltos de línea antiestéticos en pantallas de chat móvil. La tabla de referencia agrupada es mucho más limpia.

---

## 4. Impacto en Persistencia y UI

### Decision
No se modifican esquemas de persistencia en `localStorage` ni componentes visuales de la interfaz (`AppView`, `HeaderSummaryComponent`, `ParticipantCardComponent`). La lógica de exportar/compartir ya delega la generación textual a `generateSessionShareText`.

### Rationale
- Mantiene el principio de responsabilidad única (Single Responsibility Principle).
- Cero riesgo de regresión en el almacenamiento o en la experiencia de usuario dentro de la aplicación.
