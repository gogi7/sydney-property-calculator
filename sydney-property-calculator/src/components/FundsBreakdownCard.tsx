import { PieChart, DollarSign, Home, Landmark, Wallet, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateMortgage, calculateBuyingCosts } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';
import { BUYING_COSTS } from '@/constants';

export function FundsBreakdownCard() {
  const {
    propertyPrice,
    availableFunds,
    depositAmount,
    interestRate,
    loanTermYears,
    offsetAmount,
    householdIncome,
    isFirstHomeBuyer,
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

  const otherCosts = BUYING_COSTS.conveyancing + BUYING_COSTS.buildingInspection + BUYING_COSTS.loanEstablishmentFee;
  const depositOnProperty = mortgage.effectiveDeposit;
  const loanAmount = Math.max(0, mortgage.loanAmount);
  const effectiveLoan = Math.max(0, loanAmount - offsetAmount);
  const isNegativeLoan = mortgage.loanAmount < 0;

  // Bar widths as percentage of property price
  const stampDutyPct = (stampDuty.finalStampDuty / propertyPrice) * 100;
  const otherCostsPct = (otherCosts / propertyPrice) * 100;
  const depositPct = (Math.max(0, depositOnProperty) / propertyPrice) * 100;
  const loanPct = (loanAmount / propertyPrice) * 100;
  const offsetPct = Math.min((offsetAmount / propertyPrice) * 100, loanPct);

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChart className="w-5 h-5" />
          Loan & Funds Breakdown
        </CardTitle>
        <p className="text-sm text-violet-100 mt-1">
          Where your money goes
        </p>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {/* Property Price - the total */}
        <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Property Price</span>
          </div>
          <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(propertyPrice)}</span>
        </div>

        {/* Visual stacked bar */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">How the purchase is funded</p>
          <div className="flex h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            {depositPct > 0 && (
              <div
                className="bg-emerald-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{ width: `${depositPct}%` }}
                title={`Deposit: ${formatCurrency(depositOnProperty)}`}
              >
                {depositPct > 10 ? 'Deposit' : ''}
              </div>
            )}
            {loanPct > 0 && (
              <div
                className="bg-blue-500 flex items-center justify-center text-xs font-bold text-white transition-all"
                style={{ width: `${loanPct}%` }}
                title={`Loan: ${formatCurrency(loanAmount)}`}
              >
                {loanPct > 10 ? 'Loan' : ''}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Deposit
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Loan
            </span>
          </div>
        </div>

        {/* Two-column breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left: Cash Paid Upfront */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Cash paid upfront</p>

            <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Landmark className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Stamp Duty</span>
              </div>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">
                {formatCurrency(stampDuty.finalStampDuty)}
              </p>
              {isFirstHomeBuyer && stampDuty.fhbDiscount > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Saved {formatCurrency(stampDuty.fhbDiscount)} (FHB)</p>
              )}
            </div>

            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-1.5 mb-0.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Deposit on Property</span>
              </div>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(Math.max(0, depositOnProperty))}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{mortgage.depositPercent.toFixed(1)}% of price</p>
            </div>

            <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Other costs</span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(otherCosts)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Legal, inspection, loan fee</p>
            </div>

            <div className="p-2.5 bg-violet-50 dark:bg-violet-900/30 rounded-lg border border-violet-200 dark:border-violet-800">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Wallet className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">Total Cash Used</span>
              </div>
              <p className="text-lg font-bold text-violet-700 dark:text-violet-300">
                {formatCurrency(buyingCosts.totalCosts + Math.max(0, depositOnProperty))}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                from {formatCurrency(availableFunds)} available
              </p>
            </div>
          </div>

          {/* Right: The Loan */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">The loan</p>

            {!isNegativeLoan ? (
              <>
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Building className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Loan Amount</span>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {formatCurrency(loanAmount)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    LVR: {mortgage.lvr.toFixed(1)}%
                  </p>
                </div>

                {offsetAmount > 0 && (
                  <div className="p-2.5 bg-teal-50 dark:bg-teal-900/30 rounded-lg border border-teal-200 dark:border-teal-800">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Wallet className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span className="text-xs font-medium text-teal-700 dark:text-teal-300">Offset Account</span>
                    </div>
                    <p className="text-lg font-bold text-teal-700 dark:text-teal-300">
                      -{formatCurrency(Math.min(offsetAmount, loanAmount))}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Reduces interest charged</p>
                  </div>
                )}

                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border-2 border-indigo-300 dark:border-indigo-700">
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">Effective Loan (for interest)</span>
                  <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                    {formatCurrency(effectiveLoan)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {interestRate}% over {loanTermYears} years
                  </p>
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg space-y-1">
                  <p className="font-medium text-slate-600 dark:text-slate-300">How it works:</p>
                  <p>{formatCurrency(propertyPrice)} price</p>
                  <p>- {formatCurrency(Math.max(0, depositOnProperty))} deposit</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">= {formatCurrency(loanAmount)} loan</p>
                  {offsetAmount > 0 && (
                    <>
                      <p>- {formatCurrency(Math.min(offsetAmount, loanAmount))} offset</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">= {formatCurrency(effectiveLoan)} effective</p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800 text-center">
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">No Loan Needed</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">
                  Excess: {formatCurrency(Math.abs(mortgage.loanAmount))}
                </p>
                {offsetAmount > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Plus {formatCurrency(offsetAmount)} in offset
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
