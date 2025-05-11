
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

  // Check if wallet was previously connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.starknet) {
        try {
          // Check if wallet is already connected
          const isPreauthorized = await window.starknet.isPreauthorized();
          if (isPreauthorized) {
            // User has previously connected, reconnect automatically
            connectWallet();
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkWalletConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.starknet) {
      const handleAccountsChanged = (accounts: any) => {
        if (accounts.length === 0) {
          // User disconnected wallet
          disconnectWallet();
        } else if (walletState.connected) {
          // Account changed, update state
          updateWalletState();
        }
      };

      // Add event listeners for wallet changes
      window.starknet.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        // Remove event listeners on cleanup
        window.starknet.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [walletState.connected]);

  const updateWalletState = async () => {
    try {
      if (!window.starknet) return;
      
      const accounts = await window.starknet.getAccounts();
      if (accounts.length === 0) return;
      
      const account = accounts[0];
      const provider = window.starknet.provider;
      const network = await window.starknet.provider.getChainId();
      
      // For MVP, we'll use mock balance data
      // In a real app, you would get this from the blockchain
      const mockBalance = {
        eth: 0.5,
        usdc: 1000
      };
      
      setWalletState({
        connected: true,
        address: account.address,
        provider: { type: 'argentX', instance: provider },
        network: network,
        balance: mockBalance
      });
    } catch (error) {
      console.error("Error updating wallet state:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsLoading(true);
      
      // Check if ArgentX is installed
      if (typeof window !== 'undefined' && !window.starknet) {
        throw new Error('ArgentX wallet not found. Please install ArgentX extension');
      }
      
      // Request account connection
      await window.starknet.enable();
      await updateWalletState();
      
      toast.success("Wallet connected successfully");
      setIsLoading(false);
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
