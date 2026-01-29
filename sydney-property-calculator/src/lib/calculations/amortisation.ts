import type { AmortisationResults, AmortisationWeek, AmortisationYear } from '@/types';

/**
 * Generate full amortisation schedule with weekly granularity.
 * Accounts for offset balance and extra weekly payments.
 */
export function calculateAmortisation(
  loanAmount: number,
  annualRate: number,
  loanTermYears: number,
  offsetBalance: number,
  extraWeeklyPayment: number
): AmortisationResults {
  const principal = Math.max(0, loanAmount);
  const effectivePrincipal = Math.max(0, principal - offsetBalance);
  const rate = annualRate / 100;
  const weeklyRate = rate / 52;
  const totalWeeks = loanTermYears * 52;

  // Base weekly payment (minimum required)
  const baseWeeklyPayment =
    effectivePrincipal > 0 && weeklyRate > 0
      ? (effectivePrincipal * (weeklyRate * Math.pow(1 + weeklyRate, totalWeeks))) /
        (Math.pow(1 + weeklyRate, totalWeeks) - 1)
      : effectivePrincipal > 0
        ? effectivePrincipal / totalWeeks
        : 0;

  const totalWeeklyPayment = baseWeeklyPayment + extraWeeklyPayment;
  const fortnightlyPayment = totalWeeklyPayment * 2;
  const monthlyPayment = (totalWeeklyPayment * 52) / 12;

  // Generate schedules
  const weeklySchedule: AmortisationWeek[] = [];
  const yearlySchedule: AmortisationYear[] = [];
  let balance = effectivePrincipal;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let yearlyInterest = 0;
  let yearlyPrincipal = 0;
  let weeksToPayoff = 0;

  for (let week = 1; week <= totalWeeks && balance > 0; week++) {
    const interestPayment = balance * weeklyRate;
    let principalPayment = totalWeeklyPayment - interestPayment;

    if (principalPayment > balance) {
      principalPayment = balance;
    }

    balance = Math.max(0, balance - principalPayment);
    totalInterestPaid += interestPayment;
    totalPrincipalPaid += principalPayment;
    yearlyInterest += interestPayment;
    yearlyPrincipal += principalPayment;
    weeksToPayoff = week;

    weeklySchedule.push({
      week,
      year: Math.ceil(week / 52),
      payment: totalWeeklyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
      totalInterest: totalInterestPaid,
      totalPrincipal: totalPrincipalPaid,
    });

    if (week % 52 === 0 || balance === 0) {
      yearlySchedule.push({
        year: Math.ceil(week / 52),
        principal: yearlyPrincipal,
        interest: yearlyInterest,
        balance,
        totalInterest: totalInterestPaid,
        totalPrincipal: totalPrincipalPaid,
      });
      yearlyInterest = 0;
      yearlyPrincipal = 0;
    }

    if (balance === 0) break;
  }

  // Comparison: WITHOUT extra payments
  let totalInterestNoExtra = 0;
  if (extraWeeklyPayment > 0) {
    let bal = effectivePrincipal;
    for (let week = 1; week <= totalWeeks && bal > 0; week++) {
      const ip = bal * weeklyRate;
      let pp = baseWeeklyPayment - ip;
      if (pp > bal) pp = bal;
      bal = Math.max(0, bal - pp);
      totalInterestNoExtra += ip;
    }
  } else {
    totalInterestNoExtra = totalInterestPaid;
  }

  // Comparison: WITHOUT offset
  let totalInterestNoOffset = 0;
  if (offsetBalance > 0) {
    const noOffsetPayment =
      principal > 0 && weeklyRate > 0
        ? (principal * (weeklyRate * Math.pow(1 + weeklyRate, totalWeeks))) /
          (Math.pow(1 + weeklyRate, totalWeeks) - 1)
        : principal > 0
          ? principal / totalWeeks
          : 0;

    let bal = principal;
    for (let week = 1; week <= totalWeeks && bal > 0; week++) {
      const ip = bal * weeklyRate;
      let pp = noOffsetPayment - ip;
      if (pp > bal) pp = bal;
      bal = Math.max(0, bal - pp);
      totalInterestNoOffset += ip;
    }
  } else {
    totalInterestNoOffset = totalInterestNoExtra;
  }

  const yearsToPayoff = weeksToPayoff / 52;
  const timeSaved = loanTermYears - yearsToPayoff;
  const interestSavedFromExtra = totalInterestNoExtra - totalInterestPaid;
  const interestSavedFromOffset = totalInterestNoOffset - totalInterestPaid;

  return {
    weeklySchedule,
    yearlySchedule,
    baseWeeklyPayment,
    totalWeeklyPayment,
    fortnightlyPayment,
    monthlyPayment,
    totalPayments: totalPrincipalPaid + totalInterestPaid,
    totalInterest: totalInterestPaid,
    totalPrincipal: totalPrincipalPaid,
    effectivePrincipal,
    yearsToPayoff,
    weeksToPayoff,
    timeSaved,
    interestSavedFromExtra,
    interestSavedFromOffset,
    totalInterestNoOffset,
    totalInterestNoExtra,
  };
}
