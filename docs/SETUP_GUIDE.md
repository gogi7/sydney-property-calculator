# Setup Guide
## Sydney Mortgage Calculator - Project Initialization

Follow these steps in order. Run each command in your terminal.

---

## Pre-requisites Check

First, verify you have Node.js and npm working:

```powershell
node --version
npm --version
```

You should see version numbers (Node 18+ recommended).

---

## Option A: Create React App (Most Compatible)

### Step 1: Create the Project

Open PowerShell/Terminal in your project folder (`C:\Tools PHPC\claude_sydneyproperty`):

```powershell
# Navigate to parent directory first
cd "C:\Tools PHPC"

# Create new React app (this creates a new folder)
npx create-react-app sydney-property-calculator --template typescript

# Move into the project
cd sydney-property-calculator
```

**Note**: This creates a NEW folder. We'll move files later.

### Step 2: Install TailwindCSS

```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Step 3: Configure Tailwind

Edit `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Edit `src/index.css` - replace ALL content with:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Install shadcn/ui

```powershell
npx shadcn@latest init
```

When prompted, choose:
- TypeScript: **Yes**
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**
- Tailwind config location: **tailwind.config.js**
- Components location: **@/components**
- Utils location: **@/lib/utils**
- React Server Components: **No**

### Step 5: Add shadcn/ui Components

```powershell
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add slider
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add switch
npx shadcn@latest add tooltip
```

Or all at once:
```powershell
npx shadcn@latest add button card input label slider tabs badge switch tooltip
```

### Step 6: Install Additional Dependencies

```powershell
# State management
npm install zustand

# Icons
npm install lucide-react

# Charts (optional, for later)
npm install recharts
```

### Step 7: Test It Works

```powershell
npm start
```

Should open browser at http://localhost:3000

---

## Option B: Next.js (Alternative)

If Create React App doesn't work, try Next.js:

### Step 1: Create Next.js Project

```powershell
cd "C:\Tools PHPC"
npx create-next-app@latest sydney-property-calculator
```

When prompted:
- TypeScript: **Yes**
- ESLint: **Yes**
- Tailwind CSS: **Yes**
- `src/` directory: **Yes**
- App Router: **Yes**
- Customize import alias: **No** (keep @/*)

### Step 2: Move into Project

```powershell
cd sydney-property-calculator
```

### Step 3: Install shadcn/ui

```powershell
npx shadcn@latest init
```

### Step 4: Add Components

```powershell
npx shadcn@latest add button card input label slider tabs badge switch tooltip
```

### Step 5: Install Dependencies

```powershell
npm install zustand lucide-react recharts
```

### Step 6: Test

```powershell
npm run dev
```

---

## After Setup: Folder Structure

Once setup is complete, create these folders:

```
src/
├── components/
│   ├── ui/           (created by shadcn)
│   ├── PropertyForm/
│   ├── Calculators/
│   └── Projections/
├── hooks/
├── lib/
│   ├── calculations/
│   └── formatters/
├── constants/
└── types/
```

PowerShell commands to create folders:
```powershell
# For Create React App
cd src
mkdir hooks
mkdir constants
mkdir types
mkdir lib\calculations
mkdir lib\formatters
mkdir components\PropertyForm
mkdir components\Calculators
mkdir components\Projections
cd ..
```

---

## Troubleshooting

### "npm not recognized"
- Install Node.js from https://nodejs.org/
- Restart PowerShell after installation

### "npx: command not found"
- Try: `npm install -g npx`

### "EPERM" or permission errors
- Run PowerShell as Administrator
- Or try: `npm cache clean --force`

### shadcn/ui init fails
- Make sure you're in the project folder (where package.json is)
- Try: `npm install` first to ensure dependencies are installed

### Tailwind not working
- Check that `tailwind.config.js` has the correct content paths
- Restart the dev server after config changes

---

## Quick Reference: All Commands in Order

```powershell
# 1. Create project
cd "C:\Tools PHPC"
npx create-react-app sydney-property-calculator --template typescript
cd sydney-property-calculator

# 2. Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button card input label slider tabs badge switch tooltip

# 4. Other dependencies
npm install zustand lucide-react recharts

# 5. Test
npm start
```

---

## What to Tell Me

After you complete setup, let me know:
1. Which option worked (CRA or Next.js)?
2. Did shadcn/ui install successfully?
3. Does `npm start` (or `npm run dev`) work?

Then I'll help you create the actual calculator components!

