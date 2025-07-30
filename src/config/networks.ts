// Centralized network configuration for consistent network support across the app
import type { Chain } from 'wagmi/chains';
import type { AppKitNetwork } from '@reown/appkit/networks';

// Define Morph Holesky network
const morphHolesky: Chain = {
    id: 2810,
    name: 'Morph Holesky',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://rpc-holesky.morphl2.io'] }
    },
    blockExplorers: {
        default: { name: 'Morph Holesky Explorer', url: 'https://explorer-holesky.morphl2.io' }
    },
    testnet: true
};

// Define the networks your dApp will support consistently - only Morph Holesky
export const supportedChains: Chain[] = [
    morphHolesky
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

// Chain icon mapping for Morph Holesky
export const chainIcons: Record<number, string> = {
    [morphHolesky.id]: 'https://cryptologos.cc/logos/morph-logo.png', // You can update this with actual Morph logo
};
