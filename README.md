# Coffee Shop Digital Stamping System

A starter implementation based on the supplied project plan. It uses Next.js, TypeScript, PostgreSQL, Prisma, separate login/stamp QR credentials, admin approval, and a browser-based QR scanner.

## Requirements
- Node.js 20.9+
- PostgreSQL database
- HTTPS for camera access in production

## Setup
1. Extract this ZIP and open the project folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and set:
   - `DATABASE_URL`
   - `SESSION_PASSWORD` (at least 32 characters; use a long random secret)
   - `APP_URL`
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD`
   - `REWARD_THRESHOLD` and `REWARD_NAME`
4. Create database tables and generate Prisma client:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```
5. Start the site:
   ```bash
   npm run dev
   ```
6. Visit `http://localhost:3000/admin/login`.

## Included
- Admin login with bcrypt password hashing and server-side session cookie
- Admin dashboard and customer list/create/deactivate/reactivate
- Customer login QR creation and QR credential regeneration
- Separate LOGIN and STAMP credentials; only token hashes are stored
- Mobile browser QR scanner and explicit stamp approval
- Stamp history and threshold-based reward record creation
- Customer direct QR login route and loyalty-card summary

## Important implementation notes
- This is a development starter, not a production-audited system.
- The customer card currently displays stamp/reward totals; the customer-facing rotating/displayable stamp QR workflow should be completed before launch. The database stores only token hashes by design, so a secure QR-display endpoint should issue short-lived stamp challenges or rotate the stamp credential after authentication.
- The customer QR regeneration endpoint returns a new QR payload, but the current admin UI does not yet render that response. Add a dedicated QR regeneration display before using it operationally.
- Add rate limiting to login and token endpoints, CSRF/origin protections for state-changing routes, structured audit logging, database backups, and automated tests before production.
- Reward policy defaults to one reward every `REWARD_THRESHOLD` stamps. The current starter does not reset stamp history after redemption; configure the final business rules before launch.
- Add a dedicated reward redemption screen and admin workflow before production.
- Use HTTPS in production. Camera access is generally blocked on non-secure origins except localhost.
- Admin account creation is done through the seed script. Do not expose public admin registration.
- The current admin interface is intentionally minimal and should be branded/styled for the shop.

## Project structure
- `src/app/admin`: admin pages
- `src/app/customer`: customer pages
- `src/app/api`: server endpoints
- `src/lib`: Prisma, session, token helpers
- `prisma/schema.prisma`: database schema
