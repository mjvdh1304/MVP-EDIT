# Open Food Facts Integration

## Overview

The barcode scanner is now integrated with **Open Food Facts**, a free, open, and collaborative database containing over **2 million products** from around the world. When you scan a barcode:

1. **First**, the system checks our local database
2. **If not found**, it automatically queries Open Food Facts
3. **If found externally**, it displays the product info and lets you add it to our database

## How It Works

### Backend Integration

**File**: `/backend/src/services/openFoodFacts.ts`

The backend includes a service that:
- Fetches product data from Open Food Facts API
- Normalizes the external data format to match our internal schema
- Extracts comprehensive nutritional information
- Identifies certifications (organic, vegan, gluten-free, etc.)
- Parses allergens and ingredient lists

**API Endpoint**: `/backend/src/routes/products.ts`

The barcode lookup endpoint (`GET /api/products/barcode/:barcode`) now:
1. Queries local database first
2. Falls back to Open Food Facts if not found locally
3. Returns product with `isExternal: true` flag if from external DB
4. Includes a helpful message encouraging users to submit to improve data

### Frontend Integration

**Scanner Page**: `/src/pages/Scan.tsx`

When a barcode is scanned or entered manually:
- If found locally → navigates to product detail page
- If found externally → navigates to submission form with **pre-filled data**
- If not found anywhere → navigates to blank submission form

**Submit Form**: `/src/pages/SubmitProduct.tsx`

Enhanced to handle Open Food Facts data:
- Shows a blue info banner when data comes from external source
- Pre-fills all available fields (name, brand, category, ingredients, nutrition)
- User can review, edit, and submit to add to local database
- Additional fields for brand, category, and nutrition facts

## Supported Data

From Open Food Facts, we extract:

### Basic Information
- ✅ Product name
- ✅ Brand
- ✅ Category
- ✅ Barcode (EAN-13, UPC, etc.)

### Ingredients
- ✅ Full ingredient list
- ✅ Allergen information
- ✅ Traces warnings

### Nutrition (per 100g)
- ✅ Calories (kcal)
- ✅ Fat & Saturated fat
- ✅ Carbohydrates & Sugars
- ✅ Fiber
- ✅ Protein
- ✅ Salt & Sodium

### Quality Indicators
- ✅ **Nutri-Score** (A to E rating for nutritional quality)
- ✅ **Eco-Score** (A to E rating for environmental impact)

### Certifications
Automatically detected from labels:
- Organic / Bio
- Vegan
- Vegetarian
- Gluten-free
- Fair-trade
- Kosher
- Halal

## Testing the Integration

### Test with Real Barcodes

Try these famous products:

```bash
# Nutella (international)
curl http://localhost:3001/api/products/barcode/3017620422003

# Coca-Cola Classic
curl http://localhost:3001/api/products/barcode/5449000000996

# Ben & Jerry's Ice Cream
curl http://localhost:3001/api/products/barcode/8714100770542

# Kellogg's Corn Flakes
curl http://localhost:3001/api/products/barcode/5053827143882
```

### Test via Frontend

1. **Start the preview server:**
   ```bash
   cd /workspaces/MVP-EDIT/transparent-treats-main
   npm run preview
   ```

2. **Navigate to**: http://localhost:5173/scan

3. **Test methods:**
   - **Manual entry**: Type `3017620422003` (Nutella) and click "Lookup"
   - **Camera scan**: Scan any product barcode in your pantry
   - **Image upload**: Upload a photo of a barcode

4. **Expected behavior:**
   - You'll see "✓ Found in Open Food Facts: [Product Name]"
   - You'll be redirected to the submission form
   - Form will be pre-filled with product data
   - Blue info banner explains the data source
   - You can review and submit to add to local database

## Data Flow Diagram

```
┌──────────────┐
│ User Scans   │
│   Barcode    │
└──────┬───────┘
       │
       v
┌──────────────────────────────────────┐
│  GET /api/products/barcode/:barcode  │
└──────┬───────────────────────────────┘
       │
       v
┌──────────────────┐
│ Query Local DB   │
└──────┬───────────┘
       │
       ├─── Found ────> Return product (isExternal: false)
       │                      │
       │                      v
       │              Navigate to /product/:id
       │
       └─── Not Found ─> Query Open Food Facts API
                              │
                              ├─── Found ────> Return normalized data
                              │                (isExternal: true)
                              │                      │
                              │                      v
                              │              Navigate to /submit
                              │              with pre-filled data
                              │
                              └─── Not Found ─> Return 404
                                                      │
                                                      v
                                                Navigate to /submit
                                                (blank form)
```

## Benefits

### For Users
- ✅ **Instant access** to millions of products without manual entry
- ✅ **Comprehensive nutrition data** automatically populated
- ✅ **Quality indicators** (Nutri-Score, Eco-Score) for informed decisions
- ✅ **Save time** - no need to type all details manually

### For the Platform
- ✅ **Rapid database growth** through user submissions
- ✅ **Data validation** - users review external data before adding
- ✅ **Complementary data** - combine Open Food Facts with user insights
- ✅ **Global coverage** - support international products

## API Details

### Open Food Facts Endpoint
```
GET https://world.openfoodfacts.org/api/v2/product/{barcode}.json
```

### Response Format
The API returns detailed product information including:
- Product identifiers (name, brand, barcode)
- Ingredients (structured and text format)
- Nutritional values (per 100g)
- Labels and certifications
- Images (packaging, ingredients, nutrition)
- Quality scores (Nutri-Score, Eco-Score)

### Rate Limits
Open Food Facts is free and open:
- ✅ No API key required
- ✅ No rate limits for reasonable use
- ✅ Recommended: Include `User-Agent` header (already configured)

### Attribution
When displaying data from Open Food Facts:
- Include source attribution: "Data from Open Food Facts"
- Link to product page: `https://world.openfoodfacts.org/product/{barcode}`
- Encourage users to improve data on Open Food Facts

## Future Enhancements

### Planned Features
- [ ] Show product images from Open Food Facts
- [ ] Display Nova classification (food processing level)
- [ ] Show Eco-Score details (CO2, packaging, etc.)
- [ ] Link to Open Food Facts product page
- [ ] Batch import popular products
- [ ] Sync updates from Open Food Facts

### Advanced Features
- [ ] Multi-language support (Open Food Facts is multilingual)
- [ ] Allergen highlighting based on user profile
- [ ] Alternative product suggestions
- [ ] Price comparison integration
- [ ] Store availability lookup

## Troubleshooting

### "Product not found" even for known products
- **Cause**: Barcode might be regional variant or new product
- **Solution**: Submit manually, or check Open Food Facts website directly

### External data seems incomplete
- **Cause**: Open Food Facts relies on community contributions
- **Solution**: Encourage users to contribute missing info back to Open Food Facts

### API call fails
- **Cause**: Network issue or Open Food Facts downtime (rare)
- **Solution**: Backend gracefully falls back; shows "not found" message

## Contributing

### Adding Products to Open Food Facts
Users can improve global data quality:
1. Visit https://world.openfoodfacts.org
2. Create free account
3. Add/edit product information
4. Take photos of packaging, ingredients, nutrition label
5. Changes appear in API within minutes

### Local Database Strategy
- **Community products**: Keep in local DB with user reviews
- **External products**: Cache frequently scanned items
- **Hybrid approach**: Merge Open Food Facts data with user insights

## Privacy & Data

### What Gets Stored
- ✅ Barcode lookups are not stored
- ✅ Only submitted products are saved to local DB
- ✅ No personal data sent to Open Food Facts

### Open Data License
- Open Food Facts data: **ODbL** (Open Database License)
- You can use, share, and adapt the data
- Must attribute Open Food Facts
- Share-alike: improvements must be shared back

## Resources

- **Open Food Facts Website**: https://world.openfoodfacts.org
- **API Documentation**: https://openfoodfacts.github.io/api-documentation/
- **Database Statistics**: https://world.openfoodfacts.org/data
- **Mobile Apps**: Available for iOS and Android
