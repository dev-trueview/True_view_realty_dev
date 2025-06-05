
# Complete Manual Setup Guide for TrueView Reality

This comprehensive guide will help you set up your development environment to run both backend and frontend servers simultaneously, and clean up unnecessary files.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setting Up Concurrent Development](#setting-up-concurrent-development)
3. [Quick Setup Scripts](#quick-setup-scripts)
4. [File Cleanup Guide](#file-cleanup-guide)
5. [Navigation to Delete Files](#navigation-to-delete-files)
6. [Testing Your Setup](#testing-your-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### What You Need
- Node.js installed (version 16 or higher)
- npm (comes with Node.js)
- Basic command line knowledge
- A code editor (VS Code recommended)

### Check Your Installation
Open your terminal/command prompt and run:
```bash
node --version
npm --version
```

## Setting Up Concurrent Development

### Step 1: Install Required Dependencies

1. **Open your terminal** in the project root directory
2. **Install concurrently package:**
   ```bash
   npm install --save-dev concurrently
   ```
   
   This package allows running multiple commands simultaneously.

### Step 2: Update Package.json Scripts

1. **Open `package.json`** in your code editor
2. **Find the `"scripts"` section**
3. **Add these new scripts:**
   ```json
   {
     "scripts": {
       "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\" --names \"FRONTEND,BACKEND\" --prefix-colors \"blue,green\"",
       "dev:frontend": "vite",
       "dev:backend": "cd backend && npm run dev",
       "build": "tsc && vite build",
       "preview": "vite preview"
     }
   }
   ```

### Step 3: Set Up Backend Package.json

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Check if package.json exists.** If not, create it:
   ```bash
   npm init -y
   ```

3. **Install backend dependencies:**
   ```bash
   npm install express mysql2 cors
   npm install --save-dev nodemon
   ```

4. **Add these scripts to backend/package.json:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

## Quick Setup Scripts

### For Windows Users (quick-setup.bat)
1. **Double-click `quick-setup.bat`** in your project root
2. **Follow the prompts** in the command window
3. **Wait for installation to complete**

### For Mac/Linux Users (quick-setup.sh)
1. **Open terminal in project root**
2. **Make script executable:**
   ```bash
   chmod +x quick-setup.sh
   ```
3. **Run the script:**
   ```bash
   ./quick-setup.sh
   ```

## File Cleanup Guide

### Safe-to-Delete Files (After Verification)

Before deleting any files, **ALWAYS verify they're not being used** by following these steps:

#### Step 1: Search for File Usage
For each file you want to delete, search for references:

1. **Open your code editor**
2. **Use "Find in Files" (Ctrl+Shift+F in VS Code)**
3. **Search for the filename** (without extension)
4. **Check if any files import or reference it**

#### Step 2: Files That Are Likely Safe to Delete

**Duplicate/Unused Assets:**
- `public/f.ico` (duplicate favicon)
- `public/ff.png` (unknown purpose image)

**Package Manager Lock Files (Choose One):**
- Keep either `package-lock.json` OR `bun.lockb`
- Delete the one you're not using

**Documentation Files (Optional):**
- `BEGINNER_DEVELOPER_GUIDE.md`
- `DATA_STRUCTURE.md`
- Only delete if you prefer the new `MANUAL_SETUP_GUIDE.md`

## Navigation to Delete Files

### Important: Files with "delete_" Prefix

The following files have been renamed with "delete_" prefix and need to be manually removed:

#### Step-by-Step Navigation Instructions:

1. **Open File Explorer/Finder:**
   - Windows: Press `Windows + E`
   - Mac: Press `Cmd + Space`, type "Finder"
   - Linux: Open your file manager

2. **Navigate to Project Root:**
   - Look for your project folder (usually named `trueview-reality` or similar)
   - Double-click to open it

3. **Navigate to Each Directory and Delete Files:**

   **Delete Files in src/components/:**
   - Navigate to: `src` → `components`
   - Look for: `delete_AdminLogin.tsx`
   - Right-click → Delete/Move to Trash
   
   **Delete Files in src/pages/:**
   - Navigate to: `src` → `pages`
   - Look for: `delete_AdminDashboard.tsx`
   - Right-click → Delete/Move to Trash
   
   **Delete Files in src/utils/:**
   - Navigate to: `src` → `utils`
   - Look for: `delete_adminAuth.ts`
   - Right-click → Delete/Move to Trash

#### Alternative: Using Command Line

If you prefer using terminal/command prompt:

```bash
# Navigate to project root first
cd your-project-folder

# Delete the files
rm src/components/delete_AdminLogin.tsx
rm src/pages/delete_AdminDashboard.tsx
rm src/utils/delete_adminAuth.ts
```

**For Windows Command Prompt:**
```cmd
del src\components\delete_AdminLogin.tsx
del src\pages\delete_AdminDashboard.tsx
del src\utils\delete_adminAuth.ts
```

### Verification After Deletion

1. **Check your application still works:**
   ```bash
   npm run dev
   ```

2. **Verify no broken imports:**
   - Look for any red error messages in terminal
   - Check browser console for errors

3. **Test admin functionality:**
   - Try logging in to admin dashboard
   - Ensure all features work as expected

## Testing Your Setup

### Step 1: Start Development Servers
```bash
npm run dev
```

You should see output similar to:
```
[FRONTEND] VITE v4.4.0 ready
[FRONTEND] Local: http://localhost:5173/
[BACKEND] TrueView Reality backend server running on port 3001
```

### Step 2: Verify Both Servers
1. **Frontend:** Open `http://localhost:5173` in your browser
2. **Backend:** Check that API calls work (submit an enquiry form)

### Step 3: Test Admin Features
1. **Click the settings icon** in the footer
2. **Login with admin credentials**
3. **Verify dashboard loads** with analytics data

## Troubleshooting

### Common Issues and Solutions

#### Issue: "concurrently command not found"
**Solution:**
```bash
npm install --save-dev concurrently
```

#### Issue: Backend server won't start
**Solutions:**
1. Check if MySQL is running
2. Verify database credentials in `backend/server.js`
3. Install missing dependencies:
   ```bash
   cd backend
   npm install
   ```

#### Issue: Port already in use
**Solutions:**
1. **Kill processes using the ports:**
   ```bash
   # Kill process on port 3001 (backend)
   npx kill-port 3001
   
   # Kill process on port 5173 (frontend)
   npx kill-port 5173
   ```

2. **Or change ports in configuration files**

#### Issue: File deletion broke something
**Solutions:**
1. **Restore from git** (if you have version control):
   ```bash
   git checkout -- filename
   ```

2. **Check for import errors** in browser console
3. **Verify all file paths** are correct

### Getting Help

1. **Check the browser console** for JavaScript errors
2. **Check the terminal** for build errors
3. **Verify all file paths** in import statements
4. **Make sure all dependencies** are installed

### Emergency Recovery

If something goes wrong:

1. **Stop all servers:** Press `Ctrl + C` in terminal
2. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```
3. **Clear browser cache** and reload
4. **Check git history** for recent changes

## Success Checklist

- [ ] Both frontend and backend start with `npm run dev`
- [ ] Website loads at `http://localhost:5173`
- [ ] Enquiry forms submit successfully
- [ ] Admin login works
- [ ] Admin dashboard displays data
- [ ] All "delete_" prefixed files have been removed
- [ ] No console errors in browser
- [ ] No terminal errors when starting servers

## Final Notes

- **Always backup** your project before making changes
- **Test thoroughly** after any file deletions
- **Keep this guide** for future reference
- **Document any custom changes** you make

Your TrueView Reality project should now be fully set up for efficient development!
