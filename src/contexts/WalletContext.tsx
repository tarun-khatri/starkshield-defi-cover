
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { WalletState } from '../types';

interface WalletContextType {
  walletState: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const initialWalletState: WalletState = {
  connected: false,
  address: null,
  provider: null,
  network: null,
  balance: null
};

const WalletContext = createContext<WalletContextType>({
  walletState: initialWalletState,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isLoading: false
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>(initialWalletState);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Mock wallet connection for MVP
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Check if ArgentX is installed
      if (typeof window !== 'undefined' && !window.starknet) {
        throw new Error('ArgentX wallet not found. Please install ArgentX extension');
      }
      
      // Mock successful connection
      setTimeout(() => {
        // For MVP, we'll use a mock address
        const mockAddress = '0x123...abc';
        
        setWalletState({
          connected: true,
          address: mockAddress,
          provider: { type: 'argentX' },
          network: 'testnet', // Starknet testnet
          balance: {
            eth: 0.5,
            usdc: 1000
          }
        });
        
        toast.success("Wallet connected successfully", {
          description: `Connected to ${mockAddress}`
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      toast.error("Wallet connection failed", {
        description: error.message || "Could not connect wallet"
      });
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletState(initialWalletState);
    toast.info("Wallet disconnected");
  };

  // Add listeners for wallet changes here (in real implementation)

  return (
    <WalletContext.Provider value={{
      walletState,
      connectWallet,
      disconnectWallet,
      isLoading
    }}>
      {children}
    </WalletContext.Provider>
  );
};
