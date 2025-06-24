"use client";

import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface WalletProtectedRouteProps {
    children: ReactNode;
}

export function WalletProtectedRoute({ children }: WalletProtectedRouteProps) {
    const { isConnected } = useAccount();
    const router = useRouter();

    useEffect(() => {
        // If no wallet is connected, redirect to home page
        if (!isConnected) {
            router.push('/');
        }
    }, [isConnected, router]);

    // If not connected, don't render the protected content
    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center">
                <div className="text-center">
                    <div className="h-8 w-8 border-3 border-[#7b40e3] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Checking wallet connection...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
