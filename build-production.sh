#!/bin/bash
set -e

echo "🚀 Building application for production..."
echo ""

# Build Backend
echo "📦 Building backend..."
cd /workspaces/MVP-EDIT/backend
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Backend build successful"
else
    echo "❌ Backend build failed"
    exit 1
fi

echo ""

# Build Frontend
echo "🎨 Building frontend..."
cd /workspaces/MVP-EDIT/transparent-treats-main
npm install
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║            ✅ All builds completed successfully!              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📦 Build artifacts:"
echo "   Backend:  /workspaces/MVP-EDIT/backend/dist/"
echo "   Frontend: /workspaces/MVP-EDIT/transparent-treats-main/dist/"
echo ""
echo "🚀 Ready to deploy!"
echo ""
echo "Next steps:"
echo "  1. Run: chmod +x deploy.sh && ./deploy.sh"
echo "  2. Or deploy manually using DEPLOYMENT_GUIDE.md"
echo ""
