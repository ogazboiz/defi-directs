"use client";

import React, { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';
import { Web3ConnectModal } from '@/components/ui/Web3ConnectModal';
import { Wallet } from 'lucide-react';

export function ConnectButton() {
    const [modalOpen, setModalOpen] = useState(false);
    const { isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const userContext = useUser();

    // Function to create wallet and connect
    const handleConnect = async () => {
        try {
            // If user is logged in but doesn't have a wallet, create one
            if (userContext.user && !userHasWallet(userContext)) {
                console.log('Creating wallet for user...');
                await userContext.createWallet();
            }

            // Connect to the embedded wallet
            const embeddedConnector = connectors.find(connector => connector.id === 'civic');
            if (embeddedConnector && !isConnected) {
                console.log('Connecting to embedded wallet...');
                connect({ connector: embeddedConnector });
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            // Fallback to modal if auto-connect fails
            setModalOpen(true);
        }
    };

    // If wallet is connected, don't show this button
    if (isConnected && userContext.user && userHasWallet(userContext)) {
        return null;
    }

    return (
        <>
            <button
                onClick={userContext.user ? handleConnect : () => setModalOpen(true)}
                className="group relative overflow-hidden bg-[#7b40e3] hover:bg-[#6830d1] text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 h-[44px] active:scale-95"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center gap-2">
                    <Wallet className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                    <span>{userContext.user ? 'Connect Wallet' : 'Login & Connect'}</span>
                </div>
            </button>

            <Web3ConnectModal
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </>
    );
}
