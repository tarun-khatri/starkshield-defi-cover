
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ConnectWallet from '@/components/ConnectWallet';
import AssetPrice from '@/components/AssetPrice';
import { useInsurance } from '@/contexts/InsuranceContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { priceData, refreshData } = useInsurance();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const ethPrice = priceData.find(p => p.symbol === 'ETH');
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : ''
    }`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
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
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {ethPrice && <AssetPrice priceData={ethPrice} className="hidden md:flex" />}
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
