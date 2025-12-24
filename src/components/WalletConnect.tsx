import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { truncateAddress, supportedChains, ChainInfo } from '@/lib/web3';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WalletConnect = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ChainInfo | null>(null);
  const [nonEvmAddress, setNonEvmAddress] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      toast.success(`Wallet connected: ${truncateAddress(address)}`);
    }
  }, [isConnected, address]);

  // Listen for non-EVM wallet from localStorage (for TON which still uses mock)
  useEffect(() => {
    const savedWallet = localStorage.getItem('nonEvmWallet');
    if (savedWallet) {
      try {
        const { address: savedAddress, type } = JSON.parse(savedWallet);
        if (type === 'ton') {
          setNonEvmAddress(savedAddress);
          const chainInfo = supportedChains.find(c => c.type === type);
          if (chainInfo) setSelectedChain(chainInfo);
        }
      } catch (e) {
        console.error('Error parsing saved wallet:', e);
      }
    }
  }, []);

  const handleConnect = () => {
    setShowChainSelector(true);
  };

  const handleChainSelect = (chainInfo: ChainInfo) => {
    setSelectedChain(chainInfo);
    
    if (chainInfo.type === 'evm' || chainInfo.type === 'solana' || chainInfo.type === 'bitcoin') {
      // Open Reown AppKit modal - supports EVM, Solana, and Bitcoin
      open();
      setShowChainSelector(false);
    } else if (chainInfo.type === 'ton') {
      // TON still uses mock (Reown doesn't have TON adapter yet in stable)
      handleTonConnect(chainInfo);
    }
  };

  const generateTonAddress = (): string => {
    const chars = '0123456789abcdef';
    let addr = 'EQ';
    for (let i = 0; i < 46; i++) {
      addr += chars[Math.floor(Math.random() * chars.length)];
    }
    return addr;
  };

  const handleTonConnect = (chainInfo: ChainInfo) => {
    const mockAddress = generateTonAddress();
    
    setNonEvmAddress(mockAddress);
    setSelectedChain(chainInfo);
    localStorage.setItem('nonEvmWallet', JSON.stringify({ address: mockAddress, type: chainInfo.type }));
    window.dispatchEvent(new Event('storage'));
    toast.success(`${chainInfo.name} wallet connected: ${truncateAddress(mockAddress)}`);
    setShowChainSelector(false);
  };

  const handleDisconnect = () => {
    // Open AppKit to disconnect (works for EVM, Solana, Bitcoin)
    if (isConnected) {
      open();
    }
    // Clear TON wallet if any
    if (nonEvmAddress) {
      setNonEvmAddress(null);
      setSelectedChain(null);
      localStorage.removeItem('nonEvmWallet');
      window.dispatchEvent(new Event('storage'));
      toast.info('Wallet disconnected');
    }
  };

  const displayAddress = address || nonEvmAddress;
  const isWalletConnected = isConnected || nonEvmAddress;

  if (isWalletConnected && displayAddress) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Open AppKit for account/network management */}
        <Button
          onClick={() => open()}
          variant="outline"
          size="sm"
          className="interact-button glass border-border/50 hover:border-border px-2 sm:px-3"
        >
          <span className="text-base sm:text-lg">
            {selectedChain?.icon || '⟠'}
          </span>
        </Button>

        {/* Address & Disconnect */}
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="interact-button glass border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
        >
          <Wallet className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">{truncateAddress(displayAddress)}</span>
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 sm:ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        size="sm"
        className="interact-button bg-foreground text-background hover:bg-foreground/90 font-medium transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
      >
        <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
        Connect Wallet
      </Button>

      {/* Chain Selection Dialog */}
      <Dialog open={showChainSelector} onOpenChange={setShowChainSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">Select Network</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* EVM Chains */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">EVM Networks</p>
              <div className="grid grid-cols-2 gap-2">
                {supportedChains.filter(c => c.type === 'evm').map((chainInfo) => (
                  <Button
                    key={chainInfo.id}
                    variant="outline"
                    onClick={() => handleChainSelect(chainInfo)}
                    className="interact-button h-auto py-3 flex flex-col items-center gap-1 hover:border-foreground/50 transition-all"
                  >
                    <span className="text-2xl" style={{ color: chainInfo.color }}>{chainInfo.icon}</span>
                    <span className="text-xs">{chainInfo.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Non-EVM Chains */}
            <div>
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Other Networks</p>
              <div className="grid grid-cols-3 gap-2">
                {supportedChains.filter(c => c.type !== 'evm').map((chainInfo) => (
                  <Button
                    key={chainInfo.id}
                    variant="outline"
                    onClick={() => handleChainSelect(chainInfo)}
                    className="interact-button h-auto py-3 flex flex-col items-center gap-1 hover:border-foreground/50 transition-all"
                  >
                    <span className="text-2xl" style={{ color: chainInfo.color }}>{chainInfo.icon}</span>
                    <span className="text-xs">{chainInfo.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WalletConnect;
