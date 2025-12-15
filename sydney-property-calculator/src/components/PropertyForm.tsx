import { Home, Wallet, PiggyBank, Percent, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { formatCurrency, parseCurrency } from '@/lib/formatters/currency';

export function PropertyForm() {
  const {
    propertyPrice,
    totalSavings,
    offsetAmount,
    depositPercent,
    interestRate,
    loanTermYears,
    isFirstHomeBuyer,
    appreciationRate,
    setPropertyPrice,
    setTotalSavings,
    setOffsetAmount,
    setDepositPercent,
    setInterestRate,
    setLoanTermYears,
    setIsFirstHomeBuyer,
    setAppreciationRate,
  } = usePropertyStore();

  const depositAmount = propertyPrice * (depositPercent / 100);

  return (
    <Card className="border-slate-200/60 shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Home className="w-5 h-5 text-blue-600" />
          Property & Financial Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
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

        {/* Total Savings */}
        <div className="space-y-2">
          <Label htmlFor="total-savings" className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-500" />
            Total Savings
          </Label>
          <Input
            id="total-savings"
            type="text"
            value={formatCurrency(totalSavings)}
            onChange={(e) => setTotalSavings(parseCurrency(e.target.value))}
            className="text-lg font-semibold"
          />
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
            onChange={(e) => setOffsetAmount(Math.min(parseCurrency(e.target.value), totalSavings))}
            className="text-lg font-semibold"
          />
          <p className="text-xs text-slate-500">Amount to keep in offset account (reduces interest)</p>
        </div>

        {/* Deposit Percentage */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-slate-500" />
              Deposit
            </span>
            <span className="font-semibold text-blue-600">
              {depositPercent}% ({formatCurrency(depositAmount)})
            </span>
          </Label>
          <Slider
            value={[depositPercent]}
            onValueChange={([value]) => setDepositPercent(value)}
            min={5}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>5%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Interest Rate */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Interest Rate
            </span>
            <span className="font-semibold text-blue-600">{interestRate.toFixed(2)}%</span>
          </Label>
          <Slider
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
            min={2}
            max={12}
            step={0.05}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>2%</span>
            <span>12%</span>
          </div>
        </div>

        {/* Loan Term */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Loan Term
            </span>
            <span className="font-semibold text-blue-600">{loanTermYears} years</span>
          </Label>
          <Slider
            value={[loanTermYears]}
            onValueChange={([value]) => setLoanTermYears(value)}
            min={10}
            max={30}
            step={1}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>10 years</span>
            <span>30 years</span>
          </div>
        </div>

        {/* Appreciation Rate */}
        <div className="space-y-3">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Expected Appreciation
            </span>
            <span className="font-semibold text-emerald-600">{appreciationRate.toFixed(1)}% p.a.</span>
          </Label>
          <Slider
            value={[appreciationRate]}
            onValueChange={([value]) => setAppreciationRate(value)}
            min={0}
            max={15}
            step={0.5}
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>0%</span>
            <span>15%</span>
          </div>
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

