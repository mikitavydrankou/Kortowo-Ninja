# Architecture

Kortowo Ninja is a fully containerized full-stack application orchestrated with Docker Compose. This document covers the system design, technical stack, monitoring, and deployment details kept out of the README.

## Documentation modules

This repository uses a monorepo structure. Per-layer documentation:

- **[Client Documentation](../client/README.md)** — frontend architecture, UI components, state management (Zustand / React Query), build process.
- **[Server Documentation](../server/README.MD)** — backend API spec, authentication flows, database schema (Sequelize), service logic.

## System architecture

- **Frontend** — React 19 + Vite SPA. In production, static assets are served by Nginx.
- **Backend** — Node.js 20 + Express REST API. Handles business logic, stateless auth, and database access.
- **Database** — MySQL 8.0 for persistent storage of users, roles, and exchange offers.
- **Edge router** — Traefik v3.1 as reverse proxy / load balancer: automatic TLS termination (Let's Encrypt), HTTP→HTTPS redirection, and security header injection.

## Technical stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Client** | React 19, Vite | UI framework and build tool |
| **State** | Zustand, React Query | Client and server state management |
| **Server** | Node.js 20, Express | API runtime and framework |
| **Persistence** | MySQL 8.0, Sequelize | Relational database and ORM |
| **Auth** | JWT, Bcrypt | Stateless authentication and hashing |
| **Infrastructure** | Docker, Traefik | Container orchestration and routing |

## Core features

- **Stateless authentication** — JWT-based auth via secure, HTTP-only cookies to mitigate XSS.
- **Role-based access control (RBAC)** — hierarchical permissions across Users, Moderators, Administrators.
- **Automated lifecycle management** — offers carry a configurable TTL (1–48 hours) with automated background archiving.
- **Privacy-first design** — sensitive contact info is obfuscated behind a mandatory terms-of-service acceptance flow.
- **Dormitory-specific logic** — validation tailored to UWM locations (DS1–DS9, DS119, Górka).

## Monitoring stack

Observability services deploy alongside the core application.

| Tool | Port | Purpose |
|------|------|---------|
| **Prometheus** | `9090` | Time-series metrics store. Scrapes Node Exporter and itself. |
| **Grafana** | `3030` | Visualization and dashboards. Pre-configured with Prometheus and Loki data sources. |
| **Node Exporter** | `9100` | Exports hardware and OS-level metrics (CPU, memory, disk, network). |
| **Loki** | `3100` | Log aggregation, indexed by labels, built to pair with Grafana. |
| **Promtail** | `9080` | Log shipper that tails log files and pushes them to Loki. Parses backend logs. |
| **Portainer** | `9000` | Web-based Docker management UI for containers, volumes, and networks. |

### Log flow

```
Backend → File Logs → Promtail → Loki → Grafana
```

Promtail tails `/var/log/kortowo/backend/application-*.log`, parses `logfmt` fields (`level`, `event`, `service`, `statusCode`, `method`), and exposes them as labels for filtering in Grafana.

### Metrics flow

```
Node Exporter → Prometheus → Grafana
```

Prometheus scrapes metrics every 15 seconds from `node-exporter:9100` (system metrics) and `prometheus:9090` (self-monitoring).

## Deployment

Two deployment modes: **Development** (hot-reloading, local network) and **Production** (SSL, optimization, security).

### Prerequisites

- Docker Engine
- Docker Compose

### Configuration

1. Clone the repository:
   ```bash
   git clone https://github.com/mikitavydrankou/Kortowo-Ninja.git
   cd Kortowo-Ninja
   ```

2. Initialize environment variables:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` to configure database credentials, JWT secrets, and domain settings.

### Development environment

Hot-reloading frontend with direct HTTP access.

```bash
docker compose -f compose.dev.yml up -d --build
```

- **Frontend** — `http://localhost:5173`
- **API** — `http://localhost:3000`

### Production environment

Optimized build with Traefik handling SSL certificates and routing. Requires a valid domain pointed at the server IP.

```bash
docker compose up -d --build
```

- **Application** — `https://<configured-domain>`
