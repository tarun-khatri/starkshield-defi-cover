
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInsurance } from '@/contexts/InsuranceContext';
import { useWallet } from '@/contexts/WalletContext';
import UserDashboardCard from '@/components/UserDashboardCard';
import ConnectWallet from '@/components/ConnectWallet';
import { UserCoverage, UserLiquidity } from '@/types';

const Dashboard = () => {
  const { userCoverages, userLiquidity, claimPayout, withdrawLiquidity, isLoading } = useInsurance();
  const { walletState } = useWallet();
  
  const handleClaim = async (coverageId: string) => {
    await claimPayout(coverageId);
  };
  
  const handleWithdraw = async (liquidityId: string) => {
    await withdrawLiquidity(liquidityId);
  };
  
  const activeCoverages = userCoverages.filter(c => c.status === 'active');
  const expiredCoverages = userCoverages.filter(c => c.status !== 'active');
  
  const activeLiquidity = userLiquidity.filter(l => l.status === 'active');
  const closedLiquidity = userLiquidity.filter(l => l.status !== 'active');
  
  const getTotalCoverage = () => {
    return activeCoverages.reduce((sum, coverage) => sum + coverage.payout, 0);
  };
  
  const getTotalLiquidity = () => {
    return activeLiquidity.reduce((sum, position) => sum + position.stakedAmount, 0);
  };
  
  const getTotalEarnings = () => {
    return userLiquidity.reduce((sum, position) => sum + position.earned, 0);
  };
  
  if (!walletState.connected) {
    return (
      <div className="container px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md text-center p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription>Connect your wallet to view your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectWallet className="mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your insurance coverages and liquidity positions
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover-card-effect">
          <CardHeader className="pb-2">
            <CardDescription>Total Active Coverage</CardDescription>
            <CardTitle className="text-3xl">${getTotalCoverage().toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{activeCoverages.length} active policies</p>
          </CardContent>
        </Card>
        
        <Card className="hover-card-effect">
          <CardHeader className="pb-2">
            <CardDescription>Total Active Liquidity</CardDescription>
            <CardTitle className="text-3xl">${getTotalLiquidity().toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{activeLiquidity.length} active positions</p>
          </CardContent>
        </Card>
        
        <Card className="hover-card-effect">
          <CardHeader className="pb-2">
            <CardDescription>Total Earnings</CardDescription>
            <CardTitle className="text-3xl">${getTotalEarnings().toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">From {userLiquidity.length} liquidity positions</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="coverage">
        <TabsList className="mb-8">
          <TabsTrigger value="coverage">Your Coverage</TabsTrigger>
          <TabsTrigger value="liquidity">Your Liquidity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="coverage" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Active Coverage</h2>
            {activeCoverages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeCoverages.map((coverage) => (
                  <UserDashboardCard
                    key={coverage.id}
                    item={coverage}
                    type="coverage"
                    onAction={() => handleClaim(coverage.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">You don't have any active coverage</p>
                <Button asChild>
                  <a href="/buy">Buy Coverage</a>
                </Button>
              </div>
            )}
          </div>
          
          {expiredCoverages.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Past Coverage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredCoverages.map((coverage) => (
                  <UserDashboardCard
                    key={coverage.id}
                    item={coverage}
                    type="coverage"
                    onAction={() => handleClaim(coverage.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="liquidity" className="mt-0">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Active Liquidity</h2>
            {activeLiquidity.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeLiquidity.map((position) => (
                  <UserDashboardCard
                    key={position.id}
                    item={position}
                    type="liquidity"
                    onAction={() => handleWithdraw(position.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-muted rounded-lg">
                <p className="text-muted-foreground mb-4">You don't have any active liquidity positions</p>
                <Button asChild>
                  <a href="/provide">Provide Liquidity</a>
                </Button>
              </div>
            )}
          </div>
          
          {closedLiquidity.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Past Liquidity</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {closedLiquidity.map((position) => (
                  <UserDashboardCard
                    key={position.id}
                    item={position}
                    type="liquidity"
                    onAction={() => handleWithdraw(position.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
