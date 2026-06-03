<div align="center">

<img src="client/public/logo.png" alt="Kortowo Ninja" width="440" />

### Time-limited resource exchange for the UWM dorm community

Post what you offer or need → it lives for a few hours, then archives itself.
Swap goods and services fast, keep your contacts private, stay in your dorm — all self-hosted.

[![Tests](https://github.com/mikitavydrankou/Kortowo-Ninja/actions/workflows/server-tests.yml/badge.svg)](https://github.com/mikitavydrankou/Kortowo-Ninja/actions/workflows/server-tests.yml)
[![Build CI image](https://github.com/mikitavydrankou/Kortowo-Ninja/actions/workflows/ci-image.yml/badge.svg)](https://github.com/mikitavydrankou/Kortowo-Ninja/actions/workflows/ci-image.yml)
![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Node 20](https://img.shields.io/badge/Node-20-339933?logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ed?logo=docker&logoColor=white)

</div>

---

## Features

- **Time-limited listings** — offers expire after a configurable TTL (1–48h), then auto-archive in the background.
- **Privacy-first contacts** — contact info stays hidden behind a terms-of-service gate.
- **Role-based access** — Users, Moderators, Administrators with a clear permission hierarchy.
- **Dorm-aware** — validation tuned to real UWM locations (DS1–DS9, DS119, Górka).
- **Stateless auth** — JWT in HTTP-only cookies; no session store to babysit.

**Stack:** React 19 · Vite · Node 20 · Express · MySQL 8 · Sequelize · Traefik — shipped as Docker Compose.

---

## Quick start

Needs Docker + Docker Compose.

```bash
git clone https://github.com/mikitavydrankou/Kortowo-Ninja.git
cd Kortowo-Ninja
cp .env.example .env       # set DB creds, JWT secret, domain
docker compose up -d --build
```

Open **https://<your-domain>** — Traefik handles SSL and routing.

> [!TIP]
> Want hot reload? Use the dev stack below — no SSL, plain HTTP, frontend on `5173`.

## Development

```bash
cp .env.dev.example .env
docker compose -f compose.dev.yml up -d --build
```

UI `:5173` · API `:3000` · architecture in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Configuration

Everything lives in `.env`. The essentials:

| Variable      | Default        | Purpose                              |
| ------------- | -------------- | ------------------------------------ |
| `DB_PASSWORD` | `change_me`    | MySQL password (set before deploy)   |
| `JWT_SECRET`  | —              | Signs auth cookies (set before deploy) |
| `CLIENT_URL`  | —              | Public app URL, used for CORS/cookies |
| `ACME_EMAIL`  | —              | Email for Let's Encrypt certificates |
| `LOG_LEVEL`   | `info`         | Backend log verbosity                |

Full deployment, monitoring and architecture details → [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

<div align="center"><sub>Built for dorm life — quick swaps, no clutter, no oversharing.</sub></div>
