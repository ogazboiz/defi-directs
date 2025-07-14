"use client"

import { ArrowUpRight, Users } from "lucide-react"
import { useState, useEffect } from "react"
import { TransferModal } from "./wallet/transfer-modal"
import { BatchTransferModal } from "./wallet/batch-transfer-modal"
import { BatchTransferSummary } from "./wallet/batch-transfer-summary"
import { useWallet } from "@/context/WalletContext"
import WalletBalanceSkeleton from "./wallet-balance-skeleton"

interface Recipient {
  id: string
  accountName: string
  accountNumber: string
  bankCode: string
  bankName: string
  amount: string
}

export default function WalletBalance() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBatchOpen, setIsBatchOpen] = useState(false)
  const [isBatchSummaryOpen, setIsBatchSummaryOpen] = useState(false)
  const [batchRecipients, setBatchRecipients] = useState<Recipient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { totalNgnBalance } = useWallet()

  const selectedToken = {
    name: "USDC",
    logo: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
    address: "0x..."
  }

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleBatchProceedToSummary = (recipients: Recipient[]) => {
    setBatchRecipients(recipients)
    setIsBatchOpen(false)
    setIsBatchSummaryOpen(true)
  }

  const handleBackToBatchModal = () => {
    setIsBatchSummaryOpen(false)
    setIsBatchOpen(true)
  }

  if (isLoading) {
    return <WalletBalanceSkeleton />
  }

  return (
    <>
      <div className="w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1C1C27] to-[#1C1C2700] p-4 sm:p-6">
        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-base sm:text-lg font-medium text-white">Wallet Balance</h2>
          <p className="text-2xl sm:text-4xl font-semibold text-white">
            ₦
            {totalNgnBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#7b40e3] px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-opacity hover:bg-purple-700 mb-2"
          >
            <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Single Transfer</span>
          </button>
          <button
            onClick={() => setIsBatchOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#2F2F3A] border border-[#7b40e3]/30 px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-colors hover:bg-[#3B3B4F] hover:border-[#7b40e3]/50"
          >
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Batch Transfer</span>
          </button>
        </div>
      </div>
      <TransferModal open={isOpen} onOpenChange={setIsOpen} balance={totalNgnBalance} />
      <BatchTransferModal
        open={isBatchOpen}
        onOpenChange={setIsBatchOpen}
        onProceedToSummary={handleBatchProceedToSummary}
      />
      <BatchTransferSummary
        open={isBatchSummaryOpen}
        onOpenChange={setIsBatchSummaryOpen}
        recipients={batchRecipients}
        onBack={handleBackToBatchModal}
        selectedToken={selectedToken}
      />
    </>
  )
}