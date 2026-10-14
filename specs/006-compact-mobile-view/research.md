# Technical Research: Vista Móvil Compacta y Densidad Visual de Consumiciones

**Feature**: `006-compact-mobile-view`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Diseño de Fila de Consumición en Línea Continua (~36px)

### Decisión
Reestructurar la fila de consumición (`.consumption-item-row`) para integrar el nombre del producto y el precio unitario en una sola línea horizontal (`.item-info`), compactando el selector de cantidad y el botón de borrado en un layout flexbox de 36px de altura.

### Justificación
- **Ahorro Vertical Inmediato**: Reduce la altura de cada fila de ~56px a ~36px (más del 35% de reducción por ítem). 10 productos pasan de ocupar 560px a solo 360px.
- **Truncado Inteligente**: Mediante `text-overflow: ellipsis` en `.item-name`, los nombres extensos se acortan elegantemente sin desplazar los controles de cantidad ni el subtotal de la línea.

---

## 2. Catálogo Rápido en Fila Única con Desplazamiento Horizontal

### Decisión
Aplicar a `.quick-catalog-chips` en pantallas móviles `display: flex; flex-wrap: nowrap; overflow-x: auto;` con chips compactados a 32px de altura y barra de desplazamiento oculta.

### Justificación
- **Eliminación del Apilamiento Vertical**: Anteriormente, 5 botones de catálogo ocupaban hasta 3 líneas verticales completas (~110px). Con la fila horizontal desplazable, ocupan exactamente 34px fijos.
- **Fluidez Táctil en Teléfono**: El usuario puede deslizar con el pulgar hacia la derecha para seleccionar "Otro..." o presets adicionales sin empujar el resto de la interfaz.

---

## 3. Contención de Altura Máxima con Scroll Interno

### Decisión
Establecer `max-height: 280px; overflow-y: auto;` en `.consumption-list`.

### Justificación
- **Garantía Anti-Monopolio de Pantalla**: Si un participante tiene 10 o 15 consumiciones, su tarjeta no se estira hasta el infinito; la lista interna se desplaza suavemente, permitiendo que las tarjetas de los demás jugadores de la mesa sigan visibles y accesibles.

---

## 4. Ajuste de Padding Global en Vista Móvil

### Decisión
Compactar el padding del contenedor principal `.main-content` a `var(--space-3)` (12px) y la cabecera fija a `var(--space-2) var(--space-3)` en pantallas estrechas.

### Justificación
- Maximiza el área visible para el contenido lúdico útil en teléfonos de 360px a 414px de ancho.
