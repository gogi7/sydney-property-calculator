import { NSW_STAMP_DUTY_TIERS, FHB_FULL_EXEMPTION_THRESHOLD, FHB_PARTIAL_EXEMPTION_MAX } from '@/constants';
import type { StampDutyResults } from '@/types';

/**
 * Calculate base NSW stamp duty (without FHB concessions)
 */
export function calculateBaseStampDuty(propertyPrice: number): number {
  if (propertyPrice <= 0) return 0;
  
  // Find the applicable tier
  let applicableTier = NSW_STAMP_DUTY_TIERS[0];
  
  for (let i = NSW_STAMP_DUTY_TIERS.length - 1; i >= 0; i--) {
    if (propertyPrice > NSW_STAMP_DUTY_TIERS[i].threshold) {
      applicableTier = NSW_STAMP_DUTY_TIERS[i];
      break;
    }
  }
  
  const excess = propertyPrice - applicableTier.threshold;
  return applicableTier.base + (excess * applicableTier.rate);
}

/**
 * Calculate FHB discount percentage based on property price
 */
export function calculateFHBDiscount(propertyPrice: number): number {
  if (propertyPrice <= FHB_FULL_EXEMPTION_THRESHOLD) {
    return 1; // 100% discount (exempt)
  }
  
  if (propertyPrice >= FHB_PARTIAL_EXEMPTION_MAX) {
    return 0; // No discount
  }
  
  // Sliding scale between $800k and $1m
  const range = FHB_PARTIAL_EXEMPTION_MAX - FHB_FULL_EXEMPTION_THRESHOLD;
  const excess = propertyPrice - FHB_FULL_EXEMPTION_THRESHOLD;
  return 1 - (excess / range);
}

/**
 * Calculate NSW stamp duty with optional FHB concessions
 */
export function calculateNSWStampDuty(
  propertyPrice: number,
  isFirstHomeBuyer: boolean = false
): StampDutyResults {
  const baseStampDuty = calculateBaseStampDuty(propertyPrice);
  
  if (!isFirstHomeBuyer) {
    return {
      baseStampDuty,
      finalStampDuty: baseStampDuty,
      fhbDiscount: 0,
      isFHBExempt: false,
    };
  }
  
  const discountPercent = calculateFHBDiscount(propertyPrice);
  const fhbDiscount = baseStampDuty * discountPercent;
  const finalStampDuty = baseStampDuty - fhbDiscount;
  
  return {
    baseStampDuty,
    finalStampDuty: Math.round(finalStampDuty),
    fhbDiscount: Math.round(fhbDiscount),
    isFHBExempt: discountPercent === 1,
  };
}

