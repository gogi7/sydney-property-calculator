import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateBuyingCosts, calculateMortgage, calculateAmortisation } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

const COLORS = ['#3B82F6', '#10B981'];

export function LoanSummaryCard() {
  const {
    propertyPrice,
    availableFunds,
    depositAmount,
    interestRate,
    loanTermYears,
    offsetAmount,
    householdIncome,
    isFirstHomeBuyer,
    extraWeeklyPayment,
  } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const buyingCosts = calculateBuyingCosts(propertyPrice, stampDuty.finalStampDuty);
  const mortgage = calculateMortgage(
    propertyPrice, availableFunds, buyingCosts.totalCosts,
    depositAmount, interestRate, loanTermYears, offsetAmount, householdIncome
  );

  const amortisation = useMemo(
    () => calculateAmortisation(
      Math.max(0, mortgage.loanAmount), interestRate, loanTermYears,
      offsetAmount, extraWeeklyPayment
    ),
    [mortgage.loanAmount, interestRate, loanTermYears, offsetAmount, extraWeeklyPayment]
  );

  if (mortgage.loanAmount <= 0) {
    return (
      <Card className="border-slate-200/60 shadow-lg">
        <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle>Loan Summary</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center text-slate-600">
          No loan required — you have excess funds.
        </CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: 'Principal', value: amortisation.totalPrincipal },
    { name: 'Interest', value: amortisation.totalInterest },
  ];

  const totalSaved = amortisation.interestSavedFromOffset + amortisation.interestSavedFromExtra;

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
        <CardTitle>Loan Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4">Total Payment Breakdown</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatCurrencyCompact(value)}`}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value, true)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500" />
                <span className="text-sm text-slate-600">Principal: {formatCurrency(amortisation.totalPrincipal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500" />
                <span className="text-sm text-slate-600">Interest: {formatCurrency(amortisation.totalInterest)}</span>
              </div>
            </div>
          </div>

          {/* Stats Table */}
          <div>
            <h4 className="font-semibold text-slate-700 mb-4">Key Statistics</h4>
            <div className="space-y-1">
              <StatRow label="Original Loan Amount" value={formatCurrency(mortgage.loanAmount)} />
              <StatRow label="Offset Account Balance" value={formatCurrency(offsetAmount)} className="text-green-600" />
              <StatRow label="Effective Principal" value={formatCurrency(amortisation.effectivePrincipal)} />
              <StatRow label="Interest Rate" value={`${interestRate}% p.a.`} />
              <StatRow label="Original Term" value={`${loanTermYears} years`} />
              <StatRow
                label="Actual Payoff Time"
                value={`${amortisation.yearsToPayoff.toFixed(1)} years (${amortisation.weeksToPayoff} weeks)`}
                className="text-blue-600"
              />
              {amortisation.timeSaved > 0.1 && (
                <StatRow label="Time Saved" value={`${amortisation.timeSaved.toFixed(1)} years`} className="text-green-600" />
              )}
              <StatRow label="Total Repayments" value={formatCurrency(amortisation.totalPayments)} />

              <div className="border-t border-slate-200 my-2" />

              <div className="flex justify-between py-2 bg-red-50 -mx-3 px-3 rounded-lg">
                <span className="text-sm text-slate-600">Total Interest (no offset/extra)</span>
                <span className="text-sm font-semibold text-red-600">{formatCurrency(amortisation.totalInterestNoOffset)}</span>
              </div>
              <div className="flex justify-between py-2 bg-green-50 -mx-3 px-3 rounded-lg">
                <span className="text-sm text-slate-600">Total Interest (with offset/extra)</span>
                <span className="text-sm font-semibold text-green-600">{formatCurrency(amortisation.totalInterest)}</span>
              </div>
              {totalSaved > 0 && (
                <div className="flex justify-between py-2 bg-emerald-100 -mx-3 px-3 rounded-lg">
                  <span className="text-sm font-semibold text-emerald-800">Total Interest Saved</span>
                  <span className="text-sm font-bold text-emerald-600">{formatCurrency(totalSaved)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatRow({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-100">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-semibold ${className || 'text-slate-800'}`}>{value}</span>
    </div>
  );
}

function formatCurrencyCompact(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
}
