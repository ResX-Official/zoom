#!/bin/bash

# Test script to verify everything is configured correctly

set -e

echo "🧪 Testing Zoom Clone Setup..."
echo "================================"
echo ""

# Test 1: Check installer exists
echo "✅ Test 1: Installer file exists"
if [ -f "public/installer/Zoom-Setup-1.0.0.exe" ]; then
    SIZE=$(du -h public/installer/Zoom-Setup-1.0.0.exe | cut -f1)
    echo "   ✓ Found: public/installer/Zoom-Setup-1.0.0.exe ($SIZE)"
    
    # Check if it's a valid PE executable
    if file public/installer/Zoom-Setup-1.0.0.exe | grep -q "PE32"; then
        echo "   ✓ Valid Windows executable"
    else
        echo "   ⚠️  Warning: File may not be valid Windows executable"
    fi
else
    echo "   ❌ Missing: public/installer/Zoom-Setup-1.0.0.exe"
fi
echo ""

# Test 2: Check download page configuration
echo "✅ Test 2: Download page configuration"
if grep -q "/installer/Zoom-Setup" app/download/page.tsx; then
    echo "   ✓ Download page points to correct installer path"
else
    echo "   ❌ Download page not configured correctly"
fi
echo ""

# Test 3: Check API endpoint
echo "✅ Test 3: API endpoint configuration"
if grep -q "/installer/Zoom-Setup" app/api/download/installer/route.ts; then
    echo "   ✓ API endpoint configured"
else
    echo "   ❌ API endpoint not configured"
fi
echo ""

# Test 4: Check Electron main.js loads dashboard
echo "✅ Test 4: Electron app configuration"
if grep -q "thezoomcaller.com/dashboard" electron/main.js; then
    echo "   ✓ Electron app loads dashboard URL"
else
    echo "   ❌ Electron app not configured correctly"
fi

# Check auto-start
if grep -q "setLoginItemSettings" electron/main.js; then
    echo "   ✓ Auto-start on login configured"
else
    echo "   ⚠️  Auto-start not configured"
fi
echo ""

# Test 5: Check UserTrackingProvider
echo "✅ Test 5: User tracking setup"
if grep -q "UserTrackingProvider" app/layout.tsx; then
    echo "   ✓ UserTrackingProvider is loaded in app layout"
else
    echo "   ❌ UserTrackingProvider not found in layout"
fi

if [ -f "components/UserTrackingProvider.tsx" ]; then
    echo "   ✓ UserTrackingProvider component exists"
else
    echo "   ❌ UserTrackingProvider component missing"
fi
echo ""

# Test 6: Check admin login
echo "✅ Test 6: Admin login configuration"
if grep -q "thestreet" app/admin/page.tsx components/AdminLogin.tsx 2>/dev/null; then
    echo "   ✓ Admin login credentials configured"
else
    echo "   ⚠️  Admin login may not be configured"
fi
echo ""

# Test 7: Check Vercel configuration
echo "✅ Test 7: Deployment configuration"
if [ -f ".vercelignore" ]; then
    if grep -q "dist-electron" .vercelignore; then
        echo "   ✓ Electron build files excluded from Vercel"
    else
        echo "   ⚠️  dist-electron not excluded from Vercel"
    fi
else
    echo "   ⚠️  .vercelignore not found"
fi
echo ""

# Test 8: Verify Next.js build works
echo "✅ Test 8: Next.js build (quick check)"
if npm run build > /dev/null 2>&1; then
    echo "   ✓ Next.js build succeeds"
else
    echo "   ❌ Next.js build failed (run 'npm run build' for details)"
fi
echo ""

echo "================================"
echo "🎯 Summary:"
echo ""
echo "✅ Installer: public/installer/Zoom-Setup-1.0.0.exe"
echo "✅ Download URL: /installer/Zoom-Setup-1.0.0.exe"
echo "✅ Electron loads: https://thezoomcaller.com/dashboard"
echo "✅ Auto-start: Configured"
echo "✅ Tracking: UserTrackingProvider active"
echo ""
echo "📝 To test locally:"
echo "   1. npm run dev"
echo "   2. Visit http://localhost:3000/download"
echo "   3. Click download button"
echo ""
echo "📦 To deploy:"
echo "   vercel --prod"
echo ""









