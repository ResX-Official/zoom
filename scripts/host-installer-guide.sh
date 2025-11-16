#!/bin/bash

echo "🚀 Installer Hosting Guide"
echo "=========================="
echo ""

# Check if installer exists
if [ ! -f "dist-electron/Zoom-Setup-1.0.0.exe" ]; then
    echo "❌ Installer not found! Building now..."
    npm run build-installer
    echo ""
fi

INSTALLER_SIZE=$(du -h dist-electron/Zoom-Setup-1.0.0.exe | cut -f1)
echo "📦 Installer: dist-electron/Zoom-Setup-1.0.0.exe ($INSTALLER_SIZE)"
echo ""

echo "Choose hosting method:"
echo "1. GitHub Releases (Recommended - Free, Easy)"
echo "2. Manual Upload Instructions"
echo "3. Check current Git status"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📋 GitHub Releases Setup:"
        echo "========================"
        echo ""
        
        # Check Git status
        if ! git rev-parse --git-dir > /dev/null 2>&1; then
            echo "⚠️  Not a Git repository. Initializing..."
            git init
            echo "✅ Git initialized"
            echo ""
        fi
        
        # Check if remote exists
        if ! git remote get-url origin > /dev/null 2>&1; then
            echo "⚠️  No GitHub remote configured."
            echo ""
            echo "Steps to set up GitHub:"
            echo "1. Create a new repository on GitHub"
            echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
            echo "3. Then run this script again"
            echo ""
            read -p "Do you want to add a remote now? (y/n): " add_remote
            if [ "$add_remote" = "y" ]; then
                read -p "Enter GitHub repository URL: " repo_url
                git remote add origin "$repo_url"
                echo "✅ Remote added: $repo_url"
            else
                exit 0
            fi
        fi
        
        echo "📝 Preparing for GitHub Release..."
        echo ""
        
        # Check if already committed
        if [ -n "$(git status --porcelain)" ]; then
            echo "📦 Staging files..."
            git add .
            echo "💾 Committing changes..."
            git commit -m "Add Windows installer and deployment configuration" || echo "⚠️  Commit failed or nothing to commit"
        fi
        
        # Check if tag exists
        if git rev-parse v1.0.0 >/dev/null 2>&1; then
            echo "⚠️  Tag v1.0.0 already exists"
            read -p "Delete and recreate? (y/n): " recreate
            if [ "$recreate" = "y" ]; then
                git tag -d v1.0.0
                git push origin :refs/tags/v1.0.0 2>/dev/null || true
            else
                echo "Using existing tag"
            fi
        fi
        
        echo ""
        echo "🏷️  Creating tag v1.0.0..."
        git tag v1.0.0
        echo "✅ Tag created"
        echo ""
        
        echo "📤 Pushing to GitHub..."
        echo "   (This will push code and tag)"
        echo ""
        read -p "Push to GitHub now? (y/n): " push_now
        
        if [ "$push_now" = "y" ]; then
            git push origin main 2>/dev/null || git push origin master 2>/dev/null || echo "⚠️  Push failed - you may need to push manually"
            git push origin v1.0.0
            echo ""
            echo "✅ Pushed to GitHub!"
            echo ""
        else
            echo ""
            echo "📋 Manual steps:"
            echo "   git push origin main"
            echo "   git push origin v1.0.0"
            echo ""
        fi
        
        echo "📋 Next Steps:"
        echo "=============="
        echo ""
        echo "1. Go to GitHub: https://github.com/$(git remote get-url origin 2>/dev/null | sed 's/.*github.com[:/]\([^.]*\).*/\1/')"
        echo "2. Click 'Releases' → 'Draft a new release'"
        echo "3. Select tag: v1.0.0"
        echo "4. Title: Release v1.0.0"
        echo "5. Upload file: dist-electron/Zoom-Setup-1.0.0.exe"
        echo "6. Click 'Publish release'"
        echo ""
        echo "7. Get download URL (will look like):"
        echo "   https://github.com/USER/REPO/releases/download/v1.0.0/Zoom-Setup-1.0.0.exe"
        echo ""
        echo "8. Set in Vercel:"
        echo "   - Go to Vercel Dashboard → Project → Settings → Environment Variables"
        echo "   - Add: INSTALLER_URL = [GitHub download URL]"
        echo "   - Redeploy"
        echo ""
        ;;
    2)
        echo ""
        echo "📋 Manual Upload Options:"
        echo "========================"
        echo ""
        echo "Option A: GitHub Releases (Web UI)"
        echo "  1. Go to your GitHub repository"
        echo "  2. Click 'Releases' → 'Draft a new release'"
        echo "  3. Create tag: v1.0.0"
        echo "  4. Upload: dist-electron/Zoom-Setup-1.0.0.exe"
        echo "  5. Publish release"
        echo ""
        echo "Option B: AWS S3"
        echo "  aws s3 cp dist-electron/Zoom-Setup-1.0.0.exe s3://your-bucket/installer/ --acl public-read"
        echo ""
        echo "Option C: Any CDN"
        echo "  Upload to Cloudflare, BunnyCDN, etc."
        echo ""
        ;;
    3)
        echo ""
        echo "📊 Git Status:"
        echo "=============="
        git status
        echo ""
        if git remote get-url origin > /dev/null 2>&1; then
            echo "✅ Remote configured:"
            git remote -v
        else
            echo "⚠️  No remote configured"
        fi
        echo ""
        ;;
    *)
        echo "Invalid choice"
        ;;
esac

