// Centralized network configuration for consistent network support across the app
import { mainnet, sepolia, polygon, baseSepolia, base, liskSepolia } from 'wagmi/chains';
import type { Chain } from 'wagmi/chains';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Define the networks your dApp will support consistently
export const supportedChains: Chain[] = [
    liskSepolia,
    mainnet,
    sepolia,
    polygon,
    baseSepolia,
    base
];

// Export chain IDs for easy reference
export const supportedChainIds = supportedChains.map(chain => chain.id);

// Type guard to check if a number is a supported chain ID
export function isSupportedChainId(chainId: number): boolean {
    return supportedChainIds.includes(chainId);
}

// Get chain by ID
export function getChainById(chainId: number): Chain | undefined {
    return supportedChains.find(chain => chain.id === chainId);
}

// Convert wagmi chains to AppKit networks format
export function chainToAppKitNetwork(chain: Chain): AppKitNetwork {
    return {
        id: chain.id,
        caipNetworkId: `eip155:${chain.id}`,
        chainNamespace: 'eip155',
        name: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpcUrls,
        blockExplorers: chain.blockExplorers,
        testnet: chain.testnet || false
    };
}

// Export AppKit networks derived from our supported chains
export const appKitNetworks: AppKitNetwork[] = supportedChains.map(chainToAppKitNetwork);

// Chain icon mapping with placeholder images
export const chainIcons: Record<number, string> = {
    [mainnet.id]: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    [sepolia.id]: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    [polygon.id]: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    [base.id]: 'https://cryptologos.cc/logos/coinbase-logo.png',
    [baseSepolia.id]: 'https://cryptologos.cc/logos/coinbase-logo.png',
    [liskSepolia.id]: 'https://cryptologos.cc/logos/lisk-lsk-logo.png',
};
