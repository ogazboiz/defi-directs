"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { fetchTokenBalance } from "@/utils/fetchTokenBalance";
import { fetchTokenPrice } from "@/utils/fetchTokenprice";
import { Transaction } from "@/types/transaction";
import { supportedChainIds, isSupportedChainId } from '@/config/networks';

interface WalletContextType {
  connectedAddress: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  walletIcon: string | null;
  walletName: string | null;
  usdcBalance: string;
  usdtBalance: string;
  totalNgnBalance: number;
  usdcPrice: number;
  usdtPrice: number;
  fetchBalances: () => Promise<void>;
  disconnectWallet: () => void;
  refetchTransactions: () => void;
  transactionTrigger: number;
  pendingTransactions: Transaction[];
  addPendingTransaction: (tx: Transaction) => void;
  clearPendingTransaction: (txHash: `0x${string}`) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletIcon, setWalletIcon] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string>("0");
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [totalNgnBalance, setTotalNgnBalance] = useState<number>(0);
  const [usdcPrice, setUsdcPrice] = useState<number>(0);
  const [usdtPrice, setUsdtPrice] = useState<number>(0);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<number>(0);
  const [transactionTrigger, setTransactionTrigger] = useState<number>(0);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);

  const fetchAndCacheTokenPrices = useCallback(async () => {
    const now = Date.now();
    const cacheDuration = 5 * 60 * 1000;

    if (now - lastPriceUpdate > cacheDuration) {
      try {
        const [usdcPrice, usdtPrice] = await Promise.all([
          fetchTokenPrice("usd-coin"),
          fetchTokenPrice("tether"),
        ]);

        setUsdcPrice(usdcPrice);
        setUsdtPrice(usdtPrice);
        setLastPriceUpdate(now);
      } catch (error) {
        console.error("Failed to fetch token prices:", error);
      }
    }
  }, [lastPriceUpdate]);

  const fetchBalances = useCallback(async () => {
    if (!address || !chainId) return;

    try {
      // Convert chainId to number if it's a string, and use type guard
      const numericChainId = typeof chainId === 'string' ? parseInt(chainId) : chainId;
      const validChainId = isSupportedChainId(numericChainId) ? numericChainId : supportedChainIds[0]; // Default to first supported chain

      const [usdcBalance, usdtBalance] = await Promise.all([
        fetchTokenBalance("USDC", address, validChainId),
        fetchTokenBalance("USDT", address, validChainId),
      ]);

      // Set generic wallet info for AppKit wallets
      setWalletIcon(null); // AppKit handles wallet icons
      setWalletName("Connected Wallet");

      const usdc = parseFloat(usdcBalance) || 0;
      const usdt = parseFloat(usdtBalance) || 0;
      const totalUp = usdc * usdcPrice + usdt * usdtPrice;
      const total = totalUp / 1_000_000; // Adjust if needed
      setTotalNgnBalance(total);
      setUsdcBalance(usdcBalance);
      setUsdtBalance(usdtBalance);
    } catch (error) {
      console.error("Failed to fetch token balances:", error);
    }
  }, [address, chainId, usdcPrice, usdtPrice]);

  const refetchTransactions = useCallback(() => {
    setTransactionTrigger((prev) => prev + 1);
  }, []);

  const addPendingTransaction = useCallback((tx: Transaction) => {
    setPendingTransactions((prev) => [...prev, tx]);
  }, []);

  const clearPendingTransaction = useCallback((txHash: `0x${string}`) => {
    setPendingTransactions((prev) => prev.filter((tx) => tx.txHash !== txHash));
  }, []);

  const disconnectWallet = useCallback(async () => {
    try {
      // AppKit handles disconnection through the modal
      // The actual disconnect functionality is handled by AppKit
      console.log("Disconnecting wallet...");
    } catch (error) {
      console.error("Error during wallet disconnection:", error);
    }
  }, []);

  useEffect(() => {
    setIsAuthenticated(isConnected);

    if (!isConnected || !address) {
      setWalletIcon(null);
      setWalletName(null);
      setUsdcBalance("0");
      setUsdtBalance("0");
      setTotalNgnBalance(0);
      setUsdcPrice(0);
      setUsdtPrice(0);
      setPendingTransactions([]);
      return;
    }

    fetchBalances();
    fetchAndCacheTokenPrices();
    const priceIntervalId = setInterval(fetchAndCacheTokenPrices, 5 * 60 * 1000);

    return () => {
      clearInterval(priceIntervalId);
    };
  }, [isConnected, address, fetchBalances, fetchAndCacheTokenPrices]);

  return (
    <WalletContext.Provider
      value={{
        connectedAddress: address || null,
        isConnecting: false,
        isAuthenticated,
        walletIcon,
        walletName,
        usdcBalance,
        usdtBalance,
        totalNgnBalance,
        usdcPrice,
        usdtPrice,
        fetchBalances,
        disconnectWallet,
        refetchTransactions,
        transactionTrigger,
        pendingTransactions,
        addPendingTransaction,
        clearPendingTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};