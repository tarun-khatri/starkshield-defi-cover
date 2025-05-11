
import { InsurancePool, UserCoverage, UserLiquidity, PriceData } from '../types';

// Current timestamp
const now = Date.now();
const day = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const mockPrices: PriceData[] = [
  { symbol: 'ETH', price: 3250, timestamp: now, change24h: -2.5 },
  { symbol: 'BTC', price: 65000, timestamp: now, change24h: -1.2 },
  { symbol: 'AVAX', price: 42, timestamp: now, change24h: -3.8 },
];

export const mockInsurancePools: InsurancePool[] = [
  {
    id: '1',
    condition: {
      asset: 'ETH',
      conditionType: '10%',
      duration: '24h',
      description: 'ETH drops >10% in 24h'
    },
    totalLiquidity: 50000,
    totalCoverage: 20000,
    activeUsers: 15,
    premiumRate: 5, // 5% premium
    expectedAPY: 32, // 32% APY
    startTime: now - day, // Started 24 hours ago
    endTime: now + day, // Ends in 24 hours
  },
  {
    id: '2',
    condition: {
      asset: 'BTC',
      conditionType: '10%',
      duration: '24h',
      description: 'BTC drops >10% in 24h'
    },
    totalLiquidity: 80000,
    totalCoverage: 35000,
    activeUsers: 22,
    premiumRate: 4.5, // 4.5% premium
    expectedAPY: 28, // 28% APY
    startTime: now - day / 2, // Started 12 hours ago
    endTime: now + day * 1.5, // Ends in 36 hours
  },
  {
    id: '3',
    condition: {
      asset: 'ETH',
      conditionType: '15%',
      duration: '24h',
      description: 'ETH drops >15% in 24h'
    },
    totalLiquidity: 30000,
    totalCoverage: 12000,
    activeUsers: 8,
    premiumRate: 3.5, // 3.5% premium
    expectedAPY: 22, // 22% APY
    startTime: now - day / 4, // Started 6 hours ago
    endTime: now + day * 0.75, // Ends in 18 hours
  },
  {
    id: '4',
    condition: {
      asset: 'ETH',
      conditionType: '20%',
      duration: '24h',
      description: 'ETH drops >20% in 24h'
    },
    totalLiquidity: 25000,
    totalCoverage: 8000,
    activeUsers: 6,
    premiumRate: 2.5, // 2.5% premium
    expectedAPY: 18, // 18% APY
    startTime: now, // Just started
    endTime: now + day, // Ends in 24 hours
  }
];

export const mockUserCoverages: UserCoverage[] = [
  {
    id: 'cov1',
    poolId: '1',
    condition: {
      asset: 'ETH',
      conditionType: '10%',
      duration: '24h',
      description: 'ETH drops >10% in 24h'
    },
    premium: 5, // 5 USDC
    payout: 100, // 100 USDC
    startTime: now - day / 2, // Started 12 hours ago
    endTime: now + day / 2, // Ends in 12 hours
    status: 'active'
  },
  {
    id: 'cov2',
    poolId: '3',
    condition: {
      asset: 'ETH',
      conditionType: '15%',
      duration: '24h',
      description: 'ETH drops >15% in 24h'
    },
    premium: 3.5, // 3.5 USDC
    payout: 100, // 100 USDC
    startTime: now - day, // Started 24 hours ago
    endTime: now, // Just ended
    status: 'expired'
  }
];

export const mockUserLiquidityPositions: UserLiquidity[] = [
  {
    id: 'liq1',
    poolId: '1',
    condition: {
      asset: 'ETH',
      conditionType: '10%',
      duration: '24h',
      description: 'ETH drops >10% in 24h'
    },
    stakedAmount: 1000, // 1000 USDC
    earned: 12.5, // 12.5 USDC earned so far
    startTime: now - day / 2, // Started 12 hours ago
    endTime: now + day / 2, // Ends in 12 hours
    status: 'active'
  },
  {
    id: 'liq2',
    poolId: '2',
    condition: {
      asset: 'BTC',
      conditionType: '10%',
      duration: '24h',
      description: 'BTC drops >10% in 24h'
    },
    stakedAmount: 500, // 500 USDC
    earned: 15, // 15 USDC earned
    startTime: now - day, // Started 24 hours ago
    endTime: now, // Just ended
    status: 'withdrawn'
  }
];

// Mock function to calculate premium based on payout amount
export const calculatePremium = (payout: number, rate: number): number => {
  return (payout * rate) / 100;
};

// Mock function to fetch pool by ID
export const getPoolById = (poolId: string): InsurancePool | undefined => {
  return mockInsurancePools.find(pool => pool.id === poolId);
};
