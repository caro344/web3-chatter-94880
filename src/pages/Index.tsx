import { WagmiProvider, useAccount } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/web3';
import WalletConnect from '@/components/WalletConnect';
import ChatInterface from '@/components/ChatInterface';
import UserList from '@/components/UserList';
import { useMemo, useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import { ArrowUpRight, Globe, ChevronDown } from 'lucide-react';

const queryClient = new QueryClient();

const IndexContent = () => {
  const { address, isConnected } = useAccount();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }} />
        </div>

        {/* Header */}
        <header className="relative z-50 border-b border-border/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                />
              </div>

              {/* Center - Time */}
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>+ UTC</span>
                <span className="font-mono text-foreground font-medium">{formatTime(currentTime)}</span>
              </div>

              {/* Right - Wallet Connect */}
              <div className="flex items-center gap-4">
                <WalletConnect />
              </div>
            </div>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Tagline */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-muted-foreground">
                  Web3 Support Chat
                </p>
                <div className="text-right text-xs text-muted-foreground hidden lg:block">
                  ( DECENTRALIZED )
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                  Connect Wallet.
                  <br />
                  <span className="text-muted-foreground">Get Support.</span>
                </h1>
              </div>

              {/* CTA */}
              {!isConnected && (
                <div className="flex items-center gap-2 group cursor-pointer">
                  <span className="text-lg font-medium border-b-2 border-foreground pb-1 group-hover:border-muted-foreground transition-colors">
                    Connect to Start
                  </span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              )}

              {/* Scroll Indicator */}
              <div className="pt-8 lg:pt-16 flex items-center gap-3 text-xs text-muted-foreground">
                <ChevronDown className="w-4 h-4 animate-bounce" />
                <div className="text-center">
                  <p>{ "SCROLL DOWN TO" }</p>
                  <p>{ "DISCOVER MORE" }</p>
                </div>
              </div>
            </div>

            {/* Right Content - Logo Display */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 blur-3xl opacity-20 bg-foreground rounded-full scale-75" />
                
                {/* Main Logo */}
                <img 
                  src={logo} 
                  alt="Web3 Support" 
                  className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 object-contain"
                />
              </div>

              {/* Social Links - Side */}
              <div className="absolute right-0 top-0 hidden lg:flex flex-col items-end gap-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Powered by:</p>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded border border-border flex items-center justify-center hover:bg-secondary transition-colors cursor-pointer">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Feature Description */}
          <div className="mt-8 lg:mt-12 flex justify-end">
            <div className="max-w-md text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-medium">Secure Web3 Support:</span>
              </span>
              <span> Connect your wallet, chat with our team, and get real-time assistance — Every time.</span>
            </div>
          </div>

          {/* Feature Pills */}
          <div className="mt-8 lg:mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Wallet Connect', 'Real-time Chat', 'Secure Messaging', 'Multi-Chain'].map((feature) => (
                <div 
                  key={feature}
                  className="bg-secondary/50 backdrop-blur-sm border border-border/50 rounded-lg px-4 py-3 text-center text-sm font-medium hover:bg-secondary transition-colors"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3 order-1">
            <ChatInterface />
          </div>

          {/* User List */}
          <div className="order-2">
            <UserList users={connectedUsers} />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-t border-border/50 pt-6 text-center">
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
