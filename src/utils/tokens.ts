import { getTokenAddresses } from "@/config";

export interface Token {
    name: string;
    logo: string;
    address: string;
    symbol: string;
    decimals: number;
}

/**
 * Get available tokens for a specific chain
 * @param chainId - The chain ID to get tokens for
 * @returns Array of token objects
 */
export function getTokensForChain(chainId: number): Token[] {
    const tokenAddresses = getTokenAddresses(chainId);

    return [
        {
            name: "USDC",
            symbol: "USDC",
            logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/usd-coin-usdc-logo-600x600.webp",
            address: tokenAddresses.USDC,
            decimals: 6
        },
        {
            name: "USDT",
            symbol: "USDT",
            logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/tether-logo-600x600.webp",
            address: tokenAddresses.USDT,
            decimals: 6
        },
    ];
}

/**
 * Get token by name for a specific chain
 * @param chainId - The chain ID
 * @param tokenName - The token name to find
 * @returns Token object or undefined if not found
 */
export function getTokenByName(chainId: number, tokenName: string): Token | undefined {
    const tokens = getTokensForChain(chainId);
    return tokens.find(token => token.name === tokenName);
}

/**
 * Get token by address for a specific chain
 * @param chainId - The chain ID
 * @param tokenAddress - The token address to find
 * @returns Token object or undefined if not found
 */
export function getTokenByAddress(chainId: number, tokenAddress: string): Token | undefined {
    const tokens = getTokensForChain(chainId);
    return tokens.find(token => token.address.toLowerCase() === tokenAddress.toLowerCase());
}
