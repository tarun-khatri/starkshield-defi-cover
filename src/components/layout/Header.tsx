
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ConnectWallet from '@/components/ConnectWallet';
import AssetPrice from '@/components/AssetPrice';
import { useInsurance } from '@/contexts/InsuranceContext';
import { useWallet } from '@/contexts/WalletContext';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

// Mock admin addresses for the MVP
const ADMIN_ADDRESSES = [
  '0x123...abc',
  // Add more admin addresses as needed
];

const Header = () => {
  const { priceData, refreshData } = useInsurance();
  const { walletState } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (walletState.connected && walletState.address) {
      // In a real app, this would check against a backend or smart contract
      const isUserAdmin = ADMIN_ADDRESSES.includes(walletState.address) || true; // For MVP, always true
      setIsAdmin(isUserAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [walletState.connected, walletState.address]);
  
  const ethPrice = priceData.find(p => p.symbol === 'ETH');
  const btcPrice = priceData.find(p => p.symbol === 'BTC');
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : ''
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-insurance-purple-500" />
            <span className="text-2xl font-bold text-gradient">DeFi Shield</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/buy" className="text-sm font-medium transition-colors hover:text-primary">
              Buy Coverage
            </Link>
            <Link to="/provide" className="text-sm font-medium transition-colors hover:text-primary">
              Earn Yield
            </Link>
            <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            {isAdmin && walletState.connected && (
              <Link to="/admin" className="text-sm font-medium transition-colors hover:text-primary text-insurance-purple-500">
                Admin
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {ethPrice && <AssetPrice priceData={ethPrice} className="hidden md:flex" />}
          {btcPrice && <AssetPrice priceData={btcPrice} className="hidden lg:flex" />}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
