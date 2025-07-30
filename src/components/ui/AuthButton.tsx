"use client";

import React from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';

interface AuthButtonProps {
    className?: string;
    style?: React.CSSProperties;
}

export function AuthButton({ className, style }: AuthButtonProps) {
    const { open } = useAppKit();
    const { isConnected, address } = useAppKitAccount();

    return (
        <button
            onClick={() => open()}
            className={className}
            style={{
                borderRadius: "12px",
                fontSize: "14px",
                padding: "10px 20px",
                backgroundColor: "#7b40e3",
                border: "none",
                boxShadow: "0 4px 14px 0 rgba(123, 64, 227, 0.25)",
                transition: "all 0.3s ease",
                fontWeight: "500",
                color: "#ffffff",
                cursor: "pointer",
                ...style
            }}
        >
            {isConnected
                ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : 'Connect Wallet'
            }
        </button>
    );
}
