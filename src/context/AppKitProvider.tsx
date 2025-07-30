'use client'

import { wagmiAdapter, projectId, networks } from '@/config/appkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'DeFi Direct',
  description: 'Pay your bills directly with crypto - DeFi Direct',
  url: 'https://defidirect.app', // Update with your actual domain
  icons: ['/favicon.ico'] // Update with your actual icon
}

// Create the AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: networks[0],
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: true, // Enable email login
    socials: ['google', 'apple', 'github'], // Enable social logins
    emailShowWallets: true, // Show wallet options in email flow
  },
  themeMode: 'light', // You can make this dynamic based on your theme
  themeVariables: {
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 20
  },
  allowUnsupportedChain: true // Allow unsupported chains
})

function AppKitProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as never} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default AppKitProvider
