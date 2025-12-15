# Product Requirements Document (PRD)
## Sydney Mortgage & Property Investment Calculator

**Version**: 1.0  
**Last Updated**: December 2024  
**Status**: Active Development

---

## 1. Executive Summary

### 1.1 Vision
Build the most comprehensive, accurate, and user-friendly property investment calculator for the Sydney/NSW market. Enable users to make informed decisions about property purchases by providing detailed financial projections, cost breakdowns, and scenario comparisons.

### 1.2 Problem Statement
Property buyers in Sydney face complex financial decisions involving:
- High stamp duty costs (often $40,000+)
- LMI requirements for <20% deposits
- Volatile interest rates
- Understanding long-term wealth implications

Existing calculators are either too simple or don't account for NSW-specific regulations.

### 1.3 Target Users
1. **First Home Buyers** - Need FHB grant/concession calculations
2. **Property Investors** - Need rental yield and investment projections
3. **Upgraders** - Comparing sell+buy scenarios
4. **Financial Advisors** - Client scenario modeling

---

## 2. Core Features (MVP)

### 2.1 Property Details Input
| Field | Type | Validation |
|-------|------|------------|
| Property Price | Currency | $100,000 - $20,000,000 |
| Total Savings | Currency | $0 - $10,000,000 |
| Offset Account Amount | Currency | ≤ Total Savings |
| Deposit Percentage | Slider | 5% - 100% |
| First Home Buyer | Toggle | Yes/No |

### 2.2 Stamp Duty Calculator
**NSW Owner-Occupier Rates (2024-2025)**
```
$0 - $16,000:            1.25%
$16,001 - $35,000:       $200 + 1.5% of excess over $16,000
$35,001 - $93,000:       $485 + 1.75% of excess over $35,000
$93,001 - $351,000:      $1,500 + 3.5% of excess over $93,000
$351,001 - $1,168,000:   $10,530 + 4.5% of excess over $351,000
$1,168,001+:             $47,295 + 5.5% of excess over $1,168,000
```

**First Home Buyer Concessions**
- Full exemption: Properties ≤ $800,000
- Sliding scale: $800,001 - $1,000,000
- No concession: > $1,000,000

### 2.3 Mortgage Calculations
- **P&I Repayments**: Principal + Interest
- **Interest Only**: Optional mode
- **Frequency**: Monthly, Fortnightly, Weekly
- **Offset Impact**: Reduce interest based on offset balance

**Formula (P&I)**:
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
Where:
  M = Monthly payment
  P = Principal (loan amount)
  r = Monthly interest rate
  n = Number of payments
```

### 2.4 LMI Calculator
Lender's Mortgage Insurance applies when LVR > 80%

| LVR Range | Approximate LMI % |
|-----------|-------------------|
| 80.01% - 85% | 0.5% - 1.0% |
| 85.01% - 90% | 1.0% - 2.0% |
| 90.01% - 95% | 2.0% - 4.0% |

*Note: Actual LMI varies by lender. Use as estimate only.*

### 2.5 Total Buying Costs Breakdown
- Stamp Duty
- LMI (if applicable)
- Conveyancing ($1,500 - $3,000 estimate)
- Building & Pest Inspection ($500 - $1,000)
- Loan Application Fees (~$500)
- Title Registration (~$150)
- **Total Required Funds**

### 2.6 Stamp Duty Recovery Analysis
Calculate how long to recover stamp duty through appreciation:
- Configurable appreciation rate (default 5% p.a.)
- Break-even timeline in months/years
- Property value at recovery point
- Comparison with new stamp duty at recovered value

### 2.7 Interest Rate Scenarios
Model impact of rate changes:
- Current rate
- +0.5%, +1.0%, +2.0%
- -0.5%, -1.0%

Display: Monthly repayment change, total interest difference

### 2.8 Wealth Projection
10-year projections showing:
- Property value growth
- Loan balance reduction
- Equity accumulation
- Net position comparison

---

## 3. Future Features (Roadmap)

### Phase 2 - Enhanced Calculations
- [ ] Investment property mode (different stamp duty rates)
- [ ] Rental yield calculator
- [ ] Negative gearing tax benefits
- [ ] Capital gains tax projections
- [ ] Compare buy vs rent scenarios

### Phase 3 - Multi-Property
- [ ] Portfolio view for multiple properties
- [ ] Cross-collateralization modeling
- [ ] Total debt service ratio (DSR)

### Phase 4 - Personalization
- [ ] Save/load scenarios
- [ ] Account system
- [ ] Shareable calculation links
- [ ] PDF report export

### Phase 5 - Market Integration
- [ ] Live interest rate feeds
- [ ] Suburb median price lookups
- [ ] Historical appreciation data

---

## 4. Technical Requirements

### 4.1 Architecture Decision
**Recommendation: Convert to Vite + React + TypeScript**

| Approach | Pros | Cons |
|----------|------|------|
| Keep HTML Artifact | Simple, no build | Unmaintainable, can't test |
| React SPA (Vite) | Modern, testable, scalable | Setup overhead |
| Next.js | SSR, SEO, routing | Overkill for calculator |

**Decision**: Vite + React + TypeScript + TailwindCSS

### 4.2 Tech Stack
```
Frontend:
- React 18
- TypeScript
- TailwindCSS
- shadcn/ui components
- Recharts (for visualizations)
- React Hook Form + Zod

Build & Dev:
- Vite
- ESLint + Prettier
- Vitest (testing)

Deployment:
- Vercel / Netlify (static)
- No backend required initially
```

### 4.3 Browser Support
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### 4.4 Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

---

## 5. Design Requirements

### 5.1 Design Principles
1. **Clarity** - Clear labels, instant feedback
2. **Progressive Disclosure** - Show advanced options on demand
3. **Mobile-First** - 60%+ users on mobile
4. **Accessibility** - WCAG 2.1 AA compliant

### 5.2 Layout Structure
```
┌─────────────────────────────────────────┐
│           Header / Title                │
├─────────────────┬───────────────────────┤
│                 │                       │
│  Input Panel    │   Results Panel       │
│  (Property      │   (Calculations       │
│   Details)      │    Summary)           │
│                 │                       │
├─────────────────┴───────────────────────┤
│           Detailed Breakdowns           │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │Stamp    │ │Interest │ │Wealth   │   │
│  │Duty     │ │Rates    │ │Projec   │   │
│  └─────────┘ └─────────┘ └─────────┘   │
└─────────────────────────────────────────┘
```

### 5.3 Color Scheme
- Primary: Blue (#2563EB) - Trust, finance
- Success: Green (#16A34A) - Positive outcomes
- Warning: Amber (#D97706) - Caution items
- Background: Slate gradients

---

## 6. Success Metrics

### 6.1 Usage Metrics
- Monthly active users
- Calculations per session
- Feature usage heatmap
- Mobile vs desktop ratio

### 6.2 Quality Metrics
- Zero critical calculation errors
- Sub-second calculation response
- <1% error rate

---

## 7. Constraints & Assumptions

### 7.1 Constraints
- NSW-focused initially (not other states)
- No real-time bank rate integration (Phase 5)
- No user accounts initially (Phase 4)
- Static deployment (no server-side)

### 7.2 Assumptions
- Users have basic financial literacy
- Owner-occupier is default (investor mode future)
- Current interest rates as baseline
- Standard loan terms (25-30 years)

---

## 8. Glossary

| Term | Definition |
|------|------------|
| LVR | Loan-to-Value Ratio |
| LMI | Lender's Mortgage Insurance |
| P&I | Principal & Interest |
| FHB | First Home Buyer |
| Offset | Account that reduces loan interest |
| Stamp Duty | State tax on property transfer |

---

## Appendix A: NSW Government References

- [NSW Stamp Duty Rates](https://www.revenue.nsw.gov.au/taxes-duties-levies-royalties/transfer-duty)
- [First Home Buyer Assistance](https://www.revenue.nsw.gov.au/grants-schemes/first-home-buyer)
- [Property Tax Reform](https://www.nsw.gov.au/housing-and-construction/first-home-buyer-choice)

