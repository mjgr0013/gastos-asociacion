# Feature Specification: Soporte de Progressive Web App (PWA) e Instalación Offline

**Feature Branch**: `005-pwa-offline-support`

**Created**: 2026-10-14

**Status**: Draft

**Input**: User description: "quiero añadir soporte para PWA"

## Clarifications

### Session 2026-10-14
- Q: Al publicar una nueva versión de la aplicación, ¿cómo debe gestionarse la actualización para los usuarios que tengan la PWA abierta o instalada? (FR-007) → A: Actualización inmediata automática; el Service Worker activa skipWaiting() y refresca la aplicación de forma automática tan pronto como los nuevos activos están disponibles en caché, conservando intactos los datos de la sesión en localStorage.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Instalación en pantalla de inicio como aplicación autónoma (Priority: P1)

Como jugador o anfitrión habitual de sesiones de juegos de mesa, quiero poder instalar la aplicación en la pantalla de inicio de mi teléfono móvil (Android/iOS) o en mi ordenador como una aplicación independiente, para acceder a ella con un solo toque sin la barra de direcciones del navegador ocupando espacio visual valioso durante la partida.

**Why this priority**: Maximiza el área útil de la pantalla en dispositivos móviles y ofrece una experiencia de uso equivalente a una aplicación nativa, agilizando el acceso directo en cada velada de juego.

**Independent Test**: Puede probarse accediendo a la web desde un navegador móvil (Chrome, Safari, Edge), pulsando en "Instalar aplicación" o "Añadir a pantalla de inicio", y comprobando que se crea un icono en el escritorio/pantalla de inicio que al abrirse se ejecuta en modo standalone (sin barras de navegación).

**Acceptance Scenarios**:

1. **Given** un navegador compatible con PWA, **When** el usuario visita la aplicación, **Then** el navegador detecta el manifiesto de la aplicación y ofrece la posibilidad de instalarla.
2. **Given** la aplicación instalada en la pantalla de inicio, **When** el usuario la abre, **Then** se ejecuta en ventana independiente a pantalla completa (modo `standalone`), con el tema de color azul (#2563eb) en la barra de estado y su icono representativo.

---

### User Story 2 - Disponibilidad y funcionamiento 100% offline (Priority: P1)

Como usuario que participa en partidas en locales, sótanos o zonas rurales con baja o nula cobertura de datos móviles, quiero que la aplicación cargue y funcione perfectamente sin conexión a internet, para poder añadir jugadores, registrar consumiciones y consultar cuentas en cualquier circunstancia.

**Why this priority**: En sesiones de juego en locales o sótanos es muy frecuente la pérdida de señal; la falta de conexión no debe impedir el control de gastos.

**Independent Test**: Puede probarse abriendo la aplicación, activando el modo avión o desconectando la red en DevTools, recargando la página y verificando que la interfaz completa carga desde la caché local y permite todas las operaciones de alta, consumiciones y totales.

**Acceptance Scenarios**:

1. **Given** una visita previa a la aplicación, **When** el dispositivo pierde completamente la conexión a internet (modo avión) y el usuario recarga la página, **Then** la aplicación carga inmediatamente desde el Service Worker sin pantalla de error de red.
2. **Given** la aplicación en modo offline, **When** el usuario añade un nuevo participante, apunta consumiciones o borra líneas, **Then** todos los cálculos y la persistencia en `localStorage` funcionan de forma idéntica a cuando hay conexión.

---

### User Story 3 - Identidad visual de la app y compatibilidad iOS / Android (Priority: P2)

Como usuario de cualquier plataforma móvil (iOS o Android), quiero que la aplicación muestre iconos nítidos en todas las resoluciones, pantalla de inicio (splash screen) coherente y soporte explícito para Safari en iOS.

**Why this priority**: Garantiza una experiencia visual pulida, evitando iconos genéricos o capturas de pantalla borrosas en la pantalla de inicio del sistema.

**Independent Test**: Puede probarse inspeccionando los metatags de iOS (`apple-touch-icon`, `apple-mobile-web-app-capable`) y los iconos declarados en el `manifest.webmanifest` (192x192, 512x512 y SVG vectorial).

**Acceptance Scenarios**:

1. **Given** un dispositivo iPhone con iOS Safari, **When** el usuario selecciona "Añadir a pantalla de inicio", **Then** se utiliza el icono temático de alta resolución y se configura para abrirse sin barra de navegación.
2. **Given** un dispositivo Android, **When** se instala la PWA, **Then** el icono se adapta correctamente al formato de iconos del sistema (`purpose: any maskable`).

---

### Edge Cases

- **Actualización de la aplicación**: Cuando se publique una nueva versión en GitHub Pages, el Service Worker debe detectar la actualización en segundo plano e instalar los nuevos activos sin bloquear la partida en curso.
- **Primera visita sin conexión**: Si el usuario nunca ha abierto la aplicación y no tiene conexión, el navegador mostrará el error estándar de red (comportamiento habitual previo a la primera instalación).
- **Almacenamiento de caché del navegador**: La caché del Service Worker debe ceñirse a los activos estáticos del bundle (HTML, CSS, JS, iconos), ocupando menos de 2 MB y limpiando versiones antiguas de caché para no saturar el dispositivo.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema DEBE incluir un manifiesto de aplicación web (`manifest.webmanifest` o `manifest.json`) enlazado en `index.html`.
- **FR-002**: El manifiesto DEBE especificar `name` ("Gastos de Mesa - Boardgame Expenses"), `short_name` ("GastosMesa"), `start_url` ("./"), `display` ("standalone"), `background_color` ("#f8fafc") y `theme_color` ("#2563eb").
- **FR-003**: El sistema DEBE proporcionar iconos en resoluciones estándar (192x192 y 512x512 píxeles, además de SVG vectorial) con soporte para iconos adaptables (`any maskable`).
- **FR-004**: El sistema DEBE registrar un Service Worker que precargue y sirva desde caché local los activos esenciales de la aplicación (`index.html`, estilos CSS, scripts JavaScript e iconos).
- **FR-005**: La aplicación DEBE ser 100% operativa y navegable en ausencia total de conexión a internet (modo offline), apoyándose en la caché del Service Worker y en `localStorage`.
- **FR-006**: El archivo `index.html` DEBE incluir las etiquetas meta requeridas para compatibilidad completa con iOS Safari (`apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`).
- **FR-007**: El ciclo de vida del Service Worker DEBE activar de inmediato las nuevas versiones mediante `skipWaiting()` y refrescar la aplicación de forma automática, purgando cachés obsoletas y conservando intactos los datos de sesión en `localStorage`.

### Key Entities *(include if feature involves data)*

- **Web App Manifest**:
  - Atributos: `name`, `short_name`, `icons`, `start_url`, `display`, `background_color`, `theme_color`.
- **Service Worker Cache Store**:
  - Clave de caché versionada (ej: `bg_expenses_cache_v1`).
  - Lista de URLs de activos precargados (shell HTML, assets bundle, manifest e iconos).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: La aplicación cumple el 100% de los requisitos de instalabilidad de Progressive Web App evaluados por auditorías estándar de navegador (Lighthouse PWA = Passed).
- **SC-002**: Con conectividad de red desactivada (modo offline), la aplicación carga y se vuelve completamente interactiva en menos de 1 segundo tras la primera visita.
- **SC-003**: El tamaño total de la caché offline precargada por el Service Worker no supera los 2 MB, optimizando el consumo de almacenamiento en dispositivos móviles.
- **SC-004**: Cero fallos o pérdidas de datos en las operaciones de gestión de participantes, consumiciones y persistencia local durante el funcionamiento offline.

## Assumptions

- **Alojamiento estático**: El Service Worker y el manifiesto son compatibles con la estructura de rutas relativas de GitHub Pages (`base: './'`).
- **Conectividad para primera carga**: Se requiere conexión a internet únicamente durante la primera visita para descargar el bundle y registrar el Service Worker; a partir de ese momento, el acceso offline es permanente.
