import { BUYING_COSTS } from '@/constants';
import type { BuyingCosts } from '@/types';

/**
 * Calculate all buying costs
 */
export function calculateBuyingCosts(
  stampDuty: number,
  lmiAmount: number,
  depositAmount: number,
  totalSavings: number
): BuyingCosts {
  const { conveyancing, buildingInspection, pestInspection, loanApplicationFee, titleRegistration } = BUYING_COSTS;
  
  const totalCosts = stampDuty + lmiAmount + conveyancing + buildingInspection + pestInspection + loanApplicationFee + titleRegistration;
  const totalFundsRequired = depositAmount + totalCosts;
  const remainingAfterPurchase = totalSavings - totalFundsRequired;
  
  return {
    stampDuty,
    lmi: lmiAmount,
    conveyancing,
    buildingInspection,
    pestInspection,
    loanApplicationFee,
    titleRegistration,
    totalCosts,
    totalFundsRequired,
    remainingAfterPurchase,
  };
}

