# Gator Market - Installation Guide

## Prerequisites

Before installing, make sure you have:

- **Node.js** (v16 or later) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Quick Installation

### Windows

Run the PowerShell installation script:

```powershell
.\install.ps1
```

### Mac/Linux

Run the bash installation script:

```bash
chmod +x install.sh
./install.sh
```

### Manual Installation

If the scripts don't work, you can install manually:

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

After installation, start the development server:

```bash
cd frontend
npm start
```

The app will open at `http://localhost:3000`

## Current Configuration

**The app is currently running in MOCK MODE:**

- ✅ No backend/Python required
- ✅ All data stored in browser localStorage
- ✅ Login and registration work with mock data
- ✅ Profile changes persist locally

## Using with Real Backend (Optional)

If you want to connect to the real Python/FastAPI backend:

1. **Set MOCK_MODE to false** in `frontend/src/App.tsx`:

   ```typescript
   const MOCK_MODE = false; // Change from true to false
   ```

2. **Install Python dependencies:**

   ```bash
   pip install fastapi uvicorn passlib python-jose[cryptography] python-multipart bcrypt
   ```

3. **Start the backend server:**

   ```bash
   python -m uvicorn backend.main:app --reload --port 8000
   ```

4. **Keep both servers running:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`

## Troubleshooting

### "Node is not recognized"

- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt after installation

### "npm install" fails

- Try clearing npm cache: `npm cache clean --force`
- Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Port 3000 already in use

- Kill the process using port 3000, or
- Use a different port: `PORT=3001 npm start` (Mac/Linux) or `$env:PORT=3001; npm start` (Windows)

## Package List

The following packages will be installed:

- React & React DOM
- TypeScript
- Lucide React (icons)
- Sonner (toast notifications)
- Various UI components from shadcn/ui
- Development tools (ESLint, testing libraries, etc.)

See `frontend/package.json` for the complete list.
