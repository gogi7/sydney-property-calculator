# Sydney Mortgage Calculator

A comprehensive property investment calculator tailored for the Sydney/NSW real estate market. Calculate mortgage repayments, buying costs, stamp duty, and wealth projections.

![Status](https://img.shields.io/badge/status-active%20development-brightgreen)
![Version](https://img.shields.io/badge/version-0.1.0-blue)

## 🏠 Features

### Current Functionality
- **Property & Financial Overview** - Input property price and savings
- **NSW Stamp Duty Calculator** - Accurate owner-occupier stamp duty rates
- **Offset Account Modeling** - Keep offset amounts separate in calculations
- **Mortgage Repayment Calculator** - Monthly/fortnightly payment calculations
- **Stamp Duty Recovery Analysis** - Time to recover stamp duty via appreciation
- **Interest Rate Scenarios** - Multiple rate change simulations
- **Property Appreciation Projections** - Long-term wealth modeling
- **Copy to Clipboard** - Export calculation summary

### Key Calculations
- NSW Stamp Duty (tiered rates for owner-occupiers)
- LMI (Lender's Mortgage Insurance) estimates
- Monthly vs fortnightly repayment comparisons
- Future property value projections
- Break-even analysis for stamp duty recovery

## 🛠️ Current Architecture

**Status**: Claude Artifact (bundled single HTML file)

The app was generated as a Claude Artifact which bundles:
- React 18
- TailwindCSS (inline, minified)
- shadcn/ui components
- Lucide React icons

**Limitation**: The current bundled format is not maintainable for ongoing development.

## 📁 Project Structure (Planned)

```
sydney-property-calculator/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui base components
│   │   ├── PropertyDetailsCard.tsx
│   │   ├── MortgageCalculator.tsx
│   │   ├── StampDutyCalculator.tsx
│   │   ├── StampDutyRecovery.tsx
│   │   ├── WealthProjection.tsx
│   │   ├── InterestRateScenarios.tsx
│   │   └── SummaryExport.tsx
│   ├── hooks/
│   │   ├── useMortgageCalculations.ts
│   │   ├── useStampDuty.ts
│   │   └── usePropertyProjections.ts
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── mortgage.ts
│   │   │   ├── stampDuty.ts
│   │   │   ├── lmi.ts
│   │   │   └── projections.ts
│   │   └── utils.ts
│   ├── constants/
│   │   └── nswRates.ts           # NSW stamp duty tiers, rates
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── tests/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation (Coming Soon)
```bash
# Clone the repository
git clone <repo-url>
cd sydney-property-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📊 NSW Stamp Duty Rates (2024-2025)

| Property Value | Rate |
|---------------|------|
| $0 - $16,000 | 1.25% |
| $16,001 - $35,000 | $200 + 1.5% of excess |
| $35,001 - $93,000 | $485 + 1.75% of excess |
| $93,001 - $351,000 | $1,500 + 3.5% of excess |
| $351,001 - $1,168,000 | $10,530 + 4.5% of excess |
| $1,168,001+ | $47,295 + 5.5% of excess |

*First home buyer concessions and exemptions available - see PRD for details*

## 🤝 Contributing

This project is in active development. See [ROADMAP.md](./docs/ROADMAP.md) for planned features.

## 📝 License

MIT License - feel free to use and modify.

---

**Note**: This calculator is for educational purposes. Always consult financial professionals for investment decisions.

