import { createConfig, http } from 'wagmi';
import { mainnet, sepolia, polygon, arbitrum, optimism, bsc, avalanche, fantom, base } from 'wagmi/chains';
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors';

// EVM Chains configuration
export const config = createConfig({
  chains: [mainnet, sepolia, polygon, arbitrum, optimism, bsc, avalanche, fantom, base],
  connectors: [
    injected(),
    metaMask(),
    coinbaseWallet({ appName: 'Web3 Support' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [bsc.id]: http(),
    [avalanche.id]: http(),
    [fantom.id]: http(),
    [base.id]: http(),
  },
});

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
  { id: 'fantom', name: 'Fantom', type: 'evm', icon: '◇', color: '#1969FF' },
  // Non-EVM Chains
  { id: 'bitcoin', name: 'Bitcoin', type: 'bitcoin', icon: '₿', color: '#F7931A' },
  { id: 'solana', name: 'Solana', type: 'solana', icon: '◐', color: '#9945FF' },
  { id: 'ton', name: 'TON', type: 'ton', icon: '◈', color: '#0098EA' },
];