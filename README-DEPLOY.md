# Pensión 360 — Base interna de clientes

Esta versión une la interfaz CRM con el backend Express + Postgres entregado por Claude. La aplicación ya consume el login real (`POST /api/login`) y el CRUD de clientes (`GET/POST/PUT /api/clients`). El token se guarda únicamente en `sessionStorage` del navegador y se envía como `Authorization: Bearer ...`.

## Estado actual

La integración de código está lista y validada con TypeScript/build. Falta configurar los valores reales de entorno antes de publicar una versión operativa: `DATABASE_URL`, `TEAM_USER` y `TEAM_PASS`. Sin esos valores, el login rechazará el acceso y la base no podrá inicializarse.

## Configuración local

Crea un archivo `.env` a partir de las variables que aparecen abajo. No subas el `.env` real a GitHub ni lo incluyas en ZIPs.

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/base
TEAM_USER=equipo
TEAM_PASS=contraseña-larga-y-unica
```

Después instala dependencias y ejecuta:

```bash
pnpm install
pnpm check
pnpm build
pnpm start
```

La tabla `clients` se crea automáticamente al realizar la primera consulta. El backend guarda NSS y CURP en texto plano dentro de Postgres; antes de usar datos reales conviene confirmar con el despacho si necesitan cifrado a nivel de aplicación y una política de respaldos.

## Render

Crea una base Postgres y un servicio web Node. En el servicio web agrega las mismas tres variables de entorno. Usa `pnpm install` como instalación, `pnpm build` como build y `pnpm start` como start. Si la base y el servicio viven dentro de Render, usa la Internal Database URL; para pruebas locales usa la External Database URL.

Antes de usar el sistema con datos reales, prueba login, alta, edición, recarga de página, cierre de sesión y recuperación después de reiniciar el servicio. No hay botón de eliminar ni logins individuales en este alcance.
