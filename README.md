# Sak — API

The backend for **Sak**, a tourism platform built around printed passports. A
visitor buys a printed passport, activates it by scanning the QR code inside,
and from then on the passport drives the whole journey: it selects a province,
and the province brings its places, challenges, stamps and partner discounts.

Every passport copy is an independent journey — progress never crosses between
them, and the server enforces that rather than trusting the client.

The web client lives in its own repository:
**[website_syria](https://github.com/Abdo-Houry/website_syria)**.

---

## Stack

Node.js · TypeScript · Express 5 · TypeORM · PostgreSQL · JWT · bcrypt · Zod ·
Multer + sharp · Nodemailer · QRCode · Helmet.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

The API listens on `http://localhost:5000` and expects PostgreSQL to be
reachable with the credentials in `.env`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with reload |
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled build |
| `npm run seed:admin` | Create the first administrator |

### Environment

Copy `.env.example` to `.env` and fill it in.

| Variable | Notes |
| --- | --- |
| `PORT` | Defaults to 5000 |
| `NODE_ENV` | `production` on a deployed server |
| `DB_HOST` · `DB_PORT` · `DB_USERNAME` · `DB_PASSWORD` · `DB_NAME` | PostgreSQL connection |
| `DB_SYNCHRONIZE` | See **Database schema** below |
| `JWT_SECRET` | Required. Use a long random value, different per environment |
| `JWT_EXPIRES_IN` | Token lifetime, `7d` by default |
| `APP_URL` · `FRONTEND_URL` | Public origins. `FRONTEND_URL` also seeds the CORS allowlist and the printed QR links |
| `CORS_ORIGINS` | Optional. Comma-separated, for when more than one origin needs access (`https://example.com,https://www.example.com`) |
| `MAIL_USER` · `MAIL_PASSWORD` · `MAIL_FROM` | Gmail account with an app password, used for verification codes |
| `OTP_TTL_MINUTES` | Verification code lifetime, 10 by default |
| `ADMIN_USERNAME` · `ADMIN_PASSWORD` | Read by `seed:admin` only |

### Creating the first administrator

```bash
npm run seed:admin
```

The password comes from `ADMIN_PASSWORD` and nothing else — the script refuses to
run if it is unset or shorter than eight characters, so no known credentials can
ship with the code. The password is stored hashed, and afterwards it is changed
from **My account** in the admin panel; the environment variable is never read
again.

### Database schema

`DB_SYNCHRONIZE` controls whether TypeORM reshapes the database to match the
entities on every boot.

It is convenient in development and dangerous in production: renaming a column
reads as one column dropped and another added, and the data in it is gone
without a prompt or a way back. So it defaults to **on** in development and
**off** in production.

On a brand-new production database the tables therefore do not exist yet. Either
restore a dump that already carries the schema, or set `DB_SYNCHRONIZE=true` for
the first deploy only and set it back to `false` immediately afterwards.

---

## How the pieces fit

```
src/
  config/         database, environment, multer
  entities/       TypeORM entities — the schema
  models/         request/response DTOs
  validations/    Zod schemas, one per domain
  routes/         route definitions and their middleware
  controllers/    parse, delegate, respond
  services/       business logic and database access
  middleware/     auth, rate limits, image optimisation, response sanitising, errors
  utils/          api response/error helpers, phone handling, admin seeding
  uploads/        uploaded media (served statically, not in git)
```

A request flows **route → middleware → controller → service → entity**.
Controllers stay thin: they validate with Zod and hand off to a service, which
owns the logic.

Every response is wrapped in the same envelope:

```jsonc
{ "success": true, "message": "…", "data": { } }
```

Errors funnel through one handler, which turns Zod failures into `400` with the
offending field named, known `ApiError`s into their own status, and anything else
into a `500` that reveals nothing.

---

## Authentication

Sign-in is unified: `POST /api/auth/login` takes one `identifier` and works out
the role from the account itself — a username means an administrator, a phone
number or name means a visitor. The response carries a JWT with that role, and
the older `/api/users/login` and `/api/admin/login` routes still work.

| Middleware | Accepts |
| --- | --- |
| `authMiddleware` | Administrators only |
| `userAuthMiddleware` | Visitors only |
| `anyAuthMiddleware` | Either role |
| `optionalUserAuthMiddleware` | Works signed in or out, and adapts the response |

A visitor's email is verified with a six-digit code before any session is opened,
so an unverified account can never sign in. Codes are generated with
`crypto.randomInt`, stored hashed, valid for `OTP_TTL_MINUTES`, single-use, and
invalidated the moment a newer code is issued for the same address.

`sanitizeResponse` strips secret fields — currently a challenge's
`correct_option` — from every response that is not going to an administrator. It
sits in one place rather than in each route, so a new endpoint cannot leak them
by omission.

### Rate limits

| Endpoint | Limit |
| --- | --- |
| Every sign-in route | 5 attempts per IP per 15 minutes; a successful sign-in does not count |
| `register` · `resend-otp` · `forgot-password` | 5 per email address and 30 per IP, per hour |

The sign-in limit stops password guessing and the CPU load that bcrypt would
otherwise hand an attacker. The email limits protect the sending account from
being exhausted, which would stop verification working for everyone.

> Behind a reverse proxy the app must trust it (`app.set("trust proxy", 1)`,
> already set), otherwise every request looks like it comes from the proxy and
> the limits apply to all users at once.

---

## Media

Uploads go to `uploads/<kind>/<uuid>`, are capped at 25MB, and are checked
against a fixed list of image and video types.

Images are rewritten to WebP on arrival at a width suited to where they are
shown — 1600px for places and provinces, 800px for stamps and partners, 512px for
avatars. A photo straight off a phone arrives around twenty times lighter with no
visible difference. EXIF rotation is applied before re-encoding, and an image
that fails to convert is simply kept as it was rather than failing the upload.

`/uploads` is served statically with a one-year immutable cache, which is safe
because every filename is a UUID and its content never changes.

---

## Endpoints

All paths are prefixed with `/api`.

### Authentication

| Method | Path | Access |
| --- | --- | --- |
| POST | `/auth/login` | Public |
| POST | `/users/register` | Public |
| POST | `/users/login` | Public |
| POST | `/users/verify-otp` | Public |
| POST | `/users/resend-otp` | Public |
| POST | `/users/forgot-password` | Public |
| POST | `/users/reset-password` | Public |
| POST | `/admin/login` | Public |
| GET · PUT | `/admin/profile` | Admin |

### The visitor's journey

| Method | Path | Access |
| --- | --- | --- |
| GET · PUT | `/users/profile` | Visitor |
| GET · POST | `/users/books` | Visitor |
| GET | `/users/visits` | Visitor |
| GET | `/users/challenges` | Visitor |
| POST | `/users/challenges/solve` | Visitor |
| GET | `/users/stamps` | Visitor |
| POST | `/users/stamps/collect` | Visitor |
| GET | `/users/dashboard/:id` | Visitor |
| GET | `/public/qr/:serial/:version/:type/:id` | Public, richer when signed in |

The journey endpoints take the active passport's `?userBookId=`, and the server
rejects solving a challenge or collecting a stamp that does not belong to it.

### Content

`provinces` · `areas` · `places` · `challenges` · `stamps` · `partners` · `faqs`
each expose the same shape:

| Method | Path | Access |
| --- | --- | --- |
| GET | `/<resource>` · `/<resource>/:id` | Public |
| POST · PUT · DELETE | `/<resource>` · `/<resource>/:id` | Admin |

Arabic is stored in the entity's own columns; other languages live in a `jsonb`
`translations` column, so `GET` returns both and the client falls back to Arabic
when a translation is missing.

### Media

| Method | Path | Access |
| --- | --- | --- |
| POST | `/uploads/:folder/image` · `/uploads/:folder/images` | Any signed-in |
| POST | `/provinces/media/:id/images` · `/videos` | Admin |
| POST | `/places/media/:id/images` · `/videos` | Admin |
| DELETE | `/provinces/media/images/:imageId` · `/videos/:videoId` | Admin |
| DELETE | `/places/media/images/:imageId` · `/videos/:videoId` | Admin |

### Passports and administration

| Method | Path | Access |
| --- | --- | --- |
| GET | `/books` · `/books/:id` | Signed in |
| GET · POST · PUT · DELETE | `/admin/books` · `/admin/books/:id` | Admin |
| GET · POST · PUT · DELETE | `/book-copies` · `/book-copies/:id` | Admin |
| GET | `/book-copies/book/:bookId` | Admin |
| GET · POST | `/qr-codes` | Admin |
| GET | `/admin/users` · `/admin/users/:id` | Admin |
| GET | `/admin/dashboard/statistics` | Admin |

---

## Deploying

1. Set the environment variables above — a fresh `JWT_SECRET`, the real origins,
   and `NODE_ENV=production`.
2. Make sure the schema exists (restore a dump, or the one-off `DB_SYNCHRONIZE`
   described earlier).
3. `npm run build && npm start`.

`uploads/` holds every image and video the panel has ever received and is not in
git, so it needs persistent storage. On a VPS that is simply the disk; on a
platform with an ephemeral filesystem it must be a mounted volume or object
storage, otherwise the media disappears on the next deploy.
