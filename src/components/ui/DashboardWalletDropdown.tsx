'use client';

import React, { useState } from 'react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { ChevronDown, Copy, LogOut, Network, Check, Settings, User } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';
import { supportedChains, chainIcons } from '@/config/networks';
import { useRouter } from 'next/navigation';
import { Avatar } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export function DashboardWalletDropdown(): JSX.Element | null {
    const { address } = useAccount();
    const { switchChain } = useSwitchChain();
    const chainId = useChainId();
    const { walletIcon, disconnectWallet } = useWallet();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chainDropdownOpen, setChainDropdownOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const handleLogout = () => {
        disconnectWallet();
        router.push('/');
        setDropdownOpen(false);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const currentChain = supportedChains.find(chain => chain.id === chainId);

    // Show dropdown for any connected wallet
    if (!address) {
        return null;
    }

    return (
        <div className="relative">
            {/* Dashboard Style Trigger Button */}
            <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center bg-[#1A0E2C] px-4 py-2 rounded-full space-x-3 cursor-pointer shadow-md hover:bg-[#2A1C44] transition"
            >
                <p className="text-white text-sm font-medium">{truncateAddress(address)}</p>
                <DownOutlined className="text-white text-sm" />
                <Avatar
                    size="large"
                    src={walletIcon || 'https://avatars.githubusercontent.com/u/1?v=4'}
                    className="border-2 border-purple-500"
                />
            </button>

            {dropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-[#1a1a2e] border border-gray-700 rounded-xl shadow-lg z-50">
                    {/* Wallet Info Section */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar
                                size="large"
                                src={walletIcon || 'https://avatars.githubusercontent.com/u/1?v=4'}
                                className="border-2 border-purple-500"
                            />
                            <div>
                                <p className="text-white font-medium text-sm">Wallet Connected</p>
                                <p className="text-gray-400 text-xs">{truncateAddress(address)}</p>
                            </div>
                        </div>

                        {/* Copy Address Button */}
                        <button
                            onClick={() => copyToClipboard(address)}
                            className="w-full flex items-center gap-2 px-3 py-2 bg-[#262640] hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            {copySuccess ? (
                                <>
                                    <Check className="h-4 w-4 text-green-400" />
                                    <span className="text-green-400 text-sm">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-300 text-sm">Copy Address</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Network Section */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="relative">
                            <button
                                onClick={() => setChainDropdownOpen(!chainDropdownOpen)}
                                className="w-full flex items-center justify-between px-3 py-2 bg-[#262640] hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    {chainIcons[chainId] && (
                                        <img
                                            src={chainIcons[chainId]}
                                            alt={currentChain?.name || 'Chain'}
                                            className="w-4 h-4 rounded-full"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <Network className="h-4 w-4 text-gray-400" />
                                    <span className="text-gray-300 text-sm">
                                        {currentChain?.name || 'Unknown Network'}
                                    </span>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${chainDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {chainDropdownOpen && (
                                <div className="absolute top-full mt-1 left-0 right-0 bg-[#2A2A35] border border-gray-600 rounded-lg shadow-lg z-10">
                                    {supportedChains.map((chain) => (
                                        <button
                                            key={chain.id}
                                            onClick={() => {
                                                switchChain({ chainId: chain.id });
                                                setChainDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-[#262640] transition-colors first:rounded-t-lg last:rounded-b-lg ${chain.id === chainId ? 'text-purple-400' : 'text-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {chainIcons[chain.id] && (
                                                        <img
                                                            src={chainIcons[chain.id]}
                                                            alt={chain.name}
                                                            className="w-4 h-4 rounded-full"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                            }}
                                                        />
                                                    )}
                                                    <span>{chain.name}</span>
                                                </div>
                                                {chain.id === chainId && (
                                                    <Check className="h-4 w-4 text-purple-400" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        <button
                            onClick={() => {
                                setDropdownOpen(false);
                                // Add profile navigation if needed
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-[#262640] rounded-lg transition-colors"
                        >
                            <User className="h-4 w-4" />
                            <span className="text-sm">Profile</span>
                        </button>

                        <button
                            onClick={() => {
                                router.push('/settings');
                                setDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-[#262640] rounded-lg transition-colors"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="text-sm">Settings</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="text-sm">Logout</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop to close dropdown */}
            {(dropdownOpen || chainDropdownOpen) && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => {
                        setDropdownOpen(false);
                        setChainDropdownOpen(false);
                    }}
                />
            )}
        </div>
    );
}
