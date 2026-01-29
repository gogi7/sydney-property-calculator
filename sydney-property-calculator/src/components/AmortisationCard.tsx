import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateBuyingCosts, calculateMortgage, calculateAmortisation } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function AmortisationCard() {
  const {
    propertyPrice, availableFunds, depositAmount,
    interestRate, loanTermYears, offsetAmount,
    householdIncome, isFirstHomeBuyer, extraWeeklyPayment,
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
        <CardHeader className="pb-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white">
          <CardTitle>Amortisation Schedule</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 text-center text-slate-600">
          No loan required — amortisation is not applicable.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Amortisation Schedule</CardTitle>
          <span className="text-sm text-slate-300">
            {amortisation.weeksToPayoff} weeks ({amortisation.yearsToPayoff.toFixed(1)} years)
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {/* Yearly Summary */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-4">Yearly Summary</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-3 text-left font-semibold text-blue-800">Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-blue-800">Principal Paid</th>
                  <th className="px-4 py-3 text-right font-semibold text-blue-800">Interest Paid</th>
                  <th className="px-4 py-3 text-right font-semibold text-blue-800">Total Paid</th>
                  <th className="px-4 py-3 text-right font-semibold text-blue-800">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortisation.yearlySchedule.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-slate-800">Year {row.year}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatCurrency(row.principal)}</td>
                    <td className="px-4 py-3 text-right text-orange-600">{formatCurrency(row.interest)}</td>
                    <td className="px-4 py-3 text-right text-slate-700">{formatCurrency(row.principal + row.interest)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Full Weekly Schedule */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-4">Full Weekly Schedule</h4>
          <div className="overflow-x-auto max-h-96 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-slate-100">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Week</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Year</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Payment</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Principal</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Interest</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Balance</th>
                  <th className="px-3 py-2 text-right font-semibold text-slate-700">Total Interest</th>
                </tr>
              </thead>
              <tbody>
                {amortisation.weeklySchedule.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} ${
                      row.week % 52 === 0 ? 'border-b-2 border-blue-300' : ''
                    }`}
                  >
                    <td className="px-3 py-2 text-slate-700">{row.week}</td>
                    <td className="px-3 py-2 text-slate-700">{row.year}</td>
                    <td className="px-3 py-2 text-right text-slate-700">{formatCurrency(row.payment, true)}</td>
                    <td className="px-3 py-2 text-right text-green-600">{formatCurrency(row.principal, true)}</td>
                    <td className="px-3 py-2 text-right text-orange-600">{formatCurrency(row.interest, true)}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-800">{formatCurrency(row.balance, true)}</td>
                    <td className="px-3 py-2 text-right text-slate-500">{formatCurrency(row.totalInterest, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
