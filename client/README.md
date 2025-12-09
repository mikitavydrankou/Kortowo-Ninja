# Kortowo Ninja - Frontend Client

The frontend client for **Kortowo Ninja**, a student exchange offer platform. This Single Page Application (SPA) enables users to browse, create, and manage exchange offers within the Kortowo campus community. It is built with **React 19** and **Vite**, utilizing **Material-UI** for design and a split state management architecture.

## Features

*   **User Authentication**: Secure signup and login flows using HTTP-only cookies (JWT).
*   **Role-Based Access Control**: specialized UI elements for Admins and Moderators.
*   **Offer Management**:
    *   Create offers with strict character limits and TTL (Time-To-Live) configuration.
    *   Responsive grid layout for browsing offers.
    *   Real-time countdown timers for offer expiration.
*   **Privacy & Safety**:
    *   **Terms-Gated Contact**: Contact information (Facebook links) is hidden until the user explicitly accepts platform terms.
    *   Data masking for unauthenticated users.
*   **Platform Statistics**: Live counters for active users and offers.
*   **Responsive Design**: Fully adaptive UI for mobile, tablet, and desktop using Material-UI.

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.0.0 | UI Component Framework |
| **Vite** | 6.3.6 | Build Tool & Dev Server |
| **Material-UI (MUI)** | 7.0.2 | Component Library & Design System |
| **Zustand** | 5.0.3 | Client State (Auth, Session) |
| **React Query** | 5.74.3 | Server State (Caching, Data Fetching) |
| **React Router** | 7.5.0 | Client-side Routing |
| **Axios** | 1.12.0 | HTTP Client |

## Prerequisites

*   **Node.js**: Version **20.x** is required.
*   **npm**: Included with Node.js.
*   **Backend**: The Kortowo Ninja backend API must be running for data fetching to work.

## Project Architecture

The application follows a layered architecture separating presentation, state management, and API communication.

### State Management Strategy
The application uses two complementary state managers:

1.  **Client State (Zustand):**
    *   Manages **Authentication** (User object, loading states, error messages).
    *   Persists session state to `localStorage`.
    *   Provides actions: `signin`, `signup`, `logout`, `isAdminOrModerator`.

2.  **Server State (React Query):**
    *   Manages **Data Fetching** (Offers, Statistics).
    *   Handles caching, background refetching, and synchronization.
    *   Used in hooks like `useOfferById` or `useCreateOffer`.

## Authentication Flow

1.  **Credentials**: User submits username/password via `SigninForm`.
2.  **API Call**: Axios sends a POST request with `withCredentials: true`.
3.  **Token**: The backend sets an **HTTP-only cookie** containing the JWT.
4.  **State Update**: Zustand updates the global `user` state.
5.  **Persistence**: Authentication status persists across reloads via cookies and local storage state hydration.

## Key Design Patterns

*   **Conditional Rendering**: Navigation and buttons change based on `user` existence and `user.role` (Admin/Moderator).
*   **Defensive UI**: Error boundaries and Alert components display backend errors (e.g., "Login failed").
*   **Terms-First Interaction**: Users cannot access sensitive contact data (Facebook links) without actively clicking a "Accept Terms" dialog in the UI.