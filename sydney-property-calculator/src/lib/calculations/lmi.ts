import { LMI_TIERS } from '@/constants';
import type { LMIResults } from '@/types';

/**
 * Estimate LMI based on LVR and loan amount
 * Note: Actual LMI varies by lender - this is an approximation
 */
export function estimateLMI(
  propertyPrice: number,
  loanAmount: number
): LMIResults {
  if (propertyPrice <= 0 || loanAmount <= 0) {
    return { lmiRequired: false, lmiAmount: 0, lmiPercentage: 0 };
  }
  
  const lvr = (loanAmount / propertyPrice) * 100;
  
  if (lvr <= 80) {
    return { lmiRequired: false, lmiAmount: 0, lmiPercentage: 0 };
  }
  
  // Find applicable LMI rate
  let lmiRate = 0;
  for (const tier of LMI_TIERS) {
    if (lvr <= tier.maxLvr) {
      lmiRate = tier.rate;
      break;
    }
    lmiRate = tier.rate;
  }
  
  const lmiAmount = Math.round(loanAmount * lmiRate);
  
  return {
    lmiRequired: true,
    lmiAmount,
    lmiPercentage: lmiRate * 100,
  };
}

