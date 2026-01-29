import type { StampDutyRecovery, FiveYearProjection } from '@/types';
import { calculateBaseStampDuty } from './stampDuty';
import { calculateRemainingBalance } from './mortgage';

/**
 * Calculate how long to recover stamp duty through property appreciation
 */
export function calculateStampDutyRecovery(
  propertyPrice: number,
  stampDuty: number,
  annualAppreciationRate: number
): StampDutyRecovery {
  if (stampDuty <= 0 || annualAppreciationRate <= 0) {
    return {
      monthsToRecover: 0,
      yearsToRecover: 0,
      propertyValueAtRecovery: propertyPrice,
      newStampDutyAtRecovery: stampDuty,
    };
  }
  
  const monthlyRate = annualAppreciationRate / 100 / 12;
  let currentValue = propertyPrice;
  let months = 0;
  const maxMonths = 360; // 30 years max
  
  while (currentValue - propertyPrice < stampDuty && months < maxMonths) {
    currentValue *= (1 + monthlyRate);
    months++;
  }
  
  const propertyValueAtRecovery = Math.round(currentValue);
  const newStampDutyAtRecovery = calculateBaseStampDuty(propertyValueAtRecovery);
  
  return {
    monthsToRecover: months,
    yearsToRecover: Math.round(months / 12 * 10) / 10,
    propertyValueAtRecovery,
    newStampDutyAtRecovery: Math.round(newStampDutyAtRecovery),
  };
}

/**
 * Calculate 5-year wealth projection
 * Total Invested = Upfront costs (available funds) + All repayments made
 * Net Position = Equity - Total Invested
 */
export function calculateFiveYearProjection(
  propertyPrice: number,
  loanAmount: number,
  availableFunds: number,
  interestRate: number,
  loanTermYears: number,
  monthlyRepayment: number,
  growthRate: number,
  offsetBalance: number = 0
): FiveYearProjection {
  const years = 5;
  
  // Property value after 5 years
  const propertyValue = Math.round(propertyPrice * Math.pow(1 + growthRate, years));
  
  // Remaining loan after 5 years
  let remainingLoan = 0;
  if (loanAmount > 0) {
    remainingLoan = Math.round(
      calculateRemainingBalance(loanAmount, interestRate, loanTermYears, years, offsetBalance)
    );
  } else {
    // If loan was negative, it stays negative (excess funds)
    remainingLoan = loanAmount;
  }
  
  // Equity = Property Value - Remaining Loan
  const equity = propertyValue - remainingLoan;
  
  // Total repayments made over 5 years
  const totalRepayments = monthlyRepayment * 12 * years;
  
  // Interest paid over 5 years (approximate)
  const interestPaid = Math.round(totalRepayments - (loanAmount > 0 ? loanAmount - remainingLoan : 0));
  
  // Total Invested = Upfront (available funds) + All repayments
  const totalInvested = availableFunds + totalRepayments;
  
  // Net Wealth Position = Equity - Total Invested
  const netWealthPosition = equity - totalInvested;
  
  // Return percentage
  const returnPercentage = totalInvested > 0 ? (netWealthPosition / totalInvested) * 100 : 0;
  
  return {
    propertyValue,
    remainingLoan,
    equity,
    interestPaid: Math.max(0, interestPaid),
    totalInvested,
    netWealthPosition,
    returnPercentage,
  };
}

/**
 * Calculate interest paid over 5 years with variable rates
 * For scenarios like "3% for 2 years, then 5% for 3 years"
 */
export function calculateVariableRateInterest(
  loanAmount: number,
  loanTermYears: number,
  rates: Array<{ years: number; rate: number }>,
  offsetBalance: number = 0
): number {
  if (loanAmount <= 0) return 0;
  
  let remainingPrincipal = Math.max(0, loanAmount - offsetBalance);
  let totalInterest = 0;
  
  for (const period of rates) {
    const monthlyRate = period.rate / 100 / 12;
    const months = period.years * 12;
    
    for (let month = 0; month < months; month++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      totalInterest += interestPayment;
      
      // Calculate monthly payment for this rate
      const numPayments = loanTermYears * 12;
      const factor = Math.pow(1 + monthlyRate, numPayments);
      const monthlyPayment = remainingPrincipal * (monthlyRate * factor) / (factor - 1);
      
      const principalPayment = monthlyPayment - interestPayment;
      remainingPrincipal -= principalPayment;
      
      if (remainingPrincipal <= 0) break;
    }
    
    if (remainingPrincipal <= 0) break;
  }
  
  return totalInterest;
}
