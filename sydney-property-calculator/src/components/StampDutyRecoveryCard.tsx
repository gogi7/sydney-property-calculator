import { useState } from 'react';
import { Clock, TrendingUp, ArrowRight, AlertTriangle, CheckCircle, Percent, Home, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateStampDutyRecovery, calculateStampDutyDoubleRecovery, calculateBaseStampDuty } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';

export function StampDutyRecoveryCard() {
  const { propertyPrice, isFirstHomeBuyer } = usePropertyStore();
  const [propertyGrowthRate, setPropertyGrowthRate] = useState(5); // 5% default
  const [interestRate, setInterestRate] = useState(5.34); // 5.34% default
  const [newHousePrice, setNewHousePrice] = useState(propertyPrice);

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);

  // Calculate recovery based on current slider values
  const recovery = calculateStampDutyRecovery(
    propertyPrice,
    stampDuty.finalStampDuty,
    propertyGrowthRate
  );

  // Calculate double recovery (original stamp duty + stamp duty on same-priced house)
  const doubleRecovery = calculateStampDutyDoubleRecovery(
    propertyPrice,
    stampDuty.finalStampDuty,
    propertyPrice,
    propertyGrowthRate
  );

  // Calculate recovery for custom new house price
  const customNewHouseRecovery = calculateStampDutyDoubleRecovery(
    propertyPrice,
    stampDuty.finalStampDuty,
    newHousePrice,
    propertyGrowthRate
  );

  const newHouseStampDuty = calculateBaseStampDuty(newHousePrice);
  const totalCustomRecovery = stampDuty.finalStampDuty + newHouseStampDuty;

  const appreciation = recovery.propertyValueAtRecovery - propertyPrice;
  const canRecover = recovery.monthsToRecover > 0 && recovery.monthsToRecover < 360;
  const canDoubleRecover = doubleRecovery.monthsToRecover > 0 && doubleRecovery.monthsToRecover < 600;
  const canCustomRecover = customNewHouseRecovery.monthsToRecover > 0 && customNewHouseRecovery.monthsToRecover < 600;

  // Get color based on recovery time
  const getRecoveryColor = (years: number, canRecover: boolean) => {
    if (!canRecover) return 'text-red-600 dark:text-red-400';
    if (years <= 5) return 'text-emerald-600 dark:text-emerald-400';
    if (years <= 10) return 'text-blue-600 dark:text-blue-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  const getRecoveryBgColor = (years: number, canRecover: boolean) => {
    if (!canRecover) return 'bg-red-50 dark:bg-red-950/30';
    if (years <= 5) return 'bg-emerald-50 dark:bg-emerald-950/30';
    if (years <= 10) return 'bg-blue-50 dark:bg-blue-950/30';
    return 'bg-orange-50 dark:bg-orange-950/30';
  };

  const getRecoveryBorderColor = (years: number, canRecover: boolean) => {
    if (!canRecover) return 'border-red-200 dark:border-red-800';
    if (years <= 5) return 'border-emerald-200 dark:border-emerald-800';
    if (years <= 10) return 'border-blue-200 dark:border-blue-800';
    return 'border-orange-200 dark:border-orange-800';
  };

  const getRecoveryLabel = (years: number) => {
    if (years <= 5) return 'Excellent';
    if (years <= 10) return 'Good';
    if (years <= 20) return 'Long';
    return 'Very Long';
  };

  // Format new house price for slider display
  const formatSliderPrice = (price: number) => {
    if (price >= 1_000_000) {
      return `$${(price / 1_000_000).toFixed(2)}M`;
    }
    return `$${(price / 1_000).toFixed(0)}K`;
  };

  // Slider min/max for new house price
  const minNewHousePrice = Math.max(100_000, Math.round(propertyPrice * 0.3));
  const maxNewHousePrice = Math.round(propertyPrice * 3);
  const newHousePriceStep = propertyPrice >= 1_000_000 ? 25_000 : 10_000;

  return (
    <Card className="border-slate-200/60 dark:border-slate-700/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Interactive Stamp Duty Recovery Analysis
        </CardTitle>
        <p className="text-sm text-violet-100 mt-1">
          Adjust sliders to see how growth rates affect your stamp duty recovery timeline
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Interest Rate Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Interest Rate Scenario
              </label>
            </div>
            <Badge variant="secondary" className="text-sm font-mono">
              {interestRate.toFixed(2)}% p.a.
            </Badge>
          </div>
          <Slider
            value={[interestRate]}
            onValueChange={(value) => setInterestRate(value[0])}
            min={2}
            max={10}
            step={0.1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>2% (Low)</span>
            <span>5.34% (Current)</span>
            <span>10% (High)</span>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-xs text-slate-600 dark:text-slate-400">
            Interest rate shown for context. Recovery time is based on property growth only.
          </div>
        </div>

        {/* Property Growth Rate Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Property Annual Growth Rate
              </label>
            </div>
            <Badge
              variant="secondary"
              className={`text-sm font-mono ${
                propertyGrowthRate < 0 ? 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400' :
                propertyGrowthRate >= 5 ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
                'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
              }`}
            >
              {propertyGrowthRate > 0 ? '+' : ''}{propertyGrowthRate.toFixed(1)}% p.a.
            </Badge>
          </div>
          <Slider
            value={[propertyGrowthRate]}
            onValueChange={(value) => setPropertyGrowthRate(value[0])}
            min={-5}
            max={10}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>-5% (Decline)</span>
            <span>0%</span>
            <span>+5% (Moderate)</span>
            <span>+10% (Strong)</span>
          </div>
        </div>

        {/* Recovery Time Display */}
        {canRecover && propertyGrowthRate > 0 ? (
          <>
            <div className={`text-center p-6 ${getRecoveryBgColor(recovery.yearsToRecover, canRecover)} rounded-xl border-2 ${getRecoveryBorderColor(recovery.yearsToRecover, canRecover)}`}>
              <p className={`text-sm ${getRecoveryColor(recovery.yearsToRecover, canRecover)} mb-2 font-medium`}>
                Time to Recover Stamp Duty
              </p>
              <p className={`text-5xl font-bold ${getRecoveryColor(recovery.yearsToRecover, canRecover)}`}>
                {recovery.yearsToRecover.toFixed(1)}
              </p>
              <p className={`text-lg font-semibold ${getRecoveryColor(recovery.yearsToRecover, canRecover)} mt-1`}>
                years
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                ({recovery.monthsToRecover} months at {propertyGrowthRate.toFixed(1)}% p.a.)
              </p>
            </div>

            {/* Recovery Details */}
            <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Stamp Duty Paid</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {formatCurrency(stampDuty.finalStampDuty)}
                </span>
              </div>

              <div className="flex items-center gap-2 justify-center text-slate-400 dark:text-slate-600">
                <ArrowRight className="w-4 h-4" />
                <span className="text-xs">Property must appreciate by</span>
                <ArrowRight className="w-4 h-4" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Required Appreciation</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(appreciation)}
                </span>
              </div>
            </div>

            {/* Property Value at Recovery */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Property Value at Recovery</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-slate-600 dark:text-slate-400">{formatCurrency(propertyPrice)}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(recovery.propertyValueAtRecovery)}
                </span>
              </div>
            </div>

            {/* New Stamp Duty Warning */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-400 font-medium mb-1">
                Stamp duty at new value:
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-bold text-lg">
                {formatCurrency(recovery.newStampDutyAtRecovery)}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                If you sold and bought again at this price
              </p>
            </div>

            {/* === DOUBLE RECOVERY SECTION === */}
            <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Stamp Duty Doubling Recovery
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                How long until your property appreciates enough to cover <strong>both</strong> the stamp duty you already paid <strong>and</strong> the stamp duty you'd pay buying another house at the same price — effectively making stamp duty "free".
              </p>

              {canDoubleRecover ? (
                <div className={`text-center p-6 ${getRecoveryBgColor(doubleRecovery.yearsToRecover, canDoubleRecover)} rounded-xl border-2 ${getRecoveryBorderColor(doubleRecovery.yearsToRecover, canDoubleRecover)}`}>
                  <p className={`text-sm ${getRecoveryColor(doubleRecovery.yearsToRecover, canDoubleRecover)} mb-2 font-medium`}>
                    Time to Recover Double Stamp Duty
                  </p>
                  <p className={`text-5xl font-bold ${getRecoveryColor(doubleRecovery.yearsToRecover, canDoubleRecover)}`}>
                    {doubleRecovery.yearsToRecover.toFixed(1)}
                  </p>
                  <p className={`text-lg font-semibold ${getRecoveryColor(doubleRecovery.yearsToRecover, canDoubleRecover)} mt-1`}>
                    years
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                    ({doubleRecovery.monthsToRecover} months at {propertyGrowthRate.toFixed(1)}% p.a.)
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg text-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                    Cannot recover double stamp duty within 50 years at this growth rate.
                  </p>
                </div>
              )}

              {/* Double recovery breakdown */}
              <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2 bg-card">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Original stamp duty paid</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(stampDuty.finalStampDuty)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Stamp duty on same-priced new house</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(calculateBaseStampDuty(propertyPrice))}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Total to recover</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(stampDuty.finalStampDuty + calculateBaseStampDuty(propertyPrice))}
                  </span>
                </div>
              </div>
            </div>

            {/* === CUSTOM NEW HOUSE PRICE SECTION === */}
            <div className="border-t-2 border-dashed border-slate-300 dark:border-slate-600 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Next House Recovery Calculator
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Set the price of your <strong>next house</strong> and see how long your current property needs to appreciate to cover the original stamp duty <strong>plus</strong> the stamp duty on the new purchase.
              </p>

              {/* New House Price Slider */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    New House Price
                  </label>
                  <Badge variant="secondary" className="text-sm font-mono bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400">
                    {formatCurrency(newHousePrice)}
                  </Badge>
                </div>
                <Slider
                  value={[newHousePrice]}
                  onValueChange={(value) => setNewHousePrice(value[0])}
                  min={minNewHousePrice}
                  max={maxNewHousePrice}
                  step={newHousePriceStep}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>{formatSliderPrice(minNewHousePrice)}</span>
                  <span>{formatSliderPrice(propertyPrice)} (same)</span>
                  <span>{formatSliderPrice(maxNewHousePrice)}</span>
                </div>
              </div>

              {canCustomRecover && propertyGrowthRate > 0 ? (
                <div className={`text-center p-6 ${getRecoveryBgColor(customNewHouseRecovery.yearsToRecover, canCustomRecover)} rounded-xl border-2 ${getRecoveryBorderColor(customNewHouseRecovery.yearsToRecover, canCustomRecover)}`}>
                  <p className={`text-sm ${getRecoveryColor(customNewHouseRecovery.yearsToRecover, canCustomRecover)} mb-2 font-medium`}>
                    Time to Recover for Next House Move
                  </p>
                  <p className={`text-5xl font-bold ${getRecoveryColor(customNewHouseRecovery.yearsToRecover, canCustomRecover)}`}>
                    {customNewHouseRecovery.yearsToRecover.toFixed(1)}
                  </p>
                  <p className={`text-lg font-semibold ${getRecoveryColor(customNewHouseRecovery.yearsToRecover, canCustomRecover)} mt-1`}>
                    years
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                    ({customNewHouseRecovery.monthsToRecover} months at {propertyGrowthRate.toFixed(1)}% p.a.)
                  </p>
                  <Badge className={`mt-3 ${
                    customNewHouseRecovery.yearsToRecover <= 5 ? 'bg-emerald-600' :
                    customNewHouseRecovery.yearsToRecover <= 10 ? 'bg-blue-600' :
                    customNewHouseRecovery.yearsToRecover <= 20 ? 'bg-orange-600' :
                    'bg-red-600'
                  }`}>
                    {getRecoveryLabel(customNewHouseRecovery.yearsToRecover)} Recovery Timeline
                  </Badge>
                </div>
              ) : (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg text-center">
                  <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400 mx-auto mb-2" />
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">
                    {propertyGrowthRate <= 0
                      ? 'Cannot recover with negative or zero growth.'
                      : 'Cannot recover within 50 years at this growth rate.'}
                  </p>
                </div>
              )}

              {/* Custom recovery breakdown */}
              <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-2 bg-card">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Original stamp duty paid</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(stampDuty.finalStampDuty)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Stamp duty on {formatCurrency(newHousePrice)} house</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {formatCurrency(newHouseStampDuty)}
                  </span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Total appreciation needed</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalCustomRecovery)}
                  </span>
                </div>
                {canCustomRecover && propertyGrowthRate > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Property value at recovery</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(customNewHouseRecovery.propertyValueAtRecovery)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Recovery Status */}
            <div className={`p-4 rounded-lg ${getRecoveryBgColor(recovery.yearsToRecover, canRecover)} border-2 ${
              recovery.yearsToRecover <= 5 ? 'border-emerald-300 dark:border-emerald-700' :
              recovery.yearsToRecover <= 10 ? 'border-blue-300 dark:border-blue-700' :
              'border-orange-300 dark:border-orange-700'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle className={`w-5 h-5 ${getRecoveryColor(recovery.yearsToRecover, canRecover)}`} />
                <p className={`font-semibold ${getRecoveryColor(recovery.yearsToRecover, canRecover)}`}>
                  {recovery.yearsToRecover <= 5 ? 'Excellent Recovery Timeline!' :
                   recovery.yearsToRecover <= 10 ? 'Good Recovery Timeline' :
                   'Long Recovery Period'}
                </p>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                {recovery.yearsToRecover <= 5 ? 'Property value should recover stamp duty costs relatively quickly.' :
                 recovery.yearsToRecover <= 10 ? 'Moderate timeline for stamp duty recovery through appreciation.' :
                 'Consider other benefits of ownership as stamp duty recovery will take considerable time.'}
              </p>
            </div>
          </>
        ) : (
          <div className="p-6 bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-800 rounded-lg text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
            <p className="font-semibold text-red-700 dark:text-red-400 mb-2 text-lg">
              {propertyGrowthRate <= 0 ? 'Stamp Duty Cannot Be Recovered' : 'Very Long Recovery Period'}
            </p>
            <p className="text-sm text-red-600 dark:text-red-400">
              {propertyGrowthRate <= 0
                ? 'With negative or no growth, the property value won\'t increase enough to offset stamp duty costs. Consider waiting for better market conditions.'
                : 'At this growth rate, it would take more than 30 years to recover stamp duty through appreciation. Focus on other ownership benefits.'
              }
            </p>
          </div>
        )}

        {/* Quick Scenarios Reference */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-card">
          <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-2 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Scenario Reference</p>
          </div>
          <div className="p-4 space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setPropertyGrowthRate(7)}>
              <span className="text-slate-600 dark:text-slate-400">Strong Growth (+7%)</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">~2.3 years</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setPropertyGrowthRate(5)}>
              <span className="text-slate-600 dark:text-slate-400">Moderate Growth (+5%)</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium">~3.2 years</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer" onClick={() => setPropertyGrowthRate(1)}>
              <span className="text-slate-600 dark:text-slate-400">Weak Growth (+1%)</span>
              <span className="text-orange-600 dark:text-orange-400 font-medium">~16 years</span>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2 text-sm">Important Notes:</p>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Recovery time measures when property appreciation equals stamp duty paid</li>
            <li>• "Double recovery" shows time to cover both your original and next purchase stamp duty</li>
            <li>• Recovery is based purely on property growth, not interest rates</li>
            <li>• Interest rate affects your loan costs but not the recovery calculation</li>
            <li>• This doesn't account for selling costs (agent fees, marketing, legal, etc.)</li>
            <li>• Assumes consistent annual growth rate (actual markets vary significantly)</li>
            <li>• Doesn't include opportunity cost of capital invested in stamp duty</li>
            {stampDuty.isFHBExempt && (
              <li className="text-emerald-600 dark:text-emerald-400">• You received full stamp duty exemption as a first home buyer!</li>
            )}
            {stampDuty.fhbDiscount > 0 && !stampDuty.isFHBExempt && (
              <li className="text-emerald-600 dark:text-emerald-400">• First home buyer discount of {formatCurrency(stampDuty.fhbDiscount)} applied</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
