"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { verifyBankAccount } from "@/utils/accountVerification"
import toast from 'react-hot-toast'

interface CSVRecipient {
    csvName: string
    accountNumber: string
    bankCode: string
    amount: string
    verifiedName?: string
    isVerified: boolean
    isVerifying: boolean
    bankName?: string
}

interface Recipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
    isVerified?: boolean
}

interface CSVVerificationModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    csvData: CSVRecipient[]
    onConfirm: (recipients: Recipient[], groupName?: string) => void
    onBack: () => void
}

export function CSVVerificationModal({
    open,
    onOpenChange,
    csvData,
    onConfirm,
    onBack
}: CSVVerificationModalProps) {
    const [recipients, setRecipients] = useState<CSVRecipient[]>([])
    const [isVerifyingAll, setIsVerifyingAll] = useState(false)
    const [createGroup, setCreateGroup] = useState(false)
    const [groupName, setGroupName] = useState('')

    useEffect(() => {
        if (csvData.length > 0) {
            const initialRecipients = csvData.map(item => ({
                csvName: item.csvName,
                accountNumber: item.accountNumber,
                bankCode: item.bankCode,
                amount: item.amount,
                bankName: item.bankName,
                isVerified: false,
                isVerifying: false
            }))
            setRecipients(initialRecipients)
        }
    }, [csvData])

    const verifyAccount = async (index: number) => {
        const recipient = recipients[index]
        if (!recipient) return

        setRecipients(prev =>
            prev.map((r, i) => i === index ? { ...r, isVerifying: true } : r)
        )

        try {
            const result = await verifyBankAccount(recipient.accountNumber, recipient.bankCode)

            if (result.success && result.data) {
                setRecipients(prev =>
                    prev.map((r, i) =>
                        i === index
                            ? {
                                ...r,
                                verifiedName: result.data!.account_name,
                                isVerified: true,
                                isVerifying: false
                            }
                            : r
                    )
                )
            } else {
                setRecipients(prev =>
                    prev.map((r, i) =>
                        i === index ? { ...r, isVerifying: false, isVerified: false } : r
                    )
                )
                toast.error(`Failed to verify account for ${recipient.csvName}`)
            }
        } catch {
            setRecipients(prev =>
                prev.map((r, i) =>
                    i === index ? { ...r, isVerifying: false, isVerified: false } : r
                )
            )
            toast.error(`Verification failed for ${recipient.csvName}`)
        }
    }

    const verifyAllAccounts = async () => {
        setIsVerifyingAll(true)

        for (let i = 0; i < recipients.length; i++) {
            if (!recipients[i].isVerified) {
                await verifyAccount(i)
            }
        }

        setIsVerifyingAll(false)
    }

    const handleConfirm = () => {
        const verifiedRecipients = recipients.filter(r => r.isVerified)

        if (verifiedRecipients.length === 0) {
            toast.error('Please verify at least one recipient')
            return
        }

        const formattedRecipients = verifiedRecipients.map((r, index) => ({
            id: (index + 1).toString(),
            accountName: r.verifiedName || r.csvName,
            accountNumber: r.accountNumber,
            bankCode: r.bankCode,
            bankName: r.bankName || '',
            amount: r.amount,
            isVerified: true
        }))

        const finalGroupName = createGroup && groupName.trim() ? groupName.trim() : undefined
        onConfirm(formattedRecipients, finalGroupName)
    }

    const verifiedCount = recipients.filter(r => r.isVerified).length
    const totalAmount = recipients
        .filter(r => r.isVerified)
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] border border-[#7b40e3]/20 bg-[#1C1C27] p-0 text-white rounded-[20px] max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={onBack}
                            className="text-white hover:opacity-80 transition-opacity"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-[#7b40e3]">Verify CSV Recipients</h2>
                    </div>

                    {/* Progress Info */}
                    <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400">Verification Progress:</span>
                            <span className="text-white font-medium">{verifiedCount}/{recipients.length} verified</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-[#7b40e3] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(verifiedCount / recipients.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Verify All Button */}
                    <div className="mb-6">
                        <button
                            onClick={verifyAllAccounts}
                            disabled={isVerifyingAll || verifiedCount === recipients.length}
                            className="bg-[#7b40e3] hover:bg-purple-700 disabled:bg-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                        >
                            {isVerifyingAll ? 'Verifying All...' : 'Verify All Accounts'}
                        </button>
                    </div>

                    {/* Recipients List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
                        {recipients.map((recipient, index) => (
                            <div key={index} className="bg-[#2F2F3A] rounded-lg p-4">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">#{index + 1}</span>
                                        {recipient.isVerified && (
                                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>Verified</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => verifyAccount(index)}
                                        disabled={recipient.isVerifying || recipient.isVerified}
                                        className="text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 px-3 py-1 rounded transition-colors disabled:cursor-not-allowed"
                                    >
                                        {recipient.isVerifying ? 'Verifying...' : recipient.isVerified ? 'Verified' : 'Verify'}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CSV Name vs Verified Name */}
                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-400">CSV Name</div>
                                        <div className="text-white font-medium">{recipient.csvName}</div>

                                        {recipient.verifiedName && (
                                            <>
                                                <div className="text-xs text-gray-400">Verified Name</div>
                                                <div className={`font-medium ${recipient.csvName.toLowerCase() === recipient.verifiedName.toLowerCase()
                                                        ? 'text-green-400'
                                                        : 'text-yellow-400'
                                                    }`}>
                                                    {recipient.verifiedName}
                                                </div>
                                                {recipient.csvName.toLowerCase() !== recipient.verifiedName.toLowerCase() && (
                                                    <div className="text-xs text-yellow-400 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        Names don&apos;t match
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {/* Account Details */}
                                    <div className="space-y-2">
                                        <div className="text-xs text-gray-400">Account Details</div>
                                        <div className="text-white text-sm">
                                            <div>{recipient.accountNumber}</div>
                                            <div className="text-gray-400">{recipient.bankName}</div>
                                            <div className="text-purple-400 font-medium">₦{parseFloat(recipient.amount).toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create Beneficiary Group */}
                    <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                type="checkbox"
                                id="createGroup"
                                checked={createGroup}
                                onChange={(e) => setCreateGroup(e.target.checked)}
                                className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                            />
                            <label htmlFor="createGroup" className="text-sm font-medium text-white">
                                Save as Beneficiary Group
                            </label>
                        </div>

                        {createGroup && (
                            <input
                                type="text"
                                placeholder="Enter group name (e.g., Monthly Payroll, Team A)"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                            />
                        )}
                    </div>

                    {/* Summary */}
                    <div className="bg-[#14141B] rounded-lg p-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Verified Recipients:</span>
                            <span className="text-white font-medium">{verifiedCount}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-gray-400">Total Amount:</span>
                            <span className="text-purple-400 font-bold text-lg">₦{totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="flex-1 bg-[#2F2F3A] py-3 text-white hover:bg-[#3B3B4F] border border-gray-600/20 font-medium text-sm rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={verifiedCount === 0}
                            className="flex-1 bg-[#7b40e3] py-3 text-white hover:bg-purple-700 disabled:bg-gray-600 font-medium text-sm rounded-lg transition-colors disabled:cursor-not-allowed"
                        >
                            Proceed with {verifiedCount} Recipients
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
