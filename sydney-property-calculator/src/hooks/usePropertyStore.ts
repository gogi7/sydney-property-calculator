import { create } from 'zustand';
import { DEFAULT_VALUES } from '@/constants';
import type { PropertyInputs } from '@/types';

interface PropertyStore extends PropertyInputs {
  setPropertyPrice: (price: number) => void;
  setTotalSavings: (savings: number) => void;
  setOffsetAmount: (offset: number) => void;
  setDepositPercent: (percent: number) => void;
  setInterestRate: (rate: number) => void;
  setLoanTermYears: (years: number) => void;
  setIsFirstHomeBuyer: (isFHB: boolean) => void;
  setAppreciationRate: (rate: number) => void;
  reset: () => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  ...DEFAULT_VALUES,
  
  setPropertyPrice: (propertyPrice) => set({ propertyPrice }),
  setTotalSavings: (totalSavings) => set({ totalSavings }),
  setOffsetAmount: (offsetAmount) => set({ offsetAmount }),
  setDepositPercent: (depositPercent) => set({ depositPercent }),
  setInterestRate: (interestRate) => set({ interestRate }),
  setLoanTermYears: (loanTermYears) => set({ loanTermYears }),
  setIsFirstHomeBuyer: (isFirstHomeBuyer) => set({ isFirstHomeBuyer }),
  setAppreciationRate: (appreciationRate) => set({ appreciationRate }),
  
  reset: () => set(DEFAULT_VALUES),
}));

