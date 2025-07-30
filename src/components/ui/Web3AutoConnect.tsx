"use client";

import { useAutoConnect } from './AutoConnect';

interface Web3AutoConnectProps {
    children: React.ReactNode;
}

export function Web3AutoConnect({ children }: Web3AutoConnectProps) {
    // AppKit auto-connect functionality
    useAutoConnect();

    return <>{children}</>;
}
