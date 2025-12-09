# Kortowo Ninja

Kortowo Ninja is a web-based resource exchange platform engineered for the University of Warmia and Mazury (UWM) dormitory community. It facilitates the immediate, informal exchange of goods and services through a time-limited listing system, integrating directly with social media communication channels while maintaining user privacy and security.

## Documentation Modules

This repository utilizes a monorepo structure. Detailed documentation for the application layers can be found in their respective directories:

*   **[Client Documentation](./client/README.md)** - Frontend architecture, UI components, state management (Zustand/React Query), and build processes.
*   **[Server Documentation](./server/README.md)** - Backend API specification, authentication flows, database schema (Sequelize), and service logic.

## System Architecture

The application is architected as a fully containerized full-stack solution orchestrated via Docker Compose.

*   **Frontend**: A Single Page Application (SPA) built with React 19 and Vite. In production environments, static assets are served via high-performance Nginx containers.
*   **Backend**: A RESTful API developed with Node.js 20 and Express. It manages business logic, stateless authentication, and database interactions.
*   **Database**: MySQL 8.0 providing persistent storage for user identities, roles, and exchange offers.
*   **Edge Router**: Traefik v3.1 acts as the reverse proxy and load balancer, handling automatic TLS termination (Let's Encrypt), HTTP-to-HTTPS redirection, and security header injection.

## Technical Stack

| Component | Technology | Description |
|-----------|------------|-------------|
| **Client** | React 19, Vite | UI Framework and Build Tool |
| **State** | Zustand, React Query | Client and Server State Management |
| **Server** | Node.js 20, Express | API Runtime and Framework |
| **Persistence** | MySQL 8.0, Sequelize | Relational Database and ORM |
| **Auth** | JWT, Bcrypt | Stateless Authentication and Hashing |
| **Infrastructure** | Docker, Traefik | Container Orchestration and Routing |

## Monitoring Stack

The application includes a comprehensive observability stack deployed alongside the core services.

| Tool | Port | Purpose |
|------|------|---------|
| **Prometheus** | `9090` | Time-series database for metrics collection. Scrapes metrics from Node Exporter and self. |
| **Grafana** | `3030` | Visualization and dashboarding. Pre-configured with Prometheus and Loki as data sources. |
| **Node Exporter** | `9100` | Exports hardware and OS-level metrics (CPU, memory, disk, network). |
| **Loki** | `3100` | Log aggregation system designed to work with Grafana. Stores logs indexed by labels. |
| **Promtail** | `9080` | Log shipper that tails log files and pushes them to Loki. Configured to parse backend logs. |
| **Portainer** | `9000` | Web-based Docker management UI for container, volume, and network administration. |

### Log Flow

```
Backend → File Logs → Promtail → Loki → Grafana
```

Promtail is configured to tail `/var/log/kortowo/backend/application-*.log`, parsing `logfmt` fields (level, event, service, statusCode, method) and exposing them as labels for filtering in Grafana.

### Metrics Flow

```
Node Exporter → Prometheus → Grafana
```

Prometheus scrapes metrics every 15 seconds from `node-exporter:9100` for system metrics and `prometheus:9090` for self-monitoring.

## Core Features

*   **Stateless Authentication**: Implements JWT-based authentication using secure, HTTP-only cookies to mitigate XSS vulnerabilities.
*   **Role-Based Access Control (RBAC)**: Hierarchical permission system distinguishing between Users, Moderators, and Administrators.
*   **Automated Lifecycle Management**: Offers feature configurable Time-To-Live (TTL) settings (1-48 hours) with automated background archiving processes.
*   **Privacy-First Design**: Sensitive contact information is obfuscated behind a mandatory terms-of-service acceptance flow.
*   **Dormitory-Specific Logic**: Hardcoded validation logic tailored to specific UWM locations (DS1-DS9, DS119, Górka).

## Getting Started

The project supports two distinct deployment modes: **Development** (hot-reloading, local network) and **Production** (SSL, optimization, security).

### Prerequisites

*   Docker Engine
*   Docker Compose

### Configuration

1.  Clone the repository:
    ```bash
    git clone https://github.com/mikitavydrankou/Kortowo-Ninja.git
    cd Kortowo-Ninja
    ```

2.  Initialize environment variables:
    ```bash
    cp .env.example .env
    ```

3.  Edit `.env` to configure database credentials, JWT secrets, and domain settings.

### Development Environment

Starts the application with hot-reloading enabled for the frontend and direct HTTP access.

```bash
docker compose -f compose.dev.yml up -d --build
```

*   **Frontend**: `http://localhost:5173`
*   **API**: `http://localhost:3000`

### Production Environment

Deploys the optimized build with Traefik handling SSL certificates and routing. Requires a valid domain name pointed to the server IP.

```bash
docker-compose up -d --build
```

*   **Application**: `https://<configured-domain>`

## License

This project is proprietary software developed for the UWM Kortowo community.