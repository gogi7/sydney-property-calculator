import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateMortgage, calculateRateScenarios } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';
import { RATE_SCENARIOS } from '@/constants';

export function InterestRateScenariosCard() {
  const { propertyPrice, depositPercent, interestRate, loanTermYears } = usePropertyStore();

  const mortgage = calculateMortgage(propertyPrice, depositPercent, interestRate, loanTermYears);
  const scenarios = calculateRateScenarios(mortgage.loanAmount, interestRate, loanTermYears, RATE_SCENARIOS);

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Interest Rate Scenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-sm text-slate-600 mb-4">
          How rate changes affect your monthly repayment
        </p>

        <div className="space-y-2">
          {scenarios.map((scenario, idx) => {
            const isCurrentRate = scenario.rateChange === 0;
            const isIncrease = scenario.rateChange > 0;
            const isDecrease = scenario.rateChange < 0;

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg transition-all ${
                  isCurrentRate
                    ? 'bg-blue-100 border-2 border-blue-400'
                    : isIncrease
                    ? 'bg-red-50 hover:bg-red-100'
                    : 'bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCurrentRate
                        ? 'bg-blue-200'
                        : isIncrease
                        ? 'bg-red-100'
                        : 'bg-emerald-100'
                    }`}>
                      {isCurrentRate ? (
                        <Minus className="w-4 h-4 text-blue-600" />
                      ) : isIncrease ? (
                        <ArrowUpRight className="w-4 h-4 text-red-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                      )}
                    </div>
                    <div>
                      <p className={`font-semibold ${
                        isCurrentRate
                          ? 'text-blue-700'
                          : isIncrease
                          ? 'text-red-700'
                          : 'text-emerald-700'
                      }`}>
                        {scenario.rate.toFixed(2)}%
                        {isCurrentRate && ' (Current)'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {isCurrentRate
                          ? 'Your current rate'
                          : isIncrease
                          ? `+${scenario.rateChange.toFixed(1)}% increase`
                          : `${scenario.rateChange.toFixed(1)}% decrease`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      isCurrentRate
                        ? 'text-blue-600'
                        : isIncrease
                        ? 'text-red-600'
                        : 'text-emerald-600'
                    }`}>
                      {formatCurrency(scenario.monthlyRepayment, true)}
                    </p>
                    {!isCurrentRate && (
                      <p className={`text-xs font-medium ${
                        isIncrease ? 'text-red-500' : 'text-emerald-500'
                      }`}>
                        {isIncrease ? '+' : ''}{formatCurrency(scenario.monthlyDifference, true)}/mo
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Summary */}
        <div className="mt-4 p-4 bg-slate-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">Worst Case Impact (+2%)</span>
          </div>
          <p className="text-slate-600 text-sm">
            Monthly increase: <span className="font-semibold text-red-600">
              {formatCurrency(scenarios[scenarios.length - 1].monthlyDifference, true)}
            </span>
          </p>
          <p className="text-slate-600 text-sm">
            Annual extra: <span className="font-semibold text-red-600">
              {formatCurrency(scenarios[scenarios.length - 1].monthlyDifference * 12)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

