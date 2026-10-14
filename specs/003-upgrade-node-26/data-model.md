# Data Model: Manifiesto de Entorno Node.js 26

**Feature**: `003-upgrade-node-26`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Entidades de Configuración de Entorno

Esta característica define la metadata y especificación de entorno de desarrollo y compilación.

### 1.1 `PackageEnginesManifest` (`package.json`)
```json
{
  "engines": {
    "node": ">=26.0.0"
  }
}
```

### 1.2 `NvmrcManifest` (`.nvmrc`)
Contenido textual del archivo en la raíz del repositorio:
```text
26
```

---

## 2. Invariantes y Reglas de Validación

- La versión mínima de Node.js debe ser la rama mayor 26 (`>=26.0.0`).
- No afecta a las entidades de dominio de la aplicación (`Participant`, `ConsumptionItem`, `SessionState`).
