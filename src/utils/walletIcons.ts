// src/utils/walletIcons.ts
export const walletIcons: { [key: string]: string } = {
  "io.metamask": 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  metamask: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
  'app.phantom': 'https://187760183-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MVOiF6Zqit57q_hxJYp%2Fuploads%2FHEjleywo9QOnfYebBPCZ%2FPhantom_SVG_Icon.svg?alt=media&token=71b80a0a-def7-4f98-ae70-5e0843fdaaec',
  coinbasewallet: 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png',
  coinbaseWallet: 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png',
  walletconnect: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
  walletConnect: 'https://avatars.githubusercontent.com/u/37784886?s=200&v=4',
  rainbow: 'https://avatars.githubusercontent.com/u/80306874?s=200&v=4',
  civic: '/civic-logo.png',
  'com.coinbase.wallet': 'https://altcoinsbox.com/wp-content/uploads/2023/01/coinbase-wallet-logo.png',
  'com.trustwallet.app': 'https://trustwallet.com/assets/images/media/assets/trust_platform.svg',
  'io.rabby': 'https://rabby.io/assets/images/logo-128.png',
  'com.brave.wallet': 'https://brave.com/static-assets/images/brave-logo-sans-text.svg',
};

export const getWalletIcon = (connectorId: string, connectorName?: string): string => {
  // Try to get icon by connector ID first
  if (walletIcons[connectorId]) {
    return walletIcons[connectorId];
  }

  // Try to get icon by connector name (normalized)
  const normalizedName = connectorName?.toLowerCase().replace(/\s+/g, '');
  if (normalizedName && walletIcons[normalizedName]) {
    return walletIcons[normalizedName];
  }

  // Default fallback icon
  return 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg';
};