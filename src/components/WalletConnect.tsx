import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { truncateAddress } from '@/lib/web3';
import { toast } from 'sonner';
import { useEffect } from 'react';

const WalletConnect = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (isConnected && address) {
      toast.success(`Wallet connected: ${truncateAddress(address)}`);
    }
  }, [isConnected, address]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to connect wallet');
    }
  }, [error]);

  const handleConnect = () => {
    if (connectors.length === 0) {
      toast.error('No wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }
    connect({ connector: connectors[0] });
  };

  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };

  if (isConnected && address) {
    return (
      <Button
        onClick={handleDisconnect}
        variant="outline"
        size="sm"
        className="glass border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
      >
        <Wallet className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
        <span className="hidden sm:inline">{truncateAddress(address)}</span>
        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-2" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      size="sm"
      className="bg-foreground text-background hover:bg-foreground/90 font-medium transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
    >
      <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;
