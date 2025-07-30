"use client";

import React from 'react';
import { useAppKitAccount, useAppKit } from '@reown/appkit/react';
import { Wallet } from 'lucide-react';

export function ConnectButton() {
    const { isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    if (isConnected) {
        return null;
    }

    return (
        <button
            onClick={() => open()}
            className="group relative overflow-hidden bg-[#7b40e3] hover:bg-[#6830d1] text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 h-[44px] active:scale-95"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center gap-2">
                <Wallet className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Connect Wallet</span>
            </div>
        </button>
    );
}

// Alternative: Custom button that calls AppKit open
export function CustomConnectButton() {
    const { isConnected } = useAppKitAccount();
    const { open } = useAppKit();

    // If any wallet is connected, don't show this button
    if (isConnected) {
        return null;
    }

    return (
        <button
            onClick={() => open()}
            className="group relative overflow-hidden bg-[#7b40e3] hover:bg-[#6830d1] text-white rounded-2xl px-6 py-3 font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 h-[44px] active:scale-95"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <div className="relative flex items-center gap-2">
                <Wallet className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Connect Wallet</span>
            </div>
        </button>
    );
}

export function AppKitConnectButton() {
    return (
        <div className="appkit-button-wrapper">
            <appkit-button
                label="Connect Wallet"
                size="md"
            />
        </div>
    );
}

// Type declarations for AppKit web components
declare global {
    interface JSX {
        IntrinsicElements: {
            'appkit-button': {
                label?: string;
                size?: 'md' | 'sm';
                balance?: 'show' | 'hide';
                loadingLabel?: string;
                disabled?: boolean;
            };
            'appkit-network-button': Record<string, unknown>;
            'appkit-account-button': Record<string, unknown>;
        };
    }
}
