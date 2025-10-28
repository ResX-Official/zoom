# Yoom - Windows Installation Guide

This guide will help you install and run the Yoom Zoom Clone application on Windows.

## 📋 Prerequisites

Before installing Yoom, make sure you have the following installed on your Windows system:

- **Node.js** (version 16.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning the repository) - [Download here](https://git-scm.com/)

## 🚀 Quick Installation (Recommended)

### Method 1: Using Batch File (Easiest)

1. **Download the project files** to your desired location
2. **Double-click** on `install-windows.bat`
3. **Follow the prompts** in the command window
4. The script will automatically:
   - Check for Node.js and npm
   - Install all dependencies
   - Create environment file
   - Build the application
   - Start the application

### Method 2: Using PowerShell Script

1. **Right-click** on `install-windows.ps1`
2. Select **"Run with PowerShell"**
3. If prompted about execution policy, run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
4. **Follow the prompts** in the PowerShell window

## 🛠️ Manual Installation

If you prefer to install manually or the automated scripts don't work:

### Step 1: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. Make sure to check **"Add to PATH"** during installation

### Step 2: Verify Installation

Open Command Prompt or PowerShell and run:
```bash
node --version
npm --version
```

Both commands should return version numbers.

### Step 3: Install Dependencies

Navigate to the project folder and run:
```bash
npm install
```

### Step 4: Set Up Environment Variables

1. Create a file named `.env` in the project root
2. Add the following content:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key_here
STREAM_SECRET_KEY=your_stream_secret_key_here
```

3. **Replace the placeholder values** with your actual API keys:
   - Get Clerk keys from: [clerk.com](https://clerk.com/)
   - Get Stream keys from: [getstream.io](https://getstream.io/)

### Step 5: Build the Application

```bash
npm run build
```

### Step 6: Start the Application

```bash
npm run start
```

## 🌐 Accessing the Application

Once the application is running, open your web browser and go to:
**http://localhost:3000**

## 🎯 Available Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🔧 Troubleshooting

### Common Issues

1. **"Node.js not found" error**
   - Make sure Node.js is installed and added to PATH
   - Restart your command prompt/PowerShell after installation

2. **"npm command not found" error**
   - Reinstall Node.js and make sure npm is included
   - Check if npm is in your system PATH

3. **Build errors**
   - Make sure you've added your API keys to the `.env` file
   - Delete `node_modules` folder and run `npm install` again

4. **Permission errors (PowerShell)**
   - Run PowerShell as Administrator
   - Change execution policy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

5. **Port 3000 already in use**
   - Close other applications using port 3000
   - Or change the port in your `.env` file

### Getting Help

- Check the main README.md for detailed project information
- Visit the [JavaScript Mastery YouTube channel](https://www.youtube.com/@javascriptmastery/videos) for tutorials
- Join the Discord community for support

## 📱 Creating Desktop Shortcut

To create a desktop shortcut for easy access:

1. Run the `create-desktop-shortcut.bat` file (if available)
2. Or manually create a shortcut pointing to: `http://localhost:3000`

## 🔄 Updating the Application

To update to the latest version:

1. Download the latest project files
2. Replace the old files with new ones
3. Run `npm install` to update dependencies
4. Run `npm run build` to rebuild
5. Start with `npm run start`

## 📝 Notes

- The application runs locally on your machine
- Make sure your firewall allows connections to port 3000
- For production deployment, consider using services like Vercel, Netlify, or your own server
- Keep your API keys secure and never share them publicly

---

**Enjoy using Yoom!** 🎉

For more information, visit the main project repository or the JavaScript Mastery YouTube channel.
