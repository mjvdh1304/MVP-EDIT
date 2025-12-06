# Backend - Transparent Treats

A secure Node.js + Express backend service for user-contributed product data with authentication, moderation, and PostgreSQL database.

## Features

- **JWT Authentication**: User registration, login, token refresh.
- **Product Submission**: Users can submit product data (barcode, ingredients, certifications).
- **Moderation Queue**: Admin review & approval system with trust-based auto-publishing.
- **Ingredient Database**: Structured ingredient data with allergen & sourcing info.
- **User Profiles**: Preferences, dietary conditions, trust scores.
- **Admin Dashboard APIs**: Submission management, user analytics.
- **Rate Limiting**: Prevent spam and abuse.
- **Data Validation & Sanitization**: Zod schemas + backend re-validation.

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Setup

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/transparent_treats

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
# Create PostgreSQL database
createdb transparent_treats

# Run migrations
npm run db:migrate

# Seed with sample data (optional)
npm run db:seed
```

### Running the Server

**Development (with auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3001` by default.

## API Endpoints

### Authentication

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token
- `POST /api/auth/refresh` — Refresh expired token
- `POST /api/auth/logout` — Logout (optional; tokens are stateless)

### Products

- `POST /api/products/submit` — Submit a new product (requires auth)
- `GET /api/products/submissions` — Get user's own submissions (requires auth)
- `GET /api/products/:id` — Get product by ID (public)
- `GET /api/products` — List all products (public)
- `GET /api/products/metadata/:id` — Get product metadata & contributors (public)

### Admin (requires admin role)

- `GET /api/admin/submissions` — List pending submissions
- `POST /api/admin/submissions/:id/approve` — Approve a submission
- `POST /api/admin/submissions/:id/reject` — Reject a submission
- `GET /api/admin/users` — List users with trust scores
- `POST /api/admin/users/:id/ban` — Ban a user

### User

- `GET /api/user/profile` — Get current user's profile (requires auth)
- `PATCH /api/user/profile` — Update profile (requires auth)

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── config.ts                # Configuration & env vars
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication middleware
│   │   ├── errorHandler.ts      # Global error handler
│   │   └── rateLimit.ts         # Rate limiting middleware
│   ├── db/
│   │   ├── pool.ts              # PostgreSQL connection pool
│   │   ├── schema.sql           # Database schema
│   │   ├── migrate.ts           # Run migrations
│   │   ├── seed.ts              # Seed sample data
│   │   └── queries.ts           # Helper functions for DB operations
│   ├── routes/
│   │   ├── auth.ts              # Auth endpoints
│   │   ├── products.ts          # Product endpoints
│   │   ├── admin.ts             # Admin endpoints
│   │   └── user.ts              # User profile endpoints
│   ├── schemas/
│   │   ├── auth.ts              # Zod validation schemas
│   │   └── products.ts          # Product validation schemas
│   └── types/
│       └── index.ts             # TypeScript type definitions
├── package.json
├── tsconfig.json
├── .env.example
└── README.md (this file)
```

## Authentication Flow

1. User registers with email & password (password hashed with bcryptjs).
2. Server returns JWT token (expires in 1h) and refresh token (expires in 7d).
3. Client stores tokens in memory (or sessionStorage, cleared on page close).
4. Client includes token in `Authorization: Bearer <token>` header.
5. Server verifies token on protected routes; returns 401 if invalid/expired.
6. Client can refresh token before expiry using refresh endpoint.

## Moderation Flow

1. User submits product data.
2. If user is new (trustScore < 10), submission goes to `pending_review` queue.
3. Admin reviews submission via `GET /api/admin/submissions`.
4. Admin approves (published to products table, user trustScore += 1) or rejects (with feedback).
5. Once user has 10+ approved submissions, future submissions auto-publish.

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP.
- **Product submission**: 5 submissions per user per day.
- **General API**: 100 requests per 15 minutes per IP.

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

### Using Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Build and push:

```bash
docker build -t transparent-treats-backend .
docker push your-registry/transparent-treats-backend
```

### Using Heroku

```bash
heroku create transparent-treats-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Using Railway, AWS, or Digital Ocean

See deployment docs in the repo wiki or contact the team.

## Security Checklist

- [x] JWT tokens with secure secrets.
- [x] Password hashing (bcryptjs, 10+ salt rounds).
- [x] CORS restricted to frontend domain.
- [x] Rate limiting on auth & submission endpoints.
- [x] Input validation with Zod.
- [x] SQL injection prevention (parameterized queries via pg).
- [x] Moderation queue to prevent spam.
- [x] User trust scores to reduce moderation burden over time.
- [ ] HTTPS enforced in production.
- [ ] Secrets stored in environment variables (not hardcoded).
- [ ] Logging & monitoring (Sentry, DataDog, etc.).
- [ ] Regular security audits and dependency updates.

## Contributing

1. Create a feature branch: `git checkout -b feat/my-feature`.
2. Make changes and commit: `git commit -m "feat: my feature"`.
3. Push and open a PR: `git push origin feat/my-feature`.

## License

MIT
