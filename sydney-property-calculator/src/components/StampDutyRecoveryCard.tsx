import { Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateStampDutyRecovery } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function StampDutyRecoveryCard() {
  const { propertyPrice, isFirstHomeBuyer, appreciationRate } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const recovery = calculateStampDutyRecovery(propertyPrice, stampDuty.finalStampDuty, appreciationRate);

  const appreciation = recovery.propertyValueAtRecovery - propertyPrice;

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Stamp Duty Recovery
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Recovery Time */}
        <div className="text-center p-6 bg-violet-50 rounded-xl">
          <p className="text-sm text-violet-600 mb-2">Time to Recover Stamp Duty</p>
          <p className="text-4xl font-bold text-violet-600">
            {recovery.yearsToRecover.toFixed(1)} years
          </p>
          <p className="text-slate-500 text-sm mt-1">
            ({recovery.monthsToRecover} months at {appreciationRate}% p.a.)
          </p>
        </div>

        {/* Recovery Details */}
        <div className="p-4 border border-slate-200 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Stamp Duty Paid</span>
            <span className="font-semibold text-orange-600">
              {formatCurrency(stampDuty.finalStampDuty)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 justify-center text-slate-400">
            <ArrowRight className="w-4 h-4" />
            <span className="text-xs">Property must appreciate by</span>
            <ArrowRight className="w-4 h-4" />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Required Appreciation</span>
            <span className="font-semibold text-emerald-600">
              {formatCurrency(appreciation)}
            </span>
          </div>
        </div>

        {/* Property Value at Recovery */}
        <div className="p-4 bg-emerald-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Property Value at Recovery</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500">{formatCurrency(propertyPrice)}</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-xl font-bold text-emerald-600">
              {formatCurrency(recovery.propertyValueAtRecovery)}
            </span>
          </div>
        </div>

        {/* New Stamp Duty Warning */}
        <div className="p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-amber-800 font-medium mb-1">
            💡 Stamp duty at new value:
          </p>
          <p className="text-amber-600 font-bold">
            {formatCurrency(recovery.newStampDutyAtRecovery)}
          </p>
          <p className="text-xs text-amber-700 mt-1">
            If you sold and bought again at this price
          </p>
        </div>

        {/* Rate Info */}
        <div className="text-center">
          <Badge variant="secondary">
            Based on {appreciationRate}% annual appreciation
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

