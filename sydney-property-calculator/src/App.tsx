import { Building2, RefreshCw, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropertyForm } from '@/components/PropertyForm';
import { FundsBreakdownCard } from '@/components/FundsBreakdownCard';
import { MortgageCard } from '@/components/MortgageCard';
import { StampDutyCard } from '@/components/StampDutyCard';
import { BuyingCostsCard } from '@/components/BuyingCostsCard';
import { StampDutyRecoveryCard } from '@/components/StampDutyRecoveryCard';
import { FiveYearOutlookCard } from '@/components/FiveYearOutlookCard';
import { SummaryExport } from '@/components/SummaryExport';
import { usePropertyStore } from '@/hooks/usePropertyStore';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

function App() {
  const reset = usePropertyStore((state) => state.reset);
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('repayments');

  return (
    <div className="min-h-screen pb-12 bg-background text-foreground">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Sydney Property Calculator
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  NSW Mortgage & Investment Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Light</span>
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>
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
          <div className="lg:col-span-8 space-y-6">
            <FundsBreakdownCard />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="repayments">Repayments</TabsTrigger>
                <TabsTrigger value="costs">Buying Costs</TabsTrigger>
                <TabsTrigger value="recovery">Stamp Duty</TabsTrigger>
                <TabsTrigger value="outlook">5-Year Outlook</TabsTrigger>
              </TabsList>

              <TabsContent value="repayments" className="space-y-6 animate-fade-in">
                <MortgageCard />
              </TabsContent>

              <TabsContent value="costs" className="space-y-6 animate-fade-in">
                <BuyingCostsCard />
                <StampDutyCard />
              </TabsContent>

              <TabsContent value="recovery" className="space-y-6 animate-fade-in">
                <StampDutyRecoveryCard />
              </TabsContent>

              <TabsContent value="outlook" className="space-y-6 animate-fade-in">
                <FiveYearOutlookCard />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-sm border-t border-border py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-muted-foreground">
            ⚠️ This calculator is for educational purposes only. Always consult financial professionals for investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
