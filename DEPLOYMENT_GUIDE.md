# Deployment Guide - Public Access

This guide will help you deploy the application to public hosting so anyone can access it without authentication.

## Architecture

- **Frontend**: Vercel (free tier)
- **Backend + Database**: Railway (free tier with $5 credit/month)

## Option 1: Railway (Recommended - All-in-One)

Railway can host both backend and PostgreSQL database together.

### Steps:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub (free)
   - You get $5 free credit monthly

2. **Deploy Backend + Database**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Navigate to backend
   cd /workspaces/MVP-EDIT/backend
   
   # Initialize and deploy
   railway init
   railway up
   ```

3. **Add PostgreSQL Database**
   - In Railway dashboard, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway will auto-connect to your backend

4. **Set Environment Variables**
   In Railway dashboard, add:
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_REFRESH_SECRET=your-refresh-secret-change-this
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Get Backend URL**
   - Railway will provide: `https://your-backend.railway.app`
   - Copy this URL for frontend configuration

### Alternative: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

## Option 2: Render (Alternative Backend Host)

### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (free)

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory
   - Configure:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Environment**: Node

3. **Add PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Copy the "Internal Database URL"

4. **Set Environment Variables**
   ```
   DATABASE_URL=<paste internal database URL>
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   FRONTEND_URL=https://your-app.vercel.app
   ```

## Option 3: Vercel (Frontend Deployment)

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Frontend**
   ```bash
   cd /workspaces/MVP-EDIT/transparent-treats-main
   
   # Login
   vercel login
   
   # Deploy
   vercel --prod
   ```

3. **Set Environment Variable**
   - In Vercel dashboard → Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### Alternative: GitHub Integration

1. Go to https://vercel.com
2. Click "Import Project"
3. Connect your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `transparent-treats-main`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

## Option 4: Netlify (Alternative Frontend)

### Steps:

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**
   ```bash
   cd /workspaces/MVP-EDIT/transparent-treats-main
   
   # Login
   netlify login
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Set Environment Variable**
   - In Netlify dashboard → Site settings → Environment variables
   - Add: `VITE_API_URL=https://your-backend.railway.app`

## Quick Deploy Script

I'll create an automated script for you:

```bash
#!/bin/bash
# Save this as deploy.sh

echo "🚀 Deploying Transparent Treats..."

# Deploy Backend to Railway
echo "📦 Deploying backend to Railway..."
cd /workspaces/MVP-EDIT/backend
railway up

# Get backend URL (you'll need to copy this)
echo "✅ Backend deployed!"
echo "📋 Copy your Railway backend URL from: https://railway.app/dashboard"
read -p "Paste your backend URL here: " BACKEND_URL

# Deploy Frontend to Vercel
echo "🎨 Deploying frontend to Vercel..."
cd /workspaces/MVP-EDIT/transparent-treats-main
vercel --prod --env VITE_API_URL=$BACKEND_URL

echo "✅ Deployment complete!"
echo "📱 Your app is now live!"
```

## Manual Deployment (No CLI)

### Backend (Railway):
1. Push code to GitHub
2. Go to https://railway.app/new
3. Click "Deploy from GitHub repo"
4. Select `backend` directory
5. Add PostgreSQL database
6. Configure environment variables
7. Deploy

### Frontend (Vercel):
1. Go to https://vercel.com/new
2. Import from GitHub
3. Select your repository
4. Set root directory: `transparent-treats-main`
5. Add environment variable: `VITE_API_URL`
6. Deploy

## Expected Costs

### Free Tier Limits:

**Railway** (Backend + DB):
- ✅ $5 free credit/month
- ✅ Enough for ~500 hours runtime
- ✅ 1GB PostgreSQL storage
- ⚠️ Sleeps after inactivity (can upgrade)

**Vercel** (Frontend):
- ✅ Unlimited bandwidth
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Always active

**Render** (Alternative):
- ✅ Free tier available
- ⚠️ Spins down after 15 min inactivity
- ⚠️ 90 sec cold start

## Final URLs

After deployment, you'll have:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.railway.app`
- **Scanner**: `https://your-app.vercel.app/scan`

Share the frontend URL with anyone - no authentication needed!

## Troubleshooting

### Backend won't start
- Check Railway logs
- Verify DATABASE_URL is set
- Ensure migrations ran: `railway run npm run db:migrate`

### Frontend can't reach backend
- Check VITE_API_URL environment variable
- Verify backend CORS allows frontend URL
- Check backend is running: `curl https://your-backend.railway.app/api/health`

### Database connection fails
- Verify DATABASE_URL format
- Check PostgreSQL is running in Railway
- Try internal database URL instead of external

## Need Help?

Run this command to test deployment readiness:
```bash
cd /workspaces/MVP-EDIT/backend && npm run build && cd ../transparent-treats-main && npm run build
```

If both build successfully, you're ready to deploy!
