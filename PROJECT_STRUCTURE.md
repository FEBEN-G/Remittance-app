# White-Label Remittance App - Frontend Structure

This document describes the organization and architectural patterns of the frontend application.

## Directory Structure

### `/app` (Next.js App Router)

The core of the application's routing and page structure.

- **`(app)`**: Protected routes for the main application experience.
  - `/home`: Dashboard overview.
  - `/send`: Multi-step money transfer flow.
  - `/transactions`: History and transaction details.
  - `/kyc`: Identity verification flow (Fiyida & Manual).
  - `/profile`, `/wallet`, `/receivers`: Account and asset management.
- **`(auth)`**: Authentication routes (Login, Register, OTP, PIN setup).
- **`layout.tsx`**: Root layout with global providers (Theming, Auth, Localization).
- **`globals.css`**: Global styles, including Tailwind configuration and Dark Mode variables.

### `/components`

Reusable UI units.

- **`/ui`**: Base primitive components (Buttons, Inputs, Cards) powered by Shadcn/UI and Radix.
- **Functional Components**: Higher-level components like `navbar.tsx`, `bottom-nav.tsx`, and `kyc-resume-card.tsx`.

### `/hooks`

Custom React hooks for global functionality.

- `use-locale.ts`: Localization management.

### `/lib`

Core utilities and logic.

- **`/mock`**: Centralized mock data for development and demonstration.
- `store.ts`: Global state management (Zustand) for Auth and App-wide settings.
- `api.ts`: API client configuration and shared fetch logic.
- `utils.ts`: Tailwind CSS class merging and generic utilities.

### `/locales`

JSON files for internationalization (i18n) support (e.g., English, Amharic).

### `/types`

TypeScript definitions and interfaces for the entire project.

## Key Architectural Patterns

1.  **Semantic Theming**: Uses CSS variables (`oklch`) to manage Light/Dark modes, ensuring accessibility and consistent aesthetics.
2.  **Ant Design Integration**: Combines Next-Themes with Ant Design's `ConfigProvider` for a unified UI experience.
3.  **State Management**: Uses Zustand for a lightweight, performant global store.
4.  **Feature-Based Routing**: Folders in `(app)` are organized by feature area to keep complex logic localized.
