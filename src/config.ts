// src/config.ts
import { baseSepolia, liskSepolia } from 'wagmi/chains'

// Multi-chain configuration for contract addresses
export const CHAIN_CONFIG = {
  [baseSepolia.id]: {
    name: "Base Sepolia",
    tokens: {
      USDC: "0x88b11aB13cd7BE9846FA38AB85Ef133e3093375c" as `0x${string}`,
      USDT: "0x22e4068964e11648729Df47b160070f1d9B89C6d" as `0x${string}`,
    },
    contracts: {
      fiatBridge: "0xe6cC80FD22712604376CDDB639eE2E52952740df" as `0x${string}`,
    }
  },
  [liskSepolia.id]: {
    name: "Lisk Sepolia",
    tokens: {
      USDC: "0x3393E8E4616008881dC4012d3C1430580E157522" as `0x${string}`,
      USDT: "0x413146C7c449F00FfAF950a5a733898b0bB656fD" as `0x${string}`,
    },
    contracts: {
      fiatBridge: "0xB4d9389644d0ac6FB9b10f2C1C941A02E3911F34" as `0x${string}`,
    }
  }
} as const;

// Helper function to get chain config
export function getChainConfig(chainId: number) {
  return CHAIN_CONFIG[chainId as keyof typeof CHAIN_CONFIG];
}

// Helper function to get token addresses for a specific chain
export function getTokenAddresses(chainId: number) {
  const config = getChainConfig(chainId);
  return config?.tokens || CHAIN_CONFIG[liskSepolia.id].tokens; // Default to Lisk Sepolia
}

// Helper function to get contract addresses for a specific chain
export function getContractAddresses(chainId: number) {
  const config = getChainConfig(chainId);
  return config?.contracts || CHAIN_CONFIG[liskSepolia.id].contracts; // Default to Lisk Sepolia
}

// Backward compatibility - defaults to Lisk Sepolia (primary network)
export const TOKEN_ADDRESSES = getTokenAddresses(liskSepolia.id);
export const CONTRACT_ADDRESS = getContractAddresses(liskSepolia.id).fiatBridge;
