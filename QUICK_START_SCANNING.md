# 🎯 Quick Start Guide: Scanning Products with Open Food Facts

## What You Can Do Now

✅ Scan **any barcode** from products worldwide  
✅ Get **instant nutrition information**  
✅ See **quality ratings** (Nutri-Score, Eco-Score)  
✅ **Auto-fill submission forms** with complete product data  

---

## 🚀 Test in 3 Steps

### Step 1: Start the Application

```bash
# Make sure backend is running
cd /workspaces/MVP-EDIT/backend
docker compose up -d

# Start frontend preview
cd /workspaces/MVP-EDIT/transparent-treats-main
npm run preview
```

### Step 2: Open Scanner

Visit: **http://localhost:5173/scan**

### Step 3: Try These Test Barcodes

| Barcode | Product | What You'll See |
|---------|---------|----------------|
| `3017620422003` | Nutella | 539 cal/100g, Nutri-Score E, ingredients pre-filled |
| `5449000000996` | Coca-Cola Classic | 44 cal/100g, 10.6g sugar, Nutri-Score E |
| `5010477010002` | Local product | From your seed data (shows as local, not external) |

---

## 📱 Using the Scanner

### Option A: Manual Entry (Fastest for Testing)
1. Click on the "Enter barcode / QR code" field
2. Type: `3017620422003`
3. Click **"Lookup"**
4. ✓ See: "Found in Open Food Facts: Nutella"
5. You'll be redirected to submit form with **everything pre-filled**

### Option B: Camera Scan (Real-World Use)
1. Click **"Start camera"**
2. Allow camera permissions
3. Point at any product barcode
4. Auto-detects and looks up
5. Form pre-fills if found in Open Food Facts

### Option C: Image Upload (Fallback)
1. Click **"Upload image"**
2. Select photo of barcode
3. Detects barcode from image
4. Looks up and pre-fills