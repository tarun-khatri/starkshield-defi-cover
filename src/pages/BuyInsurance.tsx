
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInsurance } from '@/contexts/InsuranceContext';
import { useWallet } from '@/contexts/WalletContext';
import InsuranceCard from '@/components/InsuranceCard';
import BuyInsuranceModal from '@/components/BuyInsuranceModal';
import ConnectWallet from '@/components/ConnectWallet';
import { InsurancePool } from '@/types';

const BuyInsurance = () => {
  const { insurancePools, isLoading } = useInsurance();
  const { walletState } = useWallet();
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<InsurancePool | undefined>(undefined);
  
  const handleSelectPool = (pool: InsurancePool) => {
    setSelectedPool(pool);
    setBuyModalOpen(true);
  };
  
  // Filter pools by asset type
  const ethPools = insurancePools.filter(pool => pool.condition.asset === 'ETH');
  const btcPools = insurancePools.filter(pool => pool.condition.asset === 'BTC');
  const otherPools = insurancePools.filter(pool => !['ETH', 'BTC'].includes(pool.condition.asset));
  
  return (
    <>
      <div className="container px-4 py-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Buy Insurance Coverage</h1>
            <p className="text-muted-foreground mt-2">
              Protect against price drops with decentralized coverage
            </p>
          </div>
          {!walletState.connected && (
            <ConnectWallet />
          )}
        </div>
        
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="eth">ETH</TabsTrigger>
              <TabsTrigger value="btc">BTC</TabsTrigger>
              <TabsTrigger value="other">Other Assets</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insurancePools.map((pool) => (
                <InsuranceCard
                  key={pool.id}
                  pool={pool}
                  onSelect={() => handleSelectPool(pool)}
                  type="buy"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="eth" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ethPools.map((pool) => (
                <InsuranceCard
                  key={pool.id}
                  pool={pool}
                  onSelect={() => handleSelectPool(pool)}
                  type="buy"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="btc" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {btcPools.map((pool) => (
                <InsuranceCard
                  key={pool.id}
                  pool={pool}
                  onSelect={() => handleSelectPool(pool)}
                  type="buy"
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="other" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPools.map((pool) => (
                <InsuranceCard
                  key={pool.id}
                  pool={pool}
                  onSelect={() => handleSelectPool(pool)}
                  type="buy"
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <BuyInsuranceModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        selectedPool={selectedPool}
      />
    </>
  );
};

export default BuyInsurance;
