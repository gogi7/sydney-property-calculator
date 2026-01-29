import { create } from 'zustand';
import { DEFAULT_VALUES } from '@/constants';
import type { PropertyInputs } from '@/types';

interface PropertyStore extends PropertyInputs {
  setPropertyPrice: (price: number) => void;
  setAvailableFunds: (funds: number) => void;
  setOffsetAmount: (offset: number) => void;
  setDepositAmount: (deposit: number) => void;
  setInterestRate: (rate: number) => void;
  setLoanTermYears: (years: number) => void;
  setIsFirstHomeBuyer: (isFHB: boolean) => void;
  setHouseholdIncome: (income: number) => void;
  reset: () => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  ...DEFAULT_VALUES,
  
  setPropertyPrice: (propertyPrice) => set({ propertyPrice }),
  setAvailableFunds: (availableFunds) => set({ availableFunds }),
  setOffsetAmount: (offsetAmount) => set({ offsetAmount }),
  setDepositAmount: (depositAmount) => set({ depositAmount }),
  setInterestRate: (interestRate) => set({ interestRate }),
  setLoanTermYears: (loanTermYears) => set({ loanTermYears }),
  setIsFirstHomeBuyer: (isFirstHomeBuyer) => set({ isFirstHomeBuyer }),
  setHouseholdIncome: (householdIncome) => set({ householdIncome }),
  
  reset: () => set(DEFAULT_VALUES),
}));
