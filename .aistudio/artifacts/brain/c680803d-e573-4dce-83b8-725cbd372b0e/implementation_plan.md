# Implementation Plan: Lục Lạc Thư (Anonymous Letters)

This project builds a secure, anonymous platform where users can send public or private letters, manage their letters via unique access codes, and a central administrator can view and respond to them.

## User Review & Critical Decisions

- **Confirmed Decision 1**: **Database Backend**: CloudSQL (PostgreSQL) will be used to manage complex relationships between users, letters, and administrative actions securely.
- **Confirmed Decision 2**: **Development Phases**: Phase 1 will focus on the core letter writing, public display, and anonymous management code logic. Phase 2 will deliver the Admin Dashboard and Theme Engine.
- **Confirmed Decision 3**: **Priority**: The Anonymous Management Code UX (securely managing letters without accounts) is the primary focus after core functionality.
- **Open Question**: We have opted to defer the Admin Dashboard and Theme Engine to Phase 2. The initial release will focus on letter creation, viewing, and secure management.

---

## 1. Overview & Core Concept

- **What It Does**: A platform to send anonymous letters ("Lục Lạc Thư"). Users can send them publicly or privately, and manage them securely using randomly generated access codes.
- **Target Audience**: People looking for a quiet, secret place to express thoughts or send messages without needing a persistent account.
- **Key Value**: Simple, anonymous, secure, and aesthetically pleasing letter management.

---

## 2. User Experience & Visual Design

- **Aesthetic Direction**: Soft, editorial, minimalist.
- **Color Palette**: Light/Dark mode with a base of cream/pastel-purple (Light) and deep violet/night-blue (Dark).
- **Core User Flow**:
  1.  **Landing**: Welcome message, link to 'Write a Letter'.
  2.  **Writing**: Form to write, set options (Public/Private), customize style, then 'Send'.
  3.  **Confirmation**: Display the generated Access Code for the sender.
  4.  **Management**: Using the access code, users can edit/delete their specific letters.
  5.  **Public Wall**: Viewing letters sent 'Publicly'.

---

## 3. Technical Architecture & Data Strategy

```text
┌──────────────────────────────────────┐
│           Client (React)             │
│   (Letter Writing/View/Manage UI)    │
└──────────────────┬───────────────────┘
                   │ HTTPS API
┌──────────────────▼───────────────────┐
│           Express Server             │
│ (Auth Middleware, Route Handlers)    │
└──────────────────┬───────────────────┘
                   │ SQL (Drizzle)
┌──────────────────▼───────────────────┐
│        CloudSQL (PostgreSQL)         │
│   (Tables: Letters, Admins)          │
└──────────────────────────────────────┘
```

- **Data Model**:
    - **Letters**: `id`, `content`, `author_name`, `access_code` (hash for security), `is_public`, `style_options`, `created_at`.
    - **Admin**: Credentials (stored securely in secrets, not hardcoded).

---

## 4. Execution Plan (Phase 1)

1.  **Setup**: Initialize CloudSQL and Drizzle configuration.
2.  **Database**: Define schema (Letters table).
3.  **Backend**: API endpoints for `POST /api/letters` (create), `GET /api/letters/:id` (view public), `POST /api/letters/:id/manage` (edit/delete via access code).
4.  **Frontend**:
    - Build Letter Creation Form.
    - Build Public Letter List.
    - Build Management Form (verify access code).
    - Implement theme toggle logic.
5.  **Verification**: Test letter flow and secure management.
