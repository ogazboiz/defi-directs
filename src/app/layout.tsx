// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { Providers } from '@/components/Providers';
import AppKitProvider from '@/context/AppKitProvider';
import { WalletProvider } from '@/context/WalletContext';
import { GlobalHeader } from '@/components/ui/GlobalHeader';

const roboto = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});



export const metadata: Metadata = {
  title: 'Defi-Direct',
  description: '',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <body className={roboto.className}>
        <StyledComponentsRegistry>
          <Providers>
            <AppKitProvider cookies={cookies}>
              <WalletProvider>
                <GlobalHeader />
                {children}
              </WalletProvider>
            </AppKitProvider>
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
