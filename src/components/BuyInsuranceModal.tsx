
import React, { useState, useEffect } from 'react';
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
import { calculatePremium } from '@/data/mockData';
import { toast } from "sonner";

interface BuyInsuranceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPool?: InsurancePool;
}

const BuyInsuranceModal = ({ isOpen, onClose, selectedPool }: BuyInsuranceModalProps) => {
  const { buyInsurance, isLoading } = useInsurance();
  const { walletState } = useWallet();
  const [payoutAmount, setPayoutAmount] = useState(100);
  const [premium, setPremium] = useState(0);
  
  useEffect(() => {
    if (selectedPool) {
      const calculatedPremium = calculatePremium(payoutAmount, selectedPool.premiumRate);
      setPremium(calculatedPremium);
    }
  }, [selectedPool, payoutAmount]);
  
  const handlePayoutChange = (value: number[]) => {
    setPayoutAmount(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setPayoutAmount(Math.min(value, 1000)); // Cap at 1000 for MVP
    }
  };
  
  const handlePurchase = async () => {
    if (!selectedPool) return;
    
    if (!walletState.connected) {
      toast.error("Wallet not connected", {
        description: "Please connect your wallet to buy insurance"
      });
      return;
    }
    
    // Check if user has enough balance
    if (walletState.balance && walletState.balance.usdc < premium) {
      toast.error("Insufficient balance", {
        description: `You need ${premium} USDC to buy this coverage`
      });
      return;
    }
    
    const success = await buyInsurance(selectedPool.id, payoutAmount);
    if (success) {
      onClose();
    }
  };
  
  if (!selectedPool) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Buy Insurance Coverage</DialogTitle>
          <DialogDescription>
            {selectedPool.condition.description || `Protection against ${selectedPool.condition.asset} price drop`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="payout" className="text-sm font-medium">
              Payout Amount (USDC)
            </label>
            <Input
              id="payout"
              type="number"
              min={0}
              max={1000}
              value={payoutAmount}
              onChange={handleInputChange}
              className="col-span-3"
            />
            <Slider
              defaultValue={[100]}
              value={[payoutAmount]}
              onValueChange={handlePayoutChange}
              max={1000}
              step={10}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 USDC</span>
              <span>1000 USDC</span>
            </div>
          </div>
          
          <div className="grid gap-2 mt-4">
            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Premium Rate:</span>
                <span>{selectedPool.premiumRate}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Premium Amount:</span>
                <span>{premium.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Potential Payout:</span>
                <span>{payoutAmount} USDC</span>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePurchase} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Buy Coverage'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyInsuranceModal;
