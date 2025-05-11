
export type Asset = 'ETH' | 'BTC' | 'AVAX' | 'SOL' | 'MATIC' | 'LINK' | 'UNI' | 'AAVE';
export type ConditionType = '5%' | '10%' | '15%' | '20%' | '25%' | '30%' | '40%' | '50%';
export type Duration = '24h' | '48h' | '72h' | '7d';
export type Direction = 'up' | 'down' | 'stable';

export interface InsuranceCondition {
  asset: Asset;
  conditionType: ConditionType;
  duration: Duration;
  direction?: Direction;
  description: string;
}

export interface InsurancePool {
  id: string;
  condition: InsuranceCondition;
  totalLiquidity: number;
  totalCoverage: number;
  activeUsers: number;
  premiumRate: number; // as percentage
  expectedAPY: number; // as percentage
  startTime?: number; // timestamp
  endTime?: number; // timestamp
  verificationSource: 'pragma' | 'other';
}

export interface UserCoverage {
  id: string;
  poolId: string;
  condition: InsuranceCondition;
  premium: number;
  payout: number;
  startTime: number; // timestamp
  endTime: number; // timestamp
  status: 'active' | 'expired' | 'claimed';
}

export interface UserLiquidity {
  id: string;
  poolId: string;
  condition: InsuranceCondition;
  stakedAmount: number;
  earned: number;
  startTime: number; // timestamp
  endTime: number; // timestamp
  status: 'active' | 'withdrawn' | 'loss';
}

export interface User {
  address: string;
  coverages: UserCoverage[];
  liquidityPositions: UserLiquidity[];
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  provider: any | null;
  network: string | null;
  balance: {
    eth: number;
    usdc: number;
  } | null;
}

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
  change24h: number; // percentage
}

export interface Admin {
  address: string;
  isAdmin: boolean;
}

export interface InsuranceEvent {
  id: string;
  name: string;
  description: string;
  condition: InsuranceCondition;
  createdBy: string;
  createdAt: number;
  active: boolean;
}
