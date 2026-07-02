<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Deployment notes

## Database

This project uses **PostgreSQL** in production via Prisma.

- Provider in `prisma/schema.prisma`: `postgresql`
- Connection string: `DATABASE_URL` environment variable
- Initial migration SQL: `prisma/migrations/20260702160000_init/migration.sql`

### Setting up production database

1. Create a PostgreSQL database. Free options that work well with Vercel:
   - [Neon](https://neon.tech)
   - [Supabase](https://supabase.com)
   - [Vercel Postgres](https://vercel.com/storage/postgres)
   - [Railway](https://railway.app)

2. Set `DATABASE_URL` to your connection string.

3. Apply the initial migration:
   ```bash
   npx prisma migrate deploy
   ```

4. (Optional) Run sync manually to populate matches:
   ```bash
   curl -X POST https://your-domain.com/api/sync
   ```

### Local development

For local development you can either:
- Run PostgreSQL locally (Docker, Homebrew, etc.)
- Use the same cloud database as production (not recommended for active development)

SQLite is no longer supported because the app needs a persistent database that survives production deploys.

## Admin access

The admin panel is at `/admin`. The password is set via the `ADMIN_PASSWORD` environment variable. The default in `.env` is `admin123`; change it before deploying.
