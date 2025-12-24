import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createAppKit } from '@reown/appkit/react';
import { 
  config, 
  wagmiAdapter, 
  solanaAdapter,
  bitcoinAdapter,
  projectId, 
  networks, 
  metadata 
} from '@/lib/web3';
import Index from "./pages/Index";
import Verify from "./pages/Verify";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Initialize AppKit with all adapters (EVM, Solana, Bitcoin)
createAppKit({
  adapters: [wagmiAdapter, solanaAdapter, bitcoinAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
  },
  themeMode: 'dark',
});

// Protected route that requires human verification
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isVerified = localStorage.getItem('humanVerified') === 'true';
  
  if (!isVerified) {
    return <Navigate to="/verify" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/verify" element={<Verify />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
