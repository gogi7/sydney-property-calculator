import { Building2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyForm } from '@/components/PropertyForm';
import { MortgageCard } from '@/components/MortgageCard';
import { StampDutyCard } from '@/components/StampDutyCard';
import { BuyingCostsCard } from '@/components/BuyingCostsCard';
import { StampDutyRecoveryCard } from '@/components/StampDutyRecoveryCard';
import { InterestRateScenariosCard } from '@/components/InterestRateScenariosCard';
import { WealthProjectionCard } from '@/components/WealthProjectionCard';
import { SummaryExport } from '@/components/SummaryExport';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { useState } from 'react';

function App() {
  const reset = usePropertyStore((state) => state.reset);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Sydney Property Calculator
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">
                  NSW Mortgage & Investment Analysis
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={reset}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <PropertyForm />
            <SummaryExport />
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="scenarios">Rate Scenarios</TabsTrigger>
                <TabsTrigger value="projections">Projections</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MortgageCard />
                  <StampDutyCard />
                </div>
                <BuyingCostsCard />
              </TabsContent>

              <TabsContent value="scenarios" className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InterestRateScenariosCard />
                  <StampDutyRecoveryCard />
                </div>
              </TabsContent>

              <TabsContent value="projections" className="space-y-6 animate-fade-in">
                <WealthProjectionCard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-500">
            ⚠️ This calculator is for educational purposes only. Always consult financial professionals for investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
