
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCoverage, UserLiquidity } from '@/types';
import { format } from 'date-fns';

interface UserDashboardCardProps {
  item: UserCoverage | UserLiquidity;
  type: 'coverage' | 'liquidity';
  onAction: () => void;
}

const UserDashboardCard = ({ item, type, onAction }: UserDashboardCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const canPerformAction = () => {
    if (type === 'coverage') {
      const coverage = item as UserCoverage;
      return coverage.status === 'active' && Date.now() > coverage.endTime;
    } else {
      const liquidity = item as UserLiquidity;
      return liquidity.status === 'active' && Date.now() > liquidity.endTime;
    }
  };
  
  const getActionButtonText = () => {
    if (type === 'coverage') {
      return (item as UserCoverage).status === 'active' ? 'Claim Payout' : 'View Details';
    } else {
      return (item as UserLiquidity).status === 'active' ? 'Withdraw' : 'View Details';
    }
  };
  
  const getStatusColor = () => {
    const status = type === 'coverage' 
      ? (item as UserCoverage).status
      : (item as UserLiquidity).status;
    
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      case 'claimed':
      case 'loss':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <Card 
      className={`overflow-hidden ${isHovered ? 'border-insurance-purple-300 hover-card-effect' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="bg-insurance-purple-100 text-insurance-purple-500">
            {item.condition.asset}
          </Badge>
          <Badge className={getStatusColor()}>
            {
              type === 'coverage' 
                ? (item as UserCoverage).status.charAt(0).toUpperCase() + (item as UserCoverage).status.slice(1)
                : (item as UserLiquidity).status.charAt(0).toUpperCase() + (item as UserLiquidity).status.slice(1)
            }
          </Badge>
        </div>
        <CardTitle className="text-lg mt-2">{item.condition.description}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-4">
          {type === 'coverage' ? (
            <>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Premium</span>
                <span className="font-medium">${(item as UserCoverage).premium}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Payout</span>
                <span className="font-medium">${(item as UserCoverage).payout}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Staked</span>
                <span className="font-medium">${(item as UserLiquidity).stakedAmount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Earned</span>
                <span className="font-medium">${(item as UserLiquidity).earned}</span>
              </div>
            </>
          )}
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Start</span>
            <span className="font-medium text-xs">{formatDate(item.startTime)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">End</span>
            <span className="font-medium text-xs">{formatDate(item.endTime)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onAction}
          variant={isHovered ? "default" : "secondary"}
          disabled={type === 'coverage' ? (item as UserCoverage).status !== 'active' : (item as UserLiquidity).status !== 'active'}
        >
          {getActionButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserDashboardCard;
