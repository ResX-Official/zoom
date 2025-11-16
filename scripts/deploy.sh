#!/bin/bash

# Deployment script for Zoom Clone
# This script builds the app and prepares for Vercel deployment

set -e

echo "🚀 Starting deployment preparation..."
echo ""

# Step 1: Build Next.js app
echo "📦 Building Next.js application..."
npm run build

# Step 2: Build Electron installer (if needed)
if [ ! -f "dist-electron/Zoom-Setup-1.0.0.exe" ]; then
    echo "📦 Building Electron installer..."
    npx electron-builder --win --publish=never || echo "⚠️  Installer build failed, but continuing..."
fi

# Step 3: Copy installer to public folder for deployment
if [ -f "dist-electron/Zoom-Setup-1.0.0.exe" ]; then
    echo "📁 Copying installer to public folder..."
    mkdir -p public/installer
    cp dist-electron/Zoom-Setup-1.0.0.exe public/installer/
    echo "✅ Installer copied to public/installer/"
else
    echo "⚠️  Installer not found, skipping copy"
fi

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review the changes"
echo "   2. Commit files: git add . && git commit -m 'Prepare for deployment'"
echo "   3. Deploy to Vercel: vercel --prod"
echo ""









