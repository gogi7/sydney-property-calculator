import { Home, Wallet, PiggyBank, DollarSign, Percent, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { formatCurrency, parseCurrency } from '@/lib/formatters/currency';

export function PropertyForm() {
  const {
    propertyPrice,
    availableFunds,
    offsetAmount,
    depositAmount,
    interestRate,
    loanTermYears,
    isFirstHomeBuyer,
    householdIncome,
    setPropertyPrice,
    setAvailableFunds,
    setOffsetAmount,
    setDepositAmount,
    setInterestRate,
    setLoanTermYears,
    setIsFirstHomeBuyer,
    setHouseholdIncome,
  } = usePropertyStore();

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Home className="w-5 h-5 text-blue-600" />
          Property & Financial Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {/* Property Price */}
        <div className="space-y-2">
          <Label htmlFor="property-price" className="flex items-center gap-2">
            <Home className="w-4 h-4 text-slate-500" />
            Property Price
          </Label>
          <Input
            id="property-price"
            type="text"
            value={formatCurrency(propertyPrice)}
            onChange={(e) => setPropertyPrice(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
        </div>

        {/* Available Funds */}
        <div className="space-y-2">
          <Label htmlFor="available-funds" className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-500" />
            Available Funds
          </Label>
          <Input
            id="available-funds"
            type="text"
            value={formatCurrency(availableFunds)}
            onChange={(e) => setAvailableFunds(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">Total funds available for purchase</p>
        </div>

        {/* Offset Account */}
        <div className="space-y-2">
          <Label htmlFor="offset-amount" className="flex items-center gap-2">
            <PiggyBank className="w-4 h-4 text-slate-500" />
            Offset Account Balance
          </Label>
          <Input
            id="offset-amount"
            type="text"
            value={formatCurrency(offsetAmount)}
            onChange={(e) => setOffsetAmount(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">Amount to keep in offset account (reduces interest)</p>
        </div>

        {/* Manual Deposit Override */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            Deposit Override (Optional)
          </Label>
          <Input
            id="deposit-amount"
            type="text"
            placeholder="Auto-calculated"
            value={depositAmount > 0 ? formatCurrency(depositAmount) : ''}
            onChange={(e) => setDepositAmount(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">Leave empty for auto-calculation (Available Funds - Buying Costs)</p>
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interest-rate" className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-slate-500" />
            Interest Rate (% p.a.)
          </Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.01"
            min="0"
            max="20"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">Current CBA rate: 5.34%</p>
        </div>

        {/* Loan Term */}
        <div className="space-y-2">
          <Label htmlFor="loan-term" className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Loan Term (years)
          </Label>
          <Input
            id="loan-term"
            type="number"
            min="1"
            max="30"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(parseInt(e.target.value) || 30)}
            className="text-lg font-semibold"
          />
        </div>

        {/* Household Income */}
        <div className="space-y-2">
          <Label htmlFor="household-income" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-slate-500" />
            Monthly Household Income
          </Label>
          <Input
            id="household-income"
            type="text"
            value={formatCurrency(householdIncome)}
            onChange={(e) => setHouseholdIncome(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">For repayment affordability calculation</p>
        </div>

        {/* First Home Buyer Toggle */}
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <Label htmlFor="fhb-toggle" className="font-medium text-slate-800">
              First Home Buyer
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Eligible for stamp duty concessions
            </p>
          </div>
          <Switch
            id="fhb-toggle"
            checked={isFirstHomeBuyer}
            onCheckedChange={setIsFirstHomeBuyer}
          />
        </div>
      </CardContent>
    </Card>
  );
}
