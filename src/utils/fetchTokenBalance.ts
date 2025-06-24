// src/utils/fetchTokenBalance.ts
import { readContract } from "@wagmi/core";
import { getTokenAddresses } from "@/config";
import { config } from "@/lib/wagmiConfig";
import { baseSepolia, liskSepolia, mainnet, sepolia, polygon, base } from 'wagmi/chains';

// Define supported chain IDs from wagmi config
type SupportedChainId = typeof liskSepolia.id | typeof baseSepolia.id | typeof mainnet.id | typeof sepolia.id | typeof polygon.id | typeof base.id;

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

export const fetchTokenBalance = async (
  token: "USDC" | "USDT",
  address: string,
  chainId?: SupportedChainId
) => {
  try {
    // Get token addresses for the specified chain or current chain
    const tokenAddresses = getTokenAddresses(chainId || liskSepolia.id); // Default to Lisk Sepolia

    const readContractParams = {
      address: tokenAddresses[token],
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [address as `0x${string}`],
      ...(chainId && { chainId }), // Only include chainId if provided
    } as const;

    const balance = (await readContract(config, readContractParams)) as bigint;

    return balance.toString();
  } catch (error) {
    console.error(`Error fetching ${token} balance:`, error);
    return "0";
  }
};