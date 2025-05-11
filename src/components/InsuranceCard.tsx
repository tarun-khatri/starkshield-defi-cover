
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InsurancePool } from '@/types';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface InsuranceCardProps {
  pool: InsurancePool;
  onSelect: () => void;
  type: 'buy' | 'provide';
}

const InsuranceCard = ({ pool, onSelect, type }: InsuranceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format the condition type for display
  const formatCondition = () => {
    const { asset, conditionType, duration, description } = pool.condition;
    return description || `${asset} drops >${conditionType} in ${duration}`;
  };
  
  const timeLeft = () => {
    if (!pool.endTime) return 'N/A';
    const now = Date.now();
    const diff = pool.endTime - now;
    
    if (diff <= 0) return 'Expired';
    
    // Format time left as hours and minutes
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  return (
    <Card 
      className={`hover-card-effect overflow-hidden ${isHovered ? 'border-insurance-purple-300' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-insurance-purple-100 text-insurance-purple-500">
            {pool.condition.asset}
          </Badge>
          {type === 'provide' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {pool.expectedAPY.toFixed(0)}% APY
            </Badge>
          )}
          {type === 'buy' && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Premium: {pool.premiumRate}%
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{formatCondition()}</CardTitle>
        <CardDescription>
          {type === 'buy' 
            ? "Protect against price drops"
            : "Earn yield by underwriting risk"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {type === 'buy' ? 'Total Coverage' : 'Total Liquidity'}
            </span>
            <span className="font-medium">
              ${(type === 'buy' ? pool.totalCoverage : pool.totalLiquidity).toLocaleString()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Users</span>
            <span className="font-medium">{pool.activeUsers}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Direction</span>
            <span className="font-medium flex items-center text-red-500">
              <ArrowDown className="mr-1 h-4 w-4" /> Down
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Time Left</span>
            <span className="font-medium">{timeLeft()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onSelect}
          variant={isHovered ? "default" : "secondary"}
        >
          {type === 'buy' ? 'Get Coverage' : 'Provide Liquidity'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InsuranceCard;
