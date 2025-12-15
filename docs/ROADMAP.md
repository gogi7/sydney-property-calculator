# Development Roadmap
## Sydney Mortgage Calculator

---

## Overview

This roadmap outlines the transformation from a Claude Artifact (bundled HTML) to a maintainable, extensible React application.

```
┌──────────────────────────────────────────────────────────────────┐
│                         ROADMAP TIMELINE                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Phase 0          Phase 1          Phase 2          Phase 3     │
│  Foundation       Core Features    Enhanced Calc    Polish      │
│  [Week 1-2]       [Week 3-4]       [Week 5-6]       [Week 7-8]  │
│                                                                  │
│  • Project setup  • Property form  • Rate scenarios • Testing   │
│  • Architecture   • Stamp duty     • Projections    • A11y      │
│  • Base UI        • Mortgage calc  • Charts         • Deploy    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Foundation (Week 1-2)
**Goal**: Set up proper development environment

### Tasks

- [ ] **P0-1**: Initialize Vite + React + TypeScript project
  ```bash
  npm create vite@latest . -- --template react-ts
  ```

- [ ] **P0-2**: Configure TailwindCSS
  ```bash
  npm install -D tailwindcss postcss autoprefixer
  npx tailwindcss init -p
  ```

- [ ] **P0-3**: Set up shadcn/ui
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add button card input slider label tabs badge tooltip
  ```

- [ ] **P0-4**: Install core dependencies
  ```bash
  npm install zustand lucide-react
  npm install -D vitest @testing-library/react
  ```

- [ ] **P0-5**: Create folder structure (see ARCHITECTURE.md)

- [ ] **P0-6**: Set up ESLint + Prettier

- [ ] **P0-7**: Create TypeScript types
  ```typescript
  // types/index.ts
  export interface PropertyInputs {
    propertyPrice: number;
    totalSavings: number;
    offsetAmount: number;
    depositPercent: number;
    interestRate: number;
    loanTermYears: number;
    isFirstHomeBuyer: boolean;
  }
  ```

- [ ] **P0-8**: Create constants file with NSW rates

- [ ] **P0-9**: Archive original HTML artifact
  ```
  /archive/sydney-mortgage-calculator.original.html
  ```

### Deliverables
- [ ] Working dev server (`npm run dev`)
- [ ] Empty shell with header and basic layout
- [ ] TypeScript compiling without errors
- [ ] Git repository initialized

---

## Phase 1: Core Features (Week 3-4)
**Goal**: Replicate existing functionality from artifact

### 1.1 Calculation Library

- [ ] **P1-1**: Implement `lib/calculations/stampDuty.ts`
  - NSW tiered calculation
  - First Home Buyer exemptions
  - Foreign buyer surcharge (future)

- [ ] **P1-2**: Implement `lib/calculations/mortgage.ts`
  - P&I monthly repayment
  - Fortnightly/weekly conversion
  - Interest-only mode
  - Offset account impact

- [ ] **P1-3**: Implement `lib/calculations/lmi.ts`
  - LVR calculation
  - LMI estimation by tier

- [ ] **P1-4**: Implement `lib/calculations/buyingCosts.ts`
  - Conveyancing estimate
  - Inspections
  - Registration fees
  - Total funds required

- [ ] **P1-5**: Write unit tests for all calculations
  ```bash
  npm test -- --coverage
  ```

### 1.2 State Management

- [ ] **P1-6**: Create Zustand store
  ```typescript
  // hooks/usePropertyStore.ts
  export const usePropertyStore = create<PropertyStore>((set, get) => ({
    propertyPrice: 1000000,
    setPropertyPrice: (price) => set({ propertyPrice: price }),
    // ... etc
  }));
  ```

### 1.3 UI Components

- [ ] **P1-7**: Build `PropertyForm` component
  - Property price input (currency formatted)
  - Total savings input
  - Offset account input
  - Deposit percentage slider
  - FHB toggle switch

- [ ] **P1-8**: Build `MortgageCard` component
  - Monthly repayment display
  - Fortnightly option
  - Loan amount breakdown
  - Interest rate display

- [ ] **P1-9**: Build `StampDutyCard` component
  - Amount display
  - FHB discount indicator
  - Tier breakdown (expandable)

- [ ] **P1-10**: Build `BuyingCostsCard` component
  - Itemized list
  - Total required funds
  - Remaining savings after purchase

- [ ] **P1-11**: Build `SummaryPanel` component
  - Key figures overview
  - Copy to clipboard button

### Deliverables
- [ ] All core calculations working
- [ ] 100% test coverage on calculations
- [ ] Full input form functional
- [ ] Results display matching original artifact

---

## Phase 2: Enhanced Calculations (Week 5-6)
**Goal**: Add advanced analysis features

### 2.1 Stamp Duty Recovery Analysis

- [ ] **P2-1**: Implement `lib/calculations/stampDutyRecovery.ts`
  - Break-even timeline calculation
  - Property appreciation modeling
  - Comparison with new stamp duty at future values

- [ ] **P2-2**: Build `StampDutyRecoveryCard` component
  - Configurable appreciation rate slider
  - Timeline visualization
  - Recovery point details

### 2.2 Interest Rate Scenarios

- [ ] **P2-3**: Implement `lib/calculations/rateScenarios.ts`
  - Multiple rate change scenarios
  - Monthly payment impact
  - Total interest difference

- [ ] **P2-4**: Build `RateScenariosCard` component
  - Scenario comparison table
  - Visual indicator for current vs scenarios

### 2.3 Wealth Projections

- [ ] **P2-5**: Implement `lib/calculations/wealthProjection.ts`
  - Year-by-year projections
  - Equity accumulation
  - Net position tracking

- [ ] **P2-6**: Build `WealthProjectionCard` component
  - 10-year projection table
  - Growth rate scenarios

### 2.4 Data Visualization

- [ ] **P2-7**: Install and configure Recharts
  ```bash
  npm install recharts
  ```

- [ ] **P2-8**: Add equity growth chart

- [ ] **P2-9**: Add repayment breakdown pie chart

### Deliverables
- [ ] Stamp duty recovery analysis working
- [ ] Interest rate scenarios functional
- [ ] Wealth projection with charts
- [ ] All features matching original artifact

---

## Phase 3: Polish & Deploy (Week 7-8)
**Goal**: Production-ready application

### 3.1 Testing

- [ ] **P3-1**: Add component tests
  - Form validation
  - Store integration
  - Edge cases (0 values, max values)

- [ ] **P3-2**: Add E2E tests (optional)
  ```bash
  npm install -D playwright
  ```

### 3.2 Accessibility

- [ ] **P3-3**: Audit with axe-core
- [ ] **P3-4**: Add ARIA labels
- [ ] **P3-5**: Keyboard navigation
- [ ] **P3-6**: Screen reader testing

### 3.3 Performance

- [ ] **P3-7**: Lighthouse audit (target: 90+)
- [ ] **P3-8**: Lazy load charts
- [ ] **P3-9**: Optimize bundle size

### 3.4 Mobile Optimization

- [ ] **P3-10**: Test on iOS Safari
- [ ] **P3-11**: Test on Android Chrome
- [ ] **P3-12**: Touch-friendly sliders

### 3.5 Deployment

- [ ] **P3-13**: Set up Vercel project
- [ ] **P3-14**: Configure domain (optional)
- [ ] **P3-15**: Set up CI/CD (GitHub Actions)
- [ ] **P3-16**: Production deployment

### Deliverables
- [ ] 90+ Lighthouse score
- [ ] WCAG 2.1 AA compliant
- [ ] Live production URL
- [ ] CI/CD pipeline working

---

## Future Phases (Backlog)

### Phase 4: Investment Features
- [ ] Investment property mode (different stamp duty)
- [ ] Rental yield calculator
- [ ] Negative gearing tax benefits
- [ ] Capital gains tax projections

### Phase 5: Compare & Analyze
- [ ] Buy vs rent comparison
- [ ] Multiple property comparison
- [ ] Suburb data integration
- [ ] Historical price trends

### Phase 6: User Features
- [ ] Save/load calculations
- [ ] User accounts
- [ ] Shareable links
- [ ] PDF export

### Phase 7: Data Integration
- [ ] Live interest rate feeds
- [ ] Bank rate comparison
- [ ] Real estate API integration

---

## Feature Backlog (Prioritized)

### High Priority 🔴
| ID | Feature | Effort | Impact |
|----|---------|--------|--------|
| F1 | First Home Buyer grant calculator | Medium | High |
| F2 | Compare multiple interest rates | Low | High |
| F3 | PDF export of calculations | Medium | High |
| F4 | Mobile-responsive improvements | Low | High |

### Medium Priority 🟡
| ID | Feature | Effort | Impact |
|----|---------|--------|--------|
| F5 | Investment property mode | High | Medium |
| F6 | Rental yield calculator | Medium | Medium |
| F7 | Dark mode | Low | Medium |
| F8 | Keyboard shortcuts | Low | Medium |

### Low Priority 🟢
| ID | Feature | Effort | Impact |
|----|---------|--------|--------|
| F9 | Multi-language support | High | Low |
| F10 | User accounts | High | Low |
| F11 | Historical data charts | Medium | Low |

---

## Definition of Done

For each task to be considered complete:

- [ ] Code written and self-reviewed
- [ ] TypeScript compiles without errors
- [ ] Unit tests passing (if applicable)
- [ ] Manual testing completed
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Committed to git with descriptive message

---

## Sprint Planning Notes

### Sprint 1 (Week 1-2)
Focus: Foundation only. No features.

**Velocity estimate**: 20 story points

| Task | Story Points |
|------|-------------|
| P0-1 to P0-4 (Setup) | 5 |
| P0-5 to P0-6 (Structure) | 5 |
| P0-7 to P0-9 (Types/Constants) | 5 |
| Documentation updates | 5 |

### Sprint 2 (Week 3-4)
Focus: Core calculations and basic UI.

**Velocity estimate**: 30 story points

| Task | Story Points |
|------|-------------|
| Calculation library | 10 |
| Zustand store | 5 |
| UI components | 15 |

### Sprint 3 (Week 5-6)
Focus: Advanced features and charts.

**Velocity estimate**: 25 story points

### Sprint 4 (Week 7-8)
Focus: Polish, testing, deployment.

**Velocity estimate**: 20 story points

---

## How to Use This Roadmap

1. **Starting work**: Pick tasks from current phase
2. **Mark progress**: Check off tasks as completed
3. **Blocked?**: Document in comments, move to next task
4. **Completed phase?**: Review deliverables before proceeding
5. **Adding features**: Add to backlog with priority

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2024 | Initial roadmap created |

