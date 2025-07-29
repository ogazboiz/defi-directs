// src/components/Header.tsx
'use client';

import React from 'react';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { usePathname } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppKitAccount } from '@reown/appkit/react';
import { ConnectButton } from '@/components/ui/ConnectButton';
import { DashboardWalletDropdown } from '@/components/ui/DashboardWalletDropdown';

const Header: React.FC<{
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsMobileMenuOpen }) => {
  const pathname = usePathname();
  const { address } = useAppKitAccount();

  const getPageTitle = () => {
    if (pathname?.includes('transaction')) return 'Transactions';
    if (pathname?.includes('settings')) return 'Settings';
    if (pathname?.includes('bills')) return 'Bill Payments';
    return 'Welcome 👋';
  };

  return (
    <div className="relative flex justify-center bg-[#0A0014] items-center w-full">
      <div className="px-4 sm:px-6 lg:px-10 py-3 lg:py-4 w-full max-w-screen-2xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center">
            <div className="hidden lg:flex items-center space-x-6">
              <BellOutlined className="text-white text-2xl cursor-pointer hover:text-purple-400 transition" />
              {address ? (
                <DashboardWalletDropdown />
              ) : (
                <ConnectButton />
              )}
            </div>

            <div className="flex lg:hidden items-center space-x-3">
              {address && <DashboardWalletDropdown />}
              <button
                onClick={() => setIsMobileMenuOpen(prev => !prev)}
                className="p-2 hover:bg-[#1A0E2C] rounded-lg transition"
              >
                <MenuOutlined className="text-white text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Header;
