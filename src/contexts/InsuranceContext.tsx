
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { 
  InsurancePool, 
  UserCoverage, 
  UserLiquidity, 
  PriceData 
} from '../types';
import { 
  mockInsurancePools, 
  mockUserCoverages, 
  mockUserLiquidityPositions,
  mockPrices,
  calculatePremium
} from '../data/mockData';
import { useWallet } from './WalletContext';

interface InsuranceContextType {
  insurancePools: InsurancePool[];
  userCoverages: UserCoverage[];
  userLiquidity: UserLiquidity[];
  priceData: PriceData[];
  buyInsurance: (poolId: string, payoutAmount: number) => Promise<boolean>;
  provideLiquidity: (poolId: string, amount: number) => Promise<boolean>;
  withdrawLiquidity: (liquidityId: string) => Promise<boolean>;
  claimPayout: (coverageId: string) => Promise<boolean>;
  refreshData: () => void;
  isLoading: boolean;
}

const InsuranceContext = createContext<InsuranceContextType>({
  insurancePools: [],
  userCoverages: [],
  userLiquidity: [],
  priceData: [],
  buyInsurance: async () => false,
  provideLiquidity: async () => false,
  withdrawLiquidity: async () => false,
  claimPayout: async () => false,
  refreshData: () => {},
  isLoading: false
});

export const useInsurance = () => useContext(InsuranceContext);

export const InsuranceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { walletState } = useWallet();
  const [insurancePools, setInsurancePools] = useState<InsurancePool[]>([]);
  const [userCoverages, setUserCoverages] = useState<UserCoverage[]>([]);
  const [userLiquidity, setUserLiquidity] = useState<UserLiquidity[]>([]);
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Fetch insurance pools data
  useEffect(() => {
    const fetchData = () => {
      // In a real app, this would be an API call to the blockchain
      setTimeout(() => {
        setInsurancePools(mockInsurancePools);
        setPriceData(mockPrices);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchData();
  }, []);
  
  // Fetch user data when wallet is connected
  useEffect(() => {
    if (walletState.connected) {
      // In a real app, this would be an API call to the blockchain
      setTimeout(() => {
        setUserCoverages(mockUserCoverages);
        setUserLiquidity(mockUserLiquidityPositions);
      }, 500);
    } else {
      setUserCoverages([]);
      setUserLiquidity([]);
    }
  }, [walletState.connected]);
  
  // Function to buy insurance
  const buyInsurance = async (poolId: string, payoutAmount: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if wallet is connected
      if (!walletState.connected) {
        toast.error("Wallet not connected", {
          description: "Please connect your wallet to buy insurance"
        });
        setIsLoading(false);
        return false;
      }
      
      // Find the pool
      const pool = insurancePools.find(p => p.id === poolId);
      if (!pool) {
        toast.error("Pool not found");
        setIsLoading(false);
        return false;
      }
      
      // Calculate premium
      const premium = calculatePremium(payoutAmount, pool.premiumRate);
      
      // Mock transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new coverage to user coverages
      const newCoverage: UserCoverage = {
        id: `cov${Date.now()}`,
        poolId,
        condition: pool.condition,
        premium,
        payout: payoutAmount,
        startTime: Date.now(),
        endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        status: 'active'
      };
      
      setUserCoverages([...userCoverages, newCoverage]);
      
      // Update pool data
      const updatedPools = insurancePools.map(p => {
        if (p.id === poolId) {
          return {
            ...p,
            totalCoverage: p.totalCoverage + payoutAmount,
            activeUsers: p.activeUsers + 1
          };
        }
        return p;
      });
      
      setInsurancePools(updatedPools);
      
      toast.success("Insurance purchased successfully", {
        description: `You paid ${premium} USDC for a coverage of ${payoutAmount} USDC`
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Buy insurance error:', error);
      toast.error("Failed to buy insurance", {
        description: error.message || "Transaction failed"
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // Function to provide liquidity
  const provideLiquidity = async (poolId: string, amount: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Check if wallet is connected
      if (!walletState.connected) {
        toast.error("Wallet not connected", {
          description: "Please connect your wallet to provide liquidity"
        });
        setIsLoading(false);
        return false;
      }
      
      // Find the pool
      const pool = insurancePools.find(p => p.id === poolId);
      if (!pool) {
        toast.error("Pool not found");
        setIsLoading(false);
        return false;
      }
      
      // Mock transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new liquidity position to user liquidity
      const newLiquidity: UserLiquidity = {
        id: `liq${Date.now()}`,
        poolId,
        condition: pool.condition,
        stakedAmount: amount,
        earned: 0, // Initially earned nothing
        startTime: Date.now(),
        endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        status: 'active'
      };
      
      setUserLiquidity([...userLiquidity, newLiquidity]);
      
      // Update pool data
      const updatedPools = insurancePools.map(p => {
        if (p.id === poolId) {
          return {
            ...p,
            totalLiquidity: p.totalLiquidity + amount
          };
        }
        return p;
      });
      
      setInsurancePools(updatedPools);
      
      toast.success("Liquidity provided successfully", {
        description: `You staked ${amount} USDC in the pool`
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Provide liquidity error:', error);
      toast.error("Failed to provide liquidity", {
        description: error.message || "Transaction failed"
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // Function to withdraw liquidity
  const withdrawLiquidity = async (liquidityId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the liquidity position
      const position = userLiquidity.find(l => l.id === liquidityId);
      if (!position) {
        toast.error("Liquidity position not found");
        setIsLoading(false);
        return false;
      }
      
      // Mock transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user liquidity
      const updatedLiquidity = userLiquidity.map(l => {
        if (l.id === liquidityId) {
          return {
            ...l,
            status: 'withdrawn'
          };
        }
        return l;
      });
      
      setUserLiquidity(updatedLiquidity);
      
      // Update pool data
      const updatedPools = insurancePools.map(p => {
        if (p.id === position.poolId) {
          return {
            ...p,
            totalLiquidity: p.totalLiquidity - position.stakedAmount
          };
        }
        return p;
      });
      
      setInsurancePools(updatedPools);
      
      toast.success("Liquidity withdrawn successfully", {
        description: `You withdrew ${position.stakedAmount} USDC plus ${position.earned} USDC in earnings`
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Withdraw liquidity error:', error);
      toast.error("Failed to withdraw liquidity", {
        description: error.message || "Transaction failed"
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // Function to claim payout
  const claimPayout = async (coverageId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Find the coverage
      const coverage = userCoverages.find(c => c.id === coverageId);
      if (!coverage) {
        toast.error("Coverage not found");
        setIsLoading(false);
        return false;
      }
      
      // Mock transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user coverages
      const updatedCoverages = userCoverages.map(c => {
        if (c.id === coverageId) {
          return {
            ...c,
            status: 'claimed'
          };
        }
        return c;
      });
      
      setUserCoverages(updatedCoverages);
      
      toast.success("Payout claimed successfully", {
        description: `You received ${coverage.payout} USDC`
      });
      
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error('Claim payout error:', error);
      toast.error("Failed to claim payout", {
        description: error.message || "Transaction failed"
      });
      setIsLoading(false);
      return false;
    }
  };
  
  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // In a real app, this would be an API call to the blockchain
    setTimeout(() => {
      setInsurancePools(mockInsurancePools);
      setPriceData(mockPrices);
      
      if (walletState.connected) {
        setUserCoverages(mockUserCoverages);
        setUserLiquidity(mockUserLiquidityPositions);
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  return (
    <InsuranceContext.Provider value={{
      insurancePools,
      userCoverages,
      userLiquidity,
      priceData,
      buyInsurance,
      provideLiquidity,
      withdrawLiquidity,
      claimPayout,
      refreshData,
      isLoading
    }}>
      {children}
    </InsuranceContext.Provider>
  );
};
