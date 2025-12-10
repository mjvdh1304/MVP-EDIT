#!/bin/bash
set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║          🚀 Transparent Treats - Auto Deploy                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Prerequisites installed"
echo ""

# Step 1: Deploy Backend to Railway
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 STEP 1: Deploy Backend to Railway"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /workspaces/MVP-EDIT/backend

echo "🔐 Logging into Railway..."
railway login

echo "🏗️  Building backend..."
npm run build

echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Backend deployed!"
echo ""
echo "⚠️  IMPORTANT: Configure your backend on Railway:"
echo "   1. Go to: https://railway.app/dashboard"
echo "   2. Add PostgreSQL database to your project"
echo "   3. Set these environment variables:"
echo "      - NODE_ENV=production"
echo "      - JWT_SECRET=<generate-random-secret>"
echo "      - JWT_REFRESH_SECRET=<generate-random-secret>"
echo "      - FRONTEND_URL=<will-be-set-after-vercel-deploy>"
echo ""

read -p "📋 Paste your Railway backend URL (e.g., https://app.railway.app): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required. Exiting..."
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 STEP 2: Deploy Frontend to Vercel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd /workspaces/MVP-EDIT/transparent-treats-main

echo "🏗️  Building frontend..."
npm run build

echo "🚀 Deploying to Vercel..."
vercel --prod -e VITE_API_URL="$BACKEND_URL"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  ✅ DEPLOYMENT COMPLETE!                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Your application is now LIVE and publicly accessible!"
echo ""
echo "🌐 Frontend URL: Check Vercel output above"
echo "🔧 Backend URL:  $BACKEND_URL"
echo ""
echo "⚠️  FINAL STEPS:"
echo "   1. Copy your Vercel frontend URL"
echo "   2. Go to Railway dashboard"
echo "   3. Update FRONTEND_URL environment variable"
echo "   4. Restart your backend service"
echo ""
echo "🎯 TEST YOUR APP:"
echo "   Visit: <your-vercel-url>/scan"
echo "   Try barcode: 3017620422003 (Nutella)"
echo ""
echo "📚 Full documentation: /workspaces/MVP-EDIT/DEPLOYMENT_GUIDE.md"
echo ""
