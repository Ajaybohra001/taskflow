# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a monorepo with two independent packages (no workspace manager):

- **`backend/`** — NestJS 11 API (Express, TypeScript, Jest)
- **`frontend/`** — React 19 SPA (Vite 8, TypeScript 6)
- **Root** — only has Prettier as a dev dependency

## Commands

All commands run from within their respective package directory, not the repo root.

### Backend (`cd backend`)

| Task               | Command                                |
| ------------------ | -------------------------------------- |
| Dev server (watch) | `npm run start:dev`                    |
| Production build   | `npm run build`                        |
| Start production   | `npm run start:prod`                   |
| Unit tests         | `npm test`                             |
| Single test file   | `npx jest --testPathPattern=<pattern>` |
| Tests (watch)      | `npm run test:watch`                   |
| Tests (coverage)   | `npm run test:cov`                     |
| E2E tests          | `npm run test:e2e`                     |
| Lint (auto-fix)    | `npm run lint`                         |
| Format             | `npm run format`                       |

### Frontend (`cd frontend`)

| Task                     | Command           |
| ------------------------ | ----------------- |
| Dev server               | `npm run dev`     |
| Production build         | `npm run build`   |
| Preview production build | `npm run preview` |
| Lint                     | `npm run lint`    |

## Architecture

### Backend

Standard NestJS module structure. Each feature should be its own module under `backend/src/`.

- **Entry:** `src/main.ts` — boots NestJS on `process.env.PORT` or 3000
- **Root module:** `src/app.module.ts`
- **Unit tests** live alongside source files as `*.spec.ts` (Jest rootDir is `src/`)
- **E2E tests** live in `backend/test/` and use `test/jest-e2e.json` config with supertest
- **Build output:** `backend/dist/` (deleted on rebuild via `nest-cli.json` `deleteOutDir`)

### Frontend

Vite + React SPA with no routing library yet.

- **Entry:** `src/main.tsx` renders into `#root`
- **Build output:** `frontend/dist/`

## Code Style

- **Prettier** config in `backend/.prettierrc`: single quotes, trailing commas
- **Backend ESLint** (`backend/eslint.config.mjs`): typescript-eslint with type-checked rules, prettier plugin integration. `no-explicit-any` is off; `no-floating-promises` and `no-unsafe-argument` are warnings. Line endings set to `auto`.
- **Frontend ESLint** (`frontend/eslint.config.js`): typescript-eslint recommended, react-hooks, react-refresh plugins
- Backend TypeScript has `noImplicitAny: false` and `strictNullChecks: true`
- Frontend TypeScript has `noUnusedLocals` and `noUnusedParameters` enabled
