# Architecture Documentation
## Sydney Mortgage Calculator

---

## 1. Current State Analysis

### 1.1 Existing Implementation
The current app is a **Claude Artifact** - a single bundled HTML file containing:

```
sydney-mortgage-calculator.html (88,000+ tokens)
├── Inline TailwindCSS (minified, ~40KB)
├── React 18 runtime (bundled)
├── shadcn/ui components (bundled)
├── Lucide icons (bundled)
└── Application logic (minified, unreadable)
```

### 1.2 Problems with Current Approach
| Issue | Impact |
|-------|--------|
| Minified code | Cannot read or modify logic |
| No source files | No version control on components |
| Inline styles | Cannot customize TailwindCSS |
| No testing | Cannot verify calculations |
| Monolithic | Cannot reuse components |
| No debugging | Console only, no breakpoints |

### 1.3 What Works Well
- Fully functional standalone file
- Can be opened in any browser
- No server required
- Good starting point for understanding features

---

## 2. Recommended Architecture

### 2.1 Technology Decisions

#### Framework: React 18 + TypeScript
**Why React?**
- Already used in artifact (familiar patterns)
- Rich ecosystem (charts, forms, etc.)
- Component-based (matches UI structure)
- TypeScript for type-safe calculations

#### Build Tool: Vite
**Why Vite?**
- Fastest development server
- Native ESM support
- Excellent TypeScript support
- Simple configuration
- Better than Create React App (deprecated)

#### Styling: TailwindCSS + shadcn/ui
**Why keep this stack?**
- Already styled this way in artifact
- shadcn/ui provides accessible components
- TailwindCSS enables rapid iteration
- Copy component patterns from artifact

### 2.2 Project Structure

```
sydney-property-calculator/
│
├── src/
│   │
│   ├── components/           # UI Components
│   │   ├── ui/               # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... 
│   │   │
│   │   ├── PropertyForm/
│   │   │   ├── PropertyForm.tsx
│   │   │   ├── PriceInput.tsx
│   │   │   ├── SavingsInput.tsx
│   │   │   └── DepositSlider.tsx
│   │   │
│   │   ├── Calculators/
│   │   │   ├── MortgageCard.tsx
│   │   │   ├── StampDutyCard.tsx
│   │   │   ├── BuyingCostsCard.tsx
│   │   │   └── LMICard.tsx
│   │   │
│   │   ├── Projections/
│   │   │   ├── StampDutyRecovery.tsx
│   │   │   ├── InterestRateScenarios.tsx
│   │   │   └── WealthProjection.tsx
│   │   │
│   │   └── Export/
│   │       ├── SummaryExport.tsx
│   │       └── CopyButton.tsx
│   │
│   ├── hooks/                # Custom React Hooks
│   │   ├── usePropertyStore.ts      # Zustand store
│   │   ├── useMortgageCalc.ts
│   │   ├── useStampDuty.ts
│   │   └── useProjections.ts
│   │
│   ├── lib/                  # Pure Logic (no React)
│   │   ├── calculations/
│   │   │   ├── mortgage.ts          # P&I, IO calculations
│   │   │   ├── stampDuty.ts         # NSW stamp duty logic
│   │   │   ├── lmi.ts               # LMI estimates
│   │   │   ├── projections.ts       # Wealth projections
│   │   │   └── index.ts
│   │   │
│   │   ├── formatters/
│   │   │   ├── currency.ts          # $1,234,567 formatting
│   │   │   ├── percentage.ts
│   │   │   └── dates.ts
│   │   │
│   │   └── utils.ts
│   │
│   ├── constants/            # Configuration & Rates
│   │   ├── stampDutyRates.ts        # NSW tier rates
│   │   ├── lmiRates.ts
│   │   ├── defaultValues.ts
│   │   └── index.ts
│   │
│   ├── types/                # TypeScript Types
│   │   ├── property.ts
│   │   ├── mortgage.ts
│   │   ├── projections.ts
│   │   └── index.ts
│   │
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── index.css             # Tailwind imports
│
├── tests/                    # Test files
│   ├── lib/
│   │   ├── mortgage.test.ts
│   │   ├── stampDuty.test.ts
│   │   └── lmi.test.ts
│   └── components/
│       └── PropertyForm.test.tsx
│
├── docs/                     # Documentation
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
│
├── public/
│   └── favicon.ico
│
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── vitest.config.ts
└── .gitignore
```

### 2.3 State Management

#### Option A: React Context + useReducer (Simple)
```typescript
// Good for: MVP, <10 state values
const PropertyContext = createContext<PropertyState | null>(null);
```

#### Option B: Zustand (Recommended)
```typescript
// Good for: Growing complexity, computed values
import { create } from 'zustand';

interface PropertyStore {
  // Inputs
  propertyPrice: number;
  totalSavings: number;
  offsetAmount: number;
  depositPercent: number;
  interestRate: number;
  loanTerm: number;
  isFirstHomeBuyer: boolean;
  
  // Actions
  setPropertyPrice: (price: number) => void;
  setDeposit: (percent: number) => void;
  reset: () => void;
  
  // Computed (derived)
  get loanAmount(): number;
  get stampDuty(): number;
  get monthlyRepayment(): number;
}
```

**Decision**: Start with Zustand - small bundle, simple API, scales well.

---

## 3. Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        User Input                           │
│  (Property Price, Savings, Deposit %, Interest Rate, etc.)  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     Zustand Store                           │
│  propertyStore.ts                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Raw Inputs  │  │  Actions    │  │  Computed   │         │
│  │ (state)     │  │  (setters)  │  │  (getters)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│ lib/stampDuty   │ │ lib/mortgage│ │ lib/projections │
│                 │ │             │ │                 │
│ calculateNSW()  │ │ calcP&I()   │ │ calcRecovery()  │
│ getFHBDiscount()│ │ calcIO()    │ │ calcWealth()    │
└────────┬────────┘ └──────┬──────┘ └────────┬────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                      UI Components                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ StampDuty   │  │ Mortgage    │  │ Wealth      │         │
│  │ Card        │  │ Card        │  │ Projection  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Calculation Logic (Core)

### 4.1 Stamp Duty (NSW)

```typescript
// constants/stampDutyRates.ts
export const NSW_STAMP_DUTY_TIERS = [
  { threshold: 0,         rate: 0.0125, base: 0 },
  { threshold: 16000,     rate: 0.015,  base: 200 },
  { threshold: 35000,     rate: 0.0175, base: 485 },
  { threshold: 93000,     rate: 0.035,  base: 1500 },
  { threshold: 351000,    rate: 0.045,  base: 10530 },
  { threshold: 1168000,   rate: 0.055,  base: 47295 },
];

// lib/calculations/stampDuty.ts
export function calculateNSWStampDuty(
  propertyPrice: number,
  isFirstHomeBuyer: boolean = false
): number {
  if (isFirstHomeBuyer) {
    if (propertyPrice <= 800000) return 0;
    if (propertyPrice <= 1000000) {
      // Sliding scale reduction
      const discount = (1000000 - propertyPrice) / 200000;
      return calculateBaseStampDuty(propertyPrice) * (1 - discount);
    }
  }
  return calculateBaseStampDuty(propertyPrice);
}
```

### 4.2 Mortgage Repayments

```typescript
// lib/calculations/mortgage.ts
export function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  years: number,
  offsetBalance: number = 0
): number {
  const effectivePrincipal = Math.max(0, principal - offsetBalance);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return effectivePrincipal / numPayments;
  }
  
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return effectivePrincipal * (monthlyRate * factor) / (factor - 1);
}
```

### 4.3 LMI Estimation

```typescript
// lib/calculations/lmi.ts
export function estimateLMI(
  propertyPrice: number,
  loanAmount: number
): number {
  const lvr = (loanAmount / propertyPrice) * 100;
  
  if (lvr <= 80) return 0;
  
  // Approximate LMI rates (varies by lender)
  const lmiRate = 
    lvr <= 85 ? 0.008 :
    lvr <= 90 ? 0.015 :
    lvr <= 95 ? 0.030 : 0.045;
  
  return loanAmount * lmiRate;
}
```

---

## 5. Component Patterns

### 5.1 Card Component Pattern

```tsx
// components/Calculators/StampDutyCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty } from '@/lib/calculations/stampDuty';
import { formatCurrency } from '@/lib/formatters/currency';

export function StampDutyCard() {
  const { propertyPrice, isFirstHomeBuyer } = usePropertyStore();
  
  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          NSW Stamp Duty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-orange-600">
          {formatCurrency(stampDuty)}
        </div>
        {isFirstHomeBuyer && propertyPrice <= 800000 && (
          <Badge variant="success">FHB Exempt</Badge>
        )}
      </CardContent>
    </Card>
  );
}
```

### 5.2 Input Component Pattern

```tsx
// components/PropertyForm/PriceInput.tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePropertyStore } from '@/hooks/usePropertyStore';

export function PriceInput() {
  const { propertyPrice, setPropertyPrice } = usePropertyStore();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/[^0-9]/g, ''));
    if (!isNaN(value)) {
      setPropertyPrice(value);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="property-price">Property Price</Label>
      <Input
        id="property-price"
        type="text"
        value={formatCurrency(propertyPrice)}
        onChange={handleChange}
        className="text-lg font-semibold"
      />
    </div>
  );
}
```

---

## 6. Testing Strategy

### 6.1 Unit Tests (Calculations)
**Priority: Critical** - Financial calculations must be accurate.

```typescript
// tests/lib/stampDuty.test.ts
import { describe, it, expect } from 'vitest';
import { calculateNSWStampDuty } from '@/lib/calculations/stampDuty';

describe('NSW Stamp Duty Calculator', () => {
  it('calculates correctly for $1,000,000 property', () => {
    const result = calculateNSWStampDuty(1000000);
    expect(result).toBe(40930); // Known correct value
  });
  
  it('applies FHB exemption under $800k', () => {
    const result = calculateNSWStampDuty(750000, true);
    expect(result).toBe(0);
  });
  
  it('applies FHB sliding scale $800k-$1m', () => {
    const result = calculateNSWStampDuty(900000, true);
    // 50% discount on $900k stamp duty
    expect(result).toBeCloseTo(20465);
  });
});
```

### 6.2 Component Tests
```typescript
// tests/components/PropertyForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyForm } from '@/components/PropertyForm';

describe('PropertyForm', () => {
  it('updates store when price changes', () => {
    render(<PropertyForm />);
    const input = screen.getByLabelText(/property price/i);
    fireEvent.change(input, { target: { value: '1500000' } });
    expect(screen.getByText('$1,500,000')).toBeInTheDocument();
  });
});
```

### 6.3 Test Coverage Targets
| Area | Target Coverage |
|------|-----------------|
| Calculation functions | 100% |
| Store logic | 90% |
| UI Components | 70% |

---

## 7. Deployment

### 7.1 Build Output
```bash
npm run build
# Produces: dist/ folder (~500KB gzipped)
```

### 7.2 Hosting Options

| Platform | Pros | Cons |
|----------|------|------|
| **Vercel** | Free, auto-deploy, preview branches | - |
| **Netlify** | Free, form handling | - |
| **GitHub Pages** | Free, simple | No server functions |
| **Cloudflare Pages** | Fast CDN, free | - |

**Recommendation**: Vercel (best DX, free tier sufficient)

### 7.3 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
```

---

## 8. Migration Plan

### Step 1: Set Up New Project
```bash
npm create vite@latest sydney-property-calculator -- --template react-ts
cd sydney-property-calculator
npm install
```

### Step 2: Install Dependencies
```bash
# Core
npm install zustand recharts

# UI (shadcn/ui setup)
npx shadcn@latest init
npx shadcn@latest add button card input slider label tabs badge

# Icons
npm install lucide-react

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Step 3: Reverse-Engineer Logic
1. Open artifact HTML in browser
2. Test with known values
3. Document expected outputs
4. Implement and verify each calculation

### Step 4: Build Components
1. Start with calculation lib (pure functions)
2. Add Zustand store
3. Build UI components one at a time
4. Test each component

### Step 5: Verify & Launch
1. Compare outputs to original artifact
2. Run full test suite
3. Deploy to Vercel
4. Archive original HTML file

---

## 9. Performance Considerations

### 9.1 Bundle Size
- Use tree-shaking (Vite default)
- Lazy load charts (Recharts is large)
- Consider `react-window` for future tables

### 9.2 Calculation Performance
- Memoize expensive calculations with `useMemo`
- Debounce slider inputs (300ms)
- Use Web Workers if projections become slow

### 9.3 Render Optimization
- `React.memo()` for pure components
- Avoid inline object/function props
- Split store selectors to prevent over-rendering

---

## Appendix: Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| Dec 2024 | Use Vite over CRA | CRA deprecated, Vite faster |
| Dec 2024 | Keep TailwindCSS | Matches existing artifact |
| Dec 2024 | Zustand over Redux | Simpler for calculator app |
| Dec 2024 | TypeScript required | Financial accuracy critical |

