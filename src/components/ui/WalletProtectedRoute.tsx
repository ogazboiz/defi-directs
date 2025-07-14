"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface WalletProtectedRouteProps {
    children: ReactNode;
}

export function WalletProtectedRoute({ children }: WalletProtectedRouteProps) {
    const { isConnected, isConnecting } = useAccount();
    const router = useRouter();

    useEffect(() => {
        // Only redirect if we're sure the wallet is not connected and not in connecting state
        if (!isConnected && !isConnecting) {
            const timer = setTimeout(() => {
                router.push('/');
            }, 1000); // Add a small delay to allow for connection detection

            return () => clearTimeout(timer);
        }
    }, [isConnected, isConnecting, router]);

    // Show loading while connecting or if connection state is uncertain
    if (isConnecting || (!isConnected && !isConnecting)) {
        return (
            <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 border-3 border-[#7b40e3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">
                        {isConnecting ? 'Connecting wallet...' : 'Checking wallet connection...'}
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
