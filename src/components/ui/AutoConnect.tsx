"use client";

import React, { useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import { useUser } from '@civic/auth-web3/react';
import { userHasWallet } from '@civic/auth-web3';

export function useAutoConnect() {
    const { connectors, connect } = useConnect();
    const { isConnected } = useAccount();
    const userContext = useUser();

    useEffect(() => {
        const handleAutoConnect = async () => {
            // Only proceed if user is logged in but not connected to wallet
            if (!userContext.user || isConnected) return;

            try {
                // If user doesn't have a wallet, create one
                if (!userHasWallet(userContext)) {
                    console.log('Creating wallet for new user...');
                    await userContext.createWallet();
                }

                // Connect to the embedded wallet
                const embeddedConnector = connectors.find(connector => connector.id === 'civic');
                if (embeddedConnector && !isConnected) {
                    console.log('Connecting to embedded wallet...');
                    connect({ connector: embeddedConnector });
                }
            } catch (error) {
                console.error('Error in auto-connect:', error);
            }
        };

        handleAutoConnect();
    }, [userContext.user, isConnected, connectors, connect, userContext]);
}

export function AutoConnectWrapper({ children }: { children: React.ReactNode }) {
    useAutoConnect();
    return <>{children}</>;
}
