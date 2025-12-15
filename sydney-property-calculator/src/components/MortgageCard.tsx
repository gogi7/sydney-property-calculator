import { Calculator, Calendar, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateMortgage } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function MortgageCard() {
  const { propertyPrice, depositPercent, interestRate, loanTermYears, offsetAmount } = usePropertyStore();

  const mortgage = calculateMortgage(
    propertyPrice,
    depositPercent,
    interestRate,
    loanTermYears,
    offsetAmount
  );

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Mortgage Repayments
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Loan Amount */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">Loan Amount</p>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(mortgage.loanAmount)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={mortgage.lvr > 80 ? "warning" : "success"}>
              LVR: {mortgage.lvr.toFixed(1)}%
            </Badge>
            {offsetAmount > 0 && (
              <Badge variant="secondary">
                Offset: {formatCurrency(offsetAmount)}
              </Badge>
            )}
          </div>
        </div>

        {/* Monthly Repayment */}
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Monthly</p>
              <p className="text-xl font-bold text-blue-600">
                {formatCurrency(mortgage.monthlyRepayment, true)}
              </p>
            </div>
          </div>
        </div>

        {/* Fortnightly Repayment */}
        <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Fortnightly</p>
              <p className="text-xl font-bold text-emerald-600">
                {formatCurrency(mortgage.fortnightlyRepayment, true)}
              </p>
            </div>
          </div>
          <Badge variant="success" className="text-xs">
            Saves interest!
          </Badge>
        </div>

        {/* Total Interest */}
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <TrendingDown className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Interest ({loanTermYears} years)</p>
              <p className="text-xl font-bold text-amber-600">
                {formatCurrency(mortgage.totalInterest)}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Total Repayments</p>
            <p className="font-semibold text-slate-700">{formatCurrency(mortgage.totalRepayments)}</p>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Interest Rate</p>
            <p className="font-semibold text-slate-700">{interestRate.toFixed(2)}% p.a.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

