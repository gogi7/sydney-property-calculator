import { BUYING_COSTS } from '@/constants';
import type { BuyingCosts } from '@/types';

/**
 * Calculate all buying costs
 */
export function calculateBuyingCosts(
  propertyPrice: number,
  stampDuty: number
): BuyingCosts {
  const { conveyancing, buildingInspection, loanEstablishmentFee } = BUYING_COSTS;
  
  const totalCosts = stampDuty + conveyancing + buildingInspection + loanEstablishmentFee;
  const totalUpfrontRequired = totalCosts;
  const costsAsPercentOfPrice = (totalCosts / propertyPrice) * 100;
  const stampDutyRateEffective = (stampDuty / propertyPrice) * 100;
  
  return {
    stampDuty,
    conveyancing,
    buildingInspection,
    loanEstablishmentFee,
    totalCosts,
    totalUpfrontRequired,
    costsAsPercentOfPrice,
    stampDutyRateEffective,
  };
}
