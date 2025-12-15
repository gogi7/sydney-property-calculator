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

// LMI Rate Tiers (approximate - varies by lender)
export const LMI_TIERS = [
  { maxLvr: 80, rate: 0 },
  { maxLvr: 85, rate: 0.008 },
  { maxLvr: 90, rate: 0.015 },
  { maxLvr: 95, rate: 0.030 },
  { maxLvr: 100, rate: 0.045 },
];

// Buying Costs Estimates
export const BUYING_COSTS = {
  conveyancing: 2000,
  buildingInspection: 500,
  pestInspection: 300,
  loanApplicationFee: 500,
  titleRegistration: 150,
};

// Default Values
export const DEFAULT_VALUES = {
  propertyPrice: 1200000,
  totalSavings: 300000,
  offsetAmount: 50000,
  depositPercent: 20,
  interestRate: 6.5,
  loanTermYears: 30,
  isFirstHomeBuyer: false,
  appreciationRate: 5,
};

// Rate Scenarios to Model
export const RATE_SCENARIOS = [-1.0, -0.5, 0, 0.5, 1.0, 2.0];

