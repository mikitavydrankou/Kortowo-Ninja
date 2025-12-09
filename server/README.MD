# Kortowo Ninja - Backend Server

The backend API for the Kortowo Ninja platform, built with Node.js and Express. It provides a robust architecture for managing student exchange offers, user authentication, and role-based access control.

## Overview

The server follows a layered Model-View-Controller (MVC) architecture, separating concerns into routing, controllers, middleware, and data access layers. It utilizes Sequelize as an ORM to interact with a MySQL database.

## Technology Stack

*   **Runtime**: Node.js (v20.x required)
*   **Framework**: Express.js
*   **Database**: MySQL
*   **ORM**: Sequelize
*   **Authentication**: JSON Web Tokens (JWT) using `jsonwebtoken`
*   **Security**: `bcrypt` for password hashing, `helmet` (implied by best practices), and custom middleware
*   **Scheduling**: `node-schedule` for background tasks
*   **Logging**: `winston` for structured logging

## Prerequisites

*   Node.js version 23.x
*   MySQL Database instance
*   npm (Node Package Manager)

## Architecture

The application is structured to ensure separation of concerns:

*   **server.js**: Entry point. Initializes Express, middleware, database connection, and routes.
*   **app/controllers**: Contains business logic. Handles requests, orchestrates data operations, and returns responses.
*   **app/models**: Sequelize schemas for User, Role, Offer, and QRCounter.
*   **app/routes**: API endpoint definitions mapping URLs to controllers.
*   **app/middleware**: Interceptors for authentication (JWT verification), error handling, and request context logging.

## Core Features

### Authentication and Security

The system uses a stateless authentication mechanism:

*   **JWT & Cookies**: Upon login, a JSON Web Token is generated and stored in a secure, HTTP-only cookie. This prevents client-side JavaScript from accessing the token, mitigating XSS risks.
*   **Password Hashing**: Passwords are hashed using `bcrypt` with 8 salt rounds before storage.
*   **Validation**: Strict password complexity is enforced (8+ chars, uppercase, lowercase, digit, special character).

### Role-Based Access Control (RBAC)

Authorization is managed via a hierarchical role system:

1.  **User**: Standard access (manage own profile/offers).
2.  **Moderator**: Can manage all users and offers.
3.  **Admin**: Full system access, including deleting users and changing roles.

Middleware functions `verifyToken` and `checkRole` protect sensitive endpoints.

### Offer Management Lifecycle

Offers have a sophisticated lifecycle management system:

1.  **Creation**: Users define a Time-To-Live (TTL) between 1 and 48 hours.
2.  **Soft Expiration**: A Sequelize `beforeFind` hook automatically filters out expired offers from general queries, making them disappear immediately after expiration.
3.  **Hard Archival**: A background cron job runs every 5 minutes to update the status of expired offers from "active" to "archived" in the database.

## API Endpoints Overview

### Authentication
*   `POST /api/auth/signup` - Register a new user.
*   `POST /api/auth/signin` - Authenticate and set session cookie.
*   `POST /api/auth/signout` - Clear session cookie.

### Users
*   `GET /api/users` - List all users (Admin/Moderator only).
*   `GET /api/users/:id` - Get specific user details.
*   `PUT /api/users/:id` - Update profile.
*   `DELETE /api/users/:id` - Delete user (Admin only).
*   `GET /api/leaderboard` - Public endpoint for top active users.

### Offers
*   `POST /api/offers` - Create a new exchange offer.
*   `GET /api/offers` - List active offers.
*   `GET /api/users/:userId/offers/active` - List active offers for a specific user.
*   `GET /api/users/:userId/offers/archived` - List history of offers for a specific user.

## Error Handling

The server implements a centralized error handling mechanism. Custom error classes (`ValidationError`, `NotFoundError`, `ForbiddenError`) are thrown in controllers and caught by global middleware, ensuring consistent JSON error responses and proper logging without leaking stack traces in production.

## Logging

Structured logging is implemented using Winston. Every request is tagged with a unique `requestId` via middleware, allowing for complete traceability of actions across the system. Logs include metadata such as timestamp, IP address, HTTP method, and user ID (if authenticated).


