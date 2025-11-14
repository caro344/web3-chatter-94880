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
        className="glass border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {truncateAddress(address)}
        <LogOut className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="bg-gradient-to-r from-primary via-accent to-primary-glow bg-[length:200%_100%] animate-gradient text-white font-semibold hover:shadow-neon transition-all duration-300"
    >
      <Wallet className="w-4 h-4 mr-2" />
      Connect Wallet
    </Button>
  );
};

export default WalletConnect;
