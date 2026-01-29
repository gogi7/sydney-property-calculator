import type { MortgageResults } from '@/types';

/**
 * Calculate monthly P&I mortgage repayment
 * Handles negative loans (when you have excess funds)
 */
export function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  years: number,
  offsetBalance: number = 0
): number {
  // If loan is negative or zero, no repayments
  if (principal <= 0) return 0;
  
  const effectivePrincipal = Math.max(0, principal - offsetBalance);
  
  // If offset covers entire loan
  if (effectivePrincipal <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return effectivePrincipal / numPayments;
  }
  
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return effectivePrincipal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Convert monthly payment to weekly (52 weeks per year)
 */
export function monthlyToWeekly(monthlyPayment: number): number {
  return (monthlyPayment * 12) / 52;
}

/**
 * Calculate first year interest and principal
 */
export function calculateFirstYearBreakdown(
  principal: number,
  annualRate: number,
  monthlyRepayment: number
): { interest: number; principal: number } {
  if (principal <= 0) return { interest: 0, principal: 0 };
  
  let remainingPrincipal = principal;
  let totalInterest = 0;
  const monthlyRate = annualRate / 100 / 12;
  
  for (let month = 0; month < 12; month++) {
    const interestPayment = remainingPrincipal * monthlyRate;
    const principalPayment = monthlyRepayment - interestPayment;
    
    totalInterest += interestPayment;
    remainingPrincipal -= principalPayment;
  }
  
  const totalPrincipal = (monthlyRepayment * 12) - totalInterest;
  
  return {
    interest: totalInterest,
    principal: totalPrincipal,
  };
}

/**
 * Calculate total interest over loan term
 */
export function calculateTotalInterest(
  principal: number,
  monthlyRepayment: number,
  years: number
): number {
  if (principal <= 0) return 0;
  const totalPayments = monthlyRepayment * years * 12;
  return Math.max(0, totalPayments - principal);
}

/**
 * Calculate LVR (Loan to Value Ratio)
 */
export function calculateLVR(loanAmount: number, propertyPrice: number): number {
  if (propertyPrice <= 0) return 0;
  return (loanAmount / propertyPrice) * 100;
}

/**
 * Calculate remaining loan balance at a given year
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  totalYears: number,
  yearNumber: number,
  offsetBalance: number = 0
): number {
  if (principal <= 0) return principal; // Return negative balance as-is
  if (yearNumber >= totalYears) return 0;
  if (yearNumber <= 0) return principal;
  
  const effectivePrincipal = Math.max(0, principal - offsetBalance);
  if (effectivePrincipal <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const n = totalYears * 12;
  const p = yearNumber * 12; // payments made
  
  if (monthlyRate === 0) {
    return effectivePrincipal * (1 - yearNumber / totalYears);
  }
  
  const factor = Math.pow(1 + monthlyRate, n);
  const paidFactor = Math.pow(1 + monthlyRate, p);
  
  return effectivePrincipal * (factor - paidFactor) / (factor - 1);
}

/**
 * Full mortgage calculation with auto-calculated deposit
 */
export function calculateMortgage(
  propertyPrice: number,
  availableFunds: number,
  buyingCosts: number,
  depositOverride: number,
  interestRate: number,
  loanTermYears: number,
  offsetBalance: number,
  householdIncome: number
): MortgageResults {
  // Auto-calculate deposit: Available funds - Buying costs
  const autoCalculatedDeposit = availableFunds - buyingCosts;
  
  // Use override if provided, otherwise use auto-calculated
  const effectiveDeposit = depositOverride > 0 ? depositOverride : autoCalculatedDeposit;
  
  // Loan amount can be negative!
  const loanAmount = propertyPrice - effectiveDeposit;
  
  const depositPercent = (effectiveDeposit / propertyPrice) * 100;
  const lvr = calculateLVR(Math.max(0, loanAmount), propertyPrice);
  
  const monthlyRepayment = calculateMonthlyRepayment(
    Math.max(0, loanAmount),
    interestRate,
    loanTermYears,
    offsetBalance
  );
  
  const weeklyRepayment = monthlyToWeekly(monthlyRepayment);
  const percentOfIncome = householdIncome > 0 ? (monthlyRepayment / householdIncome) * 100 : 0;
  
  const firstYear = calculateFirstYearBreakdown(
    Math.max(0, loanAmount),
    interestRate,
    monthlyRepayment
  );
  
  const totalInterest = calculateTotalInterest(
    Math.max(0, loanAmount) - offsetBalance,
    monthlyRepayment,
    loanTermYears
  );
  
  const totalRepayments = monthlyRepayment * loanTermYears * 12;
  
  return {
    loanAmount,
    autoCalculatedDeposit,
    effectiveDeposit,
    depositPercent,
    lvr,
    monthlyRepayment,
    weeklyRepayment,
    percentOfIncome,
    totalInterest,
    totalRepayments,
    firstYearInterest: firstYear.interest,
    firstYearPrincipal: firstYear.principal,
  };
}
