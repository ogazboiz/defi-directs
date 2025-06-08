"use client";

import React from 'react';
import { useUser, UserButton } from '@civic/auth-web3/react';
import { useAutoConnect } from '@civic/auth-web3/wagmi';
import { useAccount } from 'wagmi';
import { userHasWallet } from '@civic/auth-web3';

interface Web3ConnectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function Web3ConnectModal({ open, onOpenChange }: Web3ConnectModalProps) {
    const userContext = useUser();
    const { user, isLoading, walletCreationInProgress } = userContext;
    const { isConnected } = useAccount();

    useAutoConnect();

    // Close modal when wallet is connected
    React.useEffect(() => {
        if (isConnected && user && userHasWallet(userContext)) {
            onOpenChange(false);
        }
    }, [isConnected, user, userContext, onOpenChange]);

    // Don't render if not open
    if (!open) return null;

    // If user is not authenticated, show the UserButton login
    if (!isLoading && !user) {
        return (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-black border border-gray-800 rounded-lg shadow-lg shadow-purple-500/10 w-full max-w-md mx-auto relative">
                    {/* Header */}
                    <div className="bg-[#7b40e3] px-6 py-4 text-white rounded-t-lg">
                        <div className="flex items-center justify-center space-x-2">
                            <svg className="h-6 w-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h2 className="text-xl font-semibold">Connect Your Wallet</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 bg-black">
                        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-6">
                            {/* Welcome Message */}
                            <div className="text-center">
                                <h3 className="text-lg font-medium text-white mb-2">
                                    Welcome to DeFi Direct
                                </h3>
                                <p className="text-gray-300 text-sm mb-6">
                                    Sign in to access your secure wallet and start using DeFi features
                                </p>
                            </div>

                            {/* UserButton */}
                            <div className="w-full flex justify-center">
                                <UserButton
                                    style={{
                                        minWidth: "200px",
                                        fontSize: "16px",
                                        padding: "12px 24px",
                                        borderRadius: "8px",
                                        backgroundColor: "#7b40e3",
                                        border: "none",
                                        boxShadow: "0 4px 14px 0 rgba(123, 64, 227, 0.25)",
                                        transition: "all 0.3s ease",
                                        color: "#ffffff"
                                    }}
                                />
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                            >
                                Cancel
                            </button>
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

