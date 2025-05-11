
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useInsurance } from '@/contexts/InsuranceContext';
import { useWallet } from '@/contexts/WalletContext';
import { InsurancePool } from '@/types';
import { toast } from "sonner";

interface ProvideLiquidityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPool?: InsurancePool;
}

const ProvideLiquidityModal = ({ isOpen, onClose, selectedPool }: ProvideLiquidityModalProps) => {
  const { provideLiquidity, isLoading } = useInsurance();
  const { walletState } = useWallet();
  const [amount, setAmount] = useState(100);
  
  const handleAmountChange = (value: number[]) => {
    setAmount(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setAmount(Math.min(value, 10000)); // Cap at 10000 for MVP
    }
  };
  
  const calculateEarnings = () => {
    if (!selectedPool) return 0;
    
    // Simple calculation for demonstration
    const dailyRate = selectedPool.expectedAPY / 365;
    return (amount * dailyRate / 100).toFixed(2);
  };
  
  const handleProvide = async () => {
    if (!selectedPool) return;
    
    if (!walletState.connected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to provide liquidity"
      });
      return;
    }
    
    // Check if user has enough balance
    if (walletState.balance && walletState.balance.usdc < amount) {
      toast.error("Insufficient balance", {
        description: `You need ${amount} USDC to provide this liquidity`
      });
      return;
    }
    
    const success = await provideLiquidity(selectedPool.id, amount);
    if (success) {
      onClose();
    }
  };
  
  if (!selectedPool) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Provide Liquidity</DialogTitle>
          <DialogDescription>
            Earn yield by underwriting {selectedPool.condition.description.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Liquidity Amount (USDC)
            </label>
            <Input
              id="amount"
              type="number"
              min={0}
              max={10000}
              value={amount}
              onChange={handleInputChange}
              className="col-span-3"
            />
            <Slider
              defaultValue={[100]}
              value={[amount]}
              onValueChange={handleAmountChange}
              max={10000}
              step={100}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 USDC</span>
              <span>10,000 USDC</span>
            </div>
          </div>
          
          <div className="grid gap-2 mt-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Expected APY:</span>
                <span>{selectedPool.expectedAPY}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Pool Total:</span>
                <span>{selectedPool.totalLiquidity.toLocaleString()} USDC</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Est. Daily Earnings:</span>
                <span>{calculateEarnings()} USDC</span>
              </div>
            </div>
          </div>
          
          <div className="bg-insurance-purple-100 p-3 rounded-md text-sm mt-2">
            <p className="text-insurance-purple-500">
              <strong>Note:</strong> By providing liquidity, you'll earn premiums if the condition isn't met, but could lose funds if it is.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleProvide} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Provide Liquidity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProvideLiquidityModal;
