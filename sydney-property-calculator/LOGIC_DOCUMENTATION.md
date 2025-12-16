# Sydney Property Calculator - Logic Documentation

## Overview
This calculator matches the original app's logic for Australian property purchase analysis with NSW-specific calculations.

## Core Calculation Logic

### 1. Deposit Calculation (Auto-Calculated)
**Formula:**
```
Deposit = Available Funds - Buying Costs
```

**Example:**
- Available Funds: $1,170,000
- Buying Costs: $33,935
- **Auto-Calculated Deposit: $1,136,065**

**Important Notes:**
- Deposit is NOT entered by the user
- User can override if needed via "Deposit Override" field
- This can result in deposits > 100% of property price

### 2. Loan Amount Calculation
**Formula:**
```
Loan Amount = Property Price - Deposit
```

**Can Be Negative:**
When deposit exceeds property price, the loan amount becomes negative, indicating excess funds.

**Example:**
- Property Price: $800,000
- Deposit: $1,136,065
- **Loan Amount: -$336,065** (No loan needed, $336k excess)

### 3. Buying Costs Breakdown

#### NSW Stamp Duty
Uses tiered rate structure:
- $0 - $16,000: 1.25%
- $16,001 - $35,000: $200 + 1.5% of excess
- $35,001 - $93,000: $485 + 1.75% of excess
- $93,001 - $351,000: $1,500 + 3.5% of excess
- $351,001 - $1,168,000: $10,530 + 4.5% of excess
- $1,168,001+: $47,295 + 5.5% of excess

**First Home Buyer Concessions:**
- Full exemption: ≤ $800,000
- Sliding scale: $800,001 - $1,000,000
- No concession: > $1,000,000

#### Other Costs
- Legal & Conveyancing: $2,000
- Building Inspection: $600
- Loan Establishment Fee: $600

**Total Buying Costs = Stamp Duty + Conveyancing + Inspection + Loan Fee**

### 4. Mortgage Repayments

#### Monthly Payment (P&I)
**Formula:**
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]

Where:
  M = Monthly payment
  P = Loan amount (after offset)
  r = Monthly interest rate (annual / 12)
  n = Total payments (years * 12)
```

**Offset Account Impact:**
```
Effective Loan = Max(0, Loan Amount - Offset Balance)
```

#### Weekly Payment
```
Weekly = (Monthly * 12) / 52
```

#### Affordability Metrics
```
% of Income = (Monthly Repayment / Monthly Household Income) * 100
```

**Safe Range:** < 30% of gross household income

### 5. First Year Breakdown

Calculates month-by-month for first 12 months:

```
For each month:
  Interest Payment = Remaining Principal * Monthly Rate
  Principal Payment = Monthly Repayment - Interest Payment
  Remaining Principal -= Principal Payment
```

**Result:**
- First Year Interest = Sum of all interest payments (Year 1)
- First Year Principal = Sum of all principal payments (Year 1)
- Interest % = (Interest / Total Repayments) * 100

### 6. Five-Year Wealth Projections

#### Interest Rate Scenarios
1. **Unchanged (5.34%)**: Rate constant for 5 years
2. **Cut to 3.5%**: Rate drops and stays at 3.5%
3. **Cut to 3%, bounce to 5%**: 3% for 2 years, then 5% for 3 years
4. **Raise to 7%**: Rate increases to 7%

#### Property Growth Scenarios
- +7% Annual Growth
- +5% Annual Growth
- +1% Annual Growth
- -2% Annual Decline
- -5% Annual Decline

#### Projection Calculations

**Property Value (Year 5):**
```
Value = Initial Price * (1 + Growth Rate)^5
```

**Remaining Loan (Year 5):**
```
Uses standard amortization formula to calculate balance after 60 payments
```

**Equity:**
```
Equity = Property Value - Remaining Loan
```

**Total Invested:**
```
Total Invested = Available Funds (upfront) + (Monthly Repayment * 60)
```

**Net Wealth Position:**
```
Net Position = Equity - Total Invested
Return % = (Net Position / Total Invested) * 100
```

**Key Insight:** This shows actual wealth creation, not just equity. It accounts for ALL money put into the property.

### 7. Stamp Duty Recovery

**Formula:**
```
Months Until Recovered = Find M where:
  Property Price * (1 + Monthly Growth Rate)^M - Property Price ≥ Stamp Duty
```

Shows how long until property appreciation covers the stamp duty cost.

## Default Values

### Input Defaults
- Property Price: $800,000
- Available Funds: $1,170,000
- Offset Account: $60,000
- Interest Rate: 5.34% (CBA current rate)
- Loan Term: 30 years
- Household Income: $14,500/month
- First Home Buyer: No

### Expected Results (Default Values)
- Stamp Duty: $30,735
- Total Buying Costs: $33,935
- Auto-Calculated Deposit: $1,136,065
- Loan Amount: -$336,065 (No loan)
- Deposit %: 142.0%

## Special Cases

### Case 1: Negative Loan (Overfunded)
When deposit > property price:
- No repayments required
- No interest calculations
- Shows "Excess Funds" instead of loan
- 5-year projections show negative loan remaining (cash surplus)

### Case 2: Large Offset Balance
When offset ≥ loan amount:
- Effective loan becomes $0
- No repayments required
- Still track property growth

### Case 3: First Home Buyer
Automatically applies NSW stamp duty concessions:
- Full exemption for properties ≤ $800k
- Partial exemption $800k-$1M (sliding scale)
- Shows discount in buying costs breakdown

## Assumptions & Limitations

### Included
✅ NSW stamp duty (owner-occupier rates)
✅ Standard buying costs (legal, inspections, fees)
✅ P&I mortgage repayments
✅ Offset account impact
✅ Property value appreciation/depreciation
✅ First Home Buyer concessions
✅ Multiple interest rate scenarios
✅ Household income affordability

### Not Included
❌ LMI (Lender's Mortgage Insurance)
❌ Investor property rates (different stamp duty)
❌ Rental income/yield
❌ Ongoing costs (rates, insurance, maintenance)
❌ Tax implications (CGT, depreciation)
❌ Opportunity cost of capital
❌ Inflation adjustments
❌ Variable principal payments
❌ Extra repayments
❌ Loan redraw facilities

## UI Components

### Input Fields (Not Sliders)
- Property Price
- Available Funds
- Offset Account Balance
- Deposit Override (optional)
- Interest Rate
- Loan Term (years)
- Monthly Household Income

### Tabs
1. **Repayments** - Mortgage calculations, affordability, first year breakdown
2. **Buying Costs** - Complete cost breakdown
3. **Stamp Duty Recovery** - Time to recover via appreciation
4. **5-Year Outlook** - Multiple scenario projections

## Validation Rules

### Property Price
- Min: $100,000
- Max: $20,000,000
- Used for: All calculations

### Available Funds
- Min: $0
- Max: $50,000,000
- Used for: Deposit calculation

### Offset Account
- Min: $0
- Max: Available Funds
- Used for: Reducing effective loan

### Interest Rate
- Min: 0%
- Max: 20%
- Precision: 0.01% (basis points)

### Loan Term
- Min: 1 year
- Max: 30 years
- Integer values only

### Household Income
- Min: $0
- Used for: Affordability percentage only
- Does not affect loan calculations

## Testing Examples

### Test Case 1: Original App Scenario
**Inputs:**
- Property: $800,000
- Available Funds: $1,170,000
- Offset: $60,000
- Interest: 5.34%
- Term: 30 years
- Income: $14,500/month

**Expected Outputs:**
- Stamp Duty: $30,735
- Buying Costs: $33,935
- Deposit: $1,136,065 (142.0%)
- Loan: -$336,065 (negative/no loan)
- No repayments

### Test Case 2: Standard Purchase
**Inputs:**
- Property: $1,200,000
- Available Funds: $300,000
- Offset: $30,000
- Interest: 6.5%
- Term: 30 years
- Income: $15,000/month

**Expected Outputs:**
- Stamp Duty: ~$49,055
- Buying Costs: ~$52,255
- Deposit: ~$247,745 (20.6%)
- Loan: ~$952,255
- Monthly: ~$5,707
- % of Income: ~38% (above safe range)

### Test Case 3: First Home Buyer
**Inputs:**
- Property: $750,000
- Available Funds: $200,000
- FHB: Yes
- Interest: 5.34%
- Term: 30 years

**Expected Outputs:**
- Stamp Duty: $0 (FHB exempt)
- Buying Costs: $3,200
- Deposit: $196,800
- Loan: $553,200

## Change Log

### Version 0.2.0 (Current)
- Changed from "Total Savings" to "Available Funds"
- Removed deposit % slider, made deposit auto-calculated
- Added deposit override field
- Removed LMI calculations
- Changed from 10-year to 5-year projections
- Added multiple interest rate scenarios for projections
- Added property growth scenarios (+7%, +5%, +1%, -2%, -5%)
- Changed to "Total Invested" concept (upfront + repayments)
- Added "Net Wealth Position" calculation
- Replaced sliders with input fields
- Added weekly repayment calculations
- Added first year interest/principal breakdown
- Added household income affordability metrics
- Updated buying costs breakdown
- Simplified UI to 4 tabs

### Version 0.1.0 (Original)
- Basic stamp duty calculator
- 10-year wealth projections
- Interest rate scenarios
- Slider-based inputs
- LMI calculations included

