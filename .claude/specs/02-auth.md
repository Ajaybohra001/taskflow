# Feature 2: Auth

## Goal

Users can register and log in. Protected endpoints require a valid JWT.

## Requirements

- `POST /auth/register` with `{ email, password, name }`
  - Returns 201 with `{ id, email, name }`. Never return the password or hash.
  - Email is unique and case-insensitive. A duplicate returns 409.
  - Password must be at least 8 characters. Hash it with bcrypt (cost 10).
- `POST /auth/login` with `{ email, password }`
  - Returns 200 with `{ accessToken }`.
  - Wrong password and unknown email return the same 401 message.
- `GET /auth/me` with header `Authorization: Bearer <token>`
  - Returns 200 with `{ id, email, name }`.
  - Missing or invalid token returns 401.
- JWT secret and expiry come from env: `JWT_SECRET`, `JWT_EXPIRES_IN` (default `1h`). No hardcoded secrets.
- TypeORM entity `User`: `id`, `email` (unique), `passwordHash`, `name`, `createdAt`.
- All request bodies validated with DTOs and class-validator. Invalid input returns 400.

## Out of scope

- Frontend login and register screens (later feature)
- Refresh tokens, password reset, roles

## Acceptance criteria

- Register, login and `/auth/me` work with the curl examples in this spec.
- The database stores only password hashes, never plaintext.
- `npm test` passes, including:
  - unit tests for the auth service (register, login, wrong password)
  - a test that the guard rejects missing and invalid tokens
  - e2e tests for the three endpoints
- `.env.example` lists `JWT_SECRET` and `JWT_EXPIRES_IN`. No real secret is committed.

## Curl checks

    curl -X POST localhost:3000/auth/register -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"secret123","name":"Ana"}'
    curl -X POST localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"secret123"}'
    curl localhost:3000/auth/me -H "Authorization: Bearer <token>"
