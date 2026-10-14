# Contract: Environment & Runtime Specification

**Feature**: `003-upgrade-node-26`  
**Date**: 2026-10-14  
**Status**: Completed  

---

## 1. Contrato de `package.json`

El archivo `package.json` debe contener el bloque:

```json
{
  "engines": {
    "node": ">=26.0.0"
  }
}
```

---

## 2. Contrato de `.nvmrc`

El archivo `.nvmrc` en la raíz del proyecto debe contener:

```text
26
```
