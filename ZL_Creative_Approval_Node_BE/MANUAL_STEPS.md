# Manual steps after Auth/RBAC implementation

Run these commands yourself — they are not executed by the coding agent.

## 1. Install dependencies

```bash
cd ZL_Creative_Approval_BE/ZL_Creative_Approval_Node_BE
npm install
npm run audit:check
```

## 2. Generate JWT keys (RS256)

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
# Base64-encode each PEM and set JWT_PRIVATE_KEY / JWT_PUBLIC_KEY in .env
```

## 3. Generate and run migration

```bash
npm run migration:generate -- src/database/migrations/AuthRbacInitial
npm run migration:run
```

## 4. Build and start

```bash
npm run build
npm run dev
```

## 5. Bootstrap first superadmin

1. `POST /saas/api/v1/auth/register` with `{ "email", "password", "name" }`
2. In Postgres: `UPDATE users SET is_superadmin = true WHERE email = 'your@email.com';`

## 6. Optional — EXPLAIN ANALYZE

Copy SQL from repository method comments and run against Postgres to confirm index usage.
