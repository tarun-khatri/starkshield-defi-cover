
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useInsurance } from '@/contexts/InsuranceContext';
import { useWallet } from '@/contexts/WalletContext';
import InsuranceCard from '@/components/InsuranceCard';
import BuyInsuranceModal from '@/components/BuyInsuranceModal';
import ProvideLiquidityModal from '@/components/ProvideLiquidityModal';
import { ArrowDown } from 'lucide-react';
import { InsurancePool } from '@/types';

const Home = () => {
  const { insurancePools } = useInsurance();
  const { walletState } = useWallet();
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [provideModalOpen, setProvideModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<InsurancePool | undefined>(undefined);
  
  const handleSelectBuyPool = (pool: InsurancePool) => {
    setSelectedPool(pool);
    setBuyModalOpen(true);
  };
  
  const handleSelectProvidePool = (pool: InsurancePool) => {
    setSelectedPool(pool);
    setProvideModalOpen(true);
  };
  
  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-32 background-gradient">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Buy insurance on <span className="text-gradient">ETH crashes.</span>
                <br />
                Or earn by <span className="text-gradient">insuring others.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                DeFi Shield offers transparent on-chain coverage against price drops, powered by Pragma oracles on Starknet.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/buy">Buy Insurance</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/provide">Provide Liquidity</Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Button variant="ghost" size="icon" onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            <ArrowDown className="h-5 w-5" />
          </Button>
        </div>
      </section>
      
      <section id="features" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl">Popular Coverage Options</h2>
            <p className="text-muted-foreground">
              Choose from our most popular insurance options or create your own.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insurancePools.slice(0, 3).map((pool) => (
              <InsuranceCard
                key={pool.id}
                pool={pool}
                onSelect={() => handleSelectBuyPool(pool)}
                type="buy"
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button asChild>
              <Link to="/buy">See All Coverage Options</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <section className="bg-muted py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-3xl">How It Works</h2>
            <p className="text-muted-foreground">
              DeFi Shield makes insurance simple, transparent, and decentralized.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-gradient border rounded-lg p-6 hover-card-effect">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-insurance-purple-100 text-insurance-purple-500 mb-5">
                <span className="text-2xl font-semibold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Coverage</h3>
              <p className="text-muted-foreground">
                Select a pre-defined condition like "ETH drops >10% in 24h" or create your own.
              </p>
            </div>
            
            <div className="card-gradient border rounded-lg p-6 hover-card-effect">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-insurance-purple-100 text-insurance-purple-500 mb-5">
                <span className="text-2xl font-semibold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay Premium</h3>
              <p className="text-muted-foreground">
                Pay a small premium to get coverage. Your transaction is recorded on Starknet.
              </p>
            </div>
            
            <div className="card-gradient border rounded-lg p-6 hover-card-effect">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-insurance-purple-100 text-insurance-purple-500 mb-5">
                <span className="text-2xl font-semibold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Paid Automatically</h3>
              <p className="text-muted-foreground">
                If the condition is met, you automatically receive your payout verified by Pragma oracles.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" asChild>
              <Link to="/provide">Become an Insurer</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <BuyInsuranceModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        selectedPool={selectedPool}
      />
      
      <ProvideLiquidityModal
        isOpen={provideModalOpen}
        onClose={() => setProvideModalOpen(false)}
        selectedPool={selectedPool}
      />
    </>
  );
};

export default Home;
