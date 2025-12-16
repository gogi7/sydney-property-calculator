# Sydney Property Calculator

A comprehensive property investment calculator tailored for the Sydney/NSW real estate market. Calculate mortgage repayments, buying costs, stamp duty, and 5-year wealth projections.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Version](https://img.shields.io/badge/version-0.2.0-blue)

## 🏠 Key Features

### Auto-Calculated Deposit System
- **Unique approach**: Deposit = Available Funds - Buying Costs
- Can handle "over-funded" scenarios (deposit > property price)
- Negative loan amounts when you have excess cash
- Manual deposit override available

### Comprehensive NSW Stamp Duty
- Accurate tiered NSW owner-occupier rates (2024-2025)
- First Home Buyer concessions (full exemption ≤ $800k)
- Sliding scale for $800k-$1M properties
- Effective rate calculation

### Mortgage Analysis
- Monthly & weekly repayment calculations
- Offset account impact on interest
- Affordability metrics (% of household income)
- First year interest/principal breakdown
- Visual split of interest vs principal

### 5-Year Wealth Projections
- **4 Interest Rate Scenarios:**
  - Unchanged (current rate)
  - Cut to 3.5%
  - Cut to 3%, bounce to 5%
  - Raise to 7%

- **5 Property Growth Scenarios:**
  - +7% Annual Growth
  - +5% Annual Growth
  - +1% Annual Growth
  - -2% Annual Decline
  - -5% Annual Decline

- **Comprehensive Metrics:**
  - Property value at year 5
  - Remaining loan balance
  - Your equity
  - Total invested (upfront + all repayments)
  - Net wealth position
  - Return percentage

### Stamp Duty Recovery
- Time to recover stamp duty through appreciation
- Property value at recovery point
- New stamp duty if buying at that price

### Summary Export
- Copy complete calculation summary
- Shareable text format
- All key metrics included

## 📊 Calculation Logic

### Core Formula: Auto-Calculated Deposit
```
Deposit = Available Funds - Buying Costs

Example:
Available Funds: $1,170,000
Buying Costs: $33,935
= Auto-Calculated Deposit: $1,136,065

Loan Amount = Property Price - Deposit
= $800,000 - $1,136,065
= -$336,065 (Negative = No loan needed!)
```

### Buying Costs
- NSW Stamp Duty (tiered rates)
- Legal & Conveyancing: $2,000
- Building Inspection: $600
- Loan Establishment Fee: $600

### Monthly Repayment (P&I)
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]

Where:
  M = Monthly payment
  P = Loan - Offset Balance
  r = Monthly interest rate
  n = Number of payments
```

### Net Wealth Position (5-Year)
```
Total Invested = Available Funds + (Monthly Repayment × 60)
Equity = Property Value - Remaining Loan
Net Position = Equity - Total Invested
Return % = (Net Position / Total Invested) × 100
```

This shows **actual wealth creation**, not just equity growth.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
cd sydney-property-calculator
npm install
```

### Development
```bash
npm run dev
```

Visit http://localhost:5173

### Build for Production
```bash
npm run build
```

## 🛠️ Tech Stack

- **Vite** - Lightning fast build tool
- **React 18** - UI framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling
- **Zustand** - State management
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📁 Project Structure

```
sydney-property-calculator/
├── src/
│   ├── components/
│   │   ├── ui/                      # Base UI components
│   │   ├── PropertyForm.tsx         # Input form
│   │   ├── MortgageCard.tsx         # Repayment calculations
│   │   ├── BuyingCostsCard.tsx      # Cost breakdown
│   │   ├── StampDutyCard.tsx        # Stamp duty details
│   │   ├── StampDutyRecoveryCard.tsx # Recovery analysis
│   │   ├── FiveYearOutlookCard.tsx  # Wealth projections
│   │   └── SummaryExport.tsx        # Export functionality
│   ├── hooks/
│   │   └── usePropertyStore.ts      # Zustand store
│   ├── lib/
│   │   ├── calculations/
│   │   │   ├── mortgage.ts          # Loan calculations
│   │   │   ├── stampDuty.ts         # NSW stamp duty
│   │   │   ├── buyingCosts.ts       # Cost aggregation
│   │   │   └── projections.ts       # 5-year forecasts
│   │   ├── formatters/
│   │   │   └── currency.ts          # Number formatting
│   │   └── utils.ts                 # Utility functions
│   ├── constants/
│   │   └── index.ts                 # NSW rates & defaults
│   ├── types/
│   │   └── index.ts                 # TypeScript types
│   ├── App.tsx                      # Main app component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── LOGIC_DOCUMENTATION.md           # Detailed logic guide
└── package.json
```

## 📊 Default Values

- **Property Price:** $800,000
- **Available Funds:** $1,170,000
- **Offset Account:** $60,000
- **Interest Rate:** 5.34% (CBA current rate)
- **Loan Term:** 30 years
- **Household Income:** $14,500/month

### With Defaults You Get:
- Stamp Duty: $30,735
- Total Buying Costs: $33,935
- Auto-Calculated Deposit: $1,136,065 (142.0%)
- **Loan Amount: -$336,065** *(No loan needed!)*

## 🎯 Use Cases

### 1. Standard Home Purchase
Set available funds to match your savings, calculator shows required repayments and affordability.

### 2. Overfunded Purchase
When available funds > property price + costs, see excess cash position.

### 3. First Home Buyer
Toggle FHB option to see stamp duty savings (can be $30k+!)

### 4. Scenario Planning
Compare different interest rates and property growth scenarios for 5-year outlook.

### 5. Affordability Check
Enter household income to see if repayments are within safe range (<30%).

## 📈 NSW Stamp Duty Rates (2024-2025)

| Property Value | Rate |
|---------------|------|
| $0 - $16,000 | 1.25% |
| $16,001 - $35,000 | $200 + 1.5% of excess |
| $35,001 - $93,000 | $485 + 1.75% of excess |
| $93,001 - $351,000 | $1,500 + 3.5% of excess |
| $351,001 - $1,168,000 | $10,530 + 4.5% of excess |
| $1,168,001+ | $47,295 + 5.5% of excess |

**First Home Buyer Concessions:**
- ≤ $800,000: Full exemption
- $800,001 - $1,000,000: Sliding scale discount
- > $1,000,000: No concession

## ⚠️ Important Notes

### Included in Calculations
✅ NSW stamp duty (owner-occupier)
✅ Standard buying costs
✅ P&I mortgage repayments
✅ Offset account impact
✅ Property appreciation/depreciation
✅ First Home Buyer concessions
✅ Household income affordability

### NOT Included
❌ LMI (Lender's Mortgage Insurance)
❌ Investment property calculations
❌ Rental income/yield
❌ Ongoing costs (rates, insurance, maintenance)
❌ Tax implications (CGT, depreciation)
❌ Opportunity cost of capital

### Assumptions
- Owner-occupier purchase (not investment)
- Principal & Interest (not interest-only)
- NSW property (not other states)
- 30-year standard loan term
- Fixed household income
- Consistent property growth rates
- No extra repayments or refinancing

## 🔧 Development

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

### Type Check
```bash
npm run type-check
```

## 📝 Documentation

See `LOGIC_DOCUMENTATION.md` for detailed calculation logic, formulas, test cases, and implementation notes.

## 🤝 Contributing

This is an educational project. Suggestions and improvements welcome!

## 📜 License

MIT License - feel free to use and modify.

## ⚠️ Disclaimer

**This calculator is for educational purposes only.** 

Always consult:
- Licensed financial advisors for investment decisions
- Mortgage brokers for loan products
- Conveyancers/solicitors for legal matters
- Tax professionals for tax implications

Calculations are estimates based on standard formulas and may not reflect actual loan offers or outcomes.

---

**Version:** 0.2.0  
**Last Updated:** December 2024  
**NSW Rates:** 2024-2025 Financial Year
