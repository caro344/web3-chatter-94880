import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/web3';
import WalletConnect from '@/components/WalletConnect';
import ChatInterface from '@/components/ChatInterface';
import UserList from '@/components/UserList';
import QuickGuide from '@/components/QuickGuide';
import { useMemo, useEffect } from 'react';
import logo from '@/assets/logo.png';

const queryClient = new QueryClient();

const IndexContent = () => {
  const { address, isConnected } = useAccount();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Only show the connected user in the user list
  const connectedUsers = useMemo(() => {
    if (isConnected && address) {
      return [{ address, isOnline: true }];
    }
    return [];
  }, [address, isConnected]);

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50 backdrop-blur-xl">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <img 
              src={logo} 
              alt="MetaMask Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain p-2 border-2 border-foreground rounded-xl bg-background"
            />
            <div className="flex-shrink-0">
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Quick Guide for new users */}
        {!isConnected && (
          <div className="mb-6 md:mb-8">
            <QuickGuide />
          </div>
        )}

        {/* Chat & User Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Chat Area - Takes more space on desktop */}
          <div className="lg:col-span-3 order-1">
            <ChatInterface />
          </div>

          {/* User List - Sidebar on desktop, below chat on mobile */}
          <div className="order-2 lg:order-2">
            <UserList users={connectedUsers} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-8">
        <div className="glass rounded-2xl p-4 md:p-6 border border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Powered by Web3 • Secure • Decentralized
          </p>
        </div>
      </footer>
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
