import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, ChevronDown, Check } from 'lucide-react';
import { truncateAddress, supportedChains, ChainInfo } from '@/lib/web3';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, chains } = useSwitchChain();
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [selectedChain, setSelectedChain] = useState<ChainInfo | null>(null);
  const [nonEvmAddress, setNonEvmAddress] = useState<string | null>(null);

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
    setShowChainSelector(true);
  };

  const handleChainSelect = (chainInfo: ChainInfo) => {
    setSelectedChain(chainInfo);
    
    if (chainInfo.type === 'evm') {
      // Connect with EVM wallet
      if (connectors.length === 0) {
        toast.error('No wallet detected. Please install MetaMask or another Web3 wallet.');
        return;
      }
      connect({ connector: connectors[0] });
      setShowChainSelector(false);
    } else {
      // For non-EVM chains, show wallet options
      handleNonEvmConnect(chainInfo);
    }
  };

  const handleNonEvmConnect = (chainInfo: ChainInfo) => {
    // Simulate non-EVM wallet connection prompts
    switch (chainInfo.type) {
      case 'bitcoin':
        if ((window as any).unisat) {
          (window as any).unisat.requestAccounts().then((accounts: string[]) => {
            if (accounts[0]) {
              setNonEvmAddress(accounts[0]);
              toast.success(`Bitcoin wallet connected: ${truncateAddress(accounts[0])}`);
            }
          }).catch(() => {
            toast.error('Bitcoin wallet connection failed. Try installing Unisat or Xverse wallet.');
          });
        } else {
          toast.info('Please install a Bitcoin wallet (Unisat, Xverse, or Leather)');
          window.open('https://unisat.io/', '_blank');
        }
        break;
      case 'solana':
        if ((window as any).solana?.isPhantom) {
          (window as any).solana.connect().then((resp: any) => {
            const pubKey = resp.publicKey.toString();
            setNonEvmAddress(pubKey);
            toast.success(`Solana wallet connected: ${truncateAddress(pubKey)}`);
          }).catch(() => {
            toast.error('Solana wallet connection failed');
          });
        } else {
          toast.info('Please install Phantom or Solflare wallet');
          window.open('https://phantom.app/', '_blank');
        }
        break;
      case 'ton':
        toast.info('Please install TON Keeper or TON Wallet');
        window.open('https://tonkeeper.com/', '_blank');
        break;
    }
    setShowChainSelector(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setNonEvmAddress(null);
    setSelectedChain(null);
    toast.info('Wallet disconnected');
  };

  const displayAddress = address || nonEvmAddress;
  const isWalletConnected = isConnected || nonEvmAddress;

  if (isWalletConnected && displayAddress) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Chain Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="glass border-border/50 hover:border-border px-2 sm:px-3"
            >
              <span className="text-base sm:text-lg">
                {selectedChain?.icon || (chain ? '⟠' : '◈')}
              </span>
              <ChevronDown className="w-3 h-3 ml-1 hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Switch Network</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {chains.map((c) => (
              <DropdownMenuItem
                key={c.id}
                onClick={() => switchChain({ chainId: c.id })}
                className="flex items-center justify-between"
              >
                {c.name}
                {chain?.id === c.id && <Check className="w-4 h-4 text-green-500" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Address & Disconnect */}
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="glass border-primary/50 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
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
        className="bg-foreground text-background hover:bg-foreground/90 font-medium transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
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
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:border-foreground/50 transition-all"
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
                    className="h-auto py-3 flex flex-col items-center gap-1 hover:border-foreground/50 transition-all"
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