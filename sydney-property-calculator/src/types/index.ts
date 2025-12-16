export interface PropertyInputs {
  propertyPrice: number;
  availableFunds: number;
  offsetAmount: number;
  depositAmount: number; // Manual override, otherwise auto-calculated
  interestRate: number;
  loanTermYears: number;
  isFirstHomeBuyer: boolean;
  householdIncome: number; // Monthly household income
}

export interface MortgageResults {
  loanAmount: number; // Can be negative if overfunded
  autoCalculatedDeposit: number;
  effectiveDeposit: number;
  depositPercent: number;
  lvr: number;
  monthlyRepayment: number;
  weeklyRepayment: number;
  percentOfIncome: number;
  totalInterest: number;
  totalRepayments: number;
  firstYearInterest: number;
  firstYearPrincipal: number;
}

export interface StampDutyResults {
  baseStampDuty: number;
  finalStampDuty: number;
  fhbDiscount: number;
  isFHBExempt: boolean;
}

export interface BuyingCosts {
  stampDuty: number;
  conveyancing: number;
  buildingInspection: number;
  loanEstablishmentFee: number;
  totalCosts: number;
  totalUpfrontRequired: number;
  costsAsPercentOfPrice: number;
  stampDutyRateEffective: number;
}

export interface StampDutyRecovery {
  monthsToRecover: number;
  yearsToRecover: number;
  propertyValueAtRecovery: number;
  newStampDutyAtRecovery: number;
}

export interface InterestRateScenario {
  id: string;
  name: string;
  description: string;
  rate: number;
}

export interface FiveYearProjection {
  propertyValue: number;
  remainingLoan: number;
  equity: number;
  interestPaid: number;
  totalInvested: number;
  netWealthPosition: number;
  returnPercentage: number;
}

export interface GrowthScenario {
  growthRate: number;
  label: string;
  projection: FiveYearProjection;
}
