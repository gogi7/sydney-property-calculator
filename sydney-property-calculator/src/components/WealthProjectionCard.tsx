import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateMortgage, calculateWealthProjection } from '@/lib/calculations';
import { formatCurrency, formatCurrencyCompact } from '@/lib/formatters/currency';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function WealthProjectionCard() {
  const { propertyPrice, depositPercent, interestRate, loanTermYears, appreciationRate } = usePropertyStore();

  const mortgage = calculateMortgage(propertyPrice, depositPercent, interestRate, loanTermYears);
  const projections = calculateWealthProjection(
    propertyPrice,
    mortgage.loanAmount,
    interestRate,
    loanTermYears,
    appreciationRate,
    10
  );

  const year10 = projections[10];
  const equityGrowth = year10.equity - (propertyPrice - mortgage.loanAmount);
  const initialEquity = propertyPrice * (depositPercent / 100);

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          10-Year Wealth Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl text-center">
            <p className="text-sm text-emerald-700 mb-1">Property Value (Yr 10)</p>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrencyCompact(year10.propertyValue)}
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl text-center">
            <p className="text-sm text-blue-700 mb-1">Equity (Yr 10)</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrencyCompact(year10.equity)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projections} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProperty" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLoan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `Yr ${value}`}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCurrencyCompact(value)}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [formatCurrency(value), name]}
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="propertyValue"
                name="Property Value"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProperty)"
              />
              <Area
                type="monotone"
                dataKey="equity"
                name="Equity"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorEquity)"
              />
              <Area
                type="monotone"
                dataKey="loanBalance"
                name="Loan Balance"
                stroke="#f97316"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorLoan)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-slate-600">Equity Growth</span>
            </div>
            <span className="font-semibold text-emerald-600">
              +{formatCurrency(equityGrowth)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Starting Equity</span>
            <span className="font-semibold">{formatCurrency(initialEquity)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Total Paid (10 years)</span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(year10.totalPaid)}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Loan Balance (Yr 10)</span>
            <span className="font-semibold">{formatCurrency(year10.loanBalance)}</span>
          </div>
        </div>

        <div className="text-center">
          <Badge variant="secondary">
            Based on {appreciationRate}% annual appreciation
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

