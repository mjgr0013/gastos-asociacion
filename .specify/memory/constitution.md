# Constitución del Proyecto: Stack Symfony + Docker

## 1. Principios Técnicos y Stack
- **Lenguaje:** PHP 8.3+ con tipado estricto (`declare(strict_types=1);` obligatorio en todos los archivos).
- **Framework:** Symfony 7.x (estructura estándar, sin bundles obsoletos).
- **Entorno de ejecución:** Docker y Docker Compose exclusivamente.
  - Servidor web/PHP: Contenedor con FrankenPHP (o PHP-FPM + Caddy/Nginx).
  - Base de datos: PostgreSQL 16 (o MySQL 8) en su propio contenedor.
  - No se ejecuta Composer ni PHP en la máquina local del desarrollador; todo corre dentro de contenedores (`docker compose exec ...`).

## 2. Calidad de Código y Estándares
- Cumplimiento de **PSR-12** y estándares de Symfony.
- Arquitectura limpia: Servicios desacoplados, controladores delgados (*thin controllers*), inyección de dependencias estricta.
- Manejo de migraciones con Doctrine Migrations.

## 3. Pruebas y Verificación
- Tests unitarios y de integración con **PHPUnit**.
- Cada endpoint o servicio de dominio debe contar con un test que valide los casos de éxito y de error.

## 4. Flujo de Trabajo
- Todo cambio en el sistema debe derivar de una especificación en `specs/`.
- La IA nunca generará código sin que exista previamente un `plan.md` y un `tasks.md` aprobados.
