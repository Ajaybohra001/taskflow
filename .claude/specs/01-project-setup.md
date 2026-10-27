# Feature 1: Project setup

## Goal

Backend and frontend run locally and the backend connects to a SQLite database.

## Requirements

- Backend starts on port 3000 and has `GET /health` returning `{ "status": "ok" }`.
- Backend connects to SQLite (file `taskflow.db`) via TypeORM, configured from environment variables.
- Frontend starts with Vite, calls `/health` and shows the result on the home page.
- CORS enabled for the frontend origin

## Acceptance criteria

- `npm run start:dev` in backend works with no errors.
- `npm run dev` in frontend shows "API status: ok".
- `npm test` in backend passes, including a test for `/health`.
- No secrets committed; `.env.example` exists.
