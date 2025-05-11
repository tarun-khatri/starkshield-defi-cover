
import { useEffect, useState } from 'react';
import { PriceData } from '@/types';
import { cn } from '@/lib/utils';

interface AssetPriceProps {
  priceData: PriceData;
  showChange?: boolean;
  className?: string;
}

const AssetPrice = ({ priceData, showChange = true, className }: AssetPriceProps) => {
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Flash effect when price changes
  useEffect(() => {
    setIsFlashing(true);
    const timer = setTimeout(() => setIsFlashing(false), 1000);
    return () => clearTimeout(timer);
  }, [priceData.price]);

  return (
    <div className={cn(
      'flex items-center gap-2 transition-colors', 
      isFlashing ? 'text-insurance-purple-300' : '',
      className
    )}>
      <span className="font-semibold">{priceData.symbol}</span>
      <span className="font-semibold">${priceData.price.toLocaleString()}</span>
      {showChange && (
        <span className={cn(
          'text-sm font-medium',
          priceData.change24h >= 0 ? 'text-green-500' : 'text-red-500'
        )}>
          {priceData.change24h >= 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
        </span>
      )}
    </div>
  );
};

export default AssetPrice;
