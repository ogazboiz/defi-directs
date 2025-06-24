"use client";

import React from 'react';
import Image from 'next/image';
import { useUser, UserButton } from '@civic/auth-web3/react';
import { useAutoConnect } from '@civic/auth-web3/wagmi';
import { useAccount, useConnect } from 'wagmi';
import { userHasWallet } from '@civic/auth-web3';
import { getWalletIcon } from '@/utils/walletIcons';
import type { Connector } from 'wagmi';

interface Web3ConnectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function Web3ConnectModal({ open, onOpenChange }: Web3ConnectModalProps) {
    const userContext = useUser();
    const { user, isLoading, walletCreationInProgress } = userContext;
    const { isConnected } = useAccount();
    const { connectors, connect, isPending } = useConnect();

    useAutoConnect();

    // Close modal when any wallet is connected
    React.useEffect(() => {
        if (isConnected) {
            onOpenChange(false);
        }
    }, [isConnected, onOpenChange]);

    // Don't render if not open
    if (!open) return null;

    // Get wallet icons - now uses connector objects and utility function
    const getWalletIconComponent = (connector: Connector | { id: string; name: string }) => {
        if (connector.id === 'civic') {
            return (
                <div className="w-8 h-8 bg-[#7b40e3] rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-5z" />
                    </svg>
                </div>
            );
        }

        // Use connector icon if available, otherwise fallback to utility function
        const iconUrl = ('icon' in connector ? connector.icon : undefined) || getWalletIcon(connector.id, connector.name);

        // Create fallback with first letter
        const firstLetter = connector.name?.charAt(0).toUpperCase() || 'W';

        return (
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center relative">
                {iconUrl ? (
                    <Image
                        src={iconUrl}
                        alt={connector.name || 'Wallet'}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // Hide the image and show the fallback letter
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `<span class="text-white font-medium text-sm">${firstLetter}</span>`;
                            }
                        }}
                    />
                ) : (
                    <span className="text-white font-medium text-sm">{firstLetter}</span>
                )}
            </div>
        );
    };

    // Get wallet display names
    const getWalletName = (connector: Connector) => {
        switch (connector.id) {
            case 'civic':
                return 'Civic Wallet (Social Login)';
            case 'walletConnect':
                return 'WalletConnect';
            case 'coinbaseWallet':
                return 'Coinbase Wallet';
            default:
                return connector.name || 'Unknown Wallet';
        }
    };

    // Get wallet descriptions
    const getWalletDescription = (connector: Connector) => {
        switch (connector.id) {
            case 'civic':
                return 'Sign in with social accounts (Google, Apple, etc.)';
            case 'walletConnect':
                return 'Connect with WalletConnect protocol';
            case 'coinbaseWallet':
                return 'Connect with Coinbase Wallet';
            default:
                if (connector.type === 'injected') {
                    return 'Connect with browser extension wallet';
                }
                return 'Connect your wallet';
        }
    };

    // Handle wallet connection
    const handleConnect = async (connector: Connector) => {
        try {
            if (connector.id === 'civic') {
                // For Civic wallet, handle user creation if needed
                if (!user) {
                    // User needs to sign in first
                    return;
                }

                if (!userHasWallet(userContext)) {
                    console.log('Creating wallet for user...');
                    await userContext.createWallet();
                }
            }

            connect({ connector });
        } catch (error) {
            console.error('Error connecting wallet:', error);
        }
    };

    // If user is not authenticated and trying to connect Civic wallet, show login first
    if (!isLoading && !user) {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
                <div className="bg-black border border-gray-800 rounded-lg shadow-lg shadow-purple-500/10 w-full max-w-md mx-auto relative my-8">
                    <div className="bg-[#7b40e3] px-6 py-4 text-white rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
                            </div>
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-black max-h-[80vh] overflow-y-auto">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-medium text-white mb-2">
                                Welcome to DeFi Direct
                            </h3>
                            <p className="text-gray-300 text-sm">
                                Choose how you&apos;d like to connect your wallet
                            </p>
                        </div>

                        <div className="space-y-3">
                            {/* Civic Auth Option */}
                            <div className="border border-purple-500/20 rounded-lg p-4 bg-purple-500/5">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        {getWalletIconComponent({ id: 'civic', name: 'Civic' })}
                                        <div>
                                            <h4 className="text-white font-medium">Civic Wallet</h4>
                                            <p className="text-gray-400 text-sm">Social Login</p>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-purple-500 text-white px-2 py-1 rounded-full">
                                        Recommended
                                    </div>
                                </div>
                                <p className="text-gray-300 text-sm mb-4">
                                    Sign in with Google, Apple, or other social accounts. Perfect for users new to crypto.
                                </p>
                                <UserButton
                                    style={{
                                        width: "100%",
                                        fontSize: "14px",
                                        padding: "10px 16px",
                                        borderRadius: "6px",
                                        backgroundColor: "#7b40e3",
                                        border: "none",
                                        color: "#ffffff"
                                    }}
                                />
                            </div>

                            {/* Other Wallet Options */}
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm font-medium">Or connect with existing wallet:</p>
                                {connectors
                                    .filter(connector => connector.id !== 'civic')
                                    .map((connector) => (
                                        <button
                                            key={connector.id}
                                            onClick={() => handleConnect(connector)}
                                            disabled={isPending}
                                            className="w-full flex items-center space-x-3 p-3 border border-gray-600 rounded-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {getWalletIconComponent(connector)}
                                            <div className="flex-1 text-left">
                                                <div className="text-white font-medium">{getWalletName(connector)}</div>
                                                <div className="text-gray-400 text-sm">{getWalletDescription(connector)}</div>
                                            </div>
                                            {isPending && (
                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                                            )}
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <p className="text-xs text-gray-400 text-center">
                                By connecting, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Web3U walletCreationInProgress={walletCreationInProgress} />
    );
}



function Web3U({
    walletCreationInProgress,
}: {
    walletCreationInProgress?: boolean;
}) {
    const { isConnected, address, chain } = useAccount();
    const user = useUser();
    const isLoading = user.isLoading || walletCreationInProgress;

    console.log("Chain is", chain);

    return (
        <>
            {/* Loading State */}
            {(!isConnected || isLoading) && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-black border border-gray-800 rounded-lg shadow-lg shadow-purple-500/10 w-full max-w-md mx-auto relative">
                        {/* Header */}
                        <div className="bg-[#7b40e3] px-6 py-4 text-white rounded-t-lg">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <h2 className="text-xl font-semibold">
                                    {walletCreationInProgress ? 'Creating Wallet' : 'Connecting Wallet'}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-black">
                            <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                                {/* Progress Icon */}
                                <div className="bg-purple-900/50 p-4 rounded-full border border-purple-500/30">
                                    <div className="h-8 w-8 border-3 border-[#7b40e3] border-t-transparent rounded-full animate-spin"></div>
                                </div>

                                {/* Status Text */}
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        {walletCreationInProgress
                                            ? 'Setting Up Your Wallet'
                                            : 'Connecting to Your Wallet'
                                        }
                                    </h3>
                                    <p className="text-gray-300 text-sm">
                                        {walletCreationInProgress
                                            ? 'Please wait while we create your secure wallet...'
                                            : 'Please wait while we establish the connection...'
                                        }
                                    </p>
                                </div>

                                {/* Progress Steps */}
                                <div className="w-full max-w-xs">
                                    <div className="flex items-center justify-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-2 w-2 bg-[#7b40e3] rounded-full animate-pulse"></div>
                                            <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                                            <div className="h-2 w-2 bg-purple-300 rounded-full animate-pulse delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-900 px-6 py-3 border-t border-gray-800 rounded-b-lg">
                            <p className="text-xs text-gray-400 text-center">
                                This may take a few moments...
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Success State - Wallet Connected */}
            {isConnected && !isLoading && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-black border border-gray-800 rounded-lg shadow-lg shadow-green-500/10 w-full max-w-md mx-auto relative">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white rounded-t-lg">
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="h-6 w-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h2 className="text-xl font-semibold">Wallet Connected!</h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-black">
                            <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
                                {/* Success Icon */}
                                <div className="bg-green-900/50 p-4 rounded-full border border-green-500/30">
                                    <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>

                                {/* Success Message */}
                                <div className="text-center">
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        Successfully Connected
                                    </h3>
                                    <p className="text-gray-300 text-sm mb-4">
                                        Your wallet is now connected and ready to use
                                    </p>
                                </div>

                                {/* Wallet Info */}
                                <div className="w-full bg-gray-900 rounded-lg p-4 border border-gray-700">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Network:</span>
                                            <span className="text-sm font-medium text-white">{chain?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Address:</span>
                                            <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-900 px-6 py-3 border-t border-gray-800 rounded-b-lg">
                            <p className="text-xs text-gray-400 text-center">
                                You can now access all DeFi features
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

