// NSW Stamp Duty Tiers (2024-2025) - Owner Occupier Rates
export const NSW_STAMP_DUTY_TIERS = [
  { threshold: 0, rate: 0.0125, base: 0 },
  { threshold: 16000, rate: 0.015, base: 200 },
  { threshold: 35000, rate: 0.0175, base: 485 },
  { threshold: 93000, rate: 0.035, base: 1500 },
  { threshold: 351000, rate: 0.045, base: 10530 },
  { threshold: 1168000, rate: 0.055, base: 47295 },
];

// First Home Buyer Thresholds
export const FHB_FULL_EXEMPTION_THRESHOLD = 800000;
export const FHB_PARTIAL_EXEMPTION_MAX = 1000000;

// Buying Costs
export const BUYING_COSTS = {
  conveyancing: 2000,
  buildingInspection: 600,
  loanEstablishmentFee: 600,
};

// Default Values
export const DEFAULT_VALUES = {
  propertyPrice: 1800000,
  availableFunds: 1170000,
  offsetAmount: 60000,
  depositAmount: 0, // 0 means auto-calculate
  interestRate: 5.34, // CBA current rate
  loanTermYears: 30,
  isFirstHomeBuyer: false,
  householdIncome: 14500, // Monthly
};

// Interest Rate Scenarios for 5-year projections
export const INTEREST_RATE_SCENARIOS = [
  {
    id: 'unchanged',
    name: 'Unchanged (5.34%)',
    description: 'Rate stays at current 5.34% for entire 5 years',
    rate: 5.34,
  },
  {
    id: 'cut_35',
    name: 'Cut to 3.5%',
    description: 'Rate drops to 3.5% and remains there for 5 years',
    rate: 3.5,
  },
  {
    id: 'cut_bounce',
    name: 'Cut to 3%, then bounce to 5%',
    description: 'Rate at 3% for 2 years, then bounces to 5% for remaining 3 years',
    rate: 3.0, // Simplified - actual calculation would need year-by-year
  },
  {
    id: 'raise_7',
    name: 'Raise to 7%',
    description: 'Rate increases to 7% and stays there for 5 years',
    rate: 7.0,
  },
];

// Property Growth Scenarios
export const GROWTH_SCENARIOS = [
  { rate: 0.07, label: '+7% Annual Growth' },
  { rate: 0.05, label: '+5% Annual Growth' },
  { rate: 0.01, label: '+1% Annual Growth' },
  { rate: -0.02, label: '-2% Annual Growth' },
  { rate: -0.05, label: '-5% Annual Growth' },
];
