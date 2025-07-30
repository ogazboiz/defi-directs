"use client";

import React, { useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';

// AppKit Auto-Connect Hook
// AppKit automatically handles connection restoration on page load
export function useAutoConnect() {
    const { isConnected, address } = useAppKitAccount();

    useEffect(() => {
        // AppKit automatically handles reconnection
        // No manual intervention needed
        if (isConnected && address) {
            console.log('Wallet auto-connected:', address);
        }
    }, [isConnected, address]);

    return { isConnected, address };
}

// Component wrapper for auto-connect functionality
export function AutoConnect({ children }: { children: React.ReactNode }) {
    useAutoConnect();
    return <>{children}</>;
}
