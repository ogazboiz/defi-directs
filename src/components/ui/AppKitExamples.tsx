"use client";

import React from 'react';

/**
 * AppKit Web Component Examples
 * 
 * This component demonstrates how to use AppKit's built-in web components
 * instead of custom wallet connection components.
 */
export function AppKitExamples() {
    return (
        <div className="space-y-4 p-4 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">AppKit Components</h3>

            {/* Basic Connect Button */}
            <div className="space-y-2">
                <p className="text-sm text-gray-400">Basic Connect Button:</p>
                <appkit-button />
            </div>

            {/* Connect Button with Custom Label */}
            <div className="space-y-2">
                <p className="text-sm text-gray-400">Custom Label:</p>
                <appkit-button label="Connect Your Wallet" />
            </div>

            {/* Connect Button with Balance Display */}
            <div className="space-y-2">
                <p className="text-sm text-gray-400">With Balance:</p>
                <appkit-button balance="show" />
            </div>

            {/* Network Button */}
            <div className="space-y-2">
                <p className="text-sm text-gray-400">Network Selector:</p>
                <appkit-network-button />
            </div>

            {/* Account Button (shows when connected) */}
            <div className="space-y-2">
                <p className="text-sm text-gray-400">Account Button:</p>
                <appkit-account-button />
            </div>

            <div className="mt-4 p-3 bg-gray-800 rounded text-sm text-gray-300">
                <strong>Note:</strong> These are AppKit&apos;s built-in web components that provide:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Automatic wallet connection handling</li>
                    <li>Built-in support for 350+ wallets</li>
                    <li>Email and social login options</li>
                    <li>Embedded wallet functionality</li>
                    <li>Network switching capabilities</li>
                    <li>Consistent styling and UX</li>
                </ul>
            </div>
        </div>
    );
}

// Global type declarations for AppKit web components
interface AppKitButtonProps {
    label?: string;
    balance?: 'show' | 'hide';
    size?: 'md' | 'sm';
}

declare global {
    interface IntrinsicElements {
        'appkit-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & AppKitButtonProps;
        'appkit-network-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        'appkit-account-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
