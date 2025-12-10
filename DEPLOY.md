# 🚀 Quick Deploy to Public URLs

Your app is ready for public deployment! Choose your preferred method:

## ⚡ Fastest: Automated Script

```bash
cd /workspaces/MVP-EDIT
./deploy.sh
```

This deploys everything and gives you public URLs to share.

---

## 🌐 One-Click Deploy (No CLI)

### Step 1: Backend (Railway)
1. Go to **https://railway.app/new**
2. Sign in with GitHub
3. Deploy from repo: `mjvdh1304/MVP-EDIT`
4. Directory: `backend`
5. Add PostgreSQL database
6. Copy backend URL

### Step 2: Frontend (Vercel)
1. Go to **https://vercel.com/new**
2. Import: `mjvdh1304/MVP-EDIT`
3. Directory: `transparent-treats-main`
4. Add env var: `VITE_API_URL` = your-backend-url
5. Deploy and copy frontend URL

### Step 3: Connect them
1. In Railway, add: `FRONTEND_URL` = your-frontend-url
2. Restart backend

---

## 📱 Your Public URLs

After deployment:
- **App**: `https://your-app.vercel.app`
- **Scanner**: `https://your-app.vercel.app/scan`
- **Products**: `https://your-app.vercel.app/products`

**Share these with anyone** - no authentication needed!

---

## 💰 Cost: $0/month

- Railway: $5 free credit/month
- Vercel: 100% free
- **Total: FREE**

---

## 📚 Full Documentation

See `PUBLIC_DEPLOYMENT.md` for complete instructions.

---

## ✅ What You Get

✨ Mobile barcode scanner  
✨ 2+ million products (Open Food Facts)  
✨ Auto-fill nutrition data  
✨ User authentication  
✨ Product submissions  

**Everything works on mobile browsers!**
