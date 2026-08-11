# NGS Lands Surveys App

A production-ready React Native + Expo + TypeScript foundation for the NGS Lands Surveys mobile application.

## Getting started

```bash
pnpm install
pnpm start
```

Then open the project in Expo Go, an iOS simulator, an Android emulator, or the web preview.

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm format:check
```

## Architecture

- `app/` — Expo Router route files and navigation layouts
- `src/components/` — reusable UI primitives and cross-screen components
- `src/config/` — runtime configuration and environment variable access
- `src/hooks/` — reusable hooks
- `src/services/` — API client and service boundaries
- `src/state/` — app-wide state provider boundaries
- `src/theme/` — centralized design tokens
- `src/types/` — shared domain-independent types
- `src/utils/` — small, pure utilities
- `assets/` — local app assets

This foundation intentionally contains no product screens, business logic, backend, authentication, payments, or external API implementation.
