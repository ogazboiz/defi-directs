"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Upload, UserPlus, Trash2, Download, CheckCircle, AlertCircle } from "lucide-react"
import { verifyBankAccount, validateAccountNumber, validateAmount } from "@/utils/accountVerification"
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx'

interface Recipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
    isVerified?: boolean
    isVerifying?: boolean
}

interface Bank {
    id: number
    name: string
    code: string
    longcode: string
    gateway: string
    pay_with_bank: boolean
    active: boolean
    country: string
    currency: string
    type: string
    is_deleted: boolean
    createdAt: string
    updatedAt: string
}

interface BatchTransferModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProceedToSummary: (recipients: Recipient[]) => void
}

export function BatchTransferModal({ open, onOpenChange, onProceedToSummary }: BatchTransferModalProps) {
    const [transferMode, setTransferMode] = useState<'single' | 'batch'>('single')
    const [fileUploadMode, setFileUploadMode] = useState<'manual' | 'upload'>('manual')
    const [recipients, setRecipients] = useState<Recipient[]>([
        { id: '1', accountName: '', accountNumber: '', bankCode: '', bankName: '', amount: '', isVerified: false, isVerifying: false }
    ])
    const [dragActive, setDragActive] = useState(false)
    const [banks, setBanks] = useState<Bank[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Fetch banks when modal opens
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch("/api/banks")
                const result = await response.json()

                if (result.success) {
                    const uniqueBanks = result.data.reduce((acc: Bank[], current: Bank) => {
                        const x = acc.find(item => item.code === current.code)
                        if (!x) {
                            return acc.concat([current])
                        } else {
                            console.warn(`Duplicate bank code found: ${current.code} - ${current.name}`)
                            return acc
                        }
                    }, [])
                    setBanks(uniqueBanks)
                }
            } catch (error) {
                console.error('Failed to fetch banks:', error)
                // Use fallback banks if API fails
                setBanks([
                    { id: 1, code: "058", name: "Guaranty Trust Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 2, code: "011", name: "First Bank of Nigeria", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 3, code: "221", name: "Stanbic IBTC Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 4, code: "057", name: "Zenith Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 5, code: "070", name: "Fidelity Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 6, code: "044", name: "Access Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 7, code: "033", name: "United Bank for Africa", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 8, code: "032", name: "Union Bank of Nigeria", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" }
                ])
            }
        }

        if (open) {
            fetchBanks()
        }
    }, [open])

    const addRecipient = () => {
        const newId = (recipients.length + 1).toString()
        setRecipients([...recipients, {
            id: newId,
            accountName: '',
            accountNumber: '',
            bankCode: '',
            bankName: '',
            amount: '',
            isVerified: false,
            isVerifying: false
        }])
    }

    const removeRecipient = (id: string) => {
        if (recipients.length > 1) {
            setRecipients(recipients.filter(r => r.id !== id))
        }
    }

    const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
        setRecipients(recipients.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value }
                if (field === 'bankCode') {
                    const bank = banks.find(b => b.code === value)
                    updated.bankName = bank?.name || ''
                    updated.isVerified = false // Reset verification when bank changes
                }
                if (field === 'accountNumber') {
                    updated.isVerified = false // Reset verification when account number changes
                }
                return updated
            }
            return r
        }))
    }

    const verifyAccount = async (id: string) => {
        const recipient = recipients.find(r => r.id === id)
        if (!recipient || !recipient.accountNumber || !recipient.bankCode) {
            toast.error('Please enter account number and select bank first')
            return
        }

        if (!validateAccountNumber(recipient.accountNumber)) {
            toast.error('Please enter a valid 10-digit account number')
            return
        }

        // Set verifying state
        setRecipients(recipients.map(r =>
            r.id === id ? { ...r, isVerifying: true } : r
        ))

        try {
            const result = await verifyBankAccount(recipient.accountNumber, recipient.bankCode)

            if (result.success && result.data) {
                setRecipients(recipients.map(r =>
                    r.id === id
                        ? {
                            ...r,
                            accountName: result.data!.account_name,
                            isVerified: true,
                            isVerifying: false
                        }
                        : r
                ))
                toast.success('Account verified successfully!')
            } else {
                setRecipients(recipients.map(r =>
                    r.id === id ? { ...r, isVerifying: false, isVerified: false } : r
                ))
                toast.error(result.message || 'Could not verify account details')
            }
        } catch (error) {
            setRecipients(recipients.map(r =>
                r.id === id ? { ...r, isVerifying: false, isVerified: false } : r
            ))
            toast.error('Account verification failed')
        }
    }

    const handleFileUpload = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                let workbook: any

                if (file.type.includes('csv')) {
                    workbook = XLSX.read(data, { type: 'string' })
                } else {
                    workbook = XLSX.read(data, { type: 'binary' })
                }

                const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

                if (jsonData.length < 2) {
                    toast.error('File must contain header and at least one data row')
                    return
                }

                // Skip header row and parse data
                const parsedRecipients: Recipient[] = []
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i]
                    if (row.length >= 4 && row[0] && row[1] && row[2] && row[3]) {
                        const bankCode = row[2]
                        const bank = banks.find(b => b.code === bankCode)

                        parsedRecipients.push({
                            id: i.toString(),
                            accountName: row[0],
                            accountNumber: row[1],
                            bankCode: bankCode,
                            bankName: bank?.name || 'Unknown Bank',
                            amount: row[3]
                        })
                    }
                }

                if (parsedRecipients.length === 0) {
                    toast.error('No valid recipient data found in file')
                    return
                }

                setRecipients(parsedRecipients)
                toast.success(`Successfully loaded ${parsedRecipients.length} recipients`)
            } catch (error) {
                console.error('File parsing error:', error)
                toast.error('Error parsing file. Please check format and try again.')
            }
        }

        if (file.type.includes('csv')) {
            reader.readAsText(file)
        } else {
            reader.readAsBinaryString(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const file = files[0]
            if (file.type.includes('csv') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx')) {
                handleFileUpload(file)
            } else {
                toast.error('Please upload a CSV or Excel file')
            }
        }
    }

    const downloadTemplate = () => {
        const template = [
            ['Account Name', 'Account Number', 'Bank Code', 'Amount'],
            ['John Doe', '1234567890', '058', '10000'],
            ['Jane Smith', '0987654321', '011', '15000']
        ]

        const ws = XLSX.utils.aoa_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Recipients')
        XLSX.writeFile(wb, 'batch_transfer_template.xlsx')
    }

    const validateRecipients = () => {
        const validRecipients = recipients.filter(r => {
            const hasBasicInfo = r.accountName.trim() && r.accountNumber.trim() && r.bankCode
            const hasValidAmount = validateAmount(r.amount)
            const hasValidAccount = validateAccountNumber(r.accountNumber)

            if (!hasBasicInfo) {
                toast.error(`Recipient ${r.id}: Please fill in all required fields`)
                return false
            }

            if (!hasValidAccount) {
                toast.error(`Recipient ${r.id}: Invalid account number`)
                return false
            }

            if (!hasValidAmount) {
                toast.error(`Recipient ${r.id}: Invalid amount (minimum ₦100)`)
                return false
            }

            return true
        })

        if (validRecipients.length === 0) {
            toast.error('Please add at least one valid recipient')
            return false
        }

        return validRecipients
    }

    const handleProceed = () => {
        const validRecipients = validateRecipients()
        if (validRecipients) {
            onProceedToSummary(validRecipients)
        }
    }

    const totalAmount = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

    return (
        <>
            <Toaster position="top-center" />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl w-[95vw] border border-[#7b40e3]/20 bg-[#1C1C27] p-0 text-white rounded-[20px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-6">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="text-white hover:opacity-80 transition-opacity"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <h2 className="text-2xl font-bold text-[#7b40e3]">Batch Transfer</h2>
                        </div>

                        {/* Transfer Mode Selection */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-purple-400 mb-3 block">Transfer Type</label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTransferMode('single')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${transferMode === 'single'
                                            ? 'bg-[#7b40e3] text-white'
                                            : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                        }`}
                                >
                                    Single Transfer
                                </button>
                                <button
                                    onClick={() => setTransferMode('batch')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${transferMode === 'batch'
                                            ? 'bg-[#7b40e3] text-white'
                                            : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                        }`}
                                >
                                    Batch Transfer
                                </button>
                            </div>
                        </div>

                        {transferMode === 'batch' && (
                            <>
                                {/* Input Mode Selection */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium text-purple-400 mb-3 block">Input Method</label>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setFileUploadMode('manual')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${fileUploadMode === 'manual'
                                                    ? 'bg-[#7b40e3] text-white'
                                                    : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                                }`}
                                        >
                                            Manual Entry
                                        </button>
                                        <button
                                            onClick={() => setFileUploadMode('upload')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${fileUploadMode === 'upload'
                                                    ? 'bg-[#7b40e3] text-white'
                                                    : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                                }`}
                                        >
                                            File Upload
                                        </button>
                                    </div>
                                </div>

                                {/* File Upload Section */}
                                {fileUploadMode === 'upload' && (
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-3">
                                            <label className="text-sm font-medium text-purple-400">Upload Recipients File</label>
                                            <button
                                                onClick={downloadTemplate}
                                                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download Template
                                            </button>
                                        </div>

                                        <div
                                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                                    ? 'border-[#7b40e3] bg-[#7b40e3]/10'
                                                    : 'border-gray-600 hover:border-[#7b40e3]/50'
                                                }`}
                                            onDragEnter={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDragOver={handleDrag}
                                            onDrop={handleDrop}
                                        >
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-300 mb-2">Drag and drop your CSV or Excel file here</p>
                                            <p className="text-gray-500 text-sm mb-4">or</p>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-[#7b40e3] hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Choose File
                                            </button>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".csv,.xlsx,.xls"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleFileUpload(file)
                                                }}
                                                className="hidden"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Supported formats: CSV, Excel (.xlsx, .xls). Required columns: Account Name, Account Number, Bank Code, Amount
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Recipients List */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium text-purple-400">
                                    Recipients {transferMode === 'batch' && `(${recipients.length})`}
                                </label>
                                {(transferMode === 'single' || fileUploadMode === 'manual') && (
                                    <button
                                        onClick={addRecipient}
                                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add Recipient
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {recipients.map((recipient, index) => (
                                    <div key={recipient.id} className="bg-[#2F2F3A] rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-400">Recipient {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                {recipient.isVerified && (
                                                    <div className="flex items-center gap-1 text-green-400 text-xs">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Verified</span>
                                                    </div>
                                                )}
                                                {recipients.length > 1 && (
                                                    <button
                                                        onClick={() => removeRecipient(recipient.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <select
                                                    value={recipient.bankCode}
                                                    onChange={(e) => updateRecipient(recipient.id, 'bankCode', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                >
                                                    <option value="">Select Bank</option>
                                                    {banks.map((bank) => (
                                                        <option key={`${bank.id}-${bank.code}`} value={bank.code}>
                                                            {bank.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Account Number"
                                                    value={recipient.accountNumber}
                                                    onChange={(e) => updateRecipient(recipient.id, 'accountNumber', e.target.value)}
                                                    className={`w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border rounded-lg focus:outline-none focus:border-purple-500 text-sm ${recipient.isVerified ? 'border-green-500' : 'border-gray-600'
                                                        }`}
                                                />
                                                <button
                                                    onClick={() => verifyAccount(recipient.id)}
                                                    disabled={!recipient.accountNumber || !recipient.bankCode || recipient.isVerifying}
                                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-purple-400 hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                                                >
                                                    {recipient.isVerifying ? (
                                                        <div className="w-3 h-3 border border-purple-400 border-t-transparent rounded-full animate-spin" />
                                                    ) : recipient.isVerified ? (
                                                        <CheckCircle className="h-3 w-3 text-green-400" />
                                                    ) : (
                                                        'Verify'
                                                    )}
                                                </button>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Account Name"
                                                    value={recipient.accountName}
                                                    onChange={(e) => updateRecipient(recipient.id, 'accountName', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                    disabled={recipient.isVerified}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="Amount (NGN)"
                                                    value={recipient.amount}
                                                    onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                    min="100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="bg-[#14141B] rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Recipients:</span>
                                <span className="text-white font-medium">{recipients.length}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-400">Total Amount:</span>
                                <span className="text-purple-400 font-bold text-lg">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="flex-1 bg-[#2F2F3A] py-3 text-white hover:bg-[#3B3B4F] border border-gray-600/20 font-medium text-sm rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceed}
                                className="flex-1 bg-[#7b40e3] py-3 text-white hover:bg-purple-700 font-medium text-sm rounded-lg transition-colors"
                            >
                                Proceed to Summary
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
