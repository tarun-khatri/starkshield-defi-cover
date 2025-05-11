import { 
  InsurancePool, 
  UserCoverage, 
  UserLiquidity, 
  PriceData 
} from '../types';

// Function to calculate premium based on payout and premium rate
export const calculatePremium = (payout: number, premiumRate: number): number => {
  return payout * (premiumRate / 100);
};

// Mock insurance pools
export const mockInsurancePools: InsurancePool[] = [
  {
    id: 'pool1',
    condition: {
      asset: 'ETH',
      conditionType: '10%',
      duration: '24h',
      description: 'ETH drops >10% in 24h'
    },
    totalLiquidity: 500000,
    totalCoverage: 250000,
    activeUsers: 15,
    premiumRate: 2.5,
    expectedAPY: 12,
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    verificationSource: 'pragma' // Adding the missing property
  },
  {
    id: 'pool2',
    condition: {
      asset: 'BTC',
      conditionType: '10%',
      duration: '24h',
      description: 'BTC drops >10% in 24h'
    },
    totalLiquidity: 750000,
    totalCoverage: 400000,
    activeUsers: 22,
    premiumRate: 2,
    expectedAPY: 10,
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    verificationSource: 'pragma' // Adding the missing property
  },
  {
    id: 'pool3',
    condition: {
      asset: 'ETH',
      conditionType: '15%',
      duration: '24h',
      description: 'ETH drops >15% in 24h'
    },
    totalLiquidity: 300000,
    totalCoverage: 150000,
    activeUsers: 8,
    premiumRate: 1.5,
    expectedAPY: 8,
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    verificationSource: 'pragma' // Adding the missing property
  },
  {
    id: 'pool4',
    condition: {
      asset: 'ETH',
      conditionType: '20%',
      duration: '24h',
      description: 'ETH drops >20% in 24h'
    },
    totalLiquidity: 200000,
    totalCoverage: 100000,
    activeUsers: 5,
    premiumRate: 1,
    expectedAPY: 6,
    startTime: Date.now(),
    endTime: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    verificationSource: 'pragma' // Adding the missing property
  },
];

// Mock user coverages
export const mockUserCoverages: UserCoverage[] = [
  {
    id: 'coverage1',
    poolId: 'pool1',
    condition: mockInsurancePools[0].condition,
    premium: 12.5,
    payout: 500,
    startTime: Date.now() - 3600000, // 1 hour ago
    endTime: Date.now() + 20 * 3600000, // expires in 20 hours
    status: 'active'
  },
  {
    id: 'coverage2',
    poolId: 'pool2',
    condition: mockInsurancePools[1].condition,
    premium: 8,
    payout: 400,
    startTime: Date.now() - 7200000, // 2 hours ago
    endTime: Date.now() + 19 * 3600000, // expires in 19 hours
    status: 'active'
  },
];

// Mock user liquidity positions
export const mockUserLiquidityPositions: UserLiquidity[] = [
  {
    id: 'liquidity1',
    poolId: 'pool1',
    condition: mockInsurancePools[0].condition,
    stakedAmount: 1000,
    earned: 50,
    startTime: Date.now() - 86400000, // 24 hours ago
    endTime: Date.now() + 86400000, // ends in 24 hours
    status: 'active'
  },
  {
    id: 'liquidity2',
    poolId: 'pool2',
    condition: mockInsurancePools[1].condition,
    stakedAmount: 2000,
    earned: 120,
    startTime: Date.now() - 172800000, // 48 hours ago
    endTime: Date.now() + 43200000, // ends in 12 hours
    status: 'active'
  },
];

// Mock price data
export const mockPrices: PriceData[] = [
  {
    symbol: 'ETH',
    price: 3000,
    timestamp: Date.now(),
    change24h: -5
  },
  {
    symbol: 'BTC',
    price: 50000,
    timestamp: Date.now(),
    change24h: 2
  },
  {
    symbol: 'AVAX',
    price: 30,
    timestamp: Date.now(),
    change24h: -3
  },
  {
    symbol: 'SOL',
    price: 100,
    timestamp: Date.now(),
    change24h: 1
  },
  {
    symbol: 'MATIC',
    price: 1,
    timestamp: Date.now(),
    change24h: -2
  },
  {
    symbol: 'LINK',
    price: 15,
    timestamp: Date.now(),
    change24h: 0.5
  },
  {
    symbol: 'UNI',
    price: 8,
    timestamp: Date.now(),
    change24h: -1
  },
  {
    symbol: 'AAVE',
    price: 120,
    timestamp: Date.now(),
    change24h: 3
  }
];
