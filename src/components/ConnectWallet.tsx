
import React from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Loader } from 'lucide-react';

interface ConnectWalletProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ConnectWallet: React.FC<ConnectWalletProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const { walletState, connectWallet, disconnectWallet, isLoading } = useWallet();

  if (walletState.connected) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`font-medium ${className}`}
        onClick={disconnectWallet}
      >
        {walletState.address ? `${walletState.address.substring(0, 5)}...${walletState.address.substring(walletState.address.length - 4)}` : 'Disconnect'}
      </Button>
    );
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      className={`font-medium ${className}`}
      onClick={connectWallet} 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        'Connect Wallet'
      )}
    </Button>
  );
};

export default ConnectWallet;
