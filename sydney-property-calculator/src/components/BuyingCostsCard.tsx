import { Receipt, FileText, FileCheck, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateBuyingCosts } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function BuyingCostsCard() {
  const { propertyPrice, availableFunds, isFirstHomeBuyer } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const costs = calculateBuyingCosts(propertyPrice, stampDuty.finalStampDuty);

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Australian Property Buying Costs
        </CardTitle>
        <p className="text-sm text-orange-100 mt-1">
          NSW stamp duty and associated costs for owner-occupiers
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Individual Costs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-slate-700">Stamp Duty (NSW)</span>
            </div>
            <span className="font-bold text-orange-600">{formatCurrency(costs.stampDuty)}</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Legal & Conveyancing Fees</span>
            </div>
            <span className="font-semibold text-slate-600">{formatCurrency(costs.conveyancing)}</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Building Inspection</span>
            </div>
            <span className="font-semibold text-slate-600">{formatCurrency(costs.buildingInspection)}</span>
          </div>

          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700">Loan Establishment Fee</span>
            </div>
            <span className="font-semibold text-slate-600">{formatCurrency(costs.loanEstablishmentFee)}</span>
          </div>
        </div>

        {/* Total Costs */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between p-4 bg-amber-100 rounded-lg">
            <span className="font-semibold text-slate-800">Total Buying Costs</span>
            <span className="text-2xl font-bold text-amber-700">{formatCurrency(costs.totalCosts)}</span>
          </div>
        </div>

        {/* Total Upfront Required */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm font-semibold text-slate-700 mb-2">Total Upfront Required</p>
          <p className="text-xs text-slate-600 mb-2">Deposit + Buying Costs</p>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(availableFunds)}</p>
        </div>

        {/* Breakdown Percentages */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Buying costs as % of property price:</p>
            <p className="font-bold text-slate-700">{costs.costsAsPercentOfPrice.toFixed(2)}%</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Stamp duty rate effective:</p>
            <p className="font-bold text-slate-700">{costs.stampDutyRateEffective.toFixed(2)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
