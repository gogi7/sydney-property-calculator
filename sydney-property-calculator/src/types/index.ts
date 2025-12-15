export interface PropertyInputs {
  propertyPrice: number;
  totalSavings: number;
  offsetAmount: number;
  depositPercent: number;
  interestRate: number;
  loanTermYears: number;
  isFirstHomeBuyer: boolean;
  appreciationRate: number;
}

export interface MortgageResults {
  loanAmount: number;
  lvr: number;
  monthlyRepayment: number;
  fortnightlyRepayment: number;
  totalInterest: number;
  totalRepayments: number;
}

export interface StampDutyResults {
  baseStampDuty: number;
  finalStampDuty: number;
  fhbDiscount: number;
  isFHBExempt: boolean;
}

export interface LMIResults {
  lmiRequired: boolean;
  lmiAmount: number;
  lmiPercentage: number;
}

export interface BuyingCosts {
  stampDuty: number;
  lmi: number;
  conveyancing: number;
  buildingInspection: number;
  pestInspection: number;
  loanApplicationFee: number;
  titleRegistration: number;
  totalCosts: number;
  totalFundsRequired: number;
  remainingAfterPurchase: number;
}

export interface StampDutyRecovery {
  monthsToRecover: number;
  yearsToRecover: number;
  propertyValueAtRecovery: number;
  newStampDutyAtRecovery: number;
}

export interface RateScenario {
  rate: number;
  rateChange: number;
  monthlyRepayment: number;
  monthlyDifference: number;
  totalInterest: number;
}

export interface WealthProjection {
  year: number;
  propertyValue: number;
  loanBalance: number;
  equity: number;
  totalPaid: number;
}

