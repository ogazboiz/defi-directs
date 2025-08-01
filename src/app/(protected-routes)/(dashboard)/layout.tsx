// src/app/layout.tsx
'use client';

import React, { useState } from 'react';
//import { WalletProvider } from '@/context/WalletContext';
import Header from '@/components/dashboard/Header';
import Sidebar from '@/components/dashboard/Siderbar';
import { WalletProtectedRoute } from '@/components/ui/WalletProtectedRoute';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <WalletProtectedRoute>
      <div className="flex h-screen bg-[#0A0014]">
        <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#0A0014]">
            {children}
          </main>
        </div>
      </div>
    </WalletProtectedRoute>
  );
};

export default Layout;
