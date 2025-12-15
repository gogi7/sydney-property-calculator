import { Receipt, Gift, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';
import { NSW_STAMP_DUTY_TIERS } from '@/constants';

export function StampDutyCard() {
  const { propertyPrice, isFirstHomeBuyer } = usePropertyStore();

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          NSW Stamp Duty
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {/* Final Amount */}
        <div className="text-center p-6 bg-orange-50 rounded-xl">
          <p className="text-sm text-orange-600 mb-2">
            {isFirstHomeBuyer ? 'After FHB Concession' : 'Total Stamp Duty'}
          </p>
          <p className="text-4xl font-bold text-orange-600">
            {formatCurrency(stampDuty.finalStampDuty)}
          </p>
          {stampDuty.isFHBExempt && (
            <Badge variant="success" className="mt-3">
              <Gift className="w-3 h-3 mr-1" />
              FHB Exempt!
            </Badge>
          )}
        </div>

        {/* FHB Discount */}
        {isFirstHomeBuyer && stampDuty.fhbDiscount > 0 && !stampDuty.isFHBExempt && (
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Gift className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">FHB Discount</p>
                <p className="font-bold text-emerald-600">
                  {formatCurrency(stampDuty.fhbDiscount)}
                </p>
              </div>
            </div>
            <Badge variant="success">You save!</Badge>
          </div>
        )}

        {/* Base Stamp Duty */}
        {isFirstHomeBuyer && stampDuty.fhbDiscount > 0 && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Base stamp duty:</span>
              <span className="font-medium text-slate-500 line-through">
                {formatCurrency(stampDuty.baseStampDuty)}
              </span>
            </div>
          </div>
        )}

        {/* Rate Info */}
        <div className="p-4 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-medium text-slate-600">NSW Rate Tiers</p>
          </div>
          <div className="space-y-1 text-xs text-slate-500">
            {NSW_STAMP_DUTY_TIERS.slice(0, 4).map((tier, idx) => (
              <div key={idx} className="flex justify-between">
                <span>
                  {idx === 0 ? '$0' : `$${tier.threshold.toLocaleString()}`}+
                </span>
                <span>{(tier.rate * 100).toFixed(2)}%</span>
              </div>
            ))}
            <p className="text-slate-400 pt-1">... and higher tiers</p>
          </div>
        </div>

        {/* FHB Note */}
        {!isFirstHomeBuyer && (
          <p className="text-xs text-center text-slate-500 p-2 bg-blue-50 rounded-lg">
            💡 Enable "First Home Buyer" for potential stamp duty savings
          </p>
        )}
      </CardContent>
    </Card>
  );
}

