import { Calculator, Calendar, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateMortgage, calculateBuyingCosts } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function MortgageCard() {
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

  const isNegativeLoan = mortgage.loanAmount < 0;
  const weeklyHouseholdIncome = (householdIncome * 12) / 52;
  const firstYearRepayments = mortgage.monthlyRepayment * 12;
  const annualHouseholdIncome = householdIncome * 12;
  
  // Safe repayment range is typically < 30% of income
  const isWithinSafeRange = mortgage.percentOfIncome < 30;

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Mortgage Repayments
        </CardTitle>
        <p className="text-sm text-blue-100 mt-1">
          Based on household income of {formatCurrency(householdIncome, true)}/month
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Loan Amount */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <p className="text-sm text-slate-600 mb-1">
            {isNegativeLoan ? 'Excess Funds' : 'Loan Amount'}
          </p>
          <p className={`text-2xl font-bold ${isNegativeLoan ? 'text-emerald-600' : 'text-slate-800'}`}>
            {formatCurrency(Math.abs(mortgage.loanAmount))}
            {isNegativeLoan && ' (No loan needed)'}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Auto-calculated deposit: {formatCurrency(mortgage.autoCalculatedDeposit)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Deposit = Available funds ({formatCurrency(availableFunds)}) - Buying costs ({formatCurrency(buyingCosts.totalCosts)})
          </p>
        </div>

        {!isNegativeLoan && (
          <>
            {/* Monthly Repayment */}
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700">Monthly Payment</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(mortgage.monthlyRepayment, true)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">% of Household Income</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700">
                    {mortgage.percentOfIncome.toFixed(1)}% of {formatCurrency(householdIncome)}
                  </span>
                  {isWithinSafeRange ? (
                    <Badge variant="success" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Within safe range
                    </Badge>
                  ) : (
                    <Badge variant="warning" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      High burden
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Repayment */}
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-slate-700">Weekly Payment</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(mortgage.weeklyRepayment, true)}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">% of Weekly Income</span>
                <span className="font-semibold text-slate-700">
                  {mortgage.percentOfIncome.toFixed(1)}% of {formatCurrency(weeklyHouseholdIncome)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Weekly household: {formatCurrency(weeklyHouseholdIncome)}
              </p>
            </div>

            {/* Annual Summary */}
            <div className="bg-amber-50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-slate-700 mb-3">Annual Summary (First Year)</h4>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Annual repayments</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(firstYearRepayments)}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Annual household income</span>
                <span className="font-semibold text-slate-700">
                  {formatCurrency(annualHouseholdIncome)}
                </span>
              </div>

              <div className="border-t border-amber-200 my-2 pt-2">
                <p className="font-semibold text-slate-700 mb-2">First Year Breakdown</p>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Interest Paid</span>
                  <div className="text-right">
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(mortgage.firstYearInterest)}
                    </span>
                    <p className="text-xs text-slate-500">
                      {((mortgage.firstYearInterest / firstYearRepayments) * 100).toFixed(1)}% of repayments
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-600">Principal Paid</span>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(mortgage.firstYearPrincipal)}
                    </span>
                    <p className="text-xs text-slate-500">
                      {((mortgage.firstYearPrincipal / firstYearRepayments) * 100).toFixed(1)}% of repayments
                    </p>
                  </div>
                </div>
              </div>

              {/* Interest vs Principal visualization */}
              <div className="mt-3">
                <p className="text-xs text-slate-600 mb-2">Interest vs Principal Split</p>
                <div className="flex h-6 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 flex items-center justify-center text-xs font-semibold text-white"
                    style={{ width: `${(mortgage.firstYearInterest / firstYearRepayments) * 100}%` }}
                  >
                    {((mortgage.firstYearInterest / firstYearRepayments) * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white"
                    style={{ width: `${(mortgage.firstYearPrincipal / firstYearRepayments) * 100}%` }}
                  >
                    {((mortgage.firstYearPrincipal / firstYearRepayments) * 100).toFixed(0)}%
                  </div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>🔴 Interest</span>
                  <span>🟢 Principal</span>
                </div>
              </div>
            </div>
          </>
        )}

        {isNegativeLoan && (
          <div className="p-4 bg-emerald-50 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
            <p className="font-semibold text-emerald-700">No Loan Required!</p>
            <p className="text-sm text-slate-600 mt-1">
              You have {formatCurrency(Math.abs(mortgage.loanAmount))} in excess funds after purchase
            </p>
          </div>
        )}

        {/* Deposit Info */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-slate-600">
            {mortgage.depositPercent.toFixed(1)}% deposit • Keeps {formatCurrency(offsetAmount)} in offset
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
