import { useMemo, useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateBuyingCosts, calculateMortgage, calculateAmortisation } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

function formatShort(num: number): string {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(0)}k`;
  return `$${num.toFixed(0)}`;
}

export function LoanChartsCard() {
  const {
    propertyPrice, availableFunds, depositAmount,
    interestRate, loanTermYears, offsetAmount,
    householdIncome, isFirstHomeBuyer, extraWeeklyPayment,
  } = usePropertyStore();

  const [showYearly, setShowYearly] = useState(true);

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
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardTitle>Charts</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center text-slate-600">
          No loan required — charts are not applicable.
        </CardContent>
      </Card>
    );
  }

  const balanceChartData = (
    showYearly
      ? amortisation.yearlySchedule
      : amortisation.weeklySchedule.filter((_, i) => i % 4 === 0)
  ).map((item) => ({
    period: showYearly ? `Year ${item.year}` : `Wk ${('week' in item ? (item as { week: number }).week : item.year * 52)}`,
    balance: item.balance,
    principal: item.totalPrincipal,
    interest: item.totalInterest,
  }));

  const savingsData = [
    { name: 'No Offset or Extra', interest: amortisation.totalInterestNoOffset },
    { name: 'With Extra Only', interest: amortisation.totalInterestNoExtra },
    { name: 'Current (Both)', interest: amortisation.totalInterest },
  ];

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Visual Analysis</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setShowYearly(true)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                showYearly ? 'bg-white text-purple-700' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setShowYearly(false)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                !showYearly ? 'bg-white text-purple-700' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {/* Balance Over Time */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-4">Loan Balance Over Time</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatShort} />
                <Tooltip formatter={(value: number) => formatCurrency(value, true)} />
                <Legend />
                <Area type="monotone" dataKey="balance" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Remaining Balance" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cumulative Principal vs Interest */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-4">Cumulative Principal vs Interest Paid</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={formatShort} />
                <Tooltip formatter={(value: number) => formatCurrency(value, true)} />
                <Legend />
                <Area type="monotone" dataKey="principal" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.4} name="Principal Paid" />
                <Area type="monotone" dataKey="interest" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.4} name="Interest Paid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interest Comparison */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-4">Interest Comparison: Impact of Offset & Extra Repayments</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={savingsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={formatShort} />
                <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value, true)} />
                <Bar dataKey="interest" fill="#3B82F6" name="Total Interest" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
