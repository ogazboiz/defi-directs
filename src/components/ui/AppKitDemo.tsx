"use client";

import React from 'react';

// This component demonstrates how to use AppKit's built-in web components
export function AppKitDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-gray-900 rounded-lg">
      <h3 className="text-white text-lg font-semibold">AppKit Components Demo</h3>

      {/* AppKit Connect Button - This will open the full AppKit modal */}
      <appkit-button />

      {/* You can also customize the button */}
      <appkit-button size="md" />

      {/* Network Button - Opens network selection */}
      <appkit-network-button />

      {/* Account Button - Shows account info when connected */}
      <appkit-account-button />

      <div className="text-gray-400 text-sm">
        <p>These are AppKit&apos;s built-in web components that provide:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Automatic wallet detection</li>
          <li>Embedded wallet creation</li>
          <li>Social logins (Google, Apple, GitHub)</li>
          <li>Email wallet creation</li>
          <li>Network switching</li>
          <li>Account management</li>
          <li>WalletConnect integration</li>
        </ul>
      </div>
    </div>
  );
}
