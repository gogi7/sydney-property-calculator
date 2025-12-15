import { Receipt, Shield, FileText, Home, CreditCard, FileCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateMortgage, estimateLMI, calculateBuyingCosts } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function BuyingCostsCard() {
  const { propertyPrice, totalSavings, depositPercent, interestRate, loanTermYears, isFirstHomeBuyer } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const mortgage = calculateMortgage(propertyPrice, depositPercent, interestRate, loanTermYears);
  const lmi = estimateLMI(propertyPrice, mortgage.loanAmount);
  const depositAmount = propertyPrice * (depositPercent / 100);
  const costs = calculateBuyingCosts(stampDuty.finalStampDuty, lmi.lmiAmount, depositAmount, totalSavings);

  const canAfford = costs.remainingAfterPurchase >= 0;

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Total Buying Costs
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Total Required */}
        <div className={`text-center p-6 rounded-xl ${canAfford ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className="text-sm text-slate-600 mb-2">Total Funds Required</p>
          <p className={`text-4xl font-bold ${canAfford ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatCurrency(costs.totalFundsRequired)}
          </p>
          <Badge variant={canAfford ? "success" : "destructive"} className="mt-3">
            {canAfford ? '✓ Within Budget' : '✗ Exceeds Savings'}
          </Badge>
        </div>

        {/* Cost Breakdown */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600 mb-3">Cost Breakdown</p>
          
          {/* Deposit */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">Deposit ({depositPercent}%)</span>
            </div>
            <span className="font-semibold">{formatCurrency(depositAmount)}</span>
          </div>

          {/* Stamp Duty */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-slate-600">Stamp Duty</span>
            </div>
            <span className="font-semibold text-orange-600">{formatCurrency(costs.stampDuty)}</span>
          </div>

          {/* LMI */}
          {lmi.lmiRequired && (
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-slate-600">LMI ({lmi.lmiPercentage.toFixed(1)}%)</span>
              </div>
              <span className="font-semibold text-amber-600">{formatCurrency(costs.lmi)}</span>
            </div>
          )}

          {/* Conveyancing */}
          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Conveyancing</span>
            </div>
            <span className="font-medium text-slate-600">{formatCurrency(costs.conveyancing)}</span>
          </div>

          {/* Inspections */}
          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Building & Pest</span>
            </div>
            <span className="font-medium text-slate-600">
              {formatCurrency(costs.buildingInspection + costs.pestInspection)}
            </span>
          </div>

          {/* Other Fees */}
          <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-600">Other Fees</span>
            </div>
            <span className="font-medium text-slate-600">
              {formatCurrency(costs.loanApplicationFee + costs.titleRegistration)}
            </span>
          </div>
        </div>

        {/* Remaining Savings */}
        <div className={`p-4 rounded-lg ${canAfford ? 'bg-slate-100' : 'bg-red-100'}`}>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Remaining After Purchase</span>
            <span className={`font-bold text-lg ${canAfford ? 'text-slate-700' : 'text-red-600'}`}>
              {formatCurrency(costs.remainingAfterPurchase)}
            </span>
          </div>
          {!canAfford && (
            <p className="text-xs text-red-600 mt-2">
              You need {formatCurrency(Math.abs(costs.remainingAfterPurchase))} more in savings
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

