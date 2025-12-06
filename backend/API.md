# API Documentation

## Overview

The Transparent Treats backend provides a RESTful API for user authentication, product submission, moderation, and management. All endpoints return JSON responses.

## Base URL

- Development: `http://localhost:3001`
- Production: `https://api.example.com` (set your actual domain)

## Authentication

### JWT Tokens

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Token structure:
- **Access Token**: Expires in 1 hour
- **Refresh Token**: Expires in 7 days (stored in client's sessionStorage or memory)

### Roles

- `user`: Regular user can submit products
- `admin`: Can approve/reject submissions and manage users

---

## Endpoints

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Response: 201 Created**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:**
- `400`: Invalid input (password < 8 chars, invalid email, etc.)
- `409`: Email already registered

---

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response: 200 OK**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:**
- `401`: Invalid email or password, account banned

---

#### Refresh Token

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response: 200 OK**

```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

**Errors:**
- `401`: Invalid or expired refresh token

---

### Products

#### List All Products

```http
GET /api/products
```

**Response: 200 OK**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "barcode": "5010477010002",
    "name": "Organic Whole Grain Bread",
    "brand": "Nature's Best",
    "category": "Bakery",
    "ingredients": [
      {
        "id": 1,
        "name": "Whole Wheat Flour",
        "allergen": false,
        "origin": "USA"
      }
    ],
    "certifications": ["organic", "vegan"],
    "submittedBy": "550e8400-e29b-41d4-a716-446655440001",
    "submittedAt": "2025-12-05T10:00:00Z"
  }
]
```

---

#### Get Product by ID

```http
GET /api/products/:id
```

**Response: 200 OK**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "barcode": "5010477010002",
  "name": "Organic Whole Grain Bread",
  "brand": "Nature's Best",
  "category": "Bakery",
  "ingredients": [...],
  "certifications": ["organic", "vegan"],
  "submittedBy": "550e8400-e29b-41d4-a716-446655440001",
  "submittedAt": "2025-12-05T10:00:00Z"
}
```

**Errors:**
- `404`: Product not found

---

#### Submit a Product

```http
POST /api/products/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "barcode": "5010477010005",
  "name": "Plant-Based Yogurt",
  "brand": "Green Earth",
  "category": "Dairy Alternatives",
  "ingredients": [
    {
      "name": "Coconut Milk",
      "allergen": true,
      "origin": "Thailand"
    },
    {
      "name": "Probiotic Cultures",
      "allergen": false
    }
  ],
  "certifications": ["vegan", "dairy-free"],
  "nutritionFacts": {
    "calories": 120,
    "protein": "4g",
    "carbs": "15g"
  },
  "sourceUrl": "https://example.com/product",
  "notes": "Contains coconut milk alternative to dairy"
}
```

**Response: 201 Created**

```json
{
  "submissionId": "550e8400-e29b-41d4-a716-446655440002",
  "status": "pending_review",
  "message": "Thank you! Your submission is under review."
}
```

**Errors:**
- `400`: Validation error (missing fields, invalid barcode, etc.)
- `409`: Product with this barcode already exists
- `429`: Rate limit exceeded (max 5 submissions per day per user)
- `401`: Unauthorized (missing/invalid token)

---

#### Get User's Submissions

```http
GET /api/products/user/submissions
Authorization: Bearer <token>
```

**Response: 200 OK**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "barcode": "5010477010005",
    "name": "Plant-Based Yogurt",
    "status": "pending_review",
    "createdAt": "2025-12-05T11:00:00Z",
    "updatedAt": "2025-12-05T11:00:00Z"
  }
]
```

---

### User Profile

#### Get Current User Profile

```http
GET /api/user/profile
Authorization: Bearer <token>
```

**Response: 200 OK**

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "trustScore": 5,
    "isBanned": false,
    "createdAt": "2025-12-01T08:00:00Z",
    "updatedAt": "2025-12-05T10:00:00Z"
  }
}
```

**Errors:**
- `401`: Unauthorized

---

### Admin Endpoints

#### List Pending Submissions

```http
GET /api/admin/submissions?page=0&limit=50
Authorization: Bearer <admin-token>
```

**Response: 200 OK**

```json
{
  "submissions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "barcode": "5010477010005",
      "name": "Plant-Based Yogurt",
      "ingredients": [...],
      "status": "pending_review",
      "createdAt": "2025-12-05T11:00:00Z"
    }
  ],
  "page": 0,
  "limit": 50,
  "count": 1
}
```

**Errors:**
- `401`: Unauthorized
- `403`: Forbidden (not admin)

---

#### Approve Submission

```http
POST /api/admin/submissions/:id/approve
Authorization: Bearer <admin-token>
```

**Response: 200 OK**

```json
{
  "message": "Submission approved and product published",
  "submissionId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Errors:**
- `404`: Submission not found
- `403`: Forbidden (not admin)

---

#### Reject Submission

```http
POST /api/admin/submissions/:id/reject
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "reason": "Incomplete ingredient list or invalid barcode"
}
```

**Response: 200 OK**

```json
{
  "message": "Submission rejected",
  "submissionId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Errors:**
- `400`: Missing rejection reason
- `404`: Submission not found
- `403`: Forbidden (not admin)

---

### Health Check

```http
GET /api/health
```

**Response: 200 OK**

```json
{
  "status": "ok",
  "timestamp": "2025-12-05T10:00:00Z"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-12-05T10:00:00Z"
}
```

**Common HTTP Status Codes:**

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate barcode, etc.) |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Auth endpoints**: 5 requests per 15 minutes per IP
- **Product submission**: 5 submissions per user per 24 hours
- **General API**: 100 requests per 15 minutes per IP

When rate limited, the response includes:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 300
}
```

---

## Data Types

### Ingredient Object

```typescript
{
  id?: number;
  name: string;          // e.g., "Whole Wheat Flour"
  allergen?: boolean;    // true if allergen
  origin?: string;       // e.g., "USA"
  certifications?: string[];
}
```

### Product Object

```typescript
{
  id: string;            // UUID
  barcode: string;       // 8-14 characters
  name: string;
  brand?: string;
  category?: string;     // e.g., "Bakery", "Beverages"
  ingredients: Ingredient[];
  certifications: string[];  // e.g., ["organic", "vegan"]
  nutritionFacts?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  };
  submittedBy: string;   // User UUID
  submittedAt: string;   // ISO 8601 timestamp
  verifiedAt?: string;   // ISO 8601 timestamp
  verifiedBy?: string;   // Admin UUID
}
```

### Submission Object

```typescript
{
  id: string;            // UUID
  userId: string;        // User UUID
  barcode: string;
  name: string;
  brand?: string;
  category?: string;
  ingredients: Ingredient[];
  certifications: string[];
  nutritionFacts?: object;
  sourceUrl?: string;
  notes?: string;
  status: "pending_review" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}
```

---

## Example Workflow

### 1. Register a New User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "name": "New User"
  }'
```

Save the returned `token` and `refreshToken`.

### 2. Submit a Product

```bash
curl -X POST http://localhost:3001/api/products/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "barcode": "5010477010010",
    "name": "Organic Oat Milk",
    "brand": "Plant Co",
    "category": "Beverages",
    "ingredients": [
      {"name": "Oats", "origin": "Sweden"},
      {"name": "Water"}
    ],
    "certifications": ["organic", "vegan"]
  }'
```

### 3. Check Submission Status

```bash
curl -X GET http://localhost:3001/api/products/user/submissions \
  -H "Authorization: Bearer $TOKEN"
```

### 4. (Admin) Approve Submission

```bash
curl -X POST http://localhost:3001/api/admin/submissions/$SUBMISSION_ID/approve \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

The product is now published and visible in `GET /api/products`.

---

## Testing

Use Postman, Insomnia, or Thunder Client to test the API. Import this API documentation as an OpenAPI spec or manually create a collection with the endpoints above.

Alternatively, test via cURL:

```bash
# Set variables
TOKEN="<your-jwt-token>"
SUBMISSION_ID="<submission-uuid>"

# List products
curl http://localhost:3001/api/products

# Submit a product
curl -X POST http://localhost:3001/api/products/submit \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '@product.json'
```

---

## Support

For issues or questions, file a GitHub issue or contact the team.
