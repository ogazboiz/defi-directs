import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, baseSepolia, base } from 'wagmi/chains'
import { embeddedWallet } from '@civic/auth-web3/wagmi'

export const config = createConfig({
    chains: [mainnet, sepolia, polygon, baseSepolia, base],
    connectors: [
        embeddedWallet(),
    ],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [polygon.id]: http(),
        [baseSepolia.id]: http(),
        [base.id]: http(),
    },
    ssr: true,
})

declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
