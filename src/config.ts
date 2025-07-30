// src/config.ts
import { supportedChains } from './config/networks';

// Get Morph Holesky chain (the only supported chain)
const morphHolesky = supportedChains[0]; // Since we only have one chain now

// Configuration for Morph Holesky network
export const CHAIN_CONFIG = {
  [morphHolesky.id]: {
    name: "Morph Holesky",
    tokens: {
      USDC: "0x31AA893438e58085d41cFF318fcE786f39CAEF14" as `0x${string}`,
      USDT: "0x7b6e182496c82A3ce48C9E2d737928E7e77aCf1f" as `0x${string}`,
    },
    contracts: {
      fiatBridge: "0x448435CD815c430bC7c0751aAF612cFD3D225416" as `0x${string}`,
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
  return config?.tokens || CHAIN_CONFIG[morphHolesky.id].tokens; // Default to Morph Holesky
}

// Helper function to get contract addresses for a specific chain
export function getContractAddresses(chainId: number) {
  const config = getChainConfig(chainId);
  return config?.contracts || CHAIN_CONFIG[morphHolesky.id].contracts; // Default to Morph Holesky
}

// Backward compatibility - defaults to Morph Holesky (only supported network)
export const TOKEN_ADDRESSES = getTokenAddresses(morphHolesky.id);
export const CONTRACT_ADDRESS = getContractAddresses(morphHolesky.id).fiatBridge;
