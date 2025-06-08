'use client';
import Image from 'next/image';
import React from 'react';
import Logo from '../Logo';
import { useWallet } from '@/context/WalletContext'; // Use isAuthenticated from useWallet
import { ConnectButton } from '@/components/ui/ConnectButton';
import { WalletInfoDropdown } from '@/components/ui/WalletInfoDropdown';
import { AutoConnectWrapper } from '@/components/ui/AutoConnect';
import { FadeIn, SlideIn } from '@/components/ui/Transitions';
import Link from 'next/link';

function HeroSection() {
  const { isAuthenticated } = useWallet(); // Use isAuthenticated from useWallet
  console.log(process.env.NEXT_PUBLIC_JSON_RPC_SERVER_URL)

  // Remove automatic redirect - let users manually navigate

  return (
    <AutoConnectWrapper>
      <div>
        <div className='flex 2xl:justify-between lg:justify-between justify-between  w-full max-w-6xl mx-auto items-center'>
          <div className='ml-6'> <Logo /></div>
          <div className=" mr-6 z-10 flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <button className='py-3 px-6 bg-[#7b40e3] rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors h-[44px]'>
                    Dashboard
                  </button>
                </Link>
                <WalletInfoDropdown />
              </>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
        <div className="mx-auto max-w-4xl">
          <div className='flex flex-col items-center text-center'>
            {/* Floating crypto icons */}
            <div className="absolute inset-0 z-0">
              <SlideIn direction="down" delay={0.2}>
                <div className="absolute top-[107px] left-[210px] animate-pulse hidden md:flex ">
                  <Image
                    src="/Bitcoin_3D.png"
                    alt="Bitcoin"
                    width={113}
                    height={114}
                    className="hover:scale-150 transition-transform duration-300 w-20 h-20"
                  />
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.4}>
                <div className="absolute top-[529px] left-[308px] animate-pulse delay-300">
                  <Image
                    src="/USD_Coin_3D.png"
                    alt="usd"
                    width={80}
                    height={80}
                    style={{ width: "auto", height: "auto" }}
                    className="hover:scale-150 transition-transform duration-300"
                  />
                </div>
              </SlideIn>

              <SlideIn direction="left" delay={0.6}>
                <div className="absolute top-[294px] right-[-5px] animate-pulse delay-700">
                  <Image
                    src="/Shiba_Inu_3D.png"
                    alt="Shiba Inu"
                    width={130}
                    height={130}
                    style={{ width: "auto", height: "auto" }}
                    className="hover:scale-150 transition-transform duration-300"
                  />
                </div>
              </SlideIn>

              <SlideIn direction="right" delay={0.3}>
                <div className="absolute top-[250px] animate-pulse delay-500">
                  <Image
                    src="/Polygon_3D.png"
                    alt="Polygon"
                    width={120}
                    height={120}
                    style={{ width: "auto", height: "auto" }}
                    className="hover:scale-150 transition-transform duration-300"
                  />
                </div>
              </SlideIn>

              <SlideIn direction="up" delay={0.5}>
                <div className="absolute bottom-72 right-36 animate-pulse delay-200">
                  <Image
                    src="/Solana_3D.png"
                    alt="Solana"
                    width={60}
                    height={60}
                    style={{ width: "auto", height: "auto" }}
                    className="hover:scale-150 transition-transform duration-300"
                  />
                </div>
              </SlideIn>

              <SlideIn direction="down" delay={0.7}>
                <div className="absolute bottom-[25rem] left-72 animate-pulse delay-400">
                  <Image
                    src="/Ethereum_3D.png"
                    alt="Ethereum"
                    width={55}
                    height={55}
                    className="hover:scale-150 transition-transform duration-300 w-16 h-16"
                  />
                </div>
              </SlideIn>
            </div>

            <FadeIn delay={0.1}>
              <h1 className="md:text-7xl text-3xl md:mt-20 mt-10 mb-4">
                Take Control of Your Finances With Seamless Crypto Spending
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="md:mt-8 md:text-2xl md:mx-44 mx-4 mt-2">
                Spend directly from your DeFi wallet anywhere, anytime, no intermediaries, no delays. Secure, fast, and built for the future.
              </p>
            </FadeIn>

            <FadeIn delay={0.5}>
              <Link href="#WaitList">
                <button className='py-2 md:px-6 px-4 bg-[#7b40e3] rounded-lg mt-8 animate-bounce font-bold md:text-2xl text-md hover:bg-purple-700 transition-colors'>
                  Join Waitlist
                </button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </div>
    </AutoConnectWrapper>
  );
}

export default HeroSection;