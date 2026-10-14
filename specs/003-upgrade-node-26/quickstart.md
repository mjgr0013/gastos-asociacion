# Quickstart & Validation Guide: Actualización a Node.js 26

**Feature**: `003-upgrade-node-26`  
**Date**: 2026-10-14  
**Status**: Ready for Validation  

---

## 1. Verificación del Entorno Node.js

```bash
# 1. Comprobar la versión activa de Node en el sistema
node -v
# Salida esperada: v26.x.x (ej: v26.11.1)

# 2. Si se utiliza nvm
nvm use
# Salida esperada: Now using node v26.x.x (version read from .nvmrc)
```

---

## 2. Verificación de Scripts del Proyecto

```bash
# Ejecutar suite de pruebas unitarias e integración
npm test
# Salida esperada: 100% de tests pasando en Vitest bajo Node 26

# Ejecutar proceso de build estático
npm run build
# Salida esperada: Salida limpia en dist/ sin advertencias de runtime
```
