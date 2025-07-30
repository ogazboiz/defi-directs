"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Shield, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useWallet } from "@/context/WalletContext"
import { usePublicClient, useWalletClient } from "wagmi"
import { fetchTokenPrice } from "@/utils/fetchTokenprice"
import BatchTransferService from "@/services/batchTransferService"
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'

interface Recipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
}

interface BatchTransferSummaryProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    recipients: Recipient[]
    onBack: () => void
    selectedToken: {
        name: string
        logo: string
        address: string
    }
}

export function BatchTransferSummary({
    open,
    onOpenChange,
    recipients,
    onBack,
    selectedToken
}: BatchTransferSummaryProps) {
    const [processing, setProcessing] = useState(false)
    const [approving, setApproving] = useState(false)
    const [approved, setApproved] = useState(false)
    const [processedTransfers, setProcessedTransfers] = useState<{ [key: string]: 'pending' | 'success' | 'failed' }>({})

    const { refetchTransactions } = useWallet()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    const totalAmount = recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0)
    const platformFee = totalAmount * 0.01 // 1% fee
    const totalWithFee = totalAmount + platformFee

    const handleApproveTokens = async () => {
        if (!publicClient || !walletClient) {
            toast.error("Wallet not connected")
            return
        }

        setApproving(true)
        try {
            const tokenPrice = await fetchTokenPrice(selectedToken.name.toLowerCase() === 'usdc' ? 'usd-coin' : 'tether')
            const batchService = new BatchTransferService(publicClient, walletClient, selectedToken, tokenPrice)

            const totalFiatAmount = recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0)
            const totalTokenAmount = totalFiatAmount / tokenPrice // Simplified conversion

            const success = await batchService.approveBatchTransfer(totalTokenAmount)

            if (success) {
                setApproved(true)
                toast.success("Tokens approved successfully!")
            } else {
                toast.error("Failed to approve tokens")
            }
        } catch (error) {
            console.error('Approval error:', error)
            toast.error("Failed to approve tokens")
        } finally {
            setApproving(false)
        }
    }

    const handleProcessBatchTransfer = async () => {
        if (!approved) {
            toast.error("Please approve tokens first")
            return
        }

        if (!publicClient || !walletClient) {
            toast.error("Wallet not connected")
            return
        }

        setProcessing(true)

        try {
            const tokenPrice = await fetchTokenPrice(selectedToken.name.toLowerCase() === 'usdc' ? 'usd-coin' : 'tether')
            const batchService = new BatchTransferService(publicClient, walletClient, selectedToken, tokenPrice)

            const results = await batchService.processBatchTransfer(recipients, (result) => {
                setProcessedTransfers(prev => ({
                    ...prev,
                    [result.id]: result.status
                }))

                if (result.status === 'failed') {
                    const recipient = recipients.find(r => r.id === result.id)
                    if (recipient) {
                        toast.error(`Transfer to ${recipient.accountName} failed: ${result.error}`)
                    }
                } else if (result.status === 'success') {
                    const recipient = recipients.find(r => r.id === result.id)
                    if (recipient) {
                        toast.success(`Transfer to ${recipient.accountName} completed successfully!`)
                    }
                }
            })

            const successfulTransfers = results.filter(r => r.status === 'success').length
            const failedTransfers = results.filter(r => r.status === 'failed').length

            if (successfulTransfers > 0) {
                toast.success(`Batch transfer completed! ${successfulTransfers}/${recipients.length} transfers successful`)
                refetchTransactions() // Refresh transaction list
            }

            if (failedTransfers > 0) {
                toast.error(`${failedTransfers} transfers failed. Please check individual statuses.`)
            }

            // Close modal after showing results for a moment
            setTimeout(() => {
                onOpenChange(false)
            }, 5000)

        } catch (error) {
            console.error('Batch transfer error:', error)
            toast.error("Batch transfer failed")
        } finally {
            setProcessing(false)
        }
    }

    const getTransferStatusIcon = (status: 'pending' | 'success' | 'failed' | undefined) => {
        switch (status) {
            case 'pending':
                return <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-400" />
            case 'failed':
                return <AlertCircle className="h-4 w-4 text-red-400" />
            default:
                return <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
        }
    }

    const getTransferStatusColor = (status: 'pending' | 'success' | 'failed' | undefined) => {
        switch (status) {
            case 'pending':
                return 'text-yellow-400'
            case 'success':
                return 'text-green-400'
            case 'failed':
                return 'text-red-400'
            default:
                return 'text-gray-400'
        }
    }

    return (
        <>
            <Toaster position="top-center" />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl w-[95vw] border border-[#7b40e3]/20 bg-[#1C1C27] p-0 text-white rounded-[20px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={onBack}
                                className="text-white hover:opacity-80 transition-opacity"
                                disabled={processing}
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-[#7b40e3]">Batch Transfer Summary</h2>
                        </div>

                        {/* Amount Summary */}
                        <div className="text-center mb-6">
                            <p className="text-3xl font-bold text-white">₦{totalAmount.toLocaleString()}</p>
                            <p className="text-gray-400 mt-1">Total to {recipients.length} recipients</p>
                        </div>

                        {/* Transaction Details */}
                        <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-white mb-4">Transaction Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Transfer Type</span>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-purple-400" />
                                        <span className="text-white">Batch Bank Transfer</span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Number of Recipients</span>
                                    <span className="text-white">{recipients.length}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Token</span>
                                    <div className="flex items-center gap-2">
                                        <Image src={selectedToken.logo} alt={selectedToken.name} width={20} height={20} className="rounded-full" />
                                        <span className="text-white">{selectedToken.name}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-400">Time</span>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        <span className="text-white">{new Date().toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fee Breakdown */}
                        <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-white mb-4">Fee Breakdown</h3>

                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">₦{totalAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Platform Fee (1%)</span>
                                    <span className="text-white">₦{platformFee.toFixed(2)}</span>
                                </div>
                                <hr className="border-gray-600" />
                                <div className="flex justify-between font-medium">
                                    <span className="text-white">Total</span>
                                    <span className="text-purple-400 text-lg">₦{totalWithFee.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Recipients List */}
                        <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                            <h3 className="text-lg font-medium text-white mb-4">Recipients</h3>

                            <div className="max-h-60 overflow-y-auto space-y-3">
                                {recipients.map((recipient) => (
                                    <div key={recipient.id} className="flex items-center justify-between p-3 bg-[#14141B] rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getTransferStatusIcon(processedTransfers[recipient.id])}
                                            <div>
                                                <p className="text-white font-medium">{recipient.accountName}</p>
                                                <p className="text-gray-400 text-sm">{recipient.accountNumber} • {recipient.bankName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-medium">₦{parseFloat(recipient.amount).toLocaleString()}</p>
                                            <p className={`text-sm ${getTransferStatusColor(processedTransfers[recipient.id])}`}>
                                                {processedTransfers[recipient.id] || 'pending'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Shield className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-purple-400 font-medium mb-1">Secure Batch Transaction</p>
                                    <p className="text-purple-300 text-sm">
                                        All transfers are secured by smart contracts on the blockchain.
                                        Each transfer will be processed individually to ensure maximum security.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {/* Step 1: Approve Tokens */}
                            {!approved && (
                                <button
                                    onClick={handleApproveTokens}
                                    disabled={approving || processing}
                                    className={`w-full rounded-lg py-4 text-lg font-medium transition-all duration-200 ${approving || processing
                                        ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                        : "bg-[#7b40e3] hover:bg-purple-700 text-white"
                                        }`}
                                >
                                    {approving ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                            <span>Approving Tokens...</span>
                                        </div>
                                    ) : (
                                        <span>Step 1: Approve Tokens</span>
                                    )}
                                </button>
                            )}

                            {/* Step 2: Process Batch Transfer */}
                            {approved && (
                                <button
                                    onClick={handleProcessBatchTransfer}
                                    disabled={processing}
                                    className={`w-full rounded-lg py-4 text-lg font-medium transition-all duration-200 ${processing
                                        ? "bg-gray-600 cursor-not-allowed text-gray-400"
                                        : "bg-[#7b40e3] hover:bg-purple-700 text-white"
                                        }`}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                            <span>Processing Batch Transfer...</span>
                                        </div>
                                    ) : (
                                        <span>Step 2: Process Batch Transfer</span>
                                    )}
                                </button>
                            )}

                            {/* Approval Status */}
                            {approved && !processing && (
                                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <span className="text-green-400 font-medium text-sm">Tokens approved successfully</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
