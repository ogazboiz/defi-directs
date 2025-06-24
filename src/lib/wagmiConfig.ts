import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, baseSepolia, base, liskSepolia } from 'wagmi/chains'
import { embeddedWallet } from '@civic/auth-web3/wagmi'
import { walletConnect, coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
    chains: [liskSepolia, mainnet, sepolia, polygon, baseSepolia, base],
    connectors: [
        embeddedWallet(),
        walletConnect({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
            metadata: {
                name: 'DeFi Direct',
                description: 'DeFi Direct - Seamless crypto-to-fiat transactions',
                url: 'https://defi-direct.com',
                icons: ['https://defi-direct.com/icon.png']
            }
        }),
        coinbaseWallet({
            appName: 'DeFi Direct',
            appLogoUrl: 'https://defi-direct.com/icon.png'
        }),
    ],
    transports: {
        [liskSepolia.id]: http(),
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygon.id]: http(),
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
    ssr: true,
    multiInjectedProviderDiscovery: true,
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
