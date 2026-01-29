import { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateBuyingCosts, calculateMortgage, calculateFiveYearProjection } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';
import { INTEREST_RATE_SCENARIOS, GROWTH_SCENARIOS } from '@/constants';

export function FiveYearOutlookCard() {
  const [selectedScenario, setSelectedScenario] = useState('unchanged');
  
  const { 
    propertyPrice,
    availableFunds,
    depositAmount,
    interestRate,
    loanTermYears,
    offsetAmount,
    householdIncome,
    isFirstHomeBuyer
  } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const buyingCosts = calculateBuyingCosts(propertyPrice, stampDuty.finalStampDuty);
  
  const mortgage = calculateMortgage(
    propertyPrice,
    availableFunds,
    buyingCosts.totalCosts,
    depositAmount,
    interestRate,
    loanTermYears,
    offsetAmount,
    householdIncome
  );

  // Get selected interest rate scenario
  const scenario = INTEREST_RATE_SCENARIOS.find(s => s.id === selectedScenario) || INTEREST_RATE_SCENARIOS[0];

  // Calculate projections for each growth scenario
  const projections = GROWTH_SCENARIOS.map(growth => ({
    ...growth,
    projection: calculateFiveYearProjection(
      propertyPrice,
      mortgage.loanAmount,
      availableFunds,
      scenario.rate,
      loanTermYears,
      mortgage.monthlyRepayment,
      growth.rate,
      offsetAmount
    ),
  }));

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          5-Year Wealth Projections
        </CardTitle>
        <p className="text-sm text-violet-100 mt-1">
          Different scenarios based on annual property price changes and interest rates
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Interest Rate Scenario Selector */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">Select Interest Rate Scenario (5 years)</p>
          <div className="space-y-2">
            {INTEREST_RATE_SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedScenario(s.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedScenario === s.id
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-semibold text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-600 mt-1">{s.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Growth Scenarios */}
        <div className="space-y-4">
          {projections.map(({ growthRate, label, projection }) => {
            const isPositive = projection.netWealthPosition >= 0;
            const icon = growthRate >= 0.05 ? TrendingUp : growthRate <= -0.02 ? TrendingDown : AlertTriangle;
            const Icon = icon;
            
            return (
              <div key={label} className={`p-4 rounded-lg border-2 ${
                isPositive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </h4>
                  <span className="text-xs text-slate-500">After 5 years of ownership</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-600 text-xs">Property Value</p>
                    <p className="font-semibold text-slate-800">{formatCurrency(projection.propertyValue)}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-600 text-xs">Remaining Loan</p>
                    <p className="font-semibold text-orange-600">
                      {projection.remainingLoan > 0 ? `-${formatCurrency(projection.remainingLoan)}` : formatCurrency(Math.abs(projection.remainingLoan))}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-slate-600 text-xs">Your Equity</p>
                    <p className="font-semibold text-blue-600">{formatCurrency(projection.equity)}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-600 text-xs">Interest Paid</p>
                    <p className="font-semibold text-orange-600">-{formatCurrency(projection.interestPaid)}</p>
                  </div>
                  
                  <div>
                    <p className="text-slate-600 text-xs">Total Invested</p>
                    <p className="font-semibold text-slate-700">{formatCurrency(projection.totalInvested)}</p>
                  </div>
                  
                  <div className={`col-span-2 mt-2 p-3 rounded-lg ${
                    isPositive ? 'bg-emerald-100' : 'bg-red-100'
                  }`}>
                    <p className="text-xs font-medium mb-1 text-slate-700">Net Wealth Position:</p>
                    <p className={`text-2xl font-bold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isPositive ? '+' : ''}{formatCurrency(projection.netWealthPosition)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {isPositive ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs text-emerald-700 font-medium">
                            Property increased your wealth by {Math.abs(projection.returnPercentage).toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-700 font-medium">
                            Net loss of {Math.abs(projection.returnPercentage).toFixed(1)}% on total investment
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="font-semibold text-slate-700 mb-2">Important Notes:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Projections assume consistent growth rates (actual markets vary)</li>
            <li>• Total invested includes all upfront costs ({formatCurrency(availableFunds)}) plus loan repayments made</li>
            <li>• Net position = Your equity minus total amount invested</li>
            <li>• Interest calculations vary by selected rate scenario</li>
            <li>• Does not include maintenance, rates, insurance, or opportunity costs</li>
            <li>• Tax implications (CGT exemption for PPOR) not factored in</li>
            <li>• Offset account ({formatCurrency(offsetAmount)}) kept separate and not included</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

