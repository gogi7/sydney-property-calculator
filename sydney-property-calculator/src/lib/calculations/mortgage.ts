import type { MortgageResults } from '@/types';

/**
 * Calculate monthly P&I mortgage repayment
 */
export function calculateMonthlyRepayment(
  principal: number,
  annualRate: number,
  years: number,
  offsetBalance: number = 0
): number {
  if (principal <= 0 || years <= 0) return 0;
  
  const effectivePrincipal = Math.max(0, principal - offsetBalance);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = years * 12;
  
  if (monthlyRate === 0) {
    return effectivePrincipal / numPayments;
  }
  
  const factor = Math.pow(1 + monthlyRate, numPayments);
  return effectivePrincipal * (monthlyRate * factor) / (factor - 1);
}

/**
 * Convert monthly payment to fortnightly (52 weeks / 26 fortnights)
 * Paying fortnightly = extra month per year in payments
 */
export function monthlyToFortnightly(monthlyPayment: number): number {
  // Monthly * 12 / 26 fortnights per year
  return (monthlyPayment * 12) / 26;
}

/**
 * Calculate total interest over loan term
 */
export function calculateTotalInterest(
  principal: number,
  monthlyRepayment: number,
  years: number
): number {
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
  yearNumber: number
): number {
  if (yearNumber >= totalYears) return 0;
  if (yearNumber <= 0) return principal;
  
  const monthlyRate = annualRate / 100 / 12;
  const n = totalYears * 12;
  const p = yearNumber * 12; // payments made
  
  if (monthlyRate === 0) {
    return principal * (1 - yearNumber / totalYears);
  }
  
  const factor = Math.pow(1 + monthlyRate, n);
  const paidFactor = Math.pow(1 + monthlyRate, p);
  
  return principal * (factor - paidFactor) / (factor - 1);
}

/**
 * Full mortgage calculation
 */
export function calculateMortgage(
  propertyPrice: number,
  depositPercent: number,
  interestRate: number,
  loanTermYears: number,
  offsetBalance: number = 0
): MortgageResults {
  const depositAmount = propertyPrice * (depositPercent / 100);
  const loanAmount = propertyPrice - depositAmount;
  const lvr = calculateLVR(loanAmount, propertyPrice);
  
  const monthlyRepayment = calculateMonthlyRepayment(
    loanAmount,
    interestRate,
    loanTermYears,
    offsetBalance
  );
  
  const fortnightlyRepayment = monthlyToFortnightly(monthlyRepayment);
  const totalInterest = calculateTotalInterest(loanAmount - offsetBalance, monthlyRepayment, loanTermYears);
  const totalRepayments = monthlyRepayment * loanTermYears * 12;
  
  return {
    loanAmount,
    lvr,
    monthlyRepayment,
    fortnightlyRepayment,
    totalInterest,
    totalRepayments,
  };
}

