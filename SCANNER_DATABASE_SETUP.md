# Scanner Database Setup Guide

This guide explains how to insert products with barcodes/QR codes into the database so they can be scanned by the barcode scanner feature.

## Quick Start

### Option 1: Use Existing Seed Data (Fastest)

The database already contains sample products with real barcodes. To use them:

1. **Ensure the database is running:**
   ```bash
   cd /workspaces/MVP-EDIT/backend
   docker compose up -d  # Start PostgreSQL
   ```

2. **Run migrations and seed:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Products with scannable barcodes are now in the database:**
   - `5010477010002` → "Organic Whole Grain Bread"
   - `5010477010003` → "Almond Butter"
   - `5010477010004` → "Plant-Based Yogurt" (pending review)

### Option 2: Add New Products via SQL

Connect to the database and insert products directly:

```bash
# Connect to PostgreSQL (from backend directory)
psql -h localhost -U postgres -d transparent_treats
```

Then run this SQL to insert a scannable product:

```sql
INSERT INTO products (
  id, 
  barcode, 
  name, 
  brand, 
  category, 
  ingredients, 
  certifications, 
  nutrition_facts, 
  submitted_by, 
  submitted_at, 
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(),
  '8718206039997',  -- UPC/EAN barcode
  'Example Product',
  'Example Brand',
  'Beverages',
  '[{"id":1,"name":"Water","origin":"Local"}]'::jsonb,
  '["organic","vegan"]'::text[],
  '{"calories":"0","sugar":"0g"}'::jsonb,
  (SELECT id FROM users LIMIT 1),  -- Use first user
  NOW(),
  NOW(),
  NOW()
);
```

## Using Real Barcodes for Testing

### Generate Test Barcodes

You can use these real-world barcodes for testing:

**Common Products (UPC-A/EAN-13):**
- `5010477010002` - Real bread product barcode
- `5010477010003` - Real food product barcode
- `8718206039997` - Real beverage product barcode
- `4006381030268` - Real cosmetic product barcode

### Or Generate Custom Test Codes

To create unique test barcodes:

1. **EAN-13 Format** (most common, 13 digits):
   ```
   500104 + 7701000 + 2
   ^      ^          ^
   prefix manufacturer check digit
   ```

2. **UPC-A Format** (12 digits):
   ```
   0 12345 67890 5
   ^ system product check
   ```

3. **QR Code**: Any string can be a QR code - the scanner will detect it as-is.

## Option 3: Add Products via Backend API (Requires Auth)

If the backend server is running:

1. **Sign in to get a token:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "admin123456"
     }'
   ```

2. **Use the token to submit a product:**
   ```bash
   curl -X POST http://localhost:3001/api/products/submit \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d '{
       "barcode": "1234567890123",
       "name": "My Test Product",
       "brand": "My Brand",
       "category": "Snacks",
       "ingredients": [
         {"id": 1, "name": "Ingredient 1"},
         {"id": 2, "name": "Ingredient 2"}
       ],
       "certifications": ["organic", "vegan"]
     }'
   ```

## Option 4: Modify Seed File and Re-Seed

Edit `/workspaces/MVP-EDIT/backend/src/db/seed.ts` to add custom products:

```typescript
// In the seed() function, add:
const myProduct = await createProduct(
  '9999999999999',      // Your barcode
  'My Custom Product',  // Name
  'My Brand',          // Brand
  'Category',          // Category
  [
    { id: 1, name: 'Sugar', allergen: false },
    { id: 2, name: 'Water', allergen: false }
  ],
  ['vegan', 'organic'],
  { calories: 100, protein: '5g' },
  user1.id
);
```

Then re-run:
```bash
npm run db:seed
```

## Testing the Scanner

### 1. Start Frontend Preview
```bash
cd /workspaces/MVP-EDIT/transparent-treats-main
npm run preview
```

### 2. Open Scanner Page
Navigate to: `http://localhost:5173/scan`

### 3. Test Methods

**Method A: Camera Scanning**
- Click "Start camera"
- Hold a printed barcode or QR code in front of camera
- Scanner will auto-detect and look up in database

**Method B: Image Upload**
- Click "Upload image"
- Select a photo of a barcode or QR code
- Scanner will detect and look up

**Method C: Manual Input**
- Enter barcode number in the "Enter barcode / QR code" field
- Click "Lookup"
- Will search database

### 4. Expected Behavior

**If barcode found:**
- Redirects to product detail page
- Shows all product information (ingredients, scores, etc.)

**If barcode not found:**
- Redirects to submission form
- Barcode field is pre-filled
- User can add details and submit

## Database Schema

Products table structure:
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  barcode VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  brand VARCHAR(255),
  category VARCHAR(255),
  ingredients JSONB,
  certifications TEXT[],
  nutrition_facts JSONB,
  submitted_by UUID REFERENCES users(id),
  submitted_at TIMESTAMP,
  verified_at TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### Scanner says "Product not found"
- Check the barcode is in the database
- Verify barcode format matches what's stored (exact string match)
- Ensure backend is running if using remote API

### Camera permission denied
- Grant camera access in browser settings
- Try incognito/private browsing mode
- Check HTTPS (localhost works, but remote needs HTTPS)

### Barcode detection fails
- Ensure good lighting
- Hold barcode flat and still
- Try uploading a high-quality photo instead
- Check that barcode/QR is clearly visible

### Connection to backend fails
- Backend should be running: `npm run dev` in `/workspaces/MVP-EDIT/backend`
- Check `.env` files have correct API URLs
- Verify database container is running: `docker ps`

## Quick Reference: Test Barcodes

```
Barcode          | Product Name                    | Created By
-----------------+---------------------------------+----------
5010477010002    | Organic Whole Grain Bread       | Seed Data
5010477010003    | Almond Butter                   | Seed Data
5010477010004    | Plant-Based Yogurt              | Seed Data
8718206039997    | (Add via SQL/API)               | Manual
```

## Next Steps

1. Choose an insertion method above
2. Insert product with barcode
3. Start frontend preview: `npm run preview`
4. Test at `/scan` page
5. Scan barcode or enter manually
6. Verify product information displays correctly
