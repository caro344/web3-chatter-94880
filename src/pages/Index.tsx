import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/web3';
import WalletConnect from '@/components/WalletConnect';
import ChatInterface from '@/components/ChatInterface';
import UserList from '@/components/UserList';
import QuickGuide from '@/components/QuickGuide';
import { Layers } from 'lucide-react';
import { useMemo } from 'react';

const queryClient = new QueryClient();

const IndexContent = () => {
  const { address, isConnected } = useAccount();

  // Only show the connected user in the user list
  const connectedUsers = useMemo(() => {
    if (isConnected && address) {
      return [{ address, isOnline: true }];
    }
    return [];
  }, [address, isConnected]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <header className="glass rounded-2xl p-6 mb-8 border border-border/50 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-accent to-primary-glow flex items-center justify-center neon-glow">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold gradient-text">Web3 Chat DApp</h1>
              <p className="text-sm text-muted-foreground">Decentralized messaging on the blockchain</p>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      {/* Quick Guide */}
      {!isConnected && (
        <QuickGuide />
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-2">
          <ChatInterface />
        </div>
        <div className="hidden lg:block">
          <UserList users={connectedUsers} />
        </div>
      </div>

      {/* Mobile User List */}
      <div className="lg:hidden mt-6">
        <UserList users={connectedUsers} />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <IndexContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Index;
