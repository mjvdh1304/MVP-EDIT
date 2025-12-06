# Quick Start: Backend Development

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and update for your local environment:

```bash
cp .env.example .env
```

**Minimal `.env` for local development:**

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/transparent_treats
JWT_SECRET=dev-secret
JWT_REFRESH_SECRET=dev-refresh-secret
FRONTEND_URL=http://localhost:5173
```

## PostgreSQL Setup (Local)

### macOS (with Homebrew)

```bash
brew install postgresql
brew services start postgresql
createuser postgres (if needed)
createdb transparent_treats
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb transparent_treats
```

### Windows

Download PostgreSQL from https://www.postgresql.org/download/windows/

Or use Docker:

```bash
docker run --name transparent-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=transparent_treats -p 5432:5432 -d postgres:14
```

## Development

### Run migrations + seed data

```bash
npm run db:migrate
npm run db:seed
```

### Start the dev server (auto-reload)

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Testing

```bash
npm test
```

## API Endpoints Quick Reference

### Auth (Public)

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'

# Refresh token
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<your-refresh-token>"
  }'
```

### Products (Public)

```bash
# Get all products
curl http://localhost:3001/api/products

# Get product by ID
curl http://localhost:3001/api/products/<product-id>
```

### Products - Submit (Authenticated)

```bash
# Submit a product
curl -X POST http://localhost:3001/api/products/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "5010477010005",
    "name": "Organic Oat Milk",
    "brand": "Plant Co",
    "category": "Beverages",
    "ingredients": [
      {"name": "Oats", "allergen": false, "origin": "Sweden"},
      {"name": "Water", "allergen": false}
    ],
    "certifications": ["organic", "vegan"],
    "sourceUrl": "https://example.com"
  }'

# Get your submissions
curl -X GET http://localhost:3001/api/products/user/submissions \
  -H "Authorization: Bearer <token>"
```

### User Profile (Authenticated)

```bash
# Get your profile
curl -X GET http://localhost:3001/api/user/profile \
  -H "Authorization: Bearer <token>"
```

### Admin (Authenticated + Admin role)

```bash
# List pending submissions
curl -X GET http://localhost:3001/api/admin/submissions \
  -H "Authorization: Bearer <token>"

# Approve submission
curl -X POST http://localhost:3001/api/admin/submissions/<submission-id>/approve \
  -H "Authorization: Bearer <token>"

# Reject submission
curl -X POST http://localhost:3001/api/admin/submissions/<submission-id>/reject \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Ingredient list incomplete"
  }'
```

## Demo Credentials (after seed)

- **Admin:** admin@example.com / admin123456
- **User 1:** user1@example.com / user123456
- **User 2:** user2@example.com / user123456

## Troubleshooting

### "Cannot find module 'express'"

Dependencies not installed:

```bash
npm install
```

### "Database connection refused"

PostgreSQL not running:

```bash
# macOS
brew services start postgresql

# Ubuntu
sudo systemctl start postgresql

# Docker (if using container)
docker start transparent-db
```

### "Database does not exist"

Create it:

```bash
createdb transparent_treats
npm run db:migrate
```

### Ports already in use

- Change `PORT` in `.env` (backend runs on 3001 by default)
- If PostgreSQL port 5432 is busy, update `DATABASE_URL` to a different port

## Next Steps

1. ✓ Backend running locally
2. Connect frontend: set `VITE_API_BASE_URL=http://localhost:3001` in frontend `.env`
3. Test endpoints using cURL or Postman
4. Implement frontend forms to call backend endpoints
5. Deploy to cloud (Heroku, Railway, AWS, etc.)

## Production Deployment

See `README.md` for Docker and cloud deployment options.
