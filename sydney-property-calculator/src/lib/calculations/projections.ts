import type { StampDutyRecovery, WealthProjection, RateScenario } from '@/types';
import { calculateBaseStampDuty } from './stampDuty';
import { calculateMonthlyRepayment, calculateRemainingBalance, calculateTotalInterest } from './mortgage';

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
 * Calculate interest rate scenarios
 */
export function calculateRateScenarios(
  loanAmount: number,
  currentRate: number,
  loanTermYears: number,
  rateChanges: number[]
): RateScenario[] {
  const baseMonthly = calculateMonthlyRepayment(loanAmount, currentRate, loanTermYears);
  const baseTotalInterest = calculateTotalInterest(loanAmount, baseMonthly, loanTermYears);
  
  return rateChanges.map(change => {
    const newRate = currentRate + change;
    const monthlyRepayment = calculateMonthlyRepayment(loanAmount, newRate, loanTermYears);
    const totalInterest = calculateTotalInterest(loanAmount, monthlyRepayment, loanTermYears);
    
    return {
      rate: newRate,
      rateChange: change,
      monthlyRepayment,
      monthlyDifference: monthlyRepayment - baseMonthly,
      totalInterest,
    };
  });
}

/**
 * Calculate wealth projection over time
 */
export function calculateWealthProjection(
  propertyPrice: number,
  loanAmount: number,
  interestRate: number,
  loanTermYears: number,
  appreciationRate: number,
  years: number = 10
): WealthProjection[] {
  const projections: WealthProjection[] = [];
  const monthlyRepayment = calculateMonthlyRepayment(loanAmount, interestRate, loanTermYears);
  
  for (let year = 0; year <= years; year++) {
    const propertyValue = propertyPrice * Math.pow(1 + appreciationRate / 100, year);
    const loanBalance = calculateRemainingBalance(loanAmount, interestRate, loanTermYears, year);
    const equity = propertyValue - loanBalance;
    const totalPaid = monthlyRepayment * 12 * year;
    
    projections.push({
      year,
      propertyValue: Math.round(propertyValue),
      loanBalance: Math.round(loanBalance),
      equity: Math.round(equity),
      totalPaid: Math.round(totalPaid),
    });
  }
  
  return projections;
}

