import { useState } from 'react';
import { Clock, TrendingUp, TrendingDown, AlertTriangle, ArrowRight, CheckCircle, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { calculateNSWStampDuty, calculateStampDutyRecovery } from '@/lib/calculations';
import { formatCurrency } from '@/lib/formatters/currency';
import { GROWTH_SCENARIOS, INTEREST_RATE_SCENARIOS } from '@/constants';

export function StampDutyRecoveryCard() {
  const { propertyPrice, isFirstHomeBuyer } = usePropertyStore();
  const [selectedGrowthRate, setSelectedGrowthRate] = useState(0.05); // Default to 5% growth
  const [selectedInterestScenario, setSelectedInterestScenario] = useState('unchanged');

  const stampDuty = calculateNSWStampDuty(propertyPrice, isFirstHomeBuyer);
  const interestScenario = INTEREST_RATE_SCENARIOS.find(s => s.id === selectedInterestScenario) || INTEREST_RATE_SCENARIOS[0];
  
  // Calculate recovery for all growth scenarios
  const recoveryScenarios = GROWTH_SCENARIOS.map(scenario => {
    const recovery = calculateStampDutyRecovery(
      propertyPrice,
      stampDuty.finalStampDuty,
      scenario.rate * 100 // Convert to percentage
    );
    return {
      ...scenario,
      recovery,
      appreciation: recovery.propertyValueAtRecovery - propertyPrice,
    };
  });

  // Find the selected scenario
  const selectedScenario = recoveryScenarios.find(s => s.rate === selectedGrowthRate) || recoveryScenarios[1];

  return (
    <Card className="border-slate-200/60 shadow-lg overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Stamp Duty Recovery Analysis
        </CardTitle>
        <p className="text-sm text-violet-100 mt-1">
          How long until property appreciation offsets your stamp duty cost
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Interest Rate Scenario Selector */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Percent className="w-4 h-4" />
            Interest Rate Scenario (Future Reference)
          </p>
          <div className="space-y-2">
            {INTEREST_RATE_SCENARIOS.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => setSelectedInterestScenario(scenario.id)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedInterestScenario === scenario.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-semibold text-slate-800">{scenario.name}</p>
                <p className="text-xs text-slate-600 mt-1">{scenario.description}</p>
              </button>
            ))}
          </div>
          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-slate-600">
            💡 Interest rate scenarios are for context. Recovery time is based on property growth only.
          </div>
        </div>

        {/* Property Growth Scenario Selector */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Property Growth Scenario (Affects Recovery)
          </p>
          <div className="space-y-2">
            {recoveryScenarios.map((scenario) => {
              const icon = scenario.rate >= 0.05 ? TrendingUp : scenario.rate <= -0.02 ? TrendingDown : AlertTriangle;
              const Icon = icon;
              const isSelected = selectedGrowthRate === scenario.rate;
              const canRecover = scenario.recovery.monthsToRecover > 0 && scenario.recovery.monthsToRecover < 360;
              
              return (
                <button
                  key={scenario.label}
                  onClick={() => setSelectedGrowthRate(scenario.rate)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-semibold text-slate-800">{scenario.label}</span>
                    </div>
                    {canRecover ? (
                      <span className={`text-sm font-medium ${
                        scenario.recovery.yearsToRecover <= 5 ? 'text-emerald-600' :
                        scenario.recovery.yearsToRecover <= 10 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {scenario.recovery.yearsToRecover.toFixed(1)} years
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-red-600">
                        {scenario.rate <= 0 ? 'Never recovers' : '30+ years'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Recovery Information for Selected Scenario */}
        {selectedScenario.recovery.monthsToRecover > 0 && selectedScenario.recovery.monthsToRecover < 360 ? (
          <>
            {/* Recovery Time */}
            <div className="text-center p-6 bg-violet-50 rounded-xl">
              <p className="text-sm text-violet-600 mb-2">Time to Recover Stamp Duty</p>
              <p className="text-4xl font-bold text-violet-600">
                {selectedScenario.recovery.yearsToRecover.toFixed(1)} years
              </p>
              <p className="text-slate-500 text-sm mt-1">
                ({selectedScenario.recovery.monthsToRecover} months at {(selectedScenario.rate * 100).toFixed(0)}% p.a.)
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
                  {formatCurrency(selectedScenario.appreciation)}
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
                  {formatCurrency(selectedScenario.recovery.propertyValueAtRecovery)}
                </span>
              </div>
            </div>

            {/* New Stamp Duty Warning */}
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800 font-medium mb-1">
                💡 Stamp duty at new value:
              </p>
              <p className="text-amber-600 font-bold">
                {formatCurrency(selectedScenario.recovery.newStampDutyAtRecovery)}
              </p>
              <p className="text-xs text-amber-700 mt-1">
                If you sold and bought again at this price
              </p>
            </div>
          </>
        ) : (
          <div className="p-6 bg-red-50 rounded-lg text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="font-semibold text-red-700 mb-2">
              {selectedScenario.rate <= 0 ? 'Stamp Duty Cannot Be Recovered' : 'Very Long Recovery Period'}
            </p>
            <p className="text-sm text-red-600">
              {selectedScenario.rate <= 0 
                ? 'With negative or no growth, the property value won\'t increase enough to offset stamp duty costs.'
                : 'At this growth rate, it would take more than 30 years to recover stamp duty through appreciation.'
              }
            </p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <p className="text-sm font-semibold text-slate-700">Recovery Comparison</p>
          </div>
          <div className="divide-y divide-slate-200">
            {recoveryScenarios.map((scenario) => {
              const canRecover = scenario.recovery.monthsToRecover > 0 && scenario.recovery.monthsToRecover < 360;
              return (
                <div 
                  key={scenario.label}
                  className={`px-4 py-3 flex items-center justify-between ${
                    selectedGrowthRate === scenario.rate ? 'bg-violet-50' : ''
                  }`}
                >
                  <span className="text-sm text-slate-700">{scenario.label}</span>
                  {canRecover ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className={`text-sm font-medium ${
                        scenario.recovery.yearsToRecover <= 5 ? 'text-emerald-600' :
                        scenario.recovery.yearsToRecover <= 10 ? 'text-blue-600' :
                        'text-orange-600'
                      }`}>
                        {scenario.recovery.yearsToRecover.toFixed(1)} yrs
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-red-600">
                      {scenario.rate <= 0 ? '—' : '30+ yrs'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="font-semibold text-slate-700 mb-2">Important Notes:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Recovery time measures when property appreciation equals stamp duty paid</li>
            <li>• Recovery is based purely on property growth, not interest rates</li>
            <li>• Interest rate scenarios shown for context only (affects loan costs, not recovery)</li>
            <li>• This doesn't account for selling costs (agent fees, marketing, etc.)</li>
            <li>• Assumes consistent annual growth rate (actual markets vary)</li>
            <li>• Doesn't include opportunity cost of capital invested in stamp duty</li>
            <li>• First home buyer concessions already factored into stamp duty amount</li>
            {stampDuty.isFHBExempt && (
              <li>• ✓ You received full stamp duty exemption as a first home buyer!</li>
            )}
            {stampDuty.fhbDiscount > 0 && !stampDuty.isFHBExempt && (
              <li>• ✓ First home buyer discount of {formatCurrency(stampDuty.fhbDiscount)} applied</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

