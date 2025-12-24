import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { 
  mainnet, 
  sepolia, 
  polygon, 
  arbitrum, 
  optimism, 
  bsc, 
  avalanche, 
  base,
  solana,
  solanaTestnet,
  solanaDevnet,
  bitcoin,
  bitcoinTestnet,
  type AppKitNetwork 
} from '@reown/appkit/networks';

// Your Reown Project ID
export const projectId = 'b56f71f3d4db5b2d58ca185d28a6fdfd';

// EVM Networks
export const evmNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  mainnet, sepolia, polygon, arbitrum, optimism, bsc, avalanche, base
];

// Solana Networks
export const solanaNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  solana, solanaTestnet, solanaDevnet
];

// Bitcoin Networks
export const bitcoinNetworks: [AppKitNetwork, ...AppKitNetwork[]] = [
  bitcoin, bitcoinTestnet
];

// All networks combined
export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [
  ...evmNetworks,
  ...solanaNetworks,
  ...bitcoinNetworks,
];

// App metadata for Reown
export const metadata = {
  name: 'Web3 Support',
  description: 'Secure Web3 Support Chat',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://web3support.app',
  icons: ['/favicon.png'],
};

// Create Wagmi Adapter for EVM
export const wagmiAdapter = new WagmiAdapter({
  networks: evmNetworks,
  projectId,
});

// Create Solana Adapter
export const solanaAdapter = new SolanaAdapter();

// Create Bitcoin Adapter
export const bitcoinAdapter = new BitcoinAdapter();

export const config = wagmiAdapter.wagmiConfig;

export const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Chain types for UI
export type ChainType = 'evm' | 'bitcoin' | 'solana' | 'ton';

export interface ChainInfo {
  id: string;
  name: string;
  type: ChainType;
  icon: string;
  color: string;
}

export const supportedChains: ChainInfo[] = [
  // EVM Chains
  { id: 'ethereum', name: 'Ethereum', type: 'evm', icon: '⟠', color: '#627EEA' },
  { id: 'polygon', name: 'Polygon', type: 'evm', icon: '⬡', color: '#8247E5' },
  { id: 'bsc', name: 'BNB Chain', type: 'evm', icon: '◈', color: '#F0B90B' },
  { id: 'arbitrum', name: 'Arbitrum', type: 'evm', icon: '◆', color: '#28A0F0' },
  { id: 'optimism', name: 'Optimism', type: 'evm', icon: '○', color: '#FF0420' },
  { id: 'avalanche', name: 'Avalanche', type: 'evm', icon: '▲', color: '#E84142' },
  { id: 'base', name: 'Base', type: 'evm', icon: '◎', color: '#0052FF' },
  // Non-EVM Chains
  { id: 'bitcoin', name: 'Bitcoin', type: 'bitcoin', icon: '₿', color: '#F7931A' },
  { id: 'solana', name: 'Solana', type: 'solana', icon: '◐', color: '#9945FF' },
  { id: 'ton', name: 'TON', type: 'ton', icon: '◈', color: '#0098EA' },
];
