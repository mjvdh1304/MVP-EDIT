# Frontend-Backend Integration Guide

## Overview

The frontend (`transparent-treats-main/`) is already set up to connect to the backend (`backend/`) through the API adapter in `src/services/api.ts`. Here's how to set it up locally and in production.

## Local Development Setup

### 1. Start PostgreSQL

```bash
# macOS (with Homebrew)
brew services start postgresql

# Ubuntu/Linux
sudo systemctl start postgresql

# Or use Docker
docker run --name transparent-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=transparent_treats -p 5432:5432 -d postgres:14
```

### 2. Start the Backend

```bash
cd /workspaces/MVP-EDIT/backend

# Install dependencies
npm install

# Setup database
npm run db:migrate
npm run db:seed

# Start development server (runs on port 3001)
npm run dev
```

### 3. Start the Frontend

In a new terminal:

```bash
cd /workspaces/MVP-EDIT/transparent-treats-main

# Create .env file
cp .env.example .env

# Edit .env to enable remote API:
# VITE_USE_REMOTE_API=true
# VITE_API_BASE_URL=http://localhost:3001

# Install dependencies (if not already done)
npm install

# Start dev server (runs on port 5173)
npm run dev
```

### 4. Test the Integration

1. Open http://localhost:5173 in your browser
2. Navigate to Products page — should see local data + any products in the database
3. The `IngredientModal` will call `/api/ingredients/analyze` when a product is submitted
4. Products will be fetched from the backend if `VITE_USE_REMOTE_API=true`

## Environment Variables

### Frontend (transparent-treats-main/.env)

```env
# Enable remote API (connect to backend)
VITE_USE_REMOTE_API=true

# Backend base URL
VITE_API_BASE_URL=http://localhost:3001

# Optional: Enable MSW mocks (for development without backend)
VITE_ENABLE_MSW=false
```

### Backend (backend/.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transparent_treats

# JWT Secrets (change in production!)
JWT_SECRET=dev-secret-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-change-in-production

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Authentication Flow

The frontend uses React Query with the API adapter to handle auth transparently:

### 1. Register / Login

User registers or logs in via the frontend form:

```typescript
// Frontend example
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name }),
});
const { token, refreshToken } = await response.json();
localStorage.setItem('token', token);
localStorage.setItem('refreshToken', refreshToken);
```

### 2. Protected Requests

The API adapter automatically includes the JWT in all subsequent requests:

```typescript
// Any call to a protected endpoint includes:
// Authorization: Bearer <token>
```

### 3. Token Refresh

When the access token expires (1h), the frontend automatically refreshes:

```typescript
// Call /api/auth/refresh with refreshToken
// Get new token + refreshToken
// Retry original request
```

## API Adapter Configuration

The frontend API adapter (`src/services/api.ts`) has built-in fallback logic:

```typescript
// If VITE_USE_REMOTE_API=true and API succeeds:
// → Use backend data

// If remote fails or VITE_USE_REMOTE_API=false:
// → Fall back to local data (src/data/products.ts)
```

This means:
- ✅ Frontend works without backend (uses local data)
- ✅ Frontend works with backend (uses remote data)
- ✅ Seamless fallback if backend is down

## Product Submission Flow

### User Submits a Product

1. Frontend form validates input (Zod schema match)
2. `POST /api/products/submit` with JWT
3. Backend validates & checks rate limit
4. If new user: submission goes to `pending_review` queue
5. If trusted user (10+ approvals): auto-publishes to products table
6. Frontend shows success message or "pending review"

### Admin Approves Submission

1. Admin logs in (must be admin role)
2. Admin visits `/api/admin/submissions` to see queue
3. Admin clicks "Approve" → `POST /api/admin/submissions/:id/approve`
4. Backend creates product, increments user trust score
5. Product now visible to all users

## Testing the APIs

### Using cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "name": "New User"
  }'

# Save the token from response
TOKEN="eyJhbGc..."

# Get user profile
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer $TOKEN"

# Submit a product
curl -X POST http://localhost:3001/api/products/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "5010477010099",
    "name": "Test Product",
    "ingredients": [
      {"name": "Water", "allergen": false},
      {"name": "Salt", "allergen": false}
    ],
    "certifications": ["organic"]
  }'
```

### Using Postman / Insomnia

1. Import the backend URL: `http://localhost:3001`
2. Create requests for each endpoint (see `backend/API.md`)
3. For protected endpoints: add `Authorization: Bearer <token>` header

## Production Deployment

### 1. Deploy Backend First

Choose one:

**Option A: Heroku**
```bash
cd backend
heroku create transparent-treats-api
heroku addons:create heroku-postgresql:standard-0
git push heroku main
heroku logs --tail
```

**Option B: Railway**
1. Connect GitHub repo to Railway
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

**Option C: AWS EC2 + RDS**
1. Launch EC2 instance
2. Create RDS PostgreSQL database
3. Deploy Node.js app to EC2
4. Configure security groups

### 2. Deploy Frontend

**Option A: Vercel**
```bash
cd transparent-treats-main
npm install -g vercel
vercel
# Follow prompts, add env vars
```

**Option B: Netlify**
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add env vars
5. Deploy

**Option C: GitHub Pages**
```bash
npm run build
# Push dist/ to gh-pages branch
```

### 3. Configure Environment Variables

**Frontend (Vercel/Netlify/etc)**
```env
VITE_API_BASE_URL=https://api.example.com
VITE_USE_REMOTE_API=true
```

**Backend (Heroku/Railway/etc)**
```env
NODE_ENV=production
DATABASE_URL=postgres://...production-db-url...
JWT_SECRET=...generate-strong-random-secret...
JWT_REFRESH_SECRET=...generate-strong-random-secret...
FRONTEND_URL=https://www.example.com
```

## Troubleshooting

### "Cannot GET /api/products"

Backend not running or URL incorrect.

```bash
# Check backend is running
curl http://localhost:3001/api/health
# Should return: {"status":"ok","timestamp":"..."}
```

### "Unauthorized" when submitting product

JWT token expired or invalid.

```bash
# Check token in browser DevTools → Application → localStorage
# Try logging out and back in
```

### "CORS error"

Frontend URL not whitelisted in backend CORS config.

```env
# In backend/.env
FRONTEND_URL=http://localhost:5173  # or your frontend URL
```

### "Database connection refused"

PostgreSQL not running.

```bash
# Start PostgreSQL
createdb transparent_treats
npm run db:migrate
```

## Next Steps

1. ✅ Backend & frontend running locally
2. ✅ Auth flow working (register/login)
3. ✅ Product submission working
4. [ ] Admin moderation dashboard (frontend)
5. [ ] User profile page (frontend preferences)
6. [ ] Scoring & ingredient KB service
7. [ ] Deploy to production
8. [ ] Set up monitoring (Sentry, LogRocket)
9. [ ] CI/CD pipeline (GitHub Actions, GitLab CI)

## API Documentation

For full API reference, see:
- `backend/API.md` — Complete endpoint reference
- `backend/README.md` — Architecture & deployment
- `backend/QUICK_START.md` — Developer quick start

---

**Status**: Frontend and backend fully integrated and ready for local development and production deployment.
